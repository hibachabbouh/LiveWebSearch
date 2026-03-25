from typing import TypedDict, Annotated, Optional
import json
from uuid import uuid4

from fastapi import FastAPI, Query
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langgraph.graph import StateGraph, END, add_messages
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessageChunk, ToolMessage
from langchain_community.tools.tavily_search import TavilySearchResults

load_dotenv()

class State(TypedDict):
    messages: Annotated[list, add_messages]

# --- Tool & LLM Setup ---
search_tool = TavilySearchResults(max_results=4)
tools = [search_tool]

llm = ChatGroq(
    model="llama-3.3-70b-versatile", 
    temperature=0,
    streaming=True
)

llm_with_tools = llm.bind_tools(tools=tools)

# --- Nodes & Logic ---
async def model_node(state: State):
    """The AI assistant node."""
    result = await llm_with_tools.ainvoke(state["messages"])
    return {"messages": [result]}

def tools_router(state: State):
    """Router to decide if we call a tool or finish."""
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

tool_node = ToolNode(tools)

# --- Graph Construction ---
memory = MemorySaver()
graph_builder = StateGraph(State)

graph_builder.add_node("model", model_node)
graph_builder.add_node("tools", tool_node)

graph_builder.set_entry_point("model")
graph_builder.add_conditional_edges("model", tools_router)
graph_builder.add_edge("tools", "model")

graph = graph_builder.compile(checkpointer=memory)

# --- FastAPI & SSE Logic ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type"],
)


class ChatRequest(BaseModel):
    message: str
    checkpoint_id: Optional[str] = None

def serialise_content(chunk): 
    if isinstance(chunk, AIMessageChunk):
        return chunk.content
    return ""

async def generate_chat_responses(message: str, checkpoint_id: Optional[str] = None):
    thread_id = checkpoint_id or str(uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    
    if not checkpoint_id:
        yield f"data: {{\"type\": \"checkpoint\", \"checkpoint_id\": \"{thread_id}\"}}\n\n"

    events = graph.astream_events(
        {"messages": [HumanMessage(content=message)]},
        version="v2",
        config=config
    )

    async for event in events:
        event_type = event["event"]
        
        if event_type == "on_chat_model_stream":
            content = serialise_content(event["data"]["chunk"])
            if content:
                safe_content = json.dumps(content)[1:-1]
                yield f"data: {{\"type\": \"content\", \"content\": \"{safe_content}\"}}\n\n"
        
        elif event_type == "on_chat_model_end":
            output = event["data"]["output"]
            if hasattr(output, "tool_calls") and output.tool_calls:
                search_call = next((c for c in output.tool_calls if "tavily" in c["name"]), None)
                if search_call:
                    query = search_call["args"].get("query", "Searching...")
                    yield f"data: {{\"type\": \"search_start\", \"query\": {json.dumps(query)}}}\n\n"
                    
        elif event_type == "on_tool_end" and "tavily" in event["name"]:
            output = event["data"]["output"]
            urls = [item["url"] for item in output if isinstance(item, dict) and "url" in item]
            yield f"data: {{\"type\": \"search_results\", \"urls\": {json.dumps(urls)}}}\n\n"

    yield f"data: {{\"type\": \"end\"}}\n\n"

@app.get("/chat_stream/{message}")
async def chat_stream(message: str, checkpoint_id: Optional[str] = Query(None)):
    return StreamingResponse(
        generate_chat_responses(message, checkpoint_id), 
        media_type="text/event-stream"
    )


@app.post("/chat_stream")
async def chat_stream_post(payload: ChatRequest):
    return StreamingResponse(
        generate_chat_responses(payload.message, payload.checkpoint_id),
        media_type="text/event-stream"
    )
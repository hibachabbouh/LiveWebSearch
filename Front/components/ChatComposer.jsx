import React from 'react';
import { Loader2, Send, StopCircle } from 'lucide-react';

export function ChatComposer({ value, onChange, onSubmit, onStop, isLoading }) {
  return (
    <footer className="p-4 bg-white border-t">
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto relative">
        <input
          value={value}
          onChange={onChange}
          placeholder="Ecrivez votre message ici..."
          className="w-full pl-4 pr-24 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <button
              type="button"
              onClick={onStop}
              className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              aria-label="Arreter la reponse"
              title="Arreter"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Envoyer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </footer>
  );
}

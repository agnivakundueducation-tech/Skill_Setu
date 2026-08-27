import React, { useState, useEffect } from 'react';
import { SetuCopilotChat } from './SetuCopilotChat';
import { Sparkles, MessageSquare, X, Bot, ChevronUp } from 'lucide-react';
import { DEFAULT_COPILOT_CONTEXT } from '../../services/copilotService';

export const SetuCopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnreadPrompt, setHasUnreadPrompt] = useState(true);

  // Keyboard shortcut Cmd+J / Ctrl+J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    const handleCustomOpen = (e: CustomEvent) => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-setu-copilot' as any, handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-setu-copilot' as any, handleCustomOpen);
    };
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasUnreadPrompt(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Proactive helper badge */}
          {hasUnreadPrompt && (
            <div
              onClick={handleOpen}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-xs font-medium flex items-center gap-2 cursor-pointer hover:scale-105 transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Ask **Setu Copilot**: "Am I ready for this role?"</span>
              <X
                className="w-3 h-3 text-slate-400 hover:text-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasUnreadPrompt(false);
                }}
              />
            </div>
          )}

          <button
            onClick={handleOpen}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white/20"
            title="Open Setu Copilot (⌘J)"
            aria-label="Open Setu Copilot AI Assistant"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-indigo-600" />
            </div>
            <span>Setu Copilot</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono hidden sm:inline">
              ⌘J
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Drawer / Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none sm:p-6 flex items-end justify-end">
          {/* Backdrop on mobile */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs sm:hidden pointer-events-auto transition-opacity"
          />

          <div
            className={`pointer-events-auto w-full sm:rounded-2xl shadow-2xl transition-all duration-300 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${
              isExpanded
                ? 'h-[92vh] sm:w-[680px] sm:max-w-[90vw]'
                : 'h-[85vh] sm:h-[620px] sm:w-[440px]'
            }`}
          >
            <SetuCopilotChat
              context={DEFAULT_COPILOT_CONTEXT}
              onClose={() => setIsOpen(false)}
              onMaximize={() => setIsExpanded(!isExpanded)}
              isMaximized={isExpanded}
              showCloseButton={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

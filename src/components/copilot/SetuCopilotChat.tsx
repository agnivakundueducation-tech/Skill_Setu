import React, { useState, useRef, useEffect } from 'react';
import { CopilotMessage, CopilotContext } from '../../types/copilot';
import { UserRole } from '../../types';
import { copilotService, DEFAULT_COPILOT_CONTEXT } from '../../services/copilotService';
import { askSetu } from '../../services/setuAIService';
import { useAuth } from '../../context/AuthContext';
import { CopilotMessageItem } from './CopilotMessageItem';
import { CopilotPromptSuggestions } from './CopilotPromptSuggestions';
import { CopilotContextBadge } from './CopilotContextBadge';
import {
  Sparkles,
  Send,
  Trash2,
  RefreshCw,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  X,
  MessageSquare,
  Bot
} from 'lucide-react';

interface SetuCopilotChatProps {
  role?: UserRole;
  uid?: string;
  isDemo?: boolean;
  context?: CopilotContext;
  onClose?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  onActionClick?: (actionType: string, payload?: string) => void;
  className?: string;
  showCloseButton?: boolean;
}

export const SetuCopilotChat: React.FC<SetuCopilotChatProps> = ({
  role: propRole,
  uid: propUid,
  isDemo: propIsDemo,
  context = DEFAULT_COPILOT_CONTEXT,
  onClose,
  onMaximize,
  isMaximized = false,
  onActionClick,
  className = '',
  showCloseButton = true
}) => {
  const auth = useAuth();
  const effectiveRole: UserRole = propRole || auth?.currentRole || 'student';
  const effectiveUid = propUid || auth?.appUser?.uid || auth?.user?.id;
  const effectiveIsDemo = propIsDemo ?? (auth?.isDemo ?? true);
  const userName = auth?.user?.name || auth?.appUser?.email?.split('@')[0] || (effectiveRole === 'student' ? 'Alex' : 'Partner');

  const getGreetingForRole = (r: UserRole): CopilotMessage => {
    const greetings: Record<UserRole, { content: string; followUps: string[] }> = {
      student: {
        content: `Hello **${userName}**! I am **Setu**, your AI career navigator and competency intelligence assistant.\n\nI have synchronized with your platform profile, verified skills, and target career track. How can I assist your career progression today?`,
        followUps: ['What skills should I improve first?', 'Why is my readiness score at this level?', 'Which opportunities are best for me?', 'Explain my skill gaps.']
      },
      industry: {
        content: `Hello **${userName}**! I am **Setu**, your Industry Talent & Collaboration Assistant.\n\nI have synchronized with your company job postings, applicant match benchmarks, and talent pipelines. How can I assist your talent acquisition and collaboration today?`,
        followUps: ['Which candidates best match this opportunity?', 'What skills are missing among applicants?', 'Which collaboration opportunities are relevant?', 'How can we improve candidate readiness?']
      },
      academician: {
        content: `Hello **${userName}**! I am **Setu**, your Academic-Industry Collaboration Assistant.\n\nI have synchronized with your Faculty Passport, research specializations, and active industry linkages. How can I assist your academic and research outreach today?`,
        followUps: ['Which FDPs are relevant to my expertise?', 'Which industry collaborations match my research interests?', 'Which faculty skills should I develop?', 'How can I build stronger industry collaboration?']
      },
      institution: {
        content: `Hello **${userName}**! I am **Setu**, your Institutional Skill Intelligence Assistant.\n\nI have synchronized with your student cohort benchmarks, curriculum demand heatmaps, and active intervention programs. How can I assist your curriculum leadership today?`,
        followUps: ['What are our biggest industry skill gaps?', 'Which skills should we prioritize this semester?', 'Where is student readiness weakest?', 'What interventions should we launch?']
      }
    };

    const g = greetings[r] || greetings.student;
    return {
      id: 'msg-welcome',
      role: 'assistant',
      content: g.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: g.followUps
    };
  };

  const [messages, setMessages] = useState<CopilotMessage[]>([
    getGreetingForRole(effectiveRole)
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update greeting when role changes
  useEffect(() => {
    setMessages([getGreetingForRole(effectiveRole)]);
  }, [effectiveRole]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMessage: CopilotMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Execute contextual Setu AI query
      const aiResponse = await askSetu({
        query,
        role: effectiveRole,
        uid: effectiveUid,
        isDemo: effectiveIsDemo,
        chatHistory: messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        }))
      });

      const assistantMessage: CopilotMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse.fullFormattedContent || aiResponse.directAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: aiResponse.suggestedFollowUps,
        actions: aiResponse.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Error getting response from Setu AI:', err);
      // Fallback message with retry capability
      const fallback: CopilotMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `### Direct Answer\nI encountered a temporary communication delay while connecting to Gemini. However, your platform context for **${effectiveRole}** remains fully synchronized.\n\n### Recommended Actions\n* Check your network connection or click **Retry Query** below.\n* Alternatively, select any verified quick prompt below to analyze your live data.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['What skills should I improve first?', 'Which opportunities are best for me?'],
        isError: true,
        error: err?.message || 'Gemini proxy error',
        lastUserQuery: query
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([getGreetingForRole(effectiveRole)]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col bg-slate-50/50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 h-full overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Setu AI
              </h3>
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200/50 dark:border-emerald-900/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {effectiveRole.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Context-Aware Platform Intelligence • Phase 15-A
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {onMaximize && (
            <button
              onClick={onMaximize}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isMaximized ? 'Restore View' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Synchronized Role Context Pill */}
      <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
        <CopilotContextBadge context={context} />
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <CopilotMessageItem
            key={msg.id}
            message={msg}
            onSelectFollowUp={(prompt) => handleSendMessage(prompt)}
            onActionClick={onActionClick}
            onRetry={(query) => handleSendMessage(query)}
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 items-start mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 rounded-tl-xs shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-slate-400 font-medium ml-1.5">
                  Setu AI is evaluating platform context...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Prompt Suggestions pinned at bottom if only welcome message exists */}
        {messages.length === 1 && !isTyping && (
          <div className="mt-4 pt-2">
            <CopilotPromptSuggestions
              role={effectiveRole}
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Setu anything about your ${effectiveRole} context, gaps, or opportunities...`}
              disabled={isTyping}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                Enter ↵
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm shadow-indigo-500/20 transition-all cursor-pointer shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Bot className="w-3 h-3 text-indigo-500" />
            Evidence-Based Intelligence • Zero Fabrication
          </span>
          <span>Press ⌘J / Ctrl+J anytime</span>
        </div>
      </div>
    </div>
  );
};

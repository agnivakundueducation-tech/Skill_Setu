import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Briefcase,
  Layers,
  Code2,
  Flame,
  Lightbulb
} from 'lucide-react';
import { CareerRoadmapData } from '../../../types/careerRoadmap';

interface AiRoadmapAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmap: CareerRoadmapData;
  calculatedReadiness: number;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export const AiRoadmapAdvisorModal: React.FC<AiRoadmapAdvisorModalProps> = ({
  isOpen,
  onClose,
  roadmap,
  calculatedReadiness
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello! I am your SkillSetu AI Career Advisor. You are currently at **78% readiness** for your **Software Engineer** goal. 

Across the 5 roadmap phases (DSA, React, Cloud Deployment, Industry Project, and Internships), you are projected to reach **98% readiness**. 

How can I help accelerate your milestone plan today?`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'How should I prioritize DSA vs React Projects?',
        'Which AWS services are essential for Phase 3 Cloud Deployment?',
        'How do I tailor my resume for Phase 5 internship applications?',
        'Can I do an accelerated 8-week roadmap?'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('dsa') || qLower.includes('algorithm') || qLower.includes('leetcode')) {
        aiReply = `For **Phase 1 (Improve DSA)**, focus on high-frequency patterns rather than raw problem quantity. Master:
1. **Sliding Window & Two Pointers** (String/Array manipulation)
2. **BFS & DFS Traversals** (Graphs & Trees)
3. **1D/2D Dynamic Programming** (Knapsack, Subsequences)

Completing 40 curated medium problems and 2 timed mock screens will yield the projected **+5% readiness boost (78% → 83%)**.`;
      } else if (qLower.includes('react') || qLower.includes('frontend')) {
        aiReply = `For **Phase 2 (Build React Project)**:
- Use **React 19**, TypeScript, and Tailwind CSS.
- Include state management (Zustand/Context), optimistic updates, and custom caching.
- Build a real-time collaborative tool or responsive dashboard to showcase in Phase 5. This grants **+4% readiness (83% → 87%)**.`;
      } else if (qLower.includes('cloud') || qLower.includes('aws') || qLower.includes('docker')) {
        aiReply = `For **Phase 3 (Learn Cloud Deployment)**:
- Core essentials: **Docker multi-stage builds**, **GitHub Actions CI/CD**, and container deployment to **AWS ECS/Cloud Run**.
- Adding automated health checks and SSL routing closes the cloud benchmark gap, adding **+4% readiness (87% → 91%)**.`;
      } else if (qLower.includes('resume') || qLower.includes('internship') || qLower.includes('apply')) {
        aiReply = `For **Phase 5 (Apply for Internship)**:
- Highlight measurable metrics from Phase 2 & 4 (e.g. "Decreased bundle size by 40%", "Designed multi-tier caching with Redis").
- Your verified SkillSetu profile currently has **14 matched industry openings** awaiting your Phase 4 completion!`;
      } else {
        aiReply = `Great question! Based on your **Software Engineer** roadmap, balancing consistent DSA practice (1 hour/day in Phase 1) while building real-world projects in Phase 2 & 4 will deliver the fastest readiness progression from **78% to 98%**. Would you like specific project templates or mock assessment links?`;
      }

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: 'Just now',
        suggestedPrompts: [
          'Give me a 3-week study schedule for Phase 1',
          'Show me starter code template for React project',
          'Connect with a technical mentor'
        ]
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>AI Career Roadmap Advisor</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                  Live Guidance
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target: {roadmap.careerGoal} • Current: {calculatedReadiness}% • Goal: 98%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className="max-w-[85%] space-y-2">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                {/* Suggested prompt chips */}
                {msg.suggestedPrompts && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(prompt)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors text-left"
                      >
                        💡 {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>AI Advisor is analyzing your milestone roadmap...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Advisor about your Software Engineer roadmap..."
            className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

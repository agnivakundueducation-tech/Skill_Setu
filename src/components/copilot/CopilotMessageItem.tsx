import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CopilotMessage } from '../../types/copilot';
import { SetuActionMetadata } from '../../types/setu';
import { CopilotActionCard } from './CopilotActionCard';
import {
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Target,
  Briefcase,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  FolderKanban,
  Award,
  Layers
} from 'lucide-react';

interface CopilotMessageItemProps {
  message: CopilotMessage;
  onSelectFollowUp?: (text: string) => void;
  onActionClick?: (actionType: string, payload?: string) => void;
  onRetry?: (lastQuery: string) => void;
}

export const CopilotMessageItem: React.FC<CopilotMessageItemProps> = ({
  message,
  onSelectFollowUp,
  onActionClick,
  onRetry
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = (action: SetuActionMetadata) => {
    if (onActionClick) {
      onActionClick(action.actionType, action.target);
    }
    if (action.target) {
      navigate(action.target);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'VIEW_SKILL_GAP':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case 'VIEW_OPPORTUNITIES':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-500" />;
      case 'VIEW_CAREER_ROADMAP':
        return <Target className="w-3.5 h-3.5 text-indigo-500" />;
      case 'VIEW_APPLICATIONS':
        return <FolderKanban className="w-3.5 h-3.5 text-sky-500" />;
      case 'VIEW_INTERVENTIONS':
        return <Layers className="w-3.5 h-3.5 text-purple-500" />;
      case 'VIEW_PORTFOLIO':
        return <Award className="w-3.5 h-3.5 text-amber-500" />;
      case 'VIEW_INSTITUTION_ANALYTICS':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  /**
   * Helper to format markdown text gracefully:
   * Handles ### headings, **bold**, *italics*, lists, and tables.
   */
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[] = [];

    const processInline = (text: string) => {
      // Replace **text** with bold
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-semibold text-slate-900 dark:text-slate-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Handle code tags `code`
        const codeParts = part.split(/(`.*?`)/g);
        return codeParts.map((cp, cidx) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return (
              <code
                key={`${idx}-${cidx}`}
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]"
              >
                {cp.slice(1, -1)}
              </code>
            );
          }
          return cp;
        });
      });
    };

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();

      // Table line
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableRows.push(trimmed);
        return;
      } else if (inTable) {
        // Render accumulated table
        elements.push(renderTable(tableRows, `table-${lineIdx}`));
        inTable = false;
        tableRows = [];
      }

      // H3
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.replace('### ', '');
        const isDirectAnswer = titleText.toLowerCase().includes('direct answer');
        const isWhy = titleText.toLowerCase().includes('why');
        const isActions = titleText.toLowerCase().includes('recommended action') || titleText.toLowerCase().includes('next step');
        const isData = titleText.toLowerCase().includes('platform data');

        elements.push(
          <h4
            key={lineIdx}
            className={`font-bold text-xs mt-3 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide ${
              isDirectAnswer ? 'text-indigo-600 dark:text-indigo-400' :
              isWhy ? 'text-slate-700 dark:text-slate-300' :
              isActions ? 'text-emerald-600 dark:text-emerald-400' :
              isData ? 'text-amber-600 dark:text-amber-400' :
              'text-slate-900 dark:text-white'
            }`}
          >
            {processInline(titleText)}
          </h4>
        );
        return;
      }

      // H4
      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h5 key={lineIdx} className="font-semibold text-xs text-slate-900 dark:text-slate-100 mt-2.5 mb-1 text-indigo-950 dark:text-indigo-200">
            {processInline(trimmed.replace('#### ', ''))}
          </h5>
        );
        return;
      }

      // Horizontal Divider
      if (trimmed === '---') {
        elements.push(
          <hr key={lineIdx} className="my-2.5 border-slate-200 dark:border-slate-800" />
        );
        return;
      }

      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
              {processInline(trimmed.slice(2))}
            </div>
          </div>
        );
        return;
      }

      // Numbered list
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        elements.push(
          <div key={lineIdx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              {numMatch[1]}.
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
              {processInline(numMatch[2])}
            </div>
          </div>
        );
        return;
      }

      // Regular paragraph / blank line
      if (trimmed.length > 0) {
        elements.push(
          <p key={lineIdx} className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed my-1">
            {processInline(trimmed)}
          </p>
        );
      } else {
        elements.push(<div key={lineIdx} className="h-1" />);
      }
    });

    if (inTable && tableRows.length > 0) {
      elements.push(renderTable(tableRows, 'table-end'));
    }

    return elements;
  };

  const renderTable = (rows: string[], key: string) => {
    if (rows.length < 2) return null;
    const parseCells = (row: string) =>
      row
        .split('|')
        .slice(1, -1)
        .map(c => c.trim());

    const headers = parseCells(rows[0]);
    const dataRows = rows.slice(2).map(parseCells);

    return (
      <div key={key} className="overflow-x-auto my-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="py-1.5 px-2.5 border-b border-slate-200 dark:border-slate-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/90">
            {dataRows.map((r, ri) => (
              <tr key={ri} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                {r.map((cell, ci) => (
                  <td key={ci} className="py-1.5 px-2.5 text-slate-700 dark:text-slate-300">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={`flex gap-3 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'} mb-4 group`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          isAssistant
            ? 'bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-indigo-500/20'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
        }`}
      >
        {isAssistant ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Box */}
      <div className={`max-w-[88%] sm:max-w-[82%] flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {isAssistant ? 'Setu AI Assistant' : 'You'}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {message.timestamp}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-2xl relative shadow-2xs ${
            message.isError
              ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-tl-xs'
              : isAssistant
              ? 'bg-white dark:bg-slate-800/95 border border-slate-200/90 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 rounded-tl-xs'
              : 'bg-indigo-600 text-white rounded-tr-xs'
          }`}
        >
          {/* Content */}
          {isAssistant ? (
            <div>{renderFormattedContent(message.content)}</div>
          ) : (
            <p className="text-xs text-white leading-relaxed font-normal whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          {/* Action Card Attachment (Legacy) */}
          {message.actionCard && (
            <CopilotActionCard card={message.actionCard} onActionClick={onActionClick} />
          )}

          {/* New Phase 15-B Interactive Action Buttons */}
          {isAssistant && message.actions && message.actions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                <span>Recommended Platform Actions:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.actions.map((act, actIdx) => (
                  <button
                    key={actIdx}
                    onClick={() => handleAction(act)}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium transition-all group/act text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getActionIcon(act.actionType)}
                      <span className="truncate">{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/act:text-indigo-500 group-hover/act:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error / Retry Banner */}
          {message.isError && message.lastUserQuery && onRetry && (
            <div className="mt-3 pt-2.5 border-t border-rose-200 dark:border-rose-800 flex items-center justify-between">
              <span className="text-[11px] text-rose-600 dark:text-rose-400">
                Connection interrupted.
              </span>
              <button
                onClick={() => onRetry(message.lastUserQuery!)}
                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-rose-100 dark:bg-rose-900/60 hover:bg-rose-200 text-rose-700 dark:text-rose-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry Query</span>
              </button>
            </div>
          )}

          {/* Assistant Action Buttons (Copy & Provenance) */}
          {isAssistant && !message.isError && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                SkillSetu Grounded Engine
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Suggested Follow-up chips */}
        {isAssistant && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 px-1">
            {message.suggestedFollowUps.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFollowUp && onSelectFollowUp(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200/60 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium transition-all hover:scale-[1.02] cursor-pointer text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


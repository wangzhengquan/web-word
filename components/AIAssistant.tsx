import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, MessageSquareText, Wand2 } from 'lucide-react';
import { generateText } from '../services/geminiService';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  documentContext: string;
  selectedText: string;
  onInsertText: (text: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isOpen, 
  onClose, 
  documentContext, 
  selectedText,
  onInsertText 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const res = await generateText({
      prompt: prompt,
      context: documentContext,
      selection: selectedText || undefined
    });

    setIsLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.text);
    }
  };

  const handleAccept = () => {
    if (result) {
      onInsertText(result);
      onClose();
      setPrompt('');
      setResult(null);
    }
  };

  // Pre-defined quick actions
  const quickActions = [
    { label: "Summarize", icon: <MessageSquareText size={14}/>, prompt: "Summarize this text briefly." },
    { label: "Fix Grammar", icon: <Wand2 size={14}/>, prompt: "Fix grammar and improve flow." },
    { label: "Expand", icon: <Sparkles size={14}/>, prompt: "Expand on this idea with more detail." },
  ];

  const setQuickAction = (actionPrompt: string) => {
    setPrompt(actionPrompt);
    // If user clicks a quick action and there is context, we could auto-submit, 
    // but letting them review the prompt is safer.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-50 to-white p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-brand-700">
            <Sparkles size={20} />
            <h2 className="font-semibold text-lg">Gemini Assistant</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Context Indicator */}
          {selectedText ? (
            <div className="bg-brand-50 border border-brand-100 p-3 rounded-lg text-xs text-brand-800">
              <span className="font-bold">Working on selection:</span> 
              <p className="italic truncate mt-1 opacity-80">"{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"</p>
            </div>
          ) : (
             <div className="text-xs text-gray-500 flex items-center gap-1">
                <MessageSquareText size={12} />
                Using full document context
             </div>
          )}

          {/* Result Area */}
          {result && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto custom-scrollbar">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* Input Area */}
          {!result && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {selectedText ? "How should I change this?" : "What would you like to write?"}
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Write an introduction about space travel' or 'Make this sound more professional'"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none h-24 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuickAction(action.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-brand-300 transition-colors whitespace-nowrap"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          {result ? (
            <>
              <button 
                onClick={() => setResult(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Discard
              </button>
              <button 
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                Insert Text
              </button>
            </>
          ) : (
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className={`px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg shadow-sm flex items-center gap-2 transition-all
                ${(isLoading || !prompt.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-700 hover:shadow-md'}
              `}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {isLoading ? 'Thinking...' : 'Generate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
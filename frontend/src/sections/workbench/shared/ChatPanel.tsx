import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Send, Bot, User, Sparkles } from 'lucide-react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatPanelProps {
  title?: string
  placeholder?: string
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isLoading?: boolean
  className?: string
  showSuggestions?: boolean
}

export default function ChatPanel({
  title = 'AI Assistant',
  placeholder = 'Ask about these changes...',
  messages,
  onSendMessage,
  isLoading = false,
  className,
  showSuggestions = true,
}: ChatPanelProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSendMessage(input.trim())
    setInput('')
  }

  const handleSuggestion = (suggestion: string) => {
    onSendMessage(suggestion)
  }

  const quickSuggestions = [
    'Explain the key risks',
    'Summarize changes',
    'What\'s the liability impact?',
  ]

  return (
    <div className={cn('flex flex-col bg-surface-dark border border-subtle-line rounded-xl overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-subtle-line bg-surface-mid/50">
        <Bot size={16} className="text-warm-amber" />
        <span className="font-body font-medium text-[13px] text-soft-cream">{title}</span>
        <Sparkles size={12} className="text-warm-amber ml-auto" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-3 min-h-[180px] max-h-[360px]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <Bot size={32} className="text-muted-sand/30 mb-3" />
            <p className="font-body text-[13px] text-muted-sand/60 mb-1">No messages yet</p>
            <p className="font-mono text-[11px] text-muted-sand/40">Start a conversation below</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2.5',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <div
              className={cn(
                'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5',
                msg.role === 'user'
                  ? 'bg-warm-amber/20'
                  : 'bg-emerald-500/10'
              )}
            >
              {msg.role === 'user' ? (
                <User size={12} className="text-warm-amber" />
              ) : (
                <Bot size={12} className="text-emerald-400" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-3 py-2',
                msg.role === 'user'
                  ? 'bg-warm-amber/10 border border-warm-amber/20'
                  : 'bg-obsidian/60 border border-subtle-line'
              )}
            >
              <p className="font-body text-[13px] text-soft-cream leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="font-mono text-[10px] text-warm-amber bg-warm-amber/10 border border-warm-amber/20 px-2 py-0.5 rounded hover:bg-warm-amber/20 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Bot size={12} className="text-emerald-400" />
            </div>
            <div className="flex gap-1 px-3 py-2 bg-obsidian/60 rounded-lg border border-subtle-line">
              <span className="w-1.5 h-1.5 bg-muted-sand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-sand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-muted-sand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      {showSuggestions && messages.length === 0 && (
        <div className="px-3 pb-2">
          <div className="font-mono text-[10px] text-muted-sand uppercase tracking-wider mb-1.5">Quick prompts</div>
          <div className="flex flex-wrap gap-1.5">
            {quickSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSuggestion(s)}
                className="font-body text-[11px] text-muted-sand bg-obsidian border border-subtle-line px-2.5 py-1 rounded-md hover:border-warm-amber/30 hover:text-soft-cream transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-subtle-line">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 bg-obsidian border border-subtle-line rounded-lg px-3 py-2 font-body text-[13px] text-soft-cream placeholder:text-muted-sand/50 outline-none focus:border-warm-amber/40 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-warm-amber text-obsidian flex items-center justify-center transition-all duration-200 hover:scale-[1.05] disabled:opacity-30 disabled:hover:scale-100"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  )
}

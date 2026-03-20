import { useCallback, useRef, useState } from 'react';
import { Send } from 'lucide-react';

import type { Character } from '../office/types.js';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
}

// Pixel-style avatar component
function CharacterAvatar({ character }: { character: Character }) {
  // Generate a consistent color based on palette
  const paletteColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
  ];
  const bgColor = paletteColors[character.palette % paletteColors.length];

  // Extract emoji from displayName or use default
  const emoji = character.displayName?.match(/^(\p{Emoji})/u)?.[1] || '🤖';

  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 4,
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        border: '2px solid var(--pixel-border)',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
        flexShrink: 0,
      }}
    >
      {emoji}
    </div>
  );
}

export function ChatSidebar({ character, isOpen, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract name from displayName
  const emoji = character.displayName?.match(/^(\p{Emoji})/u)?.[1] || '🤖';
  const name = character.displayName?.replace(/^(\p{Emoji}\s*)/u, '') || `Agent ${character.id}`;
  const status = character.isActive ? 'Working...' : 'Idle';

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // TODO: Integrate with backend chat API
    // For now, just show a placeholder response after a delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Hello! I'm ${name}. Chat integration coming soon! 🚀`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  }, [inputValue, isLoading, name]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 360,
        background: 'var(--pixel-bg)',
        borderLeft: '2px solid var(--pixel-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: '-4px 0 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '2px solid var(--pixel-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--pixel-header-bg, rgba(0,0,0,0.2))',
        }}
      >
        <CharacterAvatar character={character} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'var(--pixel-text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: character.isActive ? 'var(--pixel-accent)' : 'var(--pixel-text-dim)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: character.isActive ? '#4ade80' : '#6b7280',
              }}
            />
            {status}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--pixel-btn-bg)',
            border: '2px solid var(--pixel-border)',
            color: 'var(--pixel-text)',
            cursor: 'pointer',
            fontSize: 18,
            borderRadius: 4,
          }}
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--pixel-text-dim)',
              textAlign: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 48 }}>{emoji}</span>
            <div style={{ fontSize: 14 }}>Start a conversation with {name}</div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: 4,
                  background:
                    msg.role === 'user' ? 'var(--pixel-accent)' : 'var(--pixel-card-bg, rgba(255,255,255,0.05))',
                  color: msg.role === 'user' ? '#fff' : 'var(--pixel-text)',
                  fontSize: 14,
                  lineHeight: 1.5,
                  border: msg.role === 'user' ? 'none' : '1px solid var(--pixel-border)',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 4,
                background: 'var(--pixel-card-bg, rgba(255,255,255,0.05))',
                border: '1px solid var(--pixel-border)',
                color: 'var(--pixel-text-dim)',
                fontSize: 14,
              }}
            >
              <span className="pixel-agents-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: 12,
          borderTop: '2px solid var(--pixel-border)',
          display: 'flex',
          gap: 8,
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${name}...`}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 4,
            border: '2px solid var(--pixel-border)',
            background: 'var(--pixel-input-bg, rgba(0,0,0,0.3))',
            color: 'var(--pixel-text)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          style={{
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: 4,
            border: '2px solid var(--pixel-border)',
            background: inputValue.trim() && !isLoading ? 'var(--pixel-accent)' : 'var(--pixel-btn-bg)',
            color: inputValue.trim() && !isLoading ? '#fff' : 'var(--pixel-text-dim)',
            cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
            opacity: inputValue.trim() && !isLoading ? 1 : 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

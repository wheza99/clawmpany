import { useEffect, useRef, useState } from 'react';

import type { WorkspaceFolder } from '../hooks/useExtensionMessages.js';
import { ServersModal } from './ServersModal.js';
import { SettingsModal } from './SettingsModal.js';

interface BottomToolbarProps {
  isEditMode: boolean;
  onOpenClaude: () => void;
  onToggleEditMode: () => void;
  isDebugMode: boolean;
  onToggleDebugMode: () => void;
  workspaceFolders: WorkspaceFolder[];
}

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 10,
  left: 10,
  zIndex: 'var(--pixel-controls-z)',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  background: 'var(--pixel-bg)',
  border: '2px solid var(--pixel-border)',
  borderRadius: 0,
  padding: '4px 6px',
  boxShadow: 'var(--pixel-shadow)',
};

const btnBase: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: '24px',
  color: 'var(--pixel-text)',
  background: 'var(--pixel-btn-bg)',
  border: '2px solid transparent',
  borderRadius: 0,
  cursor: 'pointer',
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: 'var(--pixel-active-bg)',
  border: '2px solid var(--pixel-accent)',
};

export function BottomToolbar({
  isEditMode: _isEditMode,
  onOpenClaude: _onOpenClaude,
  onToggleEditMode: _onToggleEditMode,
  isDebugMode,
  onToggleDebugMode,
  workspaceFolders: _workspaceFolders,
}: BottomToolbarProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isServersDropdownOpen, setIsServersDropdownOpen] = useState(false);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [hoveredServer, setHoveredServer] = useState<string | null>(null);
  const serversDropdownRef = useRef<HTMLDivElement>(null);

  // Mock servers data - TODO: replace with real data
  const servers = [
    { id: '1', name: 'Production Server', status: 'online' },
    { id: '2', name: 'Development Server', status: 'offline' },
  ];

  // Close servers dropdown on outside click
  useEffect(() => {
    if (!isServersDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (serversDropdownRef.current && !serversDropdownRef.current.contains(e.target as Node)) {
        setIsServersDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isServersDropdownOpen]);

  const handleSelectServer = (serverId: string) => {
    // TODO: Implement server selection
    console.log('Selected server:', serverId);
    setIsServersDropdownOpen(false);
  };

  const handleCreateServerClick = () => {
    setIsServersDropdownOpen(false);
    setIsCreateServerOpen(true);
  };

  return (
    <div style={panelStyle}>
      {/* Servers dropdown */}
      <div ref={serversDropdownRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setIsServersDropdownOpen((v) => !v)}
          onMouseEnter={() => setHovered('servers')}
          onMouseLeave={() => setHovered(null)}
          style={{
            ...btnBase,
            padding: '5px 12px',
            background:
              hovered === 'servers' || isServersDropdownOpen
                ? 'var(--pixel-agent-hover-bg)'
                : 'var(--pixel-agent-bg)',
            border: '2px solid var(--pixel-agent-border)',
            color: 'var(--pixel-agent-text)',
          }}
        >
          Servers
        </button>
        {isServersDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              marginBottom: 4,
              background: 'var(--pixel-bg)',
              border: '2px solid var(--pixel-border)',
              borderRadius: 0,
              boxShadow: 'var(--pixel-shadow)',
              minWidth: 180,
              zIndex: 'var(--pixel-controls-z)',
            }}
          >
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => handleSelectServer(server.id)}
                onMouseEnter={() => setHoveredServer(server.id)}
                onMouseLeave={() => setHoveredServer(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  fontSize: '22px',
                  color: 'var(--pixel-text)',
                  background:
                    hoveredServer === server.id ? 'var(--pixel-btn-hover-bg)' : 'transparent',
                  border: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{server.name}</span>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: server.status === 'online' ? '#4ade80' : '#ef4444',
                    flexShrink: 0,
                    marginLeft: 8,
                  }}
                />
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--pixel-border)' }}>
              <button
                onClick={handleCreateServerClick}
                onMouseEnter={() => setHoveredServer('create')}
                onMouseLeave={() => setHoveredServer(null)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  fontSize: '22px',
                  color: 'var(--pixel-agent-text)',
                  background:
                    hoveredServer === 'create' ? 'rgba(90, 140, 255, 0.3)' : 'rgba(90, 140, 255, 0.2)',
                  border: 'none',
                  borderRadius: 0,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                + Create New Server
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Server Dialog */}
      <ServersModal isOpen={isCreateServerOpen} onClose={() => setIsCreateServerOpen(false)} />
      {/* TODO: Re-enable layout editor later */}
      {/* <button
        onClick={onToggleEditMode}
        onMouseEnter={() => setHovered('edit')}
        onMouseLeave={() => setHovered(null)}
        style={
          isEditMode
            ? { ...btnActive }
            : {
                ...btnBase,
                background: hovered === 'edit' ? 'var(--pixel-btn-hover-bg)' : btnBase.background,
              }
        }
        title="Edit office layout"
      >
        Layout
      </button> */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsSettingsOpen((v) => !v)}
          onMouseEnter={() => setHovered('settings')}
          onMouseLeave={() => setHovered(null)}
          style={
            isSettingsOpen
              ? { ...btnActive }
              : {
                  ...btnBase,
                  background:
                    hovered === 'settings' ? 'var(--pixel-btn-hover-bg)' : btnBase.background,
                }
          }
          title="Settings"
        >
          Settings
        </button>
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          isDebugMode={isDebugMode}
          onToggleDebugMode={onToggleDebugMode}
        />
      </div>
    </div>
  );
}

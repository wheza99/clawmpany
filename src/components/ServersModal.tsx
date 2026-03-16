import { useState } from 'react';

interface ServersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServersModal({ isOpen, onClose }: ServersModalProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [newServerName, setNewServerName] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    // TODO: Implement create server logic
    console.log('Create new server:', newServerName);
    setNewServerName('');
    onClose();
  };

  const handleClose = () => {
    setNewServerName('');
    onClose();
  };

  return (
    <>
      {/* Dark backdrop — click to close */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 49,
        }}
      />
      {/* Centered dialog */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          background: 'var(--pixel-bg)',
          border: '2px solid var(--pixel-border)',
          borderRadius: 0,
          padding: '4px',
          boxShadow: 'var(--pixel-shadow)',
          minWidth: 300,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 10px',
            borderBottom: '1px solid var(--pixel-border)',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.9)' }}>New Server</span>
          <button
            onClick={handleClose}
            onMouseEnter={() => setHovered('close')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === 'close' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: 'none',
              borderRadius: 0,
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            X
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '0 8px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '6px',
            }}
          >
            Server Name
          </label>
          <input
            type="text"
            value={newServerName}
            onChange={(e) => setNewServerName(e.target.value)}
            placeholder="Enter server name"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newServerName.trim()) {
                handleCreate();
              }
            }}
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid var(--pixel-border)',
              borderRadius: 0,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '16px 8px 8px',
          }}
        >
          <button
            onClick={handleClose}
            onMouseEnter={() => setHovered('cancel')}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.8)',
              background:
                hovered === 'cancel' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              border: '2px solid var(--pixel-border)',
              borderRadius: 0,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            onMouseEnter={() => setHovered('create')}
            onMouseLeave={() => setHovered(null)}
            disabled={!newServerName.trim()}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.9)',
              background:
                hovered === 'create' && newServerName.trim()
                  ? 'rgba(90, 140, 255, 0.4)'
                  : 'rgba(90, 140, 255, 0.2)',
              border: '2px solid var(--pixel-accent)',
              borderRadius: 0,
              cursor: newServerName.trim() ? 'pointer' : 'not-allowed',
              opacity: newServerName.trim() ? 1 : 0.5,
            }}
          >
            Create
          </button>
        </div>
      </div>
    </>
  );
}

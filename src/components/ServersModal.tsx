import { useState } from 'react';

interface ServersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServersModal({ isOpen, onClose }: ServersModalProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
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
          minWidth: 320,
          maxWidth: '90vw',
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

        {/* Warning Content */}
        <div style={{ padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏗️</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#ffaa00',
              marginBottom: '8px',
            }}
          >
            Office Full!
          </div>
          <div
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.4,
            }}
          >
            All office rooms are currently occupied.
            <br />
            Rooms on the next floor are under construction.
            <br />
            Please come back next week!
          </div>
        </div>

        {/* Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '12px 8px 8px',
          }}
        >
          <button
            onClick={handleClose}
            onMouseEnter={() => setHovered('ok')}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '8px 24px',
              fontSize: '22px',
              color: '#fff',
              background: hovered === 'ok' ? 'rgba(90, 140, 255, 0.4)' : 'rgba(90, 140, 255, 0.2)',
              border: '2px solid var(--pixel-accent)',
              borderRadius: 0,
              cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}

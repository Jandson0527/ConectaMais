'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useCRM();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let bg = 'rgba(15, 23, 42, 0.95)';
        let border = 'rgba(0, 210, 255, 0.3)';
        let icon = <Info style={{ width: '18px', height: '18px', color: 'var(--primary-bright)', flexShrink: 0 }} />;

        if (toast.type === 'success') {
          border = 'rgba(16, 185, 129, 0.5)';
          icon = <CheckCircle2 style={{ width: '18px', height: '18px', color: 'var(--success)', flexShrink: 0 }} />;
        } else if (toast.type === 'danger' || toast.type === 'error') {
          border = 'rgba(239, 68, 68, 0.5)';
          icon = <AlertCircle style={{ width: '18px', height: '18px', color: 'var(--danger)', flexShrink: 0 }} />;
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: bg,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${border}`,
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '0.88rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '420px',
              animation: 'slideInRight 0.25s ease'
            }}
          >
            {icon}
            <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

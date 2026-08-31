'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export default function DenySaleModal() {
  const {
    activeModal,
    closeModal,
    denySellerSale
  } = useCRM();

  const sale = activeModal?.data;
  const [reason, setReason] = useState('');

  if (!sale) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Por favor, informe a justificativa da recusa.');
      return;
    }
    denySellerSale(sale.id, reason.trim());
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-sm" style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle style={{ width: '20px', height: '20px', color: '#ef4444' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
              Recusar / Negar Venda
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Cliente: <strong style={{ color: '#ffffff' }}>{sale.company || sale.name}</strong>
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="denyReason">Motivo da Recusa *</label>
              <textarea
                id="denyReason"
                className="form-control"
                rows="3"
                placeholder="Ex: Incompatibilidade com ponto escolhido, duplicidade de anunciante, documentação pendente..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Voltar</button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ background: '#ef4444', borderColor: '#dc2626' }}
            >
              <X style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>Confirmar Recusa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

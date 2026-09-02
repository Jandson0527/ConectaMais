'use client';

import React from 'react';
import { useCRM } from '../../../context/CRMContext';
import {
  Flame,
  Plus,
  Phone,
  Building,
  Edit3,
  Trash2,
  Tv,
  MessageCircle
} from 'lucide-react';

export default function SellerHotLeadsView() {
  const {
    currentUser,
    hotLeads,
    openModal,
    deleteHotLead
  } = useCRM();

  const myHotLeads = hotLeads.filter(h => h.sellerId === currentUser?.id);

  return (
    <section className="view-panel active" id="view-seller-hotleads">
      
      <div className="view-header">
        <div>
          <h1 className="view-title">Clientes Quentes (Em Potencial)</h1>
          <p className="view-subtitle">Registre clientes interessados que ainda não fecharam a compra para acompanhar o follow-up e objeções.</p>
        </div>
        <button className="btn btn-gold" onClick={() => openModal('hot-lead')}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
          <span>+ Cadastrar Cliente Quente</span>
        </button>
      </div>

      <div className="hotleads-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {myHotLeads.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
            <Flame style={{ width: '36px', height: '36px', margin: '0 auto 8px', color: 'var(--accent-gold)', opacity: 0.4 }} />
            <p style={{ margin: 0 }}>Nenhum cliente quente cadastrado no momento. Cadastre contatos com alto potencial de fechamento!</p>
          </div>
        ) : (
          myHotLeads.map(lead => {
            const cleanPhone = (lead.phone || '').replace(/\D/g, '');
            const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(lead.name || lead.company)}%2C%20tudo%20bem%3F%20Aqui%20%C3%A9%20o%20${encodeURIComponent(currentUser?.name || 'Vendedor')}%20da%20Conecta%20Mais.`;

            return (
              <div key={lead.id} className="hotlead-card">
                
                <div className="hotlead-card-header">
                  <div className="hotlead-title-box">
                    <h3>{lead.company || lead.name}</h3>
                    <span>{lead.name} • {lead.phone}</span>
                  </div>
                  <span className="badge-approval pending" style={{ background: 'rgba(251, 191, 36, 0.15)', color: 'var(--accent-gold)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                    🔥 Quente
                  </span>
                </div>

                {/* Motivo de não fechamento */}
                <div className="hotlead-reason-box">
                  <div className="hotlead-reason-label">
                    <span>Motivo pelo qual ainda não fechou:</span>
                  </div>
                  <div className="hotlead-reason-text">
                    {lead.reasonNotClosed}
                  </div>
                </div>

                <div className="hotlead-info-list">
                  {lead.companyAddress && (
                    <div className="hotlead-info-item">
                      <span>📍 {lead.companyAddress}</span>
                    </div>
                  )}
                  {lead.planName && (
                    <div className="hotlead-info-item">
                      <span>📺 Interesse: <strong style={{ color: 'var(--primary-bright)' }}>{lead.planName}</strong></span>
                    </div>
                  )}
                  {lead.notes && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {lead.notes}
                    </div>
                  )}
                </div>

                <div className="hotlead-card-footer">
                  {cleanPhone && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-whatsapp sm"
                      style={{ fontSize: '0.75rem' }}
                    >
                      <MessageCircle style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                      WhatsApp
                    </a>
                  )}

                  <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                    <button
                      className="btn btn-primary sm"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => openModal('client', { name: lead.name, company: lead.company, companyAddress: lead.companyAddress, phone: lead.phone, planId: lead.planInterest })}
                    >
                      Fechar Venda 🎉
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => openModal('edit-hotlead', lead)}
                      title="Editar"
                    >
                      <Edit3 style={{ width: '13px', height: '13px' }} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                      onClick={() => {
                        if (confirm(`Remover cliente quente ${lead.company}?`)) deleteHotLead(lead.id);
                      }}
                      title="Excluir"
                    >
                      <Trash2 style={{ width: '13px', height: '13px' }} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </section>
  );
}

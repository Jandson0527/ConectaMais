'use client';

import React, { useState, useEffect } from 'react';
import { useCRM, computeDueDate } from '../../context/CRMContext';
import {
  X,
  RefreshCw,
  Calendar,
  DollarSign,
  Check,
  Zap,
  Clock,
  CheckCircle,
  Percent,
  UserCheck,
  CreditCard,
  Sparkles
} from 'lucide-react';

export default function RenewalModal() {
  const {
    activeModal,
    closeModal,
    renewLeadContract,
    plans,
    users,
    getLeadDueStatus,
    getNextCommissionPayoutDate,
    formatCurrency
  } = useCRM();

  const lead = activeModal?.data;
  if (!lead) return null;

  const plan = plans.find(p => p.id === lead.planId) || plans[0];
  const dueInfo = getLeadDueStatus(lead);
  const seller = lead.sellerId ? users.find(u => u.id === lead.sellerId) : null;
  const nextPayout = getNextCommissionPayoutDate();

  const isCurrentDueInFuture = lead.dueDate && new Date(lead.dueDate) > new Date();

  // Estados do formulário de renovação
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [billingCycle, setBillingCycle] = useState(lead.billingCycle || 'monthly');
  const [renewalValue, setRenewalValue] = useState(String(lead.value || plan.monthlyPrice || 99.90));
  const [paymentMethod, setPaymentMethod] = useState(lead.paymentMethod || 'Pix');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notes, setNotes] = useState('');

  // Atualizar valor quando muda o ciclo
  const handleCycleChange = (cycle) => {
    setBillingCycle(cycle);
    if (cycle === 'quarterly') {
      setRenewalValue(String(plan.quarterlyPrice || (plan.monthlyPrice * 3)));
    } else if (cycle === 'monthly') {
      setRenewalValue(String(plan.monthlyPrice || 99.90));
    }
  };

  // Cálculo da nova data de vencimento em tempo real
  let baseForNewDue = paymentDate;
  if (lead.dueDate) {
    const currentDueObj = new Date(lead.dueDate);
    const payDateObj = new Date(paymentDate);
    if (currentDueObj > payDateObj) {
      baseForNewDue = lead.dueDate;
    }
  }

  const projectedNextDueDate = computeDueDate(baseForNewDue, billingCycle, lead.planId);
  const formattedProjectedDueDate = `${projectedNextDueDate.split('-')[2]}/${projectedNextDueDate.split('-')[1]}/${projectedNextDueDate.split('-')[0]}`;
  const formattedCurrentDueDate = dueInfo.formattedDueDate;

  const isAdvance = baseForNewDue === lead.dueDate;
  const commAmount = lead.sellerId ? Number((Number(renewalValue) * 0.10).toFixed(2)) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    renewLeadContract(lead.id, paymentDate, paymentMethod, Number(renewalValue));
    if (notifyWhatsApp) {
      openModal('whatsapp-billing', {
        ...lead,
        defaultTemplate: 'renewal_confirmed',
        paymentDate,
        dueDate: projectedNextDueDate,
        value: Number(renewalValue),
        paymentMethod
      });
    } else {
      closeModal();
    }
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '640px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--success), #059669)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <RefreshCw style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                {isCurrentDueInFuture ? 'Antecipar Renovação de Contrato' : 'Renovar Mensalidade'}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {lead.company || lead.name} • {plan.name}
              </span>
            </div>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Card Comparativo de Vencimento Atual vs Novo Vencimento Estendido */}
            <div style={{
              background: 'var(--bg-surface)',
              border: isAdvance ? '1.5px solid rgba(2, 132, 166, 0.4)' : '1.5px solid rgba(5, 150, 105, 0.4)',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '10px',
                  background: isAdvance ? 'rgba(0, 210, 255, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: isAdvance ? 'var(--primary-bright)' : 'var(--success)',
                  border: `1px solid ${isAdvance ? 'rgba(0, 210, 255, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                }}>
                  {isAdvance ? '⚡ Renovação Antecipada (Dias Preservados)' : '🔄 Renovação Regular'}
                </span>
                <span style={{ fontSize: '0.75rem', color: dueInfo.color, fontWeight: 700 }}>
                  Status Atual: {dueInfo.text}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '12px', textAlign: 'center', background: 'var(--bg-card)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Vencimento Atual</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{formattedCurrentDueDate}</strong>
                </div>
                <div style={{ color: 'var(--primary-bright)', fontSize: '1.2rem', fontWeight: 900 }}>➔</div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'block', fontWeight: 700 }}>Novo Vencimento Estendido</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--success)', fontWeight: 900 }}>{formattedProjectedDueDate}</strong>
                </div>
              </div>

              {isAdvance && (
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-bright)', lineHeight: 1.4 }}>
                  💡 O cliente está antecipando o pagamento. O novo ciclo (+1 mês) foi somado a partir da data de vencimento atual ({formattedCurrentDueDate}), sem perder nenhum dia já pago!
                </span>
              )}
            </div>

            {/* Ciclo de Renovação */}
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Ciclo de Renovação *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn sm ${billingCycle === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleCycleChange('monthly')}
                  style={{ justifyContent: 'center', fontWeight: 700 }}
                >
                  Mensal (+1 Mês)
                </button>
                <button
                  type="button"
                  className={`btn sm ${billingCycle === 'quarterly' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleCycleChange('quarterly')}
                  style={{ justifyContent: 'center', fontWeight: 700 }}
                >
                  Trimestral (+3 Meses)
                </button>
              </div>
            </div>

            {/* Grid: Data de Pagamento & Valor */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="renPaymentDate">Data do Pagamento da Renovação *</label>
                <input
                  type="date"
                  id="renPaymentDate"
                  className="form-control"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="renValue">Valor da Mensalidade (R$) *</label>
                <input
                  type="number"
                  id="renValue"
                  className="form-control"
                  step="0.01"
                  min="0.01"
                  value={renewalValue}
                  onChange={(e) => setRenewalValue(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Forma de Pagamento */}
            <div className="form-group">
              <label className="form-label" htmlFor="renPaymentMethod">Forma de Pagamento *</label>
              <select
                id="renPaymentMethod"
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="Pix">Pix (Instantâneo)</option>
                <option value="Boleto Bancário">Boleto Bancário</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Transferência Bancária">Transferência Bancária (TED/DOC)</option>
                <option value="Dinheiro em Espécie">Dinheiro em Espécie</option>
              </select>
            </div>

            {/* Banner de Comissão Recorrente do Vendedor se houver */}
            {seller && (
              <div style={{
                background: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '10px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div>
                  <strong style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck style={{ width: '16px', height: '16px' }} />
                    Vendedor Vinculado: {seller.name}
                  </strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Comissão recorrente de 10% gerada para repasse em {nextPayout.formattedDate}
                  </span>
                </div>
                <strong style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', fontWeight: 900 }}>
                  + {formatCurrency(commAmount)}
                </strong>
              </div>
            )}

            {/* Opção de Notificação WhatsApp */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={notifyWhatsApp}
                  onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                  style={{ accentColor: 'var(--success)', width: '17px', height: '17px' }}
                />
                <span>
                  💬 <strong>Enviar Confirmação no WhatsApp:</strong> Abrir prévia de mensagem para o cliente confirmando que a mensalidade foi renovada!
                </span>
              </label>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              Confirmar Renovação ({formattedProjectedDueDate})
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

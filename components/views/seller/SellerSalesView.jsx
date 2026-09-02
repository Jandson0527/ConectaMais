'use client';

import React, { useState } from 'react';
import { useCRM } from '../../../context/CRMContext';
import {
  ShoppingBag,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  MessageCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function SellerSalesView() {
  const {
    currentUser,
    getSellerCommissions,
    plans,
    openModal,
    formatCurrency,
    getLeadDueStatus
  } = useCRM();

  const commData = getSellerCommissions(currentUser?.id);
  const [statusFilter, setStatusFilter] = useState('all');
  const canCreateLeads = !currentUser?.permissions || currentUser.permissions.includes('create-leads');

  const filteredSales = commData.salesList.filter(s => {
    if (statusFilter === 'approved') return s.approvalStatus === 'approved' || s.stage === 'ganho';
    if (statusFilter === 'pending') return s.approvalStatus === 'pending';
    if (statusFilter === 'denied') return s.approvalStatus === 'denied';
    return true;
  });

  return (
    <section className="view-panel active" id="view-seller-sales">
      
      <div className="view-header">
        <div>
          <h1 className="view-title">Minhas Vendas Realizadas</h1>
          <p className="view-subtitle">Consulte o status de aprovação de cada contrato cadastrado, vencimentos e os valores da sua comissão de 10%.</p>
        </div>
        {canCreateLeads && (
          <button className="btn btn-primary" onClick={() => openModal('client')}>
            <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            <span>+ Cadastrar Nova Venda</span>
          </button>
        )}
      </div>

      {/* Filtro de Status */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <select
          className="form-select sm"
          style={{ width: '220px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os Status ({commData.salesList.length})</option>
          <option value="approved">✅ Vendas Aprovadas ({commData.approvedCount})</option>
          <option value="pending">⏳ Aguardando Sócios ({commData.pendingCount})</option>
          <option value="denied">❌ Vendas Negadas</option>
        </select>
      </div>

      {/* Tabela de Vendas */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Cliente / Estabelecimento</th>
                <th style={{ padding: '12px 16px' }}>Telefone / Contato</th>
                <th style={{ padding: '12px 16px' }}>Plano Contratado</th>
                <th style={{ padding: '12px 16px' }}>Valor da Venda</th>
                <th style={{ padding: '12px 16px' }}>Sua Comissão (10%)</th>
                <th style={{ padding: '12px 16px' }}>Vencimento</th>
                <th style={{ padding: '12px 16px' }}>Status de Aprovação</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Nenhuma venda encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredSales.map(sale => {
                  const plan = plans.find(p => p.id === sale.planId) || plans[0];
                  const comm = sale.commissionAmount || (sale.value * 0.10);
                  const isApproved = sale.approvalStatus === 'approved' || sale.stage === 'ganho';
                  const isDenied = sale.approvalStatus === 'denied';
                  const dueInfo = getLeadDueStatus(sale);

                  return (
                    <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }} className="table-row-hover">
                      <td style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => openModal('lead-details', sale)}>
                        <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.92rem' }}>
                          {sale.company || sale.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {sale.companyAddress}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{sale.name}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sale.phone}</div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: 'var(--primary-bright)', fontWeight: 600 }}>{plan.name}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📺 {sale.tvsCount || plan.tvs} TVs</div>
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                        {formatCurrency(sale.value)}
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--accent-gold)', fontFamily: 'var(--font-sans)' }}>
                        {formatCurrency(comm)}
                      </td>

                      {/* Vencimento */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: dueInfo.color, fontWeight: 700, display: 'block', fontSize: '0.82rem' }}>
                          {dueInfo.formattedDueDate}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {dueInfo.text}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge-approval ${isApproved ? 'approved' : (isDenied ? 'denied' : 'pending')}`}>
                          {isApproved ? '✅ Aprovada' : (isDenied ? '❌ Negada' : '⏳ Aguardando Aprovação')}
                        </span>
                        {isDenied && sale.denialReason && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--danger)', marginTop: '4px' }}>
                            Motivo: {sale.denialReason}
                          </div>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary sm"
                          onClick={() => openModal('lead-details', sale)}
                        >
                          <ExternalLink style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                          Detalhes
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}

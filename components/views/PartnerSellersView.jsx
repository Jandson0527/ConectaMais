'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  UserCheck,
  PlusCircle,
  Percent,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  FolderOpen,
  Send,
  Zap,
  TrendingUp,
  Wallet,
  Calendar,
  CalendarCheck,
  MessageCircle
} from 'lucide-react';

export default function PartnerSellersView() {
  const {
    users,
    leads,
    currentUser,
    openModal,
    approveSellerSale,
    getSellerCommissions,
    getNextCommissionPayoutDate,
    formatCurrency,
    deleteUser
  } = useCRM();

  const can = (action) => !currentUser?.permissions || currentUser.permissions.includes(action);
  const sellers = users.filter(u => u.role === 'vendedor');
  const pendingSales = leads.filter(l => l.sellerId && l.approvalStatus === 'pending');
  const nextPayout = getNextCommissionPayoutDate();

  const totalPendingCommissions = sellers.reduce((sum, s) => sum + getSellerCommissions(s.id).pendingCommission, 0);

  return (
    <section className="view-panel active" id="view-partner-sellers">
      
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Gestão de Vendedores & Repasses (Dia 10)</h1>
          <p className="view-subtitle">Aprove novas vendas, controle o saldo de comissões de 10% e realize os repasses oficiais no <strong>dia 10 de cada mês</strong>.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {can('create-finance') && (
            <button
              className="btn btn-gold"
              onClick={() => openModal('transaction', { type: 'expense', category: 'Comissões de Vendedores' })}
              style={{ fontWeight: 800 }}
            >
              <DollarSign style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>Pagar Comissão de Vendedor</span>
            </button>
          )}
          {can('create-users') && (
            <button className="btn btn-primary" onClick={() => openModal('seller')}>
              <PlusCircle style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>+ Novo Vendedor</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner de Ciclo de Repasse no Dia 10 */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1.5px solid rgba(251, 191, 36, 0.4)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(251, 191, 36, 0.15)',
            color: 'var(--accent-gold)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            fontWeight: 900
          }}>
            10
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Ciclo Oficial de Repasse: Todo Dia 10 de Cada Mês
              </strong>
              <span className="badge-approval approved" style={{ fontSize: '0.72rem' }}>
                📅 Programado
              </span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Próxima data de quitação: <strong style={{ color: 'var(--accent-gold)' }}>{nextPayout.formattedDate}</strong> ({nextPayout.text})
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '8px 14px',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Fila Total a Repassar no Dia 10</span>
          <strong style={{ fontSize: '1.25rem', color: totalPendingCommissions > 0 ? 'var(--accent-gold)' : 'var(--success)', fontWeight: 900 }}>
            {formatCurrency(totalPendingCommissions)}
          </strong>
        </div>
      </div>

      {/* Fila de Aprovação de Vendas */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock style={{ width: '18px', height: '18px', color: 'var(--accent-gold)' }} />
              Vendas Aguardando Validação dos Sócios
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Ao aprovar, a receita entra no caixa e a comissão de 10% é somada ao saldo do vendedor para pagamento no dia 10
            </span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '12px',
            background: pendingSales.length > 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: pendingSales.length > 0 ? 'var(--accent-gold)' : 'var(--success)',
            border: `1px solid ${pendingSales.length > 0 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            fontWeight: 700
          }}>
            {pendingSales.length} {pendingSales.length === 1 ? 'Venda Pendente' : 'Vendas Pendentes'}
          </span>
        </div>

        {pendingSales.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            🎉 Nenhuma venda pendente de aprovação no momento. Todas as vendas dos vendedores foram validadas!
          </div>
        ) : (
          <div className="approval-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginTop: '10px' }}>
            {pendingSales.map(sale => {
              const sellerObj = users.find(u => u.id === sale.sellerId);
              const comm = sale.commissionAmount || (sale.value * 0.10);

              return (
                <div key={sale.id} className="approval-card">
                  <div className="approval-card-top">
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{sale.company || sale.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {sale.companyAddress}
                      </div>
                    </div>
                    <span className="approval-seller-chip">
                      👤 {sellerObj?.name || 'Vendedor'}
                    </span>
                  </div>

                  <div className="approval-financial-row">
                    <span>Valor da Venda: <strong>{formatCurrency(sale.value)}</strong></span>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                      Comissão (10%): <strong>{formatCurrency(comm)}</strong>
                    </span>
                  </div>

                  <div className="approval-actions-row">
                    <button
                      className="btn btn-primary sm"
                      style={{ flex: 1, justifyContent: 'center' }}
                      onClick={() => approveSellerSale(sale.id)}
                    >
                      <CheckCircle style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      Aprovar Venda
                    </button>
                    <button
                      className="btn btn-secondary sm"
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      onClick={() => openModal('deny-sale', sale)}
                    >
                      <XCircle style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      Negar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lista de Vendedores Cadastrados */}
      <div>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck style={{ width: '20px', height: '20px', color: 'var(--primary-bright)' }} />
          Vendedores Cadastrados & Repasses do Dia 10 ({sellers.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {sellers.map(seller => {
            const commData = getSellerCommissions(seller.id);
            const hasPendingPayout = commData.pendingCommission > 0;

            return (
              <div
                key={seller.id}
                style={{
                  background: 'var(--bg-card)',
                  border: hasPendingPayout ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-bright)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{seller.name}</h4>
                      <span style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: hasPendingPayout ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: hasPendingPayout ? 'var(--accent-gold)' : 'var(--success)',
                        border: `1px solid ${hasPendingPayout ? 'rgba(251, 191, 36, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                        fontWeight: 700
                      }}>
                        {hasPendingPayout ? '⏳ Repasse Dia 10' : '✅ Quitado'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{seller.phone || seller.email}</span>
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-surface)',
                  padding: '12px',
                  borderRadius: '10px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  fontSize: '0.8rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Saldo a Repassar (Dia 10)</span>
                    <strong style={{
                      color: hasPendingPayout ? 'var(--accent-gold)' : 'var(--success)',
                      fontSize: '1.15rem',
                      display: 'block'
                    }}>
                      {formatCurrency(commData.pendingCommission)}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>Renda Recorrente (MRR)</span>
                    <strong style={{ color: 'var(--primary-bright)', fontSize: '1.05rem', display: 'block' }}>
                      {formatCurrency(commData.portfolioMonthlyRecurring)} / mês
                    </strong>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    <span>Total Ganho: <strong>{formatCurrency(commData.totalEarnedCommission)}</strong></span>
                    <span>Já Quitado: <strong>{formatCurrency(commData.totalPaidOut)}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', flexWrap: 'wrap' }}>
                  {hasPendingPayout && (
                    <button
                      className="btn btn-gold sm"
                      style={{ flex: 1, justifyContent: 'center', fontWeight: 800 }}
                      onClick={() => openModal('transaction', {
                        type: 'expense',
                        category: 'Comissões de Vendedores',
                        sellerId: seller.id,
                        amount: commData.pendingCommission,
                        date: nextPayout.isoDate,
                        description: `Pagamento de Comissões (Repasse Dia 10) — ${seller.name}`
                      })}
                    >
                      <Zap style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      Pagar Comissão ({formatCurrency(commData.pendingCommission)})
                    </button>
                  )}
                  <button
                    className="btn btn-whatsapp sm"
                    style={{ flex: hasPendingPayout ? 'initial' : 1, justifyContent: 'center' }}
                    onClick={() => openModal('whatsapp-billing', {
                      ...seller,
                      isSellerTarget: true,
                      payoutAmount: commData.pendingCommission,
                      defaultTemplate: 'commission_paid'
                    })}
                    title="Enviar Mensagem / Notificação de Comissão no WhatsApp do Vendedor"
                  >
                    <MessageCircle style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                    WhatsApp
                  </button>
                  <button
                    className="btn btn-secondary sm"
                    style={{ flex: hasPendingPayout ? 'initial' : 1, justifyContent: 'center' }}
                    onClick={() => openModal('seller-dossier', seller)}
                  >
                    <FolderOpen style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                    Dossiê
                  </button>
                  {can('edit-users') && (
                    <button
                      className="btn btn-secondary sm"
                      style={{ flex: hasPendingPayout ? 'initial' : 1, justifyContent: 'center' }}
                      onClick={() => openModal('edit-user', seller)}
                      title="Editar, Inativar ou Remover Vendedor"
                    >
                      <UserCheck style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      Editar / Inativar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

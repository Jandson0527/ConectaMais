'use client';

import React from 'react';
import { useCRM } from '../../../context/CRMContext';
import {
  ShoppingBag,
  Percent,
  Flame,
  PlusCircle,
  Clock,
  CheckCircle,
  Calendar,
  ChevronRight,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

export default function SellerDashboardView() {
  const {
    currentUser,
    openModal,
    setCurrentView,
    getSellerCommissions,
    hotLeads,
    meetings,
    plans,
    formatCurrency
  } = useCRM();

  const commData = getSellerCommissions(currentUser?.id) || {};
  const payoutInfo = commData.nextPayoutInfo || { formattedDate: '10 de cada mês', daysRemainingText: '' };
  const sellerHotLeads = (hotLeads || []).filter(h => h.sellerId === currentUser?.id);
  const sellerMeetings = (meetings || []).filter(m => m.scheduledBy === currentUser?.id || m.assignedPartnerId === currentUser?.id);
  const canCreateLeads = !currentUser?.permissions || currentUser.permissions.includes('create-leads');

  return (
    <section className="view-panel active" id="view-seller-dashboard">
      
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Meu Painel de Vendas</h1>
          <p className="view-subtitle">Bem-vindo, <strong style={{ color: 'var(--primary-bright)' }}>{currentUser?.name}</strong>! Suas comissões de 10% caem todo <strong>dia 10 de cada mês</strong>.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-gold" onClick={() => openModal('hot-lead')}>
            <Flame style={{ width: '16px', height: '16px', marginRight: '4px' }} />
            <span>+ Cliente Quente</span>
          </button>
          {canCreateLeads && (
            <button className="btn btn-primary" onClick={() => openModal('client')}>
              <PlusCircle style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>+ Cadastrar Nova Venda</span>
            </button>
          )}
        </div>
      </div>

      {/* Banner de Boas-Vindas & Regra de Comissão Recorrente no Dia 10 */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(2, 132, 166, 0.35)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span className="badge-approval approved" style={{ fontSize: '0.72rem' }}>
              ⭐ Vendedor Comercial Conecta Mais
            </span>
            <span className="commission-tag" style={{ background: 'rgba(0, 210, 255, 0.15)', color: 'var(--primary-bright)', borderColor: 'rgba(0, 210, 255, 0.3)' }}>
              <RefreshCw style={{ width: '12px', height: '12px' }} /> 10% Recorrente
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '10px',
              background: 'rgba(251, 191, 36, 0.15)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(251, 191, 36, 0.3)'
            }}>
              📅 Pagamento Todo Dia 10 ({payoutInfo.formattedDate})
            </span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
            Construa sua Renda Passiva na Conecta Mais! 🚀
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Toda vez que seus clientes renovarem a mensalidade, você ganha <strong>10% de comissão novamente</strong>, pago pontualmente no <strong>dia 10 de cada mês</strong>!
          </p>
        </div>
        {canCreateLeads && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => openModal('client')} style={{ fontWeight: 700 }}>
              <PlusCircle style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>+ Cadastrar Venda</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards do Vendedor */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        <div className="kpi-card" style={{ '--accent-color': commData.pendingCommission > 0 ? 'var(--accent-gold)' : 'var(--success)' }}>
          <div className="kpi-icon-box" style={{ color: commData.pendingCommission > 0 ? 'var(--accent-gold)' : 'var(--success)' }}>
            <DollarSign style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Saldo p/ Repasse (Dia 10)</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: commData.pendingCommission > 0 ? 'var(--accent-gold)' : 'var(--success)' }}>
                {formatCurrency(commData.pendingCommission)}
              </span>
            </div>
            <span className="kpi-subtext">Repasse em {payoutInfo.formattedDate}</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--primary-bright)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--primary-bright)' }}>
            <TrendingUp style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Renda Mensal Recorrente (MRR)</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: 'var(--primary-bright)' }}>
                {formatCurrency(commData.portfolioMonthlyRecurring)}
              </span>
              <span className="kpi-badge positive">/ mês</span>
            </div>
            <span className="kpi-subtext">10% contínuo de clientes ativos</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--success)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--success)' }}>
            <CheckCircle style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Já Pago pelos Sócios</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: 'var(--success)' }}>
                {formatCurrency(commData.totalPaidOut)}
              </span>
            </div>
            <span className="kpi-subtext">{commData.payoutsHistory.length} repasses efetuados</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--accent-orange)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--accent-orange)' }}>
            <Flame style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Clientes Quentes</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{sellerHotLeads.length}</span>
            </div>
            <span className="kpi-subtext">Negociações em andamento</span>
          </div>
        </div>

      </div>

      {/* Grid com Últimas Vendas & Clientes Quentes */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        
        {/* Minhas Últimas Vendas */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Minhas Vendas & Carteira Recorrente</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Clientes ativos geram 10% todo mês na renovação</span>
            </div>
            <button className="btn btn-secondary sm" onClick={() => setCurrentView('seller-sales')}>
              Ver Todas ({commData.salesList.length}) <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          {commData.salesList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <ShoppingBag style={{ width: '36px', height: '36px', margin: '0 auto 8px', opacity: 0.4 }} />
              <p style={{ margin: 0 }}>Você ainda não cadastrou nenhuma venda. Clique no botão acima para cadastrar seu primeiro cliente!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {commData.salesList.slice(0, 4).map(sale => {
                const plan = plans.find(p => p.id === sale.planId) || plans[0];
                const comm = sale.commissionAmount || (sale.value * 0.10);
                const isApproved = sale.approvalStatus === 'approved' || sale.stage === 'ganho';
                const isDenied = sale.approvalStatus === 'denied';

                return (
                  <div
                    key={sale.id}
                    className="approval-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openModal('lead-details', sale)}
                  >
                    <div className="approval-card-top">
                      <div>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{sale.company || sale.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {plan.name} • {sale.companyAddress}
                        </div>
                      </div>
                      <span className={`badge-approval ${isApproved ? 'approved' : (isDenied ? 'denied' : 'pending')}`}>
                        {isApproved ? '✅ Aprovada' : (isDenied ? '❌ Negada' : '⏳ Aguardando Aprovação')}
                      </span>
                    </div>
                    <div className="approval-financial-row">
                      <span>Valor: <strong>{formatCurrency(sale.value)}</strong></span>
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                        Comissão Recorrente (10%): <strong>{formatCurrency(comm)} / ciclo</strong>
                      </span>
                    </div>
                    {sale.dueDate && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        📅 Próxima Renovação: <strong style={{ color: 'var(--primary-bright)' }}>{sale.dueDate.split('-')[2]}/{sale.dueDate.split('-')[1]}/{sale.dueDate.split('-')[0]}</strong>
                        {sale.renewalsCount ? ` • 🔄 ${sale.renewalsCount} renovações feitas` : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clientes Quentes Preview */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame style={{ width: '18px', height: '18px' }} /> Clientes Quentes
            </h3>
            <button className="btn btn-secondary sm" onClick={() => setCurrentView('seller-hotleads')}>
              Ver Todos ({sellerHotLeads.length})
            </button>
          </div>

          {sellerHotLeads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Nenhum cliente em potencial cadastrado no momento.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sellerHotLeads.slice(0, 3).map(h => (
                <div key={h.id} style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', display: 'block' }}>{h.company || h.name}</strong>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    <strong>Motivo:</strong> {h.reasonNotClosed}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-gold sm"
            style={{ marginTop: 'auto', justifyContent: 'center' }}
            onClick={() => openModal('hot-lead')}
          >
            + Cadastrar Cliente Quente
          </button>
        </div>

      </div>

    </section>
  );
}

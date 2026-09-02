'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Users,
  Tv,
  DollarSign,
  TrendingUp,
  Wallet,
  Calendar,
  PlusCircle,
  Clock,
  ArrowUpRight,
  Flame,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  MessageCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function DashboardView() {
  const {
    leads,
    screens,
    transactions,
    meetings,
    plans,
    currentUser,
    openModal,
    setCurrentView,
    formatCurrency,
    getDueAlerts,
    getLeadDueStatus,
    renewLeadContract
  } = useCRM();

  const canCreateFinance = !currentUser?.permissions || currentUser.permissions.includes('create-finance');
  const canCreateLeads = !currentUser?.permissions || currentUser.permissions.includes('create-leads');

  // Metrics
  const activeScreensCount = screens.filter(s => s.status === 'active').reduce((acc, s) => acc + (s.tvsCount || 1), 0);
  const wonLeads = leads.filter(l => l.stage === 'ganho');
  const totalRevenue = wonLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  
  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'paid').reduce((sum, t) => sum + Number(t.amount), 0);
  const cashBalance = totalIncome - totalExpense;

  const pendingApprovals = leads.filter(l => l.approvalStatus === 'pending');

  // Vencimentos e Alertas
  const dueAlerts = getDueAlerts();

  // Meetings Today
  const todayStr = new Date().toISOString().split('T')[0];
  const meetingsToday = meetings.filter(m => m.date === todayStr);

  return (
    <section className="view-panel active" id="view-dashboard">
      
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Visão Geral & Performance</h1>
          <p className="view-subtitle">Acompanhe métricas em tempo real de vendas, conversão de anunciantes, vencimentos e faturamento da Conecta Mais.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {canCreateLeads && (
            <button className="btn btn-primary" onClick={() => openModal('client')}>
              <PlusCircle style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>+ Novo Cliente</span>
            </button>
          )}
          {canCreateFinance && (
            <button className="btn btn-secondary" onClick={() => openModal('transaction', 'expense')}>
              <Wallet style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>+ Cadastrar Gasto</span>
            </button>
          )}
        </div>
      </div>

      {/* Alertas de Compromissos do Dia */}
      {meetingsToday.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.15), rgba(0, 119, 182, 0.15))',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          borderRadius: '12px',
          padding: '14px 18px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--primary-bright)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem', display: 'block' }}>
                Você tem {meetingsToday.length} reunião comercial agendada para hoje!
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {meetingsToday[0].title} às {meetingsToday[0].time} ({meetingsToday[0].companyName})
              </span>
            </div>
          </div>
          <button className="btn btn-secondary sm" onClick={() => setCurrentView('calendar')}>
            Ver Agenda Completa <ChevronRight style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      )}

      {/* SEÇÃO PRINCIPAL DE ALERTAS DE VENCIMENTO DE CLIENTES */}
      <div style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${dueAlerts.expired.length > 0 ? 'var(--danger)' : (dueAlerts.dueToday.length > 0 ? 'var(--accent-gold)' : 'rgba(2, 132, 166, 0.3)')}`,
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: dueAlerts.expired.length > 0 ? '0 8px 30px rgba(239, 68, 68, 0.15)' : 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: dueAlerts.expired.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(251, 191, 36, 0.2)',
              color: dueAlerts.expired.length > 0 ? 'var(--danger)' : 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${dueAlerts.expired.length > 0 ? 'var(--danger)' : 'var(--accent-gold)'}`
            }}>
              <AlertCircle style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                🚨 Alertas de Vencimento de Clientes & Mensalidades
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Controle de renovações de contratos, clientes vencidos e cobranças em aberto.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.18)',
              color: 'var(--danger)',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              🔴 {dueAlerts.expired.length} Vencidos
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(251, 191, 36, 0.18)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(251, 191, 36, 0.4)'
            }}>
              🟡 {dueAlerts.dueToday.length} Vence Hoje
            </span>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.18)',
              color: 'var(--accent-gold)',
              border: '1px solid rgba(245, 158, 11, 0.4)'
            }}>
              🟠 {dueAlerts.dueSoon.length} A Vencer (7d)
            </span>
          </div>
        </div>

        {/* Lista de Alertas Ativos */}
        {dueAlerts.totalAlerts === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
            <CheckCircle style={{ width: '24px', height: '24px', margin: '0 auto 6px', display: 'block' }} />
            <strong>Todos os clientes estão com as mensalidades em dia!</strong> Nenhuma renovação pendente para os próximos 7 dias.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' }}>
            
            {/* Clientes Vencidos */}
            {dueAlerts.expired.map(lead => {
              const dueInfo = getLeadDueStatus(lead);
              const plan = plans.find(p => p.id === lead.planId) || plans[0];
              const cleanPhone = (lead.phone || '').replace(/\D/g, '');
              const billingMsg = encodeURIComponent(`Olá ${lead.name || lead.company}, tudo bem? Aqui é da Conecta Mais. Identificamos que a mensalidade do seu plano (${plan.name}) venceu em ${dueInfo.formattedDueDate}. Segue a chave Pix para renovação: 11981112233. Qualquer dúvida estamos à disposição!`);
              const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${billingMsg}`;

              return (
                <div
                  key={lead.id}
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1.5px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                        {lead.company || lead.name}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {lead.name} • {lead.phone}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: 'var(--danger)',
                      color: '#ffffff',
                      textTransform: 'uppercase'
                    }}>
                      🔴 {dueInfo.text}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: '6px' }}>
                    <span>Plano: <strong style={{ color: 'var(--primary-bright)' }}>{plan.name}</strong></span>
                    <span>Valor: <strong style={{ color: 'var(--success)' }}>{formatCurrency(lead.value)}</strong></span>
                    <span>Vencimento: <strong style={{ color: 'var(--danger)' }}>{dueInfo.formattedDueDate}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {cleanPhone && (
                      <button
                        type="button"
                        className="btn btn-whatsapp sm"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                        onClick={() => openModal('whatsapp-billing', lead)}
                      >
                        <MessageCircle style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                        Cobrar WhatsApp
                      </button>
                    )}
                    <button
                      className="btn btn-primary sm"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      onClick={() => openModal('renewal', lead)}
                      title="Renovar mensalidade e registrar pagamento"
                    >
                      <RefreshCw style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                      Renovar Mensalidade
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Clientes Vencendo Hoje */}
            {dueAlerts.dueToday.map(lead => {
              const dueInfo = getLeadDueStatus(lead);
              const plan = plans.find(p => p.id === lead.planId) || plans[0];
              const cleanPhone = (lead.phone || '').replace(/\D/g, '');

              return (
                <div
                  key={lead.id}
                  style={{
                    background: 'rgba(251, 191, 36, 0.08)',
                    border: '1.5px solid rgba(251, 191, 36, 0.35)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                        {lead.company || lead.name}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {lead.name} • {lead.phone}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: 'var(--accent-gold)',
                      color: '#000',
                      textTransform: 'uppercase'
                    }}>
                      🟡 Vence Hoje!
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: '6px' }}>
                    <span>Plano: <strong style={{ color: 'var(--primary-bright)' }}>{plan.name}</strong></span>
                    <span>Valor: <strong style={{ color: 'var(--success)' }}>{formatCurrency(lead.value)}</strong></span>
                    <span>Vencimento: <strong style={{ color: 'var(--accent-gold)' }}>{dueInfo.formattedDueDate}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {cleanPhone && (
                      <button
                        type="button"
                        className="btn btn-whatsapp sm"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                        onClick={() => openModal('whatsapp-billing', lead)}
                      >
                        <MessageCircle style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                        WhatsApp Renovação
                      </button>
                    )}
                    <button
                      className="btn btn-primary sm"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      onClick={() => openModal('renewal', lead)}
                    >
                      <RefreshCw style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                      Renovar Mensalidade
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Clientes A Vencer nos Próximos 7 Dias */}
            {dueAlerts.dueSoon.map(lead => {
              const dueInfo = getLeadDueStatus(lead);
              const plan = plans.find(p => p.id === lead.planId) || plans[0];
              const cleanPhone = (lead.phone || '').replace(/\D/g, '');

              return (
                <div
                  key={lead.id}
                  style={{
                    background: 'rgba(245, 158, 11, 0.06)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', display: 'block' }}>
                        {lead.company || lead.name}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {lead.name} • {lead.phone}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: 'var(--accent-gold)',
                      border: '1px solid rgba(245, 158, 11, 0.4)'
                    }}>
                      🟠 {dueInfo.text}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: '6px' }}>
                    <span>Plano: <strong style={{ color: 'var(--primary-bright)' }}>{plan.name}</strong></span>
                    <span>Valor: <strong style={{ color: 'var(--success)' }}>{formatCurrency(lead.value)}</strong></span>
                    <span>Vencimento: <strong style={{ color: 'var(--accent-gold)' }}>{dueInfo.formattedDueDate}</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    {cleanPhone && (
                      <button
                        type="button"
                        className="btn btn-whatsapp sm"
                        style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem' }}
                        onClick={() => openModal('whatsapp-billing', lead)}
                        title="Enviar lembrete de vencimento próximo no WhatsApp"
                      >
                        <MessageCircle style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                        Lembrete WhatsApp
                      </button>
                    )}
                    <button
                      className="btn btn-secondary sm"
                      style={{ flex: cleanPhone ? 1 : 1, justifyContent: 'center', fontSize: '0.78rem' }}
                      onClick={() => openModal('lead-details', lead)}
                    >
                      <ExternalLink style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                      Dossiê
                    </button>
                    <button
                      className="btn btn-primary sm"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.78rem', background: 'var(--accent-orange)', borderColor: 'var(--accent-orange)', color: '#000', fontWeight: 700 }}
                      onClick={() => openModal('renewal', lead)}
                      title="Antecipar renovação do cliente"
                    >
                      <RefreshCw style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                      Antecipar
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        <div className="kpi-card" style={{ '--accent-color': 'var(--primary-bright)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--primary-bright)' }}>
            <Users style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Clientes / Anunciantes</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{wonLeads.length}</span>
              <span className="kpi-badge positive">Ativos</span>
            </div>
            <span className="kpi-subtext">{leads.length} leads totais no funil</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--success)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--success)' }}>
            <TrendingUp style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Faturamento Total Fechado</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{formatCurrency(totalRevenue)}</span>
            </div>
            <span className="kpi-subtext">Receita gerada em contratos</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--accent-gold)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--accent-gold)' }}>
            <Wallet style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Saldo em Caixa</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{formatCurrency(cashBalance)}</span>
            </div>
            <span className="kpi-subtext">Entradas menos custos e comissões</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--danger)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--danger)' }}>
            <AlertCircle style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Mensalidades Vencidas</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: dueAlerts.expired.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
                {dueAlerts.expired.length}
              </span>
              {dueAlerts.expired.length > 0 && <span className="kpi-badge negative">Atraso</span>}
            </div>
            <span className="kpi-subtext">Necessitam cobrança ativa</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': '#a855f7' }}>
          <div className="kpi-icon-box" style={{ color: '#a855f7' }}>
            <Tv style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Telas Físicas no Ar</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{activeScreensCount} TVs</span>
            </div>
            <span className="kpi-subtext">5 estabelecimentos parceiros</span>
          </div>
        </div>

      </div>

      {/* Grid: Clientes Recentes & Rede de Telas */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        
        {/* Clientes Recentes */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Últimos Clientes Cadastrados</h3>
            <button className="btn btn-secondary sm" onClick={() => setCurrentView('leads')}>
              Ver Todos ({leads.length}) <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leads.slice(0, 5).map(lead => {
              const plan = plans.find(p => p.id === lead.planId) || plans[0];
              const dueInfo = getLeadDueStatus(lead);

              return (
                <div
                  key={lead.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => openModal('lead-details', lead)}
                  className="table-row-hover"
                >
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.92rem', display: 'block' }}>
                      {lead.company || lead.name}
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {plan.name} • {lead.companyAddress}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div>
                      <strong style={{ color: 'var(--success)', fontSize: '0.95rem', display: 'block', fontFamily: 'var(--font-sans)' }}>
                        {formatCurrency(lead.value)}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: dueInfo.color, fontWeight: 700 }}>
                        {dueInfo.text}
                      </span>
                    </div>
                    <span className={`badge-stage badge-${lead.stage}`}>
                      {lead.stage.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo da Rede de Telas */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Rede de Telas</h3>
            <button className="btn btn-secondary sm" onClick={() => setCurrentView('screens')}>
              Gerenciar <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {screens.map(screen => (
              <div key={screen.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-surface)', borderRadius: '8px', fontSize: '0.82rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{screen.name}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{screen.neighborhood}</span>
                </div>
                <span style={{ color: 'var(--primary-bright)', fontWeight: 700 }}>
                  📺 {screen.tvsCount} TV
                </span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary sm" style={{ marginTop: 'auto', justifyContent: 'center' }} onClick={() => openModal('screen')}>
            + Adicionar Novo Ponto
          </button>
        </div>

      </div>

    </section>
  );
}

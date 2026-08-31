'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  FileSpreadsheet,
  MessageCircle,
  Edit3,
  Trash2,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function LeadsView() {
  const {
    currentUser,
    leads,
    plans,
    screens,
    users,
    openModal,
    deleteLead,
    formatCurrency,
    exportCSV,
    searchQuery,
    setSearchQuery,
    getLeadDueStatus,
    renewLeadContract
  } = useCRM();

  const [stageFilter, setStageFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dueFilter, setDueFilter] = useState('all'); // all | expired | due_today | due_soon | ok
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter
  const baseLeads = currentUser?.role === 'vendedor' ? leads.filter(l => l.sellerId === currentUser.id || l.assignedTo === currentUser.id) : leads;

  const filtered = baseLeads.filter(lead => {
    if (stageFilter !== 'all' && lead.stage !== stageFilter) return false;
    if (originFilter !== 'all' && lead.origin !== originFilter) return false;
    if (userFilter !== 'all' && lead.assignedTo !== userFilter && lead.sellerId !== userFilter) return false;
    if (paymentMethodFilter !== 'all' && (lead.paymentMethod || 'Pix') !== paymentMethodFilter) return false;

    if (dueFilter !== 'all') {
      const dueStatus = getLeadDueStatus(lead).status;
      if (dueFilter === 'expired' && dueStatus !== 'expired') return false;
      if (dueFilter === 'due_today' && dueStatus !== 'due_today') return false;
      if (dueFilter === 'due_soon' && dueStatus !== 'due_soon') return false;
      if (dueFilter === 'ok' && dueStatus !== 'ok') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComp = lead.company?.toLowerCase().includes(q);
      const matchName = lead.name?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.includes(q);
      const matchEmail = lead.email?.toLowerCase().includes(q);
      const matchAddr = lead.companyAddress?.toLowerCase().includes(q);
      if (!matchComp && !matchName && !matchPhone && !matchEmail && !matchAddr) return false;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <section className="view-panel active" id="view-leads">
      
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Lista de Clientes & Anunciantes</h1>
          <p className="view-subtitle">Gerencie todos os clientes ativos, datas de vencimento, pagamentos e renovações na rede Conecta Mais.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={exportCSV}>
            <FileSpreadsheet style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            <span>Exportar CSV</span>
          </button>
          {(!currentUser || currentUser?.permissions?.includes('create-leads')) && (
            <button className="btn btn-primary" onClick={() => openModal('client')}>
              <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>+ Novo Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nome, empresa, endereço ou WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtro de Vencimento */}
        <select
          className="form-select"
          style={{ width: '180px', borderColor: dueFilter !== 'all' ? 'var(--accent-gold)' : undefined }}
          value={dueFilter}
          onChange={(e) => setDueFilter(e.target.value)}
        >
          <option value="all">Todos os Vencimentos</option>
          <option value="expired">🔴 Vencidos (Em Atraso)</option>
          <option value="due_today">🟡 Vencendo Hoje</option>
          <option value="due_soon">🟠 A Vencer (Próximos 7d)</option>
          <option value="ok">🟢 Em Dia</option>
        </select>

        <select
          className="form-select"
          style={{ width: '160px' }}
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option value="all">Todas as Etapas</option>
          <option value="novo">Novo Lead</option>
          <option value="qualificacao">Qualificação</option>
          <option value="reuniao">Reunião Agendada</option>
          <option value="proposta">Proposta Apresentada</option>
          <option value="negociacao">Em Negociação</option>
          <option value="ganho">Ganho (Fechado)</option>
          <option value="perdido">Perdido</option>
        </select>

        <select
          className="form-select"
          style={{ width: '160px' }}
          value={originFilter}
          onChange={(e) => setOriginFilter(e.target.value)}
        >
          <option value="all">Todas as Origens</option>
          <option value="WhatsApp Direto">WhatsApp Direto</option>
          <option value="Visita Presencial">Visita Presencial</option>
          <option value="Prospecção Vendedor">Prospecção Vendedor</option>
          <option value="Google Ads">Google Ads</option>
          <option value="Instagram">Instagram</option>
          <option value="Indicação">Indicação</option>
        </select>

        <select
          className="form-select"
          style={{ width: '160px' }}
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        >
          <option value="all">Todos os Responsáveis</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select
          className="form-select"
          style={{ width: '175px' }}
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
        >
          <option value="all">Formas de Pagamento (Todas)</option>
          <option value="Pix">⚡ Pix</option>
          <option value="Boleto Bancário">📄 Boleto Bancário</option>
          <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
          <option value="Cartão de Débito">💳 Cartão de Débito</option>
          <option value="Transferência Bancária">🏦 Transferência</option>
          <option value="Dinheiro em Espécie">💵 Dinheiro</option>
        </select>

        {(stageFilter !== 'all' || originFilter !== 'all' || userFilter !== 'all' || dueFilter !== 'all' || paymentMethodFilter !== 'all' || searchQuery) && (
          <button
            className="btn btn-secondary sm"
            onClick={() => { setStageFilter('all'); setOriginFilter('all'); setUserFilter('all'); setDueFilter('all'); setPaymentMethodFilter('all'); setSearchQuery(''); }}
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Tabela de Leads */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        overflow: 'hidden'
      }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('company')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Cliente / Estabelecimento <ArrowUpDown style={{ width: '12px', height: '12px' }} />
                  </span>
                </th>
                <th style={{ padding: '12px 16px' }}>Contato / WhatsApp</th>
                <th style={{ padding: '12px 16px' }}>Plano / TVs</th>
                <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('value')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Valor & Pgto <ArrowUpDown style={{ width: '12px', height: '12px' }} />
                  </span>
                </th>
                <th style={{ padding: '12px 16px', cursor: 'pointer' }} onClick={() => handleSort('dueDate')}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Datas <ArrowUpDown style={{ width: '12px', height: '12px' }} />
                  </span>
                </th>
                <th style={{ padding: '12px 16px' }}>Status Vencimento</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Nenhum cliente encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                sorted.map(lead => {
                  const plan = plans.find(p => p.id === lead.planId) || plans[0];
                  const dueInfo = getLeadDueStatus(lead);
                  const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                  const billingMsg = encodeURIComponent(`Olá ${lead.name || lead.company}, tudo bem? Aqui é da Conecta Mais. A mensalidade do plano (${plan.name}) está com vencimento em ${dueInfo.formattedDueDate}. Segue dados para pagamento (${lead.paymentMethod || 'Pix'}).`);
                  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${billingMsg}`;

                  return (
                    <tr key={lead.id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.15), rgba(0, 119, 182, 0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: '#00d2ff',
                            fontSize: '0.85rem'
                          }}>
                            {(lead.name || 'C').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <strong style={{ color: '#ffffff', display: 'block' }}>{lead.company || lead.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.companyAddress}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div>
                            <span style={{ color: '#ffffff', display: 'block', fontSize: '0.85rem' }}>{lead.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.phone}</span>
                          </div>
                          {cleanPhone && (
                            <button
                              type="button"
                              className="btn-icon"
                              onClick={() => openModal('whatsapp-billing', lead)}
                              title="Enviar Cobrança / Mensagem Personalizada no WhatsApp"
                              style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}
                            >
                              <MessageCircle style={{ width: '16px', height: '16px' }} />
                            </button>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: '#00d2ff', fontWeight: 600, display: 'block' }}>
                          {plan.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          📺 {lead.tvsCount || plan.tvs} TVs • {lead.mediaFormat === 'video' ? 'Vídeo' : 'Foto'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ color: '#10b981', fontFamily: 'var(--font-sans)', display: 'block', fontSize: '0.95rem' }}>
                          {formatCurrency(lead.value)}
                        </strong>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          marginTop: '3px',
                          background: lead.paymentMethod === 'Cartão de Crédito'
                            ? 'rgba(139, 92, 246, 0.15)'
                            : (lead.paymentMethod === 'Boleto Bancário' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'),
                          color: lead.paymentMethod === 'Cartão de Crédito'
                            ? '#a78bfa'
                            : (lead.paymentMethod === 'Boleto Bancário' ? '#fbbf24' : '#10b981'),
                          border: `1px solid ${lead.paymentMethod === 'Cartão de Crédito' ? 'rgba(139, 92, 246, 0.3)' : (lead.paymentMethod === 'Boleto Bancário' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)')}`
                        }}>
                          {lead.paymentMethod === 'Cartão de Crédito' && '💳 '}
                          {lead.paymentMethod === 'Boleto Bancário' && '📄 '}
                          {(!lead.paymentMethod || lead.paymentMethod === 'Pix') && '⚡ '}
                          {lead.paymentMethod || 'Pix'}
                        </span>
                      </td>

                      {/* Data Pagamento e Vencimento */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>
                            Pago: <strong style={{ color: '#ffffff' }}>{lead.paymentDate ? `${lead.paymentDate.split('-')[2]}/${lead.paymentDate.split('-')[1]}/${lead.paymentDate.split('-')[0]}` : '-'}</strong>
                          </span>
                          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.72rem' }}>
                            Vence: <strong style={{ color: dueInfo.color }}>{dueInfo.formattedDueDate}</strong>
                          </span>
                        </div>
                      </td>

                      {/* Status de Vencimento Badge */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 9px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: dueInfo.status === 'expired'
                            ? 'rgba(239, 68, 68, 0.18)'
                            : (dueInfo.status === 'due_today'
                              ? 'rgba(251, 191, 36, 0.18)'
                              : (dueInfo.status === 'due_soon'
                                ? 'rgba(245, 158, 11, 0.18)'
                                : 'rgba(16, 185, 129, 0.18)')),
                          color: dueInfo.color,
                          border: `1px solid ${dueInfo.color}`
                        }}>
                          {dueInfo.status === 'expired' && '🔴'}
                          {dueInfo.status === 'due_today' && '🟡'}
                          {dueInfo.status === 'due_soon' && '🟠'}
                          {dueInfo.status === 'ok' && '🟢'}
                          {' '}{dueInfo.text}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn-icon"
                            style={{ width: '30px', height: '30px', color: '#10b981' }}
                            onClick={() => openModal('renewal', lead)}
                            title="Renovar Mensalidade / Antecipar Contrato"
                          >
                            <RefreshCw style={{ width: '14px', height: '14px' }} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{ width: '30px', height: '30px' }}
                            onClick={() => openModal('lead-details', lead)}
                            title="Ver Dossiê e Histórico"
                          >
                            <ExternalLink style={{ width: '14px', height: '14px' }} />
                          </button>
                          {(!currentUser || currentUser?.permissions?.includes('edit-leads')) && (
                            <button
                              className="btn-icon"
                              style={{ width: '30px', height: '30px' }}
                              onClick={() => openModal('edit-client', lead)}
                              title="Editar Cliente"
                            >
                              <Edit3 style={{ width: '14px', height: '14px' }} />
                            </button>
                          )}
                          {(!currentUser || currentUser?.permissions?.includes('delete-leads')) && (
                            <button
                              className="btn-icon"
                              style={{ width: '30px', height: '30px', color: '#f87171' }}
                              onClick={() => {
                                if (confirm(`Deseja realmente excluir ${lead.company}?`)) deleteLead(lead.id);
                              }}
                              title="Excluir"
                            >
                              <Trash2 style={{ width: '14px', height: '14px' }} />
                            </button>
                          )}
                        </div>
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

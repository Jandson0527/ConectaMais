'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Kanban,
  Plus,
  Phone,
  Building,
  Tv,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

const STAGES = [
  { id: 'novo', title: 'Novo Lead', color: 'var(--text-muted)' },
  { id: 'qualificacao', title: 'Qualificação', color: 'var(--primary-bright)' },
  { id: 'reuniao', title: 'Reunião Agendada', color: '#0077b6' },
  { id: 'proposta', title: 'Proposta Apresentada', color: 'var(--purple)' },
  { id: 'negociacao', title: 'Em Negociação', color: 'var(--accent-gold)' },
  { id: 'ganho', title: 'Ganho (Fechado) 🎉', color: 'var(--success)' },
  { id: 'perdido', title: 'Perdido', color: 'var(--danger)' }
];

export default function KanbanView() {
  const {
    leads,
    plans,
    users,
    openModal,
    updateLeadStage,
    formatCurrency,
    searchQuery,
    currentUser
  } = useCRM();

  const [filterUser, setFilterUser] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (filterUser !== 'all' && lead.assignedTo !== filterUser && lead.sellerId !== filterUser) return false;
    if (filterPlan !== 'all' && lead.planId !== filterPlan) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.name?.toLowerCase().includes(q);
      const matchComp = lead.company?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.includes(q);
      if (!matchName && !matchComp && !matchPhone) return false;
    }
    return true;
  });

  const getNextStage = (currentStage) => {
    const idx = STAGES.findIndex(s => s.id === currentStage);
    if (idx < STAGES.length - 2) return STAGES[idx + 1].id;
    if (idx === STAGES.length - 2) return 'ganho';
    return null;
  };

  const getPrevStage = (currentStage) => {
    const idx = STAGES.findIndex(s => s.id === currentStage);
    if (idx > 0 && idx < STAGES.length - 1) return STAGES[idx - 1].id;
    return null;
  };

  return (
    <section className="view-panel active" id="view-kanban" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header & Filtros */}
      <div className="view-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="view-title">Funil de Vendas (CRM Kanban)</h1>
          <p className="view-subtitle">Gerencie o fluxo de negociação dos clientes em tempo real, desde o primeiro contato até o fechamento.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="form-select sm"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            style={{ width: '160px' }}
          >
            <option value="all">Todos os Responsáveis</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <select
            className="form-select sm"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">Todos os Planos</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {(!currentUser || currentUser?.permissions?.includes('create-leads')) && (
            <button className="btn primary sm" onClick={() => openModal('client')}>
              <Plus style={{ width: '16px', height: '16px', marginRight: '4px' }} />
              <span>+ Novo Cliente</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="kanban-board-container" style={{
        display: 'flex',
        gap: '14px',
        overflowX: 'auto',
        flex: 1,
        paddingBottom: '1rem',
        alignItems: 'flex-start'
      }}>
        {STAGES.map(stage => {
          const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
          const stageTotalValue = stageLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);

          return (
            <div
              key={stage.id}
              className="kanban-column"
              style={{
                minWidth: '290px',
                maxWidth: '310px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 210px)'
              }}
            >
              {/* Column Header */}
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border-subtle)',
                borderTop: `3px solid ${stage.color}`,
                borderTopLeftRadius: '14px',
                borderTopRightRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-surface)'
              }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{stage.title}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {formatCurrency(stageTotalValue)}
                  </span>
                </div>
                <span style={{
                  background: 'var(--bg-card)',
                  color: stage.color,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Column Body / Cards List */}
              <div style={{
                padding: '10px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                flex: 1
              }}>
                {stageLeads.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', border: '1px dashed var(--border-subtle)', borderRadius: '8px' }}>
                    Nenhum cliente nesta etapa
                  </div>
                ) : (
                  stageLeads.map(lead => {
                    const plan = plans.find(p => p.id === lead.planId) || plans[0];
                    const nextStg = getNextStage(lead.stage);
                    const prevStg = getPrevStage(lead.stage);

                    return (
                      <div
                        key={lead.id}
                        className="kanban-card"
                        style={{
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          padding: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                        onClick={() => openModal('lead-details', lead)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{lead.company || lead.name}</strong>
                          <span style={{
                            fontSize: '0.7rem',
                            color: lead.priority === 'urgente' ? 'var(--danger)' : 'var(--primary-bright)',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}>
                            {lead.priority}
                          </span>
                        </div>

                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {lead.name} • {lead.phone}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary-bright)', background: 'rgba(0, 210, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            📺 {plan.name} ({lead.tvsCount || 1} TVs)
                          </span>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--success)', fontFamily: 'var(--font-sans)' }}>
                            {formatCurrency(lead.value)}
                          </strong>
                        </div>

                        {/* Quick Advance / Move Buttons */}
                        {(!currentUser || currentUser?.permissions?.includes('edit-leads')) && (
                          <div
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {prevStg ? (
                              <button
                                className="btn-icon"
                                style={{ width: '24px', height: '24px' }}
                                onClick={() => updateLeadStage(lead.id, prevStg)}
                                title="Recuar etapa"
                              >
                                <ChevronLeft style={{ width: '14px', height: '14px' }} />
                              </button>
                            ) : <div />}

                            {nextStg && (
                              <button
                                className="btn btn-secondary sm"
                                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                                onClick={() => updateLeadStage(lead.id, nextStg)}
                                title="Avançar etapa"
                              >
                                <span>Avançar</span>
                                <ChevronRight style={{ width: '12px', height: '12px', marginLeft: '2px' }} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

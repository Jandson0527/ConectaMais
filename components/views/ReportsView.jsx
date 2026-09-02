'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  DollarSign,
  Users,
  Tv
} from 'lucide-react';

export default function ReportsView() {
  const { leads, plans, transactions, formatCurrency } = useCRM();

  // Metrics calculation
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === 'ganho');
  const conversionRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : 0;
  const totalRevenue = wonLeads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);

  // Group by plan
  const planBreakdown = plans.map(p => {
    const count = leads.filter(l => l.planId === p.id).length;
    const rev = leads.filter(l => l.planId === p.id && l.stage === 'ganho').reduce((sum, l) => sum + Number(l.value), 0);
    return { name: p.name, count, rev };
  });

  return (
    <section className="view-panel active" id="view-reports">
      
      <div className="view-header">
        <div>
          <h1 className="view-title">Relatórios & Métricas de Desempenho</h1>
          <p className="view-subtitle">Análise aprofundada de conversão comercial, faturamento por plano e canais de atração.</p>
        </div>
      </div>

      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="kpi-card" style={{ '--accent-color': 'var(--primary-bright)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--primary-bright)' }}>
            <TrendingUp style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Taxa de Conversão</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{conversionRate}%</span>
              <span className="kpi-badge positive">{wonLeads.length} Fechados</span>
            </div>
            <span className="kpi-subtext">De lead para cliente ativo</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--success)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--success)' }}>
            <DollarSign style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Faturamento Total Gerado</span>
            <div className="kpi-value-row">
              <span className="kpi-value">{formatCurrency(totalRevenue)}</span>
            </div>
            <span className="kpi-subtext">Soma dos contratos fechados</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': 'var(--accent-gold)' }}>
          <div className="kpi-icon-box" style={{ color: 'var(--accent-gold)' }}>
            <Tv style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Ticket Médio por Contrato</span>
            <div className="kpi-value-row">
              <span className="kpi-value">
                {wonLeads.length > 0 ? formatCurrency(totalRevenue / wonLeads.length) : 'R$ 0,00'}
              </span>
            </div>
            <span className="kpi-subtext">Valor médio por anunciante</span>
          </div>
        </div>
      </div>

      {/* Tabela de Planos Mais Vendidos */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Desempenho Comercial por Plano de TV
        </h3>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px' }}>Plano de TV</th>
                <th style={{ padding: '10px 14px' }}>Total de Leads</th>
                <th style={{ padding: '10px 14px' }}>Faturamento Fechado</th>
                <th style={{ padding: '10px 14px' }}>Participação</th>
              </tr>
            </thead>
            <tbody>
              {planBreakdown.map(p => {
                const perc = totalRevenue > 0 ? ((p.rev / totalRevenue) * 100).toFixed(0) : 0;
                return (
                  <tr key={p.name} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {p.count} clientes
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--success)', fontFamily: 'var(--font-sans)' }}>
                      {formatCurrency(p.rev)}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, background: 'var(--border-subtle)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${perc}%`, background: 'var(--primary-bright)', height: '100%' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{perc}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}

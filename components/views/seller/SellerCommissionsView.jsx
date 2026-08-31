'use client';

import React from 'react';
import { useCRM } from '../../../context/CRMContext';
import {
  Percent,
  DollarSign,
  CheckCircle,
  Clock,
  Wallet,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  TrendingUp,
  Users,
  Sparkles,
  ArrowDownCircle,
  CheckCircle2,
  Calendar,
  CalendarCheck
} from 'lucide-react';

export default function SellerCommissionsView() {
  const {
    currentUser,
    getSellerCommissions,
    plans,
    formatCurrency
  } = useCRM();

  const commData = getSellerCommissions(currentUser?.id) || {
    commissionLedger: [],
    payoutsHistory: [],
    salesList: [],
    approvedSales: []
  };
  const payoutInfo = commData.nextPayoutInfo || { formattedDate: '10 de cada mês', daysRemainingText: '' };

  return (
    <section className="view-panel active" id="view-seller-commissions">
      
      <div className="view-header">
        <div>
          <h1 className="view-title">Minhas Comissões Recorrentes (10%)</h1>
          <p className="view-subtitle">Acompanhe seu saldo acumulado, repasses efetuados pelos sócios e data do próximo pagamento no <strong>dia 10</strong>.</p>
        </div>
      </div>

      {/* Alerta de Data do Próximo Pagamento no Dia 10 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))',
        border: '1.5px solid rgba(251, 191, 36, 0.45)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 20px rgba(251, 191, 36, 0.12)'
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
              <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
                Pagamento de Comissões: Todo Dia 10 de Cada Mês
              </strong>
              <span className="badge-approval approved" style={{ fontSize: '0.72rem' }}>
                📅 Ciclo Mensal
              </span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Próximo repasse oficial: <strong style={{ color: 'var(--accent-gold)' }}>{payoutInfo.formattedDate}</strong> ({payoutInfo.text})
            </span>
          </div>
        </div>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '8px 14px',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Saldo a Receber no Dia 10</span>
          <strong style={{ fontSize: '1.25rem', color: commData.pendingCommission > 0 ? 'var(--accent-gold)' : '#10b981', fontWeight: 900 }}>
            {formatCurrency(commData.pendingCommission)}
          </strong>
        </div>
      </div>

      {/* KPI Cards de Comissões & Recorrência */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        {/* Saldo Atual a Receber */}
        <div className="kpi-card" style={{ '--accent-color': commData.pendingCommission > 0 ? '#fbbf24' : '#10b981' }}>
          <div className="kpi-icon-box" style={{ background: commData.pendingCommission > 0 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: commData.pendingCommission > 0 ? 'var(--accent-gold)' : '#10b981' }}>
            <Wallet style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Saldo Acumulado Atual</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: commData.pendingCommission > 0 ? 'var(--accent-gold)' : '#10b981' }}>
                {formatCurrency(commData.pendingCommission)}
              </span>
            </div>
            <span className="kpi-subtext">
              {commData.pendingCommission > 0 ? `Programado para pagamento em ${payoutInfo.formattedDate}` : '✅ Saldo atual 100% quitado'}
            </span>
          </div>
        </div>

        {/* Total Já Recebido */}
        <div className="kpi-card" style={{ '--accent-color': '#10b981' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <CheckCircle2 style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Já Pago pelos Sócios</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: '#10b981' }}>
                {formatCurrency(commData.totalPaidOut)}
              </span>
            </div>
            <span className="kpi-subtext">{commData.payoutsHistory.length} repasses efetuados</span>
          </div>
        </div>

        {/* Renda Recorrente Mensal */}
        <div className="kpi-card" style={{ '--accent-color': '#00d2ff' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(0, 210, 255, 0.12)', color: '#00d2ff' }}>
            <TrendingUp style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Renda Mensal Recorrente (MRR)</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: '#00d2ff' }}>
                {formatCurrency(commData.portfolioMonthlyRecurring)}
              </span>
              <span className="kpi-badge positive">/ mês</span>
            </div>
            <span className="kpi-subtext">10% contínuo de clientes ativos</span>
          </div>
        </div>

        {/* Total Histórico Ganho */}
        <div className="kpi-card" style={{ '--accent-color': '#8b5cf6' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <ShoppingBag style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total Histórico de Comissões</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: '#a78bfa' }}>
                {formatCurrency(commData.totalEarnedCommission)}
              </span>
            </div>
            <span className="kpi-subtext">{commData.approvedCount} ativações • {commData.totalRenewalsCount} renovações</span>
          </div>
        </div>

      </div>

      {/* Banner de Recorrência & Política de Ganhos no Dia 10 */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
        border: '1.5px solid rgba(0, 210, 255, 0.35)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 6px 20px rgba(0, 210, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#00d2ff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
              Política de Pagamento & Comissionamento Recorrente (10%)
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#00d2ff', fontWeight: 600 }}>
              Repasse pontual todo dia 10 de cada mês
            </span>
          </div>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
          • <strong>Data de Repasse Fixa:</strong> Toda a sua comissão acumulada de vendas fechadas e renovações é paga pontualmente no <strong>dia 10 de cada mês</strong> via Pix.<br />
          • <strong>Ativações & Renovações:</strong> Toda vez que você fecha uma venda ou um cliente da sua carteira <strong>renova a mensalidade</strong>, 10% entra automaticamente no seu saldo a receber.<br />
          • <strong>Quitação pelos Sócios:</strong> No dia 10, os sócios efetuam o repasse no fluxo financeiro, o seu saldo é <strong>zerado</strong> e o comprovante fica gravado no histórico abaixo.<br />
          • <strong>Novos Ganhos Automáticos:</strong> Assim que qualquer cliente fizer uma nova renovação ou você cadastrar um novo contrato, o saldo volta a subir para o próximo dia 10!
        </p>
      </div>

      {/* Histórico de Repasses Pagos pelos Sócios */}
      {commData.payoutsHistory.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowDownCircle style={{ width: '18px', height: '18px', color: '#10b981' }} />
                Histórico de Repasses Recebidos dos Sócios ({commData.payoutsHistory.length})
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Comprovantes e quitações de comissão realizadas para você
              </span>
            </div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#10b981',
              padding: '4px 10px',
              background: 'rgba(16, 185, 129, 0.15)',
              borderRadius: '10px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              Total Recebido: {formatCurrency(commData.totalPaidOut)}
            </span>
          </div>

          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px' }}>Data do Repasse</th>
                  <th style={{ padding: '10px 14px' }}>Valor Pago</th>
                  <th style={{ padding: '10px 14px' }}>Forma de Pagamento</th>
                  <th style={{ padding: '10px 14px' }}>Pago por</th>
                  <th style={{ padding: '10px 14px' }}>Observações</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {commData.payoutsHistory.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                    <td style={{ padding: '10px 14px', color: '#ffffff', fontWeight: 700 }}>
                      {p.date ? (p.date.includes('-') ? `${p.date.split('-')[2]}/${p.date.split('-')[1]}/${p.date.split('-')[0]}` : p.date) : '-'}
                    </td>
                    <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 800 }}>
                      {formatCurrency(p.amount)}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="badge-payment-method">{p.paymentMethod || 'Pix'}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                      {p.paidByName || 'Sócio'}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {p.notes || 'Quitação de saldo'}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="badge-approval approved">✅ Pago / Quitado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Extrato Detalhado de Comissões (Vendas Iniciais + Renovações) */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>
              Extrato Detalhado de Vendas & Renovações
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Discriminação de todas as ativações e ciclos de renovação gerados pela sua carteira
            </span>
          </div>
          <span style={{
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            fontWeight: 700
          }}>
            {commData.commissionLedger.length} Lançamentos Registrados
          </span>
        </div>

        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>Tipo de Ganho</th>
                <th style={{ padding: '12px 14px' }}>Cliente / Estabelecimento</th>
                <th style={{ padding: '12px 14px' }}>Data</th>
                <th style={{ padding: '12px 14px' }}>Valor Pago pelo Cliente</th>
                <th style={{ padding: '12px 14px' }}>Taxa</th>
                <th style={{ padding: '12px 14px' }}>Sua Comissão (10%)</th>
              </tr>
            </thead>
            <tbody>
              {commData.commissionLedger.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Nenhuma comissão registrada ainda. Cadastre clientes e acompanhe as renovações recorrentes aqui!
                  </td>
                </tr>
              ) : (
                commData.commissionLedger.map((item, idx) => {
                  const isRecurring = item.type === 'recurring_renewal';

                  return (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }} className="table-row-hover">
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          background: isRecurring ? 'rgba(0, 210, 255, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                          color: isRecurring ? '#00d2ff' : 'var(--accent-gold)',
                          border: `1px solid ${isRecurring ? 'rgba(0, 210, 255, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                        }}>
                          {item.typeLabel}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: '#ffffff', display: 'block' }}>{item.company}</strong>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.companyAddress}</span>
                      </td>

                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                        {item.date ? (item.date.includes('-') ? `${item.date.split('-')[2]}/${item.date.split('-')[1]}/${item.date.split('-')[0]}` : item.date) : '-'}
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                        {formatCurrency(item.saleValue)}
                      </td>

                      <td style={{ padding: '12px 14px', color: '#00d2ff', fontWeight: 700 }}>
                        10%
                      </td>

                      <td style={{ padding: '12px 14px', fontWeight: 900, color: 'var(--accent-gold)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem' }}>
                        + {formatCurrency(item.commissionAmount)}
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

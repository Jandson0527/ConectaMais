'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  FolderOpen,
  ShoppingBag,
  DollarSign,
  Percent,
  CheckCircle,
  Clock,
  Flame,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  Zap,
  ArrowDownCircle
} from 'lucide-react';

export default function SellerDossierModal() {
  const {
    activeModal,
    closeModal,
    openModal,
    users,
    hotLeads,
    getSellerCommissions,
    formatCurrency
  } = useCRM();

  const seller = activeModal?.data;
  if (!seller) return null;

  const commData = getSellerCommissions(seller.id);
  const sellerHotLeads = hotLeads.filter(h => h.sellerId === seller.id);
  const hasPendingPayout = commData.pendingCommission > 0;

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-xl" style={{ maxWidth: '960px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FolderOpen style={{ width: '22px', height: '22px', color: '#00d2ff' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
                Dossiê Completo & Repasse de Comissões do Vendedor
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Vendas ativas, histórico de renovações, repasses efetuados e saldo a pagar
              </span>
            </div>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Hero Banner do Vendedor */}
          <div className="seller-dossier-hero" style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))',
            border: hasPendingPayout ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(0, 210, 255, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={seller.avatar} alt={seller.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00d2ff' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#ffffff' }}>{seller.name}</h3>
                  <span className={`badge-approval ${hasPendingPayout ? 'pending' : 'approved'}`}>
                    {hasPendingPayout ? '⏳ Saldo a Pagar' : '✅ Comissões Quitadas'}
                  </span>
                  <span className="commission-tag">
                    <RefreshCw style={{ width: '12px', height: '12px' }} /> 10% Recorrente
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span><Mail style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} /> {seller.email}</span>
                  <span><Phone style={{ width: '14px', height: '14px', display: 'inline', marginRight: '4px' }} /> {seller.phone || 'Sem telefone'}</span>
                </div>
              </div>
            </div>

            {hasPendingPayout && (
              <button
                className="btn btn-gold"
                style={{ fontWeight: 800 }}
                onClick={() => {
                  closeModal();
                  openModal('transaction', {
                    type: 'expense',
                    category: 'Comissões de Vendedores',
                    sellerId: seller.id,
                    amount: commData.pendingCommission,
                    description: `Pagamento de Comissões — ${seller.name}`
                  });
                }}
              >
                <Zap style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                Pagar Comissão Agora ({formatCurrency(commData.pendingCommission)})
              </button>
            )}
          </div>

          {/* Cards de Métricas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Saldo Atual a Pagar</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: hasPendingPayout ? 'var(--accent-gold)' : '#10b981', marginTop: '4px' }}>
                {formatCurrency(commData.pendingCommission)}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                {hasPendingPayout ? 'Pendente de repasse' : 'Zero pendências'}
              </span>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Já Repassado</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {formatCurrency(commData.totalPaidOut)}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{commData.payoutsHistory.length} repasses efetuados</span>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Renda Recorrente Estimada (MRR)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00d2ff', marginTop: '4px' }}>
                {formatCurrency(commData.portfolioMonthlyRecurring)} / mês
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>De {commData.activeClientsCount} clientes ativos</span>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Histórico Ganho</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a78bfa', marginTop: '4px' }}>
                {formatCurrency(commData.totalEarnedCommission)}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{commData.totalRenewalsCount} ciclos renovados</span>
            </div>

          </div>

          {/* Histórico de Repasses */}
          {commData.payoutsHistory.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#10b981', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowDownCircle style={{ width: '16px', height: '16px' }} />
                Histórico de Repasses Realizados ({commData.payoutsHistory.length})
              </h4>
              <div className="table-responsive" style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px 12px' }}>Data</th>
                      <th style={{ padding: '8px 12px' }}>Valor Pago</th>
                      <th style={{ padding: '8px 12px' }}>Forma de Pagamento</th>
                      <th style={{ padding: '8px 12px' }}>Pago por</th>
                      <th style={{ padding: '8px 12px' }}>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commData.payoutsHistory.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                        <td style={{ padding: '8px 12px' }}>
                          {p.date ? (p.date.includes('-') ? `${p.date.split('-')[2]}/${p.date.split('-')[1]}/${p.date.split('-')[0]}` : p.date) : '-'}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#10b981', fontWeight: 800 }}>
                          {formatCurrency(p.amount)}
                        </td>
                        <td style={{ padding: '8px 12px' }}>{p.paymentMethod || 'Pix'}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{p.paidByName || 'Sócio'}</td>
                        <td style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{p.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Extrato Detalhado de Comissões */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShoppingBag style={{ width: '16px', height: '16px', color: '#00d2ff' }} />
              Extrato de Vendas & Ciclos de Renovação ({commData.commissionLedger.length})
            </h4>
            
            {commData.commissionLedger.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                Nenhuma comissão registrada para este vendedor até o momento.
              </div>
            ) : (
              <div className="table-responsive" style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px 14px' }}>Tipo</th>
                      <th style={{ padding: '10px 14px' }}>Cliente / Estabelecimento</th>
                      <th style={{ padding: '10px 14px' }}>Data</th>
                      <th style={{ padding: '10px 14px' }}>Valor Pago</th>
                      <th style={{ padding: '10px 14px' }}>Taxa</th>
                      <th style={{ padding: '10px 14px' }}>Comissão (10%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commData.commissionLedger.map((item, idx) => (
                      <tr key={item.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '10px',
                            background: item.type === 'recurring_renewal' ? 'rgba(0, 210, 255, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                            color: item.type === 'recurring_renewal' ? '#00d2ff' : 'var(--accent-gold)'
                          }}>
                            {item.typeLabel}
                          </span>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <strong style={{ color: '#ffffff', display: 'block' }}>{item.company}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.companyAddress}</span>
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>
                          {item.date ? (item.date.includes('-') ? `${item.date.split('-')[2]}/${item.date.split('-')[1]}/${item.date.split('-')[0]}` : item.date) : '-'}
                        </td>
                        <td style={{ padding: '10px 14px', fontWeight: 700 }}>
                          {formatCurrency(item.saleValue)}
                        </td>
                        <td style={{ padding: '10px 14px', color: '#00d2ff', fontWeight: 600 }}>
                          10%
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--accent-gold)', fontWeight: 800 }}>
                          + {formatCurrency(item.commissionAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Clientes Quentes */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame style={{ width: '16px', height: '16px' }} />
              Clientes Quentes / Em Prospecção ({sellerHotLeads.length})
            </h4>
            {sellerHotLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                Nenhum cliente em potencial cadastrado no momento.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                {sellerHotLeads.map(h => (
                  <div key={h.id} style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <strong style={{ color: '#ffffff', display: 'block', fontSize: '0.9rem' }}>{h.company || h.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.phone} • {h.planName}</span>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <strong>Motivo:</strong> {h.reasonNotClosed}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

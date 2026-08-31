'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Filter,
  Trash2,
  Calendar,
  Zap,
  Percent,
  Search,
  UserCheck,
  Building,
  RotateCcw
} from 'lucide-react';

export default function FinanceView() {
  const {
    transactions,
    users,
    openModal,
    deleteTransaction,
    formatCurrency
  } = useCRM();

  const [typeFilter, setTypeFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const partners = users.filter(u => u.role !== 'vendedor');
  const sellers = users.filter(u => u.role === 'vendedor');

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalCommissionsPaid = transactions
    .filter(t => t.type === 'expense' && t.category === 'Comissões de Vendedores' && t.status === 'paid')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Filtragem dinâmica
  const filtered = transactions.filter(t => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (partnerFilter !== 'all' && t.partnerId !== partnerFilter) return false;
    if (paymentMethodFilter !== 'all' && (t.paymentMethod || 'Pix') !== paymentMethodFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;

    // Filtro por Vendedor (Comissões ou Lançamentos vinculados)
    if (sellerFilter !== 'all') {
      const matchSellerId = t.sellerId === sellerFilter;
      const matchSellerName = t.sellerName && sellers.find(s => s.id === sellerFilter)?.name.toLowerCase().includes(t.sellerName.toLowerCase());
      const matchInDesc = sellers.find(s => s.id === sellerFilter) && t.description?.toLowerCase().includes(sellers.find(s => s.id === sellerFilter).name.toLowerCase());
      const matchInNotes = sellers.find(s => s.id === sellerFilter) && t.notes?.toLowerCase().includes(sellers.find(s => s.id === sellerFilter).name.toLowerCase());
      if (!matchSellerId && !matchSellerName && !matchInDesc && !matchInNotes) return false;
    }

    // Busca textual por nome do vendedor, cliente, descrição ou notas
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchDesc = t.description?.toLowerCase().includes(term);
      const matchNotes = t.notes?.toLowerCase().includes(term);
      const matchCategory = t.category?.toLowerCase().includes(term);
      const matchSeller = t.sellerName?.toLowerCase().includes(term) || (t.sellerId && users.find(u => u.id === t.sellerId)?.name.toLowerCase().includes(term));
      const matchPartner = t.partnerId && users.find(u => u.id === t.partnerId)?.name.toLowerCase().includes(term);
      if (!matchDesc && !matchNotes && !matchCategory && !matchSeller && !matchPartner) return false;
    }

    return true;
  });

  const resetFilters = () => {
    setTypeFilter('all');
    setPartnerFilter('all');
    setSellerFilter('all');
    setCategoryFilter('all');
    setPaymentMethodFilter('all');
    setSearchTerm('');
  };

  return (
    <section className="view-panel active" id="view-finance">
      
      {/* Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">Financeiro & Fluxo de Caixa</h1>
          <p className="view-subtitle">Controle em tempo real de entradas de clientes anunciantes, custos operacionais e pagamento de comissões de vendedores.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-gold"
            onClick={() => openModal('transaction', { type: 'expense', category: 'Comissões de Vendedores' })}
            style={{ fontWeight: 800 }}
          >
            <Zap style={{ width: '16px', height: '16px', marginRight: '4px' }} />
            <span>Pagar Comissão de Vendedor</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => openModal('transaction', { type: 'expense', category: 'Custo Fixo por TV' })}
            style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          >
            - Lançar Gasto / Despesa
          </button>
          <button
            className="btn btn-primary"
            onClick={() => openModal('transaction', { type: 'income', category: 'Planos Recorrentes' })}
          >
            + Lançar Receita
          </button>
        </div>
      </div>

      {/* KPI Cards Financeiros */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="kpi-card" style={{ '--accent-color': '#10b981' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <ArrowUpRight style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Faturamento Total (Entradas)</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: '#10b981' }}>{formatCurrency(totalIncome)}</span>
            </div>
            <span className="kpi-subtext">Recebimentos liquidados de contratos</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': '#ef4444' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
            <ArrowDownLeft style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Despesas Totais (Saídas)</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: '#ef4444' }}>{formatCurrency(totalExpense)}</span>
            </div>
            <span className="kpi-subtext">Custos fixos + Comissões pagas ({formatCurrency(totalCommissionsPaid)})</span>
          </div>
        </div>

        <div className="kpi-card" style={{ '--accent-color': '#00d2ff' }}>
          <div className="kpi-icon-box" style={{ background: 'rgba(0, 210, 255, 0.12)', color: '#00d2ff' }}>
            <Wallet style={{ width: '22px', height: '22px' }} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Saldo Líquido em Caixa</span>
            <div className="kpi-value-row">
              <span className="kpi-value" style={{ color: balance >= 0 ? '#10b981' : '#ef4444' }}>
                {formatCurrency(balance)}
              </span>
            </div>
            <span className="kpi-subtext">Disponível para os sócios</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Completa com Busca por Vendedor */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Busca Textual */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control sm"
              placeholder="Buscar por vendedor, cliente, descrição..."
              style={{ paddingLeft: '36px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {(typeFilter !== 'all' || partnerFilter !== 'all' || sellerFilter !== 'all' || categoryFilter !== 'all' || paymentMethodFilter !== 'all' || searchTerm) && (
              <button
                type="button"
                className="btn btn-secondary sm"
                onClick={resetFilters}
                style={{ fontSize: '0.76rem', padding: '6px 10px', color: '#f87171' }}
                title="Limpar todos os filtros"
              >
                <RotateCcw style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                Limpar Filtros
              </button>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Exibindo <strong>{filtered.length}</strong> de {transactions.length} registros
            </span>
          </div>
        </div>

        {/* Dropdowns de Filtros */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          
          {/* Filtro Tipo */}
          <select
            className="form-select sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Todas as Movimentações</option>
            <option value="income">💰 Apenas Entradas (Receitas)</option>
            <option value="expense">💸 Apenas Saídas (Despesas / Comissões)</option>
          </select>

          {/* Filtro por Vendedor */}
          <select
            className="form-select sm"
            value={sellerFilter}
            onChange={(e) => setSellerFilter(e.target.value)}
            style={{
              background: sellerFilter !== 'all' ? 'rgba(251, 191, 36, 0.1)' : undefined,
              borderColor: sellerFilter !== 'all' ? 'rgba(251, 191, 36, 0.4)' : undefined,
              color: sellerFilter !== 'all' ? 'var(--accent-gold)' : undefined,
              fontWeight: sellerFilter !== 'all' ? 700 : 500
            }}
          >
            <option value="all">💼 Todos os Vendedores (Comissões)</option>
            {sellers.map(s => (
              <option key={s.id} value={s.id}>💼 {s.name} (Vendedor)</option>
            ))}
          </select>

          {/* Filtro por Sócio Pagador/Autor */}
          <select
            className="form-select sm"
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
          >
            <option value="all">👤 Todos os Sócios / Autores</option>
            {partners.map(u => (
              <option key={u.id} value={u.id}>👤 {u.name}</option>
            ))}
          </select>

          {/* Filtro Categoria */}
          <select
            className="form-select sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">📁 Categorias (Todas)</option>
            <option value="Comissões de Vendedores">⭐ Comissões de Vendedores</option>
            <option value="Planos Recorrentes">📺 Planos Recorrentes</option>
            <option value="Planos Avulsos">⚡ Planos Avulsos</option>
            <option value="Custo Fixo por TV">🔌 Custo Fixo por TV</option>
            <option value="Marketing / Tráfego Pago">📣 Marketing / Tráfego Pago</option>
          </select>

          {/* Filtro Forma de Pagamento */}
          <select
            className="form-select sm"
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
          >
            <option value="all">💳 Formas de Pagto (Todas)</option>
            <option value="Pix">⚡ Pix</option>
            <option value="Boleto Bancário">📄 Boleto Bancário</option>
            <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
            <option value="Cartão de Débito">💳 Cartão de Débito</option>
            <option value="Transferência Bancária">🏦 Transferência</option>
            <option value="Dinheiro em Espécie">💵 Dinheiro</option>
          </select>

        </div>
      </div>

      {/* Tabela de Extrato com Informações do Vendedor */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>Data</th>
                <th style={{ padding: '12px 14px' }}>Descrição da Movimentação</th>
                <th style={{ padding: '12px 14px' }}>Categoria</th>
                <th style={{ padding: '12px 14px' }}>Forma de Pagto</th>
                <th style={{ padding: '12px 14px' }}>Beneficiário / Sócio</th>
                <th style={{ padding: '12px 14px' }}>Valor</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                      <Wallet style={{ width: '38px', height: '38px', margin: '0 auto 10px', color: 'var(--text-muted)', opacity: 0.4 }} />
                      <p style={{ margin: 0, fontWeight: 600, color: '#ffffff' }}>Nenhuma movimentação financeira encontrada.</p>
                      <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Tente alterar os filtros selecionados ou o termo de busca.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(tx => {
                  const partner = users.find(u => u.id === tx.partnerId);
                  const isIncome = tx.type === 'income';
                  const isCommission = tx.category === 'Comissões de Vendedores';
                  const pMethod = tx.paymentMethod || 'Pix';
                  
                  // Identifica vendedor vinculado
                  const seller = tx.sellerId ? users.find(u => u.id === tx.sellerId) : (tx.sellerName ? { name: tx.sellerName } : null);

                  return (
                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }} className="table-row-hover">
                      <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                        {tx.date ? (tx.date.includes('-') ? `${tx.date.split('-')[2]}/${tx.date.split('-')[1]}/${tx.date.split('-')[0]}` : tx.date) : '-'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <strong style={{ color: '#ffffff', display: 'block' }}>{tx.description}</strong>
                        {tx.notes && <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{tx.notes}</span>}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          background: isCommission ? 'rgba(251, 191, 36, 0.15)' : 'var(--bg-surface)',
                          color: isCommission ? 'var(--accent-gold)' : 'var(--text-secondary)',
                          border: `1px solid ${isCommission ? 'rgba(251, 191, 36, 0.3)' : 'var(--border-subtle)'}`,
                          fontWeight: isCommission ? 800 : 500
                        }}>
                          {isCommission ? '⭐ Comissões de Vendedores' : tx.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '10px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          background: pMethod === 'Cartão de Crédito'
                            ? 'rgba(139, 92, 246, 0.15)'
                            : (pMethod === 'Boleto Bancário'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)'),
                          color: pMethod === 'Cartão de Crédito'
                            ? '#a78bfa'
                            : (pMethod === 'Boleto Bancário'
                              ? '#fbbf24'
                              : '#10b981'),
                          border: `1px solid ${pMethod === 'Cartão de Crédito' ? 'rgba(139, 92, 246, 0.3)' : (pMethod === 'Boleto Bancário' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)')}`
                        }}>
                          {pMethod === 'Cartão de Crédito' && '💳'}
                          {pMethod === 'Boleto Bancário' && '📄'}
                          {pMethod === 'Pix' && '⚡'}
                          {' '}{pMethod}
                        </span>
                      </td>

                      {/* Beneficiário / Sócio com destaque para Vendedores */}
                      <td style={{ padding: '12px 14px' }}>
                        {isCommission ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                              color: 'var(--accent-gold)',
                              fontWeight: 800,
                              fontSize: '0.84rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              💼 {seller?.name || tx.sellerName || 'Vendedor Comercial'}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Pago por: {partner?.name || 'Sócio'}
                            </span>
                          </div>
                        ) : (
                          <div style={{ color: 'var(--text-secondary)' }}>
                            <span>{partner?.name || 'Sistema'}</span>
                            {seller && (
                              <span style={{ display: 'block', fontSize: '0.72rem', color: '#00d2ff' }}>
                                💼 Vendedor: {seller.name}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td style={{
                        padding: '12px 14px',
                        fontWeight: 800,
                        color: isIncome ? '#10b981' : '#f87171',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.95rem'
                      }}>
                        {isIncome ? `+ ${formatCurrency(tx.amount)}` : `- ${formatCurrency(tx.amount)}`}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge-payment ${tx.status}`}>
                          {tx.status === 'paid' ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <button
                          className="btn-icon"
                          onClick={() => deleteTransaction(tx.id)}
                          title="Excluir Lançamento"
                          style={{ color: '#f87171' }}
                        >
                          <Trash2 style={{ width: '15px', height: '15px' }} />
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

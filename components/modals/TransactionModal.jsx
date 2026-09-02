'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  DollarSign,
  Check,
  Calendar,
  Wallet,
  Percent,
  UserCheck,
  Zap,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function TransactionModal() {
  const {
    activeModal,
    closeModal,
    addTransaction,
    paySellerCommission,
    getSellerCommissions,
    users,
    currentUser,
    formatCurrency
  } = useCRM();

  const modalData = activeModal?.data || {};
  const initialType = typeof modalData === 'string' ? modalData : (modalData.type || 'income');
  const initialCategory = modalData.category || (initialType === 'income' ? 'Planos Recorrentes' : 'Comissões de Vendedores');
  const initialSellerId = modalData.sellerId || '';

  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState(modalData.amount ? String(modalData.amount) : '');
  const [description, setDescription] = useState(modalData.description || '');
  const [category, setCategory] = useState(initialCategory);
  const [selectedSellerId, setSelectedSellerId] = useState(initialSellerId);
  const [paymentMethod, setPaymentMethod] = useState(modalData.paymentMethod || 'Pix');
  const [date, setDate] = useState(modalData.date || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(modalData.dueDate || new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('paid');
  const [partnerId, setPartnerId] = useState(currentUser?.id || 'usr-1');
  const [notes, setNotes] = useState(modalData.notes || '');
  const [notifySellerWhatsApp, setNotifySellerWhatsApp] = useState(true);

  const sellersList = users.filter(u => u.role === 'vendedor');

  const incomeCategories = [
    'Planos Recorrentes',
    'Planos Avulsos',
    'Produção de Vídeo',
    'Taxa de Instalação',
    'Outras Receitas'
  ];
  
  const expenseCategories = [
    'Comissões de Vendedores',
    'Custo Fixo por TV',
    'Servidor / Software TV',
    'Marketing / Tráfego Pago',
    'Equipamentos & Cabos',
    'Despesas Administrativas',
    'Outros Gastos'
  ];

  // Se houver apenas 1 vendedor e categoria for comissão, seleciona ele automaticamente
  useEffect(() => {
    if (type === 'expense' && category === 'Comissões de Vendedores' && !selectedSellerId && sellersList.length > 0) {
      setSelectedSellerId(sellersList[0].id);
    }
  }, [type, category, selectedSellerId, sellersList]);

  // Se trocar de tipo, ajusta categoria
  useEffect(() => {
    if (type === 'income') {
      if (!incomeCategories.includes(category)) setCategory('Planos Recorrentes');
    } else {
      if (!expenseCategories.includes(category)) setCategory('Comissões de Vendedores');
    }
  }, [type]);

  // Dados do vendedor selecionado
  const selectedSeller = users.find(u => u.id === selectedSellerId);
  const sellerCommData = selectedSellerId ? getSellerCommissions(selectedSellerId) : null;

  // Auto preencher valor, descrição e data oficial do dia 10
  const handleAutoFillSeller = () => {
    if (sellerCommData && selectedSeller) {
      setAmount(String(sellerCommData.pendingCommission));
      setDescription(`Pagamento de Comissões (Repasse Dia 10) — ${selectedSeller.name}`);
      const payoutDateStr = sellerCommData.nextPayoutInfo?.isoDate || new Date().toISOString().split('T')[0];
      setDate(payoutDateStr);
      setDueDate(payoutDateStr);
      setNotes(`Quitação de comissões acumuladas (${formatCurrency(sellerCommData.pendingCommission)}) referente ao ciclo do dia 10.`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = Number(amount);
    if (!description.trim() || !finalAmount || finalAmount <= 0) {
      alert('Por favor, informe uma descrição e um valor válido.');
      return;
    }

    if (type === 'expense' && category === 'Comissões de Vendedores' && selectedSellerId) {
      // Pagar comissão do vendedor e zerar saldo
      paySellerCommission({
        sellerId: selectedSellerId,
        amount: finalAmount,
        paymentMethod,
        date,
        notes: notes.trim(),
        description: description.trim()
      });

      if (notifySellerWhatsApp && selectedSeller) {
        openModal('whatsapp-billing', {
          ...selectedSeller,
          isSellerTarget: true,
          payoutAmount: finalAmount,
          defaultTemplate: 'commission_paid'
        });
      } else {
        closeModal();
      }
    } else {
      // Lançamento normal de receita ou despesa
      addTransaction({
        type,
        description: description.trim(),
        amount: finalAmount,
        category,
        paymentMethod,
        date,
        dueDate,
        status,
        partnerId,
        notes: notes.trim()
      });
      closeModal();
    }
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '620px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet style={{ width: '22px', height: '22px', color: type === 'income' ? 'var(--success)' : 'var(--danger)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                {type === 'income' ? 'Lançar Receita / Entrada' : 'Cadastrar Gasto & Pagamento de Comissão'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {type === 'income' ? 'Entrada no fluxo de caixa da empresa' : 'Saídas, despesas operacionais ou repasse de comissões'}
              </span>
            </div>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Tipo de Movimentação */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="txType">Tipo de Movimentação *</label>
                <select
                  id="txType"
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="income">💰 Entrada (Receita / Faturamento)</option>
                  <option value="expense">💸 Saída (Gasto / Despesa / Comissão)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="txCategory">Categoria *</label>
                <select
                  id="txCategory"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEÇÃO ESPECÍFICA DE PAGAMENTO DE COMISSÃO DE VENDEDOR */}
            {type === 'expense' && category === 'Comissões de Vendedores' && (
              <div style={{
                background: 'var(--bg-surface)',
                border: '1.5px solid rgba(217, 119, 6, 0.35)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <label className="form-label" style={{ margin: 0, color: 'var(--accent-gold)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck style={{ width: '16px', height: '16px' }} />
                    Selecione o Vendedor para Pagar *
                  </label>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Ao registrar como pago, o saldo de comissão do vendedor será zerado
                  </span>
                </div>

                <select
                  className="form-select"
                  value={selectedSellerId}
                  onChange={(e) => setSelectedSellerId(e.target.value)}
                  style={{ borderColor: 'rgba(251, 191, 36, 0.4)', fontWeight: 700 }}
                  required
                >
                  <option value="">Selecione um vendedor...</option>
                  {sellersList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.phone || s.email})
                    </option>
                  ))}
                </select>

                {/* Resumo do Saldo do Vendedor Selecionado */}
                {sellerCommData && selectedSeller && (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                          Saldo Atual a Pagar de {selectedSeller.name}:
                        </span>
                        <strong style={{
                          fontSize: '1.4rem',
                          color: sellerCommData.pendingCommission > 0 ? 'var(--accent-gold)' : 'var(--success)',
                          fontWeight: 900
                        }}>
                          {formatCurrency(sellerCommData.pendingCommission)}
                        </strong>
                      </div>

                      {sellerCommData.pendingCommission > 0 ? (
                        <button
                          type="button"
                          className="btn btn-gold sm"
                          onClick={handleAutoFillSeller}
                          style={{ fontWeight: 800 }}
                        >
                          <Zap style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                          Preencher Saldo Total ({formatCurrency(sellerCommData.pendingCommission)})
                        </button>
                      ) : (
                        <span style={{
                          fontSize: '0.76rem',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: 'var(--success)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          fontWeight: 700
                        }}>
                          ✅ Saldo Já Zerado
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4, borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                      • <strong>Total Ganho na Rede:</strong> {formatCurrency(sellerCommData.totalEarnedCommission)} ({sellerCommData.approvedCount} vendas ativas, {sellerCommData.totalRenewalsCount} renovações)<br />
                      • <strong>Já Repassado Anteriormente:</strong> {formatCurrency(sellerCommData.totalPaidOut)}<br />
                      • <em>Novas comissões de 10% entrarão no saldo automaticamente sempre que um cliente dele fechar ou renovar a mensalidade!</em>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Valor e Descrição */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="txAmount">Valor do Pagamento (R$) *</label>
                <input
                  type="number"
                  id="txAmount"
                  className="form-control"
                  placeholder="Ex: 59.90"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="txPaymentMethod">Forma de Pagamento *</label>
                <select
                  id="txPaymentMethod"
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="Pix">Pix (Instantâneo)</option>
                  <option value="Transferência Bancária">Transferência Bancária (TED/DOC)</option>
                  <option value="Boleto Bancário">Boleto Bancário</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro em Espécie">Dinheiro em Espécie</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="txDescription">Descrição da Movimentação *</label>
              <input
                type="text"
                id="txDescription"
                className="form-control"
                placeholder={type === 'income' ? 'Ex: Mensalidade Academia FitLife (Plano Conecta)' : 'Ex: Pagamento de Comissões — Luciano Silva'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Datas e Status */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="txDate">Data do Pagamento / Lançamento *</label>
                <input
                  type="date"
                  id="txDate"
                  className="form-control"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setDueDate(e.target.value); }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="txPartnerId">Sócio Responsável *</label>
                <select
                  id="txPartnerId"
                  className="form-select"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  required
                >
                  {users.filter(u => u.role !== 'vendedor').map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.roleName || u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="txNotes">Observações / Comprovante</label>
              <textarea
                id="txNotes"
                className="form-control"
                rows={2}
                placeholder="Ex: Chave Pix enviada no WhatsApp. Quitação referente às ativações de agosto."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {type === 'expense' && category === 'Comissões de Vendedores' && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.84rem', color: 'var(--text-primary)', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={notifySellerWhatsApp}
                    onChange={(e) => setNotifySellerWhatsApp(e.target.checked)}
                    style={{ accentColor: 'var(--success)', width: '17px', height: '17px' }}
                  />
                  <span>
                    💬 <strong>Notificar Vendedor no WhatsApp:</strong> Abrir prévia de mensagem informando que a comissão do dia 10 foi paga!
                  </span>
                </label>
              </div>
            )}

          </div>

          <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn ${type === 'income' ? 'btn-primary' : 'btn-gold'}`}
              style={{ fontWeight: 800 }}
            >
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>
                {type === 'expense' && category === 'Comissões de Vendedores'
                  ? 'Confirmar Pagamento & Zerar Saldo do Vendedor'
                  : (type === 'income' ? 'Salvar Receita' : 'Registrar Gasto')}
              </span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

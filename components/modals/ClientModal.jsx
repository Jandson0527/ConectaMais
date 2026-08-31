'use client';

import React, { useState, useEffect } from 'react';
import { useCRM, computeDueDate } from '../../context/CRMContext';
import {
  X,
  UserPlus,
  Tv,
  MapPin,
  DollarSign,
  Building,
  Phone,
  User,
  Check,
  CheckSquare,
  Sparkles,
  Percent,
  Calendar,
  Layers,
  Image,
  Video,
  FileText,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function ClientModal() {
  const {
    activeModal,
    closeModal,
    addLead,
    updateLead,
    plans,
    screens,
    users,
    currentUser,
    isSeller,
    formatCurrency
  } = useCRM();

  const isEditing = activeModal?.type === 'edit-client' || activeModal?.type === 'edit-lead';
  const existingLead = isEditing ? activeModal.data : null;

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Proprietário / Decisor');
  const [planId, setPlanId] = useState('plan-conecta');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [mediaFormat, setMediaFormat] = useState('foto');
  const [tvsCount, setTvsCount] = useState(5);
  const [selectedScreenIds, setSelectedScreenIds] = useState([]);
  const [value, setValue] = useState(299.90);
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [cardInstallments, setCardInstallments] = useState(1);
  const [boletoBarcode, setBoletoBarcode] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('alta');
  const [stage, setStage] = useState('qualificacao');
  const [origin, setOrigin] = useState('WhatsApp Direto');
  const [assignedTo, setAssignedTo] = useState(currentUser?.id || 'usr-1');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  // Sync state with existing lead if editing
  useEffect(() => {
    if (existingLead) {
      setName(existingLead.name || '');
      setPhone(existingLead.phone || '');
      setCompany(existingLead.company || '');
      setCompanyAddress(existingLead.companyAddress || '');
      setEmail(existingLead.email || '');
      setRole(existingLead.role || 'Proprietário / Decisor');
      setPlanId(existingLead.planId || 'plan-conecta');
      setBillingCycle(existingLead.billingCycle || 'monthly');
      setPaymentMethod(existingLead.paymentMethod || 'Pix');
      setCardInstallments(existingLead.cardInstallments || 1);
      setBoletoBarcode(existingLead.boletoBarcode || '');
      setMediaFormat(existingLead.mediaFormat || 'foto');
      setTvsCount(existingLead.tvsCount || 5);
      setSelectedScreenIds(existingLead.selectedScreenIds || []);
      setValue(existingLead.value || 299.90);
      const pDate = existingLead.paymentDate || existingLead.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
      setPaymentDate(pDate);
      setDueDate(existingLead.dueDate || computeDueDate(pDate, existingLead.billingCycle || 'monthly', existingLead.planId || 'plan-conecta'));
      setPriority(existingLead.priority || 'alta');
      setStage(existingLead.stage || 'qualificacao');
      setOrigin(existingLead.origin || 'WhatsApp Direto');
      setAssignedTo(existingLead.assignedTo || currentUser?.id);
      setTags(Array.isArray(existingLead.tags) ? existingLead.tags.join(', ') : (existingLead.tags || ''));
      setNotes(existingLead.notes || '');
    } else {
      // Defaults for new client
      const todayStr = new Date().toISOString().split('T')[0];
      setName('');
      setPhone('');
      setCompany('');
      setCompanyAddress('');
      setEmail('');
      setRole('Proprietário / Decisor');
      setPlanId('plan-conecta');
      setBillingCycle('monthly');
      setPaymentMethod('Pix');
      setCardInstallments(1);
      setBoletoBarcode('');
      setMediaFormat('foto');
      setTvsCount(5);
      // Select all screens by default for 5 TVs
      setSelectedScreenIds(screens.map(s => s.id));
      setValue(299.90);
      setPaymentDate(todayStr);
      setDueDate(computeDueDate(todayStr, 'monthly', 'plan-conecta'));
      setPriority('alta');
      setStage(isSeller() ? 'reuniao' : 'qualificacao');
      setOrigin(isSeller() ? 'Prospecção Vendedor' : 'WhatsApp Direto');
      setAssignedTo(currentUser?.id || 'usr-1');
      setTags('5 TVs, Anunciante');
      setNotes('');
    }
  }, [existingLead, isEditing, screens, currentUser, isSeller]);

  // Handle plan change and recalculate values & recommended screen limits & due date
  const handlePlanChange = (newPlanId) => {
    setPlanId(newPlanId);
    const plan = plans.find(p => p.id === newPlanId);
    if (!plan) return;

    const maxTvs = plan.tvs || 1;
    setTvsCount(maxTvs);

    // Compute price based on cycle
    if (billingCycle === 'quarterly') {
      setValue(plan.quarterlyPrice || (plan.monthlyPrice * 3));
    } else if (billingCycle === 'campaign') {
      setValue(plan.fixedPrice || plan.monthlyPrice || 99.90);
    } else {
      setValue(plan.monthlyPrice || plan.fixedPrice || 99.90);
    }

    // Auto update due date
    setDueDate(computeDueDate(paymentDate, billingCycle, newPlanId));

    // Auto adjust screen selection count to match plan TVs
    if (selectedScreenIds.length > maxTvs) {
      setSelectedScreenIds(selectedScreenIds.slice(0, maxTvs));
    } else if (selectedScreenIds.length < maxTvs && screens.length >= maxTvs) {
      setSelectedScreenIds(screens.slice(0, maxTvs).map(s => s.id));
    }
  };

  // Handle cycle change
  const handleCycleChange = (newCycle) => {
    setBillingCycle(newCycle);
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    if (newCycle === 'quarterly') {
      setValue(plan.quarterlyPrice || (plan.monthlyPrice * 3));
    } else if (newCycle === 'campaign') {
      setValue(plan.fixedPrice || plan.monthlyPrice || 99.90);
    } else {
      setValue(plan.monthlyPrice || plan.fixedPrice || 99.90);
    }

    // Auto update due date
    setDueDate(computeDueDate(paymentDate, newCycle, planId));
  };

  // Handle payment date change
  const handlePaymentDateChange = (newPDate) => {
    setPaymentDate(newPDate);
    setDueDate(computeDueDate(newPDate, billingCycle, planId));
  };

  // Toggle Screen selection
  const toggleScreen = (screenId) => {
    setSelectedScreenIds(prev => {
      if (prev.includes(screenId)) {
        return prev.filter(id => id !== screenId);
      } else {
        if (prev.length >= tvsCount) {
          return [...prev.slice(1), screenId];
        }
        return [...prev, screenId];
      }
    });
  };

  const selectAllScreens = () => {
    setSelectedScreenIds(screens.map(s => s.id));
    setTvsCount(screens.length);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Por favor, informe o nome do contato decisor.');
      return;
    }
    if (!phone.trim()) {
      alert('Por favor, informe o telefone/WhatsApp de contato.');
      return;
    }
    if (!company.trim()) {
      alert('Por favor, informe o nome do estabelecimento.');
      return;
    }
    if (!companyAddress.trim()) {
      alert('Por favor, informe o endereço completo do estabelecimento.');
      return;
    }
    if (selectedScreenIds.length === 0) {
      alert('Por favor, selecione ao menos 1 ponto de tela para veiculação.');
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      company: company.trim(),
      companyAddress: companyAddress.trim(),
      email: email.trim(),
      role: role.trim(),
      planId,
      billingCycle,
      paymentMethod,
      cardInstallments: paymentMethod === 'Cartão de Crédito' ? Number(cardInstallments) : 1,
      boletoBarcode: paymentMethod === 'Boleto Bancário' ? boletoBarcode.trim() : '',
      mediaFormat,
      tvsCount: Number(tvsCount),
      selectedScreenIds,
      value: Number(value),
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || computeDueDate(paymentDate, billingCycle, planId),
      priority,
      stage,
      origin,
      assignedTo,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      notes: notes.trim()
    };

    if (isEditing && existingLead) {
      updateLead(existingLead.id, payload);
    } else {
      addLead(payload);
    }
  };

  const selectedPlan = plans.find(p => p.id === planId) || plans[0];
  const sellerCommission = Number((value * 0.10).toFixed(2));

  // Formatted date preview
  const formattedDueDatePreview = dueDate ? `${dueDate.split('-')[2]}/${dueDate.split('-')[1]}/${dueDate.split('-')[0]}` : '';

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '820px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(0, 210, 255, 0.2)' }}>
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2), rgba(0, 119, 182, 0.3))',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00d2ff'
            }}>
              <UserPlus style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                {isEditing ? 'Editar Dados do Cliente' : 'Cadastrar Novo Cliente & Anunciante'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Rede Conecta Mais de Marketing Indoor
                </span>
                {isSeller() ? (
                  <span className="badge-approval pending" style={{ fontSize: '0.7rem' }}>
                    <Percent style={{ width: '12px', height: '12px' }} /> Vendedor: Comissão 10%
                  </span>
                ) : (
                  <span className="badge-approval approved" style={{ fontSize: '0.7rem' }}>
                    <Sparkles style={{ width: '12px', height: '12px' }} /> Painel dos Sócios Diretores
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal} title="Fechar (Esc)">
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Banner Informativo */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6))',
              border: '1px solid rgba(0, 210, 255, 0.25)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <strong style={{ color: '#00d2ff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Tv style={{ width: '16px', height: '16px' }} />
                  {isSeller() ? 'Registro de Venda do Vendedor Comercial' : 'Cadastro Geral de Anunciante (Sócios)'}
                </strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {isSeller()
                    ? `Vendedor: ${currentUser?.name}. Sua comissão de 10% (${formatCurrency(sellerCommission)}) será submetida para aprovação dos sócios.`
                    : 'Preencha os dados do cliente, escolha o plano, defina a data de pagamento e selecione os pontos de telas.'}
                </p>
              </div>
              <div style={{
                background: 'rgba(251, 191, 36, 0.12)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                padding: '6px 12px',
                borderRadius: '8px',
                textAlign: 'right'
              }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  {isSeller() ? 'Sua Comissão (10%)' : 'Faturamento Total'}
                </span>
                <strong style={{ fontSize: '1rem', color: '#ffffff', fontFamily: 'var(--font-sans)' }}>
                  {isSeller() ? formatCurrency(sellerCommission) : formatCurrency(value)}
                </strong>
              </div>
            </div>

            {/* SEÇÃO 1: INFORMAÇÕES DO CLIENTE & CONTATO */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#00d2ff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User style={{ width: '16px', height: '16px' }} />
                1. Dados de Identificação & Contato
              </h4>
              
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="clientName">
                    Nome do Contato / Decisor *
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    className="form-control"
                    placeholder="Ex: Jandson Silva / Dra. Patrícia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientPhone">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="clientPhone"
                    className="form-control"
                    placeholder="(11) 98765-4321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="clientCompany">
                    Nome do Estabelecimento / Empresa *
                  </label>
                  <input
                    type="text"
                    id="clientCompany"
                    className="form-control"
                    placeholder="Ex: Ótica Visão, Barbearia Men's Prime, Academia FitLife"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientCompanyAddress">
                    Endereço Completo do Estabelecimento *
                  </label>
                  <input
                    type="text"
                    id="clientCompanyAddress"
                    className="form-control"
                    placeholder="Ex: Av. Paulista, 1500 - Bela Vista, São Paulo - SP"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="clientEmail">
                    E-mail do Cliente (Opcional)
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    className="form-control"
                    placeholder="contato@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientRole">
                    Cargo / Função do Contato
                  </label>
                  <input
                    type="text"
                    id="clientRole"
                    className="form-control"
                    placeholder="Ex: Proprietário, Gerente Comercial, Diretor"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: PLANO ESCOLHIDO & DATAS DE PAGAMENTO / VENCIMENTO */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tv style={{ width: '16px', height: '16px' }} />
                2. Plano Escolhido, Datas de Pagamento & Vencimento
              </h4>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="clientPlan">
                    Plano de TVs *
                  </label>
                  <select
                    id="clientPlan"
                    className="form-select"
                    value={planId}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    required
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.badge} {p.name} ({p.tvs} {p.tvs === 1 ? 'TV' : 'TVs'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientBillingCycle">
                    Ciclo de Cobrança *
                  </label>
                  <select
                    id="clientBillingCycle"
                    className="form-select"
                    value={billingCycle}
                    onChange={(e) => handleCycleChange(e.target.value)}
                    required
                  >
                    <option value="monthly">Mensal Recorrente</option>
                    <option value="quarterly">3 Meses Antecipados (Desconto)</option>
                    <option value="campaign">Campanha Avulsa (15/30 dias)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientMediaFormat">
                    Formato de Anúncio *
                  </label>
                  <select
                    id="clientMediaFormat"
                    className="form-select"
                    value={mediaFormat}
                    onChange={(e) => setMediaFormat(e.target.value)}
                    required
                  >
                    <option value="foto">📸 Foto / Encarte Estático (Full HD)</option>
                    <option value="video">🎥 Vídeo Comercial / Motion Graphics</option>
                    <option value="ambos">🔄 Foto + Vídeo (Campanha Híbrida)</option>
                  </select>
                </div>
              </div>

              {/* CAMPOS DE DATA DE PAGAMENTO E DATA DE VENCIMENTO */}
              <div className="form-grid-3" style={{ marginTop: '0.75rem', background: 'rgba(30, 41, 59, 0.4)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="clientPaymentDate" style={{ color: '#00d2ff', fontWeight: 700 }}>
                    📅 Data do Pagamento / Início *
                  </label>
                  <input
                    type="date"
                    id="clientPaymentDate"
                    className="form-control"
                    value={paymentDate}
                    onChange={(e) => handlePaymentDateChange(e.target.value)}
                    required
                  />
                  <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Data em que o cliente pagou / ativou
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientDueDate" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                    ⏰ Data do Próximo Vencimento *
                  </label>
                  <input
                    type="date"
                    id="clientDueDate"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                  <small style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                    Vencimento calculado: {formattedDueDatePreview}
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientValue">
                    Valor Fechado (R$) *
                  </label>
                  <input
                    type="number"
                    id="clientValue"
                    className="form-control"
                    min="0"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                  <small style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    Total: {formatCurrency(value)}
                  </small>
                </div>

              </div>

              <div className="form-grid-2" style={{ marginTop: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="clientPaymentMethod" style={{ fontWeight: 700, color: '#ffffff' }}>
                    💳 Forma de Pagamento *
                  </label>
                  <select
                    id="clientPaymentMethod"
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="Pix">⚡ Pix (Instantâneo / Chave)</option>
                    <option value="Boleto Bancário">📄 Boleto Bancário (Com Vencimento)</option>
                    <option value="Cartão de Crédito">💳 Cartão de Crédito (Recorrente ou Parcelado)</option>
                    <option value="Cartão de Débito">💳 Cartão de Débito</option>
                    <option value="Transferência Bancária">🏦 Transferência Bancária (TED/DOC)</option>
                    <option value="Dinheiro em Espécie">💵 Dinheiro em Espécie</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientTvsCount">
                    Quantidade de TVs Contratadas:
                  </label>
                  <input
                    type="number"
                    id="clientTvsCount"
                    className="form-control"
                    min="1"
                    max="10"
                    value={tvsCount}
                    onChange={(e) => setTvsCount(Number(e.target.value))}
                    required
                  />
                  <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Recomendado para {selectedPlan.name}: {selectedPlan.tvs} TVs.
                  </small>
                </div>
              </div>

              {/* DETALHES CONDICIONAIS DE CARTÃO DE CRÉDITO OU BOLETO */}
              {paymentMethod === 'Cartão de Crédito' && (
                <div style={{
                  marginTop: '0.75rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <strong style={{ color: '#a78bfa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    💳 Configuração do Cartão de Crédito
                  </strong>
                  <div className="form-grid-2">
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" htmlFor="clientCardInstallments" style={{ fontSize: '0.78rem' }}>
                        Modalidade / Parcelas:
                      </label>
                      <select
                        id="clientCardInstallments"
                        className="form-select"
                        value={cardInstallments}
                        onChange={(e) => setCardInstallments(Number(e.target.value))}
                      >
                        <option value={1}>1x — Recorrência Automática no Cartão (Mensal)</option>
                        <option value={1}>1x — À Vista no Cartão</option>
                        <option value={2}>2x de {formatCurrency(value / 2)}</option>
                        <option value={3}>3x de {formatCurrency(value / 3)}</option>
                        <option value={6}>6x de {formatCurrency(value / 6)}</option>
                        <option value={12}>12x de {formatCurrency(value / 12)}</option>
                      </select>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                      ✨ Cobrança processada de forma segura com recibo automático para o anunciante.
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Boleto Bancário' && (
                <div style={{
                  marginTop: '0.75rem',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <strong style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📄 Informações do Boleto Bancário
                  </strong>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="clientBoletoBarcode" style={{ fontSize: '0.78rem' }}>
                      Linha Digitável / Código de Barras do Boleto (Opcional):
                    </label>
                    <input
                      type="text"
                      id="clientBoletoBarcode"
                      className="form-control"
                      placeholder="Ex: 34191.79001 01043.510047 91020.150008 5 89000000029990"
                      value={boletoBarcode}
                      onChange={(e) => setBoletoBarcode(e.target.value)}
                    />
                    <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Vencimento do boleto registrado para: <strong style={{ color: 'var(--accent-gold)' }}>{formattedDueDatePreview}</strong>
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* SEÇÃO 3: PONTOS DE TELAS FÍSICAS (LOCAIS CONTRATADOS) */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#00d2ff', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin style={{ width: '16px', height: '16px' }} />
                    3. Pontos de Telas / Locais Contratados *
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Selecione os estabelecimentos parceiros onde os anúncios serão veiculados
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="screens-quota-badge" style={{
                    background: selectedScreenIds.length === tvsCount ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 210, 255, 0.15)',
                    color: selectedScreenIds.length === tvsCount ? '#10b981' : '#00d2ff',
                    border: '1px solid currentColor',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    Selecionados: {selectedScreenIds.length} de {tvsCount} TVs
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary sm"
                    onClick={selectAllScreens}
                    style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                  >
                    <CheckSquare style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                    Selecionar Todas
                  </button>
                </div>
              </div>

              {/* Grid Interativa de Telas */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '10px',
                marginTop: '8px'
              }}>
                {screens.map(screen => {
                  const isChecked = selectedScreenIds.includes(screen.id);
                  return (
                    <div
                      key={screen.id}
                      onClick={() => toggleScreen(screen.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: isChecked ? 'rgba(0, 210, 255, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                        border: `1.5px solid ${isChecked ? '#00d2ff' : 'rgba(255, 255, 255, 0.1)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.88rem', color: isChecked ? '#00d2ff' : '#ffffff' }}>
                          {screen.name}
                        </strong>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: `1.5px solid ${isChecked ? '#00d2ff' : '#64748b'}`,
                          background: isChecked ? '#00d2ff' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#000'
                        }}>
                          {isChecked && <Check style={{ width: '13px', height: '13px', strokeWidth: 3 }} />}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {screen.segment} • {screen.neighborhood}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                          👥 {screen.audienceEst}
                        </span>
                        <span style={{ color: '#00d2ff', fontWeight: 700 }}>
                          📺 {screen.tvsCount} TV
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEÇÃO 4: GESTÃO, ETAPA DO FUNIL & OBSERVAÇÕES */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers style={{ width: '16px', height: '16px' }} />
                4. Informações Operacionais & Funil
              </h4>

              <div className="form-grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="clientStage">
                    Etapa Inicial no Funil CRM
                  </label>
                  <select
                    id="clientStage"
                    className="form-select"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    disabled={isSeller()}
                  >
                    <option value="novo">Novo Lead</option>
                    <option value="qualificacao">Qualificação</option>
                    <option value="reuniao">Reunião Agendada</option>
                    <option value="proposta">Proposta Apresentada</option>
                    <option value="negociacao">Em Negociação</option>
                    <option value="ganho">Ganho (Fechado) 🎉</option>
                    <option value="perdido">Perdido</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientOrigin">
                    Canal de Origem
                  </label>
                  <select
                    id="clientOrigin"
                    className="form-select"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  >
                    <option value="WhatsApp Direto">WhatsApp Direto</option>
                    <option value="Visita Presencial">Visita Presencial</option>
                    <option value="Prospecção Vendedor">Prospecção Vendedor</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Meta Ads (FB/IG)">Meta Ads (FB/IG)</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Indicação">Indicação</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="clientAssignedTo">
                    Responsável
                  </label>
                  <select
                    id="clientAssignedTo"
                    className="form-select"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    disabled={isSeller()}
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role === 'vendedor' ? 'Vendedor' : 'Sócio'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label className="form-label" htmlFor="clientTags">
                  Tags de Identificação (separadas por vírgula)
                </label>
                <input
                  type="text"
                  id="clientTags"
                  className="form-control"
                  placeholder="Ex: Farmácia, Recorrente, 5 TVs, Foto Encarte"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label className="form-label" htmlFor="clientNotes">
                  Observações / Detalhes da Negociação
                </label>
                <textarea
                  id="clientNotes"
                  className="form-control"
                  rows="2"
                  placeholder="Ex: O cliente solicitou alteração do encarte no dia 15 de cada mês. Contrato trimestral fechado com Pix..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem', background: 'var(--bg-modal)' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 800 }}>
              <Check style={{ width: '18px', height: '18px', marginRight: '6px' }} />
              <span>{isEditing ? 'Atualizar Cliente' : (isSeller() ? 'Enviar Venda para Aprovação' : 'Cadastrar Cliente')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

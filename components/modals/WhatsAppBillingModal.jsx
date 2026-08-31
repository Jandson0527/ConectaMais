'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  MessageCircle,
  Send,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Percent,
  Flame,
  ExternalLink
} from 'lucide-react';

export default function WhatsAppBillingModal() {
  const {
    activeModal,
    closeModal,
    plans,
    users,
    getLeadDueStatus,
    getNextCommissionPayoutDate,
    formatCurrency,
    addActivity,
    showToast
  } = useCRM();

  const data = activeModal?.data || {};
  const isSellerTarget = data.isSellerTarget || data.role === 'vendedor';

  const lead = !isSellerTarget ? data : null;
  const seller = isSellerTarget ? data : null;

  const plan = lead ? (plans.find(p => p.id === lead.planId) || plans[0]) : null;
  const dueInfo = lead ? getLeadDueStatus(lead) : null;
  const nextPayout = getNextCommissionPayoutDate();

  // Define default template type based on lead or seller status
  const getDefaultTemplateType = () => {
    if (isSellerTarget) {
      return data.defaultTemplate || 'commission_paid';
    }
    if (data.defaultTemplate) return data.defaultTemplate;
    if (dueInfo) {
      if (dueInfo.status === 'expired') return 'expired';
      if (dueInfo.status === 'due_today') return 'due_today';
      if (dueInfo.status === 'due_soon') return 'due_soon';
      if (dueInfo.status === 'ok') return 'due_soon';
    }
    return 'due_soon';
  };

  const [templateType, setTemplateType] = useState(getDefaultTemplateType);
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);

  // Phone calculation
  const rawPhone = isSellerTarget ? (seller?.phone || '') : (lead?.phone || '');
  const cleanPhone = rawPhone.replace(/\D/g, '');

  // Generate template message text
  const generateMessage = (type) => {
    if (isSellerTarget) {
      const sellerName = seller?.name || 'Vendedor Comercial';
      const payoutAmount = data.payoutAmount ? formatCurrency(data.payoutAmount) : (data.amount ? formatCurrency(data.amount) : 'sua comissão');
      const clientName = data.clientName || 'Cliente Anunciante';

      switch (type) {
        case 'commission_paid':
          return `Olá *${sellerName}*, tudo bem? 🎉\n\nInformamos que o seu repasse de comissões no valor de *${payoutAmount}* referente ao ciclo do *dia 10* foi efetuado via Pix com sucesso! 💸\n\n✅ O comprovante e a quitação já estão registrados no seu painel Conecta Mais.\n\nParabéns pelo excelente trabalho e boas vendas neste novo mês! 🚀`;

        case 'sale_approved':
          return `Olá *${sellerName}*! Ótima notícia! 🌟\n\nA sua venda para o cliente *${clientName}* foi *Aprovada pelos Sócios*! 🤝\n\n💰 A sua comissão de 10% já foi creditada no seu saldo para o próximo repasse no *dia 10* (${nextPayout.formattedDate}).\n\nContinue acelerando! 🚀`;

        case 'renewal_commission':
          return `Olá *${sellerName}*! 🔄 Mais renda recorrente na sua conta!\n\nO cliente *${clientName}* da sua carteira acabou de renovar a mensalidade! ✨\n\n💰 A sua comissão de 10% já entrou no seu saldo para pagamento no *dia 10*. Construindo renda passiva com a Conecta Mais! 👏`;

        default:
          return `Olá *${sellerName}*, segue comunicado da diretoria da Conecta Mais.`;
      }
    } else {
      const clientName = lead?.name || lead?.company || 'Cliente';
      const companyName = lead?.company || lead?.name || 'sua empresa';
      const planName = plan?.name || 'Plano Indoor';
      const valStr = formatCurrency(lead?.value || 99.90);
      const dueDateStr = dueInfo?.formattedDueDate || 'próximos dias';
      const pixKey = '11981112233 (CNPJ / Pix Conecta Mais)';

      switch (type) {
        case 'due_soon':
          return `Olá *${clientName}*, tudo bem? Aqui é da *Conecta Mais - Marketing Indoor*! 📺\n\nPassando para lembrar que a mensalidade do seu plano (*${planName}*) no valor de *${valStr}* vencerá em *${dueDateStr}*.\n\n🔑 *Chave Pix:* \`${pixKey}\`\n${lead?.boletoBarcode ? `📄 *Linha Digitável do Boleto:* \`${lead.boletoBarcode}\`\n` : ''}\nPara manter a veiculação dos anúncios da *${companyName}* ativa e contínua nas nossas telas, basta realizar o pagamento e nos enviar o comprovante por aqui. Qualquer dúvida estamos à disposição! 🤝`;

        case 'due_today':
          return `Olá *${clientName}*, tudo bem? Aqui é da equipe *Conecta Mais*! 🟡\n\nA mensalidade do seu plano de TV Indoor (*${planName}*) no valor de *${valStr}* vence *HOJE (${dueDateStr})*.\n\n🔑 *Chave Pix:* \`${pixKey}\`\n${lead?.boletoBarcode ? `📄 *Linha Digitável do Boleto:* \`${lead.boletoBarcode}\`\n` : ''}\nRealize o pagamento hoje para garantir a exibição ininterrupta dos seus anúncios nos nossos pontos parceiros. Muito obrigado pela parceria! 🚀`;

        case 'expired':
          return `Olá *${clientName}*, tudo bem? Entramos em contato da *Conecta Mais*! 🔴\n\nIdentificamos uma pendência referente à mensalidade do plano *${planName}* (*${valStr}*), com vencimento em *${dueDateStr}*.\n\n🔑 *Chave Pix:* \`${pixKey}\`\n${lead?.boletoBarcode ? `📄 *Linha Digitável:* \`${lead.boletoBarcode}\`\n` : ''}\nPara evitar a pausa temporária na veiculação dos anúncios da *${companyName}* nas telas, pedimos a gentileza de regularizar o pagamento e nos encaminhar o comprovante. Caso já tenha efetuado, por favor desconsidere! 🙏`;

        case 'renewal_confirmed':
          return `Olá *${clientName}*! 🎉 Pagamento confirmado com sucesso!\n\nRecebemos a quitação da sua mensalidade no valor de *${valStr}*. O contrato da *${companyName}* foi estendido com sucesso até *${dueDateStr}*! 📺✨\n\nSeus anúncios continuam sendo exibidos com máxima visibilidade na nossa rede de telas indoor. A Conecta Mais agradece a confiança e parceria! 🤝🚀`;

        case 'contract_expired':
          return `Olá *${clientName}*, esperamos que esteja bem! ⚠️\n\nInformamos que o ciclo contratual de veiculação da *${companyName}* nas TVs da Conecta Mais encerrou.\n\nGostaria de reativar sua veiculação e continuar alcançando milhares de clientes locais todos os dias? Responda a esta mensagem para renovarmos com condições especiais! 🎯`;

        case 'send_pix':
          return `Olá *${clientName}*, seguem os dados para pagamento via Pix da *Conecta Mais*:\n\n🔑 *Chave Pix (CNPJ/Telefone):* \`${pixKey}\`\n💰 *Valor:* *${valStr}*\n📅 *Vencimento:* *${dueDateStr}*\n\nApós o pagamento, por favor nos envie o comprovante para confirmação imediata! Obrigado! 🚀`;

        case 'send_boleto':
          return `Olá *${clientName}*, segue o código de barras para pagamento do boleto da *Conecta Mais*:\n\n📄 *Linha Digitável:* \`${lead?.boletoBarcode || '34191.79001 01043.510047 91020.150008 5 89000000029990'}\`\n💰 *Valor:* *${valStr}*\n📅 *Vencimento:* *${dueDateStr}*\n\nQualquer dúvida estamos à disposição!`;

        default:
          return `Olá *${clientName}*, aqui é da Conecta Mais!`;
      }
    }
  };

  useEffect(() => {
    setCustomText(generateMessage(templateType));
  }, [templateType, data]);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(customText);
      setCopied(true);
      showToast('Mensagem copiada para a área de transferência!', 'success');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSendWhatsApp = () => {
    if (!cleanPhone) {
      alert('Telefone do destinatário não cadastrado.');
      return;
    }

    const encodedText = encodeURIComponent(customText);
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodedText}`;

    // Registrar no histórico de atividades do CRM
    if (lead?.id) {
      addActivity(lead.id, {
        type: 'whatsapp',
        title: `Cobrança / Mensagem WhatsApp Enviada (${templateType})`,
        description: `Mensagem enviada para ${cleanPhone}: "${customText.substring(0, 120)}..."`
      });
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    showToast('WhatsApp aberto em nova janela!', 'success');
    closeModal();
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '780px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <MessageCircle style={{ width: '22px', height: '22px' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                {isSellerTarget ? 'Notificar Vendedor no WhatsApp' : 'Enviar Cobrança & Mensagem WhatsApp'}
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                {isSellerTarget ? `Vendedor: ${seller?.name} • ${rawPhone || 'Sem telefone'}` : `Cliente: ${lead?.company || lead?.name} • ${rawPhone || 'Sem telefone'}`}
              </span>
            </div>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal} title="Fechar">
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Seletor de Modelo de Mensagem */}
          <div>
            <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', color: '#00d2ff' }}>
              <Sparkles style={{ width: '15px', height: '15px' }} />
              Selecione o Modelo de Mensagem Personalizada:
            </label>

            {!isSellerTarget ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn sm ${templateType === 'due_soon' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('due_soon')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}
                >
                  ⏰ Lembrete (Vai Vencer)
                </button>

                <button
                  type="button"
                  className={`btn sm ${templateType === 'due_today' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('due_today')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, background: templateType === 'due_today' ? '#fbbf24' : undefined, color: templateType === 'due_today' ? '#000' : undefined }}
                >
                  🟡 Vencendo Hoje
                </button>

                <button
                  type="button"
                  className={`btn sm ${templateType === 'expired' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('expired')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, background: templateType === 'expired' ? '#ef4444' : undefined, color: templateType === 'expired' ? '#fff' : undefined }}
                >
                  🔴 Cobrança (Vencido)
                </button>

                <button
                  type="button"
                  className={`btn sm ${templateType === 'renewal_confirmed' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('renewal_confirmed')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, background: templateType === 'renewal_confirmed' ? '#10b981' : undefined, color: templateType === 'renewal_confirmed' ? '#fff' : undefined }}
                >
                  🎉 Pagamento Confirmado
                </button>

                <button
                  type="button"
                  className={`btn sm ${templateType === 'send_pix' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('send_pix')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}
                >
                  ⚡ Enviar Chave Pix
                </button>

                <button
                  type="button"
                  className={`btn sm ${templateType === 'send_boleto' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('send_boleto')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}
                >
                  📄 Enviar Boleto
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn sm ${templateType === 'commission_paid' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('commission_paid')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, background: templateType === 'commission_paid' ? '#10b981' : undefined }}
                >
                  💸 Comissão Paga (Dia 10)
                </button>

                <button
                  type="button"
                  className={`btn sm ${templateType === 'sale_approved' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('sale_approved')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}
                >
                  ⭐ Venda Aprovada (+10%)
                </button>

                <button
                  type="button"
                  className={`btn sm ${templateType === 'renewal_commission' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTemplateType('renewal_commission')}
                  style={{ justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 }}
                >
                  🔄 Renovação de Cliente (+10%)
                </button>
              </div>
            )}
          </div>

          {/* Editor de Texto da Mensagem */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" htmlFor="waMessageText" style={{ fontWeight: 700, margin: 0 }}>
                Texto da Mensagem (Você pode editar e personalizar):
              </label>
              <button
                type="button"
                className="btn btn-secondary sm"
                style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                onClick={() => setCustomText(generateMessage(templateType))}
                title="Restaurar texto padrão do modelo"
              >
                <RotateCcw style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                Restaurar Modelo
              </button>
            </div>
            <textarea
              id="waMessageText"
              className="form-control"
              rows={6}
              style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', lineHeight: 1.5 }}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
          </div>

          {/* Prévia Visual do WhatsApp */}
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              📱 Prévia no WhatsApp do Destinatário ({rawPhone || 'Número não informado'}):
            </span>
            <div style={{
              background: '#0b141a',
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <div style={{
                background: '#005c4b',
                color: '#e9edef',
                borderRadius: '8px 0px 8px 8px',
                padding: '10px 14px',
                maxWidth: '85%',
                fontSize: '0.85rem',
                lineHeight: 1.45,
                whiteSpace: 'pre-wrap',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                position: 'relative'
              }}>
                {customText}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={{ color: '#53bdeb' }}>✓✓</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer com Botões de Ação */}
        <div className="modal-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCopy}
            style={{ fontWeight: 700 }}
          >
            {copied ? (
              <>
                <Check style={{ width: '15px', height: '15px', marginRight: '6px', color: '#10b981' }} />
                Mensagem Copiada!
              </>
            ) : (
              <>
                <Copy style={{ width: '15px', height: '15px', marginRight: '6px' }} />
                Copiar Mensagem
              </>
            )}
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-whatsapp"
              onClick={handleSendWhatsApp}
              style={{ fontWeight: 800, padding: '10px 20px', fontSize: '0.92rem' }}
            >
              <Send style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Enviar Cobrança no WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

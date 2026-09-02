'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  Edit3,
  MessageCircle,
  Mail,
  CalendarPlus,
  Send,
  Building,
  Phone,
  MapPin,
  Tv,
  CheckCircle,
  Clock,
  Trash2,
  ExternalLink,
  Calendar,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function LeadDetailsModal() {
  const {
    activeModal,
    closeModal,
    openModal,
    leads,
    plans,
    screens,
    users,
    activities,
    meetings,
    addActivity,
    updateLeadStage,
    deleteLead,
    formatCurrency,
    getLeadDueStatus,
    renewLeadContract
  } = useCRM();

  const leadId = activeModal?.data?.id || activeModal?.data;
  const lead = leads.find(l => l.id === leadId);

  const [actType, setActType] = useState('note');
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');

  if (!lead) return null;

  const plan = plans.find(p => p.id === lead.planId) || plans[0];
  const assignedUser = users.find(u => u.id === lead.assignedTo);
  const leadActivities = activities.filter(a => a.leadId === lead.id);
  const leadMeetings = meetings.filter(m => m.leadId === lead.id);
  const selectedScreensList = screens.filter(s => lead.selectedScreenIds?.includes(s.id));
  const dueInfo = getLeadDueStatus(lead);

  // Phone clean for WhatsApp
  const cleanPhone = (lead.phone || '').replace(/\D/g, '');
  const billingMsg = encodeURIComponent(`Olá ${lead.name || lead.company}, tudo bem? Aqui é da Conecta Mais. A sua mensalidade do plano (${plan.name}) está com vencimento em ${dueInfo.formattedDueDate}. Segue a chave Pix: 11981112233. Qualquer dúvida estamos à disposição!`);
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${billingMsg}`;

  const handleActivitySubmit = (e) => {
    e.preventDefault();
    if (!actTitle.trim()) return;
    addActivity(lead.id, {
      type: actType,
      title: actTitle,
      description: actDesc
    });
    setActTitle('');
    setActDesc('');
  };

  const getStageBadgeColor = (stg) => {
    switch (stg) {
      case 'ganho': return { bg: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', border: 'var(--success)' };
      case 'perdido': return { bg: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: 'var(--danger)' };
      case 'negociacao': return { bg: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-gold)', border: 'var(--accent-gold)' };
      case 'proposta': return { bg: 'rgba(139, 92, 246, 0.2)', color: 'var(--purple)', border: 'var(--purple)' };
      case 'reuniao': return { bg: 'rgba(0, 210, 255, 0.2)', color: 'var(--primary-bright)', border: 'var(--primary-bright)' };
      default: return { bg: 'rgba(148, 163, 184, 0.2)', color: 'var(--text-muted)', border: 'var(--text-muted)' };
    }
  };

  const stageStyle = getStageBadgeColor(lead.stage);

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-xl" style={{ maxWidth: '1000px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary-bright), #0077b6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.2rem',
              color: '#070b14'
            }}>
              {(lead.name || 'C').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                {lead.company || lead.name}
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {lead.name} • {lead.role || 'Contato Decisor'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn btn-secondary sm"
              onClick={() => openModal('edit-client', lead)}
              title="Editar Lead"
            >
              <Edit3 style={{ width: '14px', height: '14px', marginRight: '4px' }} />
              Editar
            </button>
            <button
              className="btn btn-secondary sm"
              onClick={() => {
                if (confirm(`Deseja realmente excluir ${lead.company}?`)) deleteLead(lead.id);
              }}
              style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              title="Excluir Lead"
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
            </button>
            <button className="btn-icon modal-close-btn" onClick={closeModal} title="Fechar">
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body lead-details-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem' }}>
          
          {/* Coluna Esquerda: Informações Gerais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Quick Actions Card */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid rgba(2, 132, 166, 0.25)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Ações Rápidas de Contato
              </h4>
              <button
                type="button"
                className="btn btn-whatsapp"
                onClick={() => openModal('whatsapp-billing', lead)}
                style={{ justifyContent: 'center', fontWeight: 800 }}
              >
                <MessageCircle style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                Enviar Cobrança / Mensagem WhatsApp
              </button>
              <button
                className="btn btn-primary"
                onClick={() => openModal('renewal', lead)}
                style={{ justifyContent: 'center', fontWeight: 800 }}
              >
                <RefreshCw style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                {dueInfo.status === 'ok' || dueInfo.status === 'due_soon' ? 'Antecipar Renovação' : 'Renovar Mensalidade'}
              </button>
              
              <div style={{
                fontSize: '0.74rem',
                color: 'var(--primary)',
                background: 'rgba(2, 132, 166, 0.1)',
                padding: '6px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(2, 132, 166, 0.22)',
                lineHeight: 1.4
              }}>
                💡 <strong>Renovação Antecipada:</strong> Você pode renovar a qualquer momento. Os dias já pagos são preservados e somados ao novo ciclo!
              </div>

              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="btn btn-secondary"
                  style={{ justifyContent: 'center' }}
                >
                  <Mail style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                  Enviar E-mail
                </a>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => openModal('meeting', { leadId: lead.id, companyName: lead.company, contactPerson: lead.name, phone: lead.phone, address: lead.companyAddress })}
                style={{ justifyContent: 'center' }}
              >
                <CalendarPlus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                Agendar Reunião
              </button>
            </div>

            {/* Meta Info Box */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Dados do Contrato & Vencimento
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Status Vencimento:</span>
                <span style={{
                  background: dueInfo.status === 'expired' ? 'rgba(239, 68, 68, 0.2)' : (dueInfo.status === 'due_today' ? 'rgba(251, 191, 36, 0.2)' : (dueInfo.status === 'due_soon' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)')),
                  color: dueInfo.color,
                  border: `1px solid ${dueInfo.color}`,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {dueInfo.status === 'expired' && '🔴 '}
                  {dueInfo.status === 'due_today' && '🟡 '}
                  {dueInfo.status === 'due_soon' && '🟠 '}
                  {dueInfo.status === 'ok' && '🟢 '}
                  {dueInfo.text}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Data de Pagamento:</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {lead.paymentDate ? `${lead.paymentDate.split('-')[2]}/${lead.paymentDate.split('-')[1]}/${lead.paymentDate.split('-')[0]}` : '-'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Vencimento Atual:</span>
                <strong style={{ fontSize: '0.88rem', color: dueInfo.color }}>
                  {dueInfo.formattedDueDate}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Forma de Pagamento:</span>
                <span style={{
                  background: lead.paymentMethod === 'Cartão de Crédito'
                    ? 'rgba(139, 92, 246, 0.15)'
                    : (lead.paymentMethod === 'Boleto Bancário'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)'),
                  color: lead.paymentMethod === 'Cartão de Crédito'
                    ? 'var(--purple)'
                    : (lead.paymentMethod === 'Boleto Bancário'
                      ? 'var(--accent-gold)'
                      : 'var(--success)'),
                  border: `1px solid ${lead.paymentMethod === 'Cartão de Crédito' ? 'rgba(139, 92, 246, 0.3)' : (lead.paymentMethod === 'Boleto Bancário' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)')}`,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {lead.paymentMethod === 'Cartão de Crédito' && '💳'}
                  {lead.paymentMethod === 'Boleto Bancário' && '📄'}
                  {(!lead.paymentMethod || lead.paymentMethod === 'Pix') && '⚡'}
                  {' '}{lead.paymentMethod || 'Pix'}
                </span>
              </div>

              {lead.boletoBarcode && (
                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', display: 'block', fontWeight: 700 }}>📄 Linha Digitável do Boleto:</span>
                  <code style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', wordBreak: 'break-all', display: 'block', marginTop: '2px' }}>
                    {lead.boletoBarcode}
                  </code>
                </div>
              )}

              {lead.renewalsCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Renovações:</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 800, fontSize: '0.88rem' }}>
                    🔄 {lead.renewalsCount} ciclos renovados
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Etapa Funil:</span>
                <span style={{
                  background: stageStyle.bg,
                  color: stageStyle.color,
                  border: `1px solid ${stageStyle.border}`,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {lead.stage}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Plano:</span>
                <strong style={{ fontSize: '0.88rem', color: 'var(--primary-bright)' }}>{plan.name}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Valor do Contrato:</span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--success)', fontFamily: 'var(--font-sans)' }}>
                  {formatCurrency(lead.value)}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Formato Mídia:</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  {lead.mediaFormat === 'video' ? '🎥 Vídeo Motion' : (lead.mediaFormat === 'ambos' ? '🔄 Foto + Vídeo' : '📸 Foto Encarte')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Telefone:</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{lead.phone}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Endereço:</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{lead.companyAddress}</span>
              </div>

              {lead.sellerId && (
                <div style={{
                  padding: '8px 10px',
                  background: 'rgba(251, 191, 36, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  fontSize: '0.78rem'
                }}>
                  <strong style={{ color: 'var(--accent-gold)' }}>Venda por Vendedor:</strong> {users.find(u=>u.id===lead.sellerId)?.name}
                  <br />
                  <span>Comissão (10%): <strong>{formatCurrency(lead.commissionAmount || lead.value * 0.10)}</strong></span>
                </div>
              )}

              {/* Telas Contratadas */}
              <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary-bright)', display: 'block', marginBottom: '6px' }}>
                  📍 Telas Físicas Contratadas ({selectedScreensList.length}):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedScreensList.map(sc => (
                    <div key={sc.id} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(0, 0, 0, 0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                      • <strong>{sc.name}</strong> ({sc.neighborhood})
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage Updater */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <label className="form-label" style={{ marginBottom: '6px', fontWeight: 700 }}>
                Avançar Etapa do Funil:
              </label>
              <select
                className="form-select"
                value={lead.stage}
                onChange={(e) => updateLeadStage(lead.id, e.target.value)}
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
          </div>

          {/* Coluna Direita: Timeline & Atividades */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Form de Nova Atividade */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Registrar Atividade / Histórico de Contato
              </h4>
              <form onSubmit={handleActivitySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select
                    className="form-select sm"
                    style={{ width: '150px' }}
                    value={actType}
                    onChange={(e) => setActType(e.target.value)}
                  >
                    <option value="whatsapp">📱 WhatsApp</option>
                    <option value="call">📞 Ligação</option>
                    <option value="meeting">🤝 Reunião</option>
                    <option value="proposal">📄 Proposta</option>
                    <option value="note">📝 Nota / Cobrança</option>
                  </select>
                  <input
                    type="text"
                    className="form-control sm"
                    placeholder="Título da atividade (Ex: Cobrança de mensalidade enviada)..."
                    value={actTitle}
                    onChange={(e) => setActTitle(e.target.value)}
                    required
                  />
                </div>
                <textarea
                  className="form-control sm"
                  rows="2"
                  placeholder="Detalhes ou anotações adicionais..."
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary sm">
                    <Send style={{ width: '13px', height: '13px', marginRight: '4px' }} />
                    Salvar Atividade
                  </button>
                </div>
              </form>
            </div>

            {/* Linha do Tempo */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
              flex: 1
            }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock style={{ width: '16px', height: '16px', color: 'var(--primary-bright)' }} />
                Linha do Tempo & Histórico Comercial ({leadActivities.length})
              </h4>

              {leadActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Nenhuma atividade registrada ainda para este cliente. Registre notas de cobrança ou reuniões acima!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {leadActivities.map(act => (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--primary-bright)'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{act.title}</strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {new Date(act.createdAt).toLocaleDateString('pt-BR')} às {new Date(act.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {act.description && (
                          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {act.description}
                          </p>
                        )}
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', display: 'block', marginTop: '4px' }}>
                          Registrado por: {act.user}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

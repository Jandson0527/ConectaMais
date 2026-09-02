'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Video,
  MapPin,
  Clock,
  User,
  ExternalLink,
  Edit3,
  Trash2
} from 'lucide-react';

export default function CalendarView() {
  const {
    meetings,
    users,
    currentUser,
    isSeller,
    openModal,
    deleteMeeting
  } = useCRM();

  const [partnerFilter, setPartnerFilter] = useState('all');

  const filteredMeetings = meetings.filter(m => {
    if (isSeller()) {
      return m.scheduledBy === currentUser.id || m.assignedPartnerId === currentUser.id || m.participantIds?.includes(currentUser.id);
    }
    if (partnerFilter !== 'all') {
      return m.scheduledBy === partnerFilter || m.assignedPartnerId === partnerFilter || m.participantIds?.includes(partnerFilter);
    }
    return true;
  });

  return (
    <section className="view-panel active" id="view-calendar">
      
      <div className="view-header">
        <div>
          <h1 className="view-title">Reuniões & Agenda Comercial</h1>
          <p className="view-subtitle">Acompanhe as reuniões de apresentação da Conecta Mais presenciais e por videochamada.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {!isSeller() && (
            <select
              className="form-select sm"
              style={{ width: '180px' }}
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
            >
              <option value="all">Todos os Sócios</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          )}
          <button className="btn btn-primary" onClick={() => openModal('meeting')}>
            <Plus style={{ width: '16px', height: '16px', marginRight: '6px' }} />
            <span>+ Agendar Reunião</span>
          </button>
        </div>
      </div>

      {/* Lista de Reuniões */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredMeetings.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-subtle)' }}>
            Nenhuma reunião comercial agendada com os filtros atuais.
          </div>
        ) : (
          filteredMeetings.map(mtg => {
            const partner = users.find(u => u.id === mtg.assignedPartnerId);
            const isOnline = mtg.type === 'online';

            return (
              <div
                key={mtg.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: isOnline ? 'rgba(0, 210, 255, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                    color: isOnline ? 'var(--primary-bright)' : 'var(--accent-gold)',
                    border: `1px solid ${isOnline ? 'rgba(0, 210, 255, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`
                  }}>
                    {isOnline ? '💻 Videochamada Meet' : '📍 Presencial no Local'}
                  </span>

                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {mtg.duration} min
                  </span>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  {mtg.title}
                </h3>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>
                    <strong>Empresa:</strong> {mtg.companyName}
                    {mtg.contactPerson && <span style={{ color: 'var(--text-muted)' }}> ({mtg.contactPerson})</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-bright)', fontWeight: 600 }}>
                    <CalendarIcon style={{ width: '14px', height: '14px' }} />
                    <span>{mtg.date} às {mtg.time}</span>
                  </div>
                  {mtg.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: '0.8rem' }}>{mtg.address}</span>
                    </div>
                  )}
                  {partner && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      👤 Conduzido por: <strong style={{ color: 'var(--text-primary)' }}>{partner.name}</strong>
                    </div>
                  )}
                </div>

                {mtg.notes && (
                  <div style={{ background: 'var(--bg-surface)', padding: '8px 10px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {mtg.notes}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  {mtg.meetLink ? (
                    <a
                      href={mtg.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary sm"
                      style={{ color: 'var(--primary-bright)', borderColor: 'rgba(0, 210, 255, 0.4)' }}
                    >
                      <Video style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                      Acessar Meet
                    </a>
                  ) : <div />}

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => openModal('edit-meeting', mtg)}
                      title="Editar Reunião"
                    >
                      <Edit3 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                      onClick={() => {
                        if (confirm(`Remover reunião "${mtg.title}"?`)) deleteMeeting(mtg.id);
                      }}
                      title="Excluir Reunião"
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </section>
  );
}

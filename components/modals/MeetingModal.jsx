'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  CalendarPlus,
  Video,
  Check,
  MapPin,
  Clock,
  User,
  Building,
  Phone
} from 'lucide-react';

export default function MeetingModal() {
  const {
    activeModal,
    closeModal,
    addMeeting,
    updateMeeting,
    leads,
    users,
    currentUser
  } = useCRM();

  const isEditing = activeModal?.type === 'edit-meeting';
  const existingMeeting = isEditing ? activeModal.data : null;
  const initialData = activeModal?.data || {};

  const [title, setTitle] = useState('');
  const [leadId, setLeadId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('presencial');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [duration, setDuration] = useState('45');
  const [scheduledBy, setScheduledBy] = useState(currentUser?.id || 'usr-1');
  const [assignedPartnerId, setAssignedPartnerId] = useState(currentUser?.id || 'usr-1');
  const [participantIds, setParticipantIds] = useState([currentUser?.id || 'usr-1']);
  const [meetLink, setMeetLink] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingMeeting) {
      setTitle(existingMeeting.title || '');
      setLeadId(existingMeeting.leadId || '');
      setCompanyName(existingMeeting.companyName || '');
      setContactPerson(existingMeeting.contactPerson || '');
      setPhone(existingMeeting.phone || '');
      setType(existingMeeting.type || 'presencial');
      setAddress(existingMeeting.address || '');
      setDate(existingMeeting.date || new Date().toISOString().split('T')[0]);
      setTime(existingMeeting.time || '14:00');
      setDuration(existingMeeting.duration || '45');
      setScheduledBy(existingMeeting.scheduledBy || currentUser?.id);
      setAssignedPartnerId(existingMeeting.assignedPartnerId || currentUser?.id);
      setParticipantIds(existingMeeting.participantIds || [currentUser?.id]);
      setMeetLink(existingMeeting.meetLink || '');
      setStatus(existingMeeting.status || 'scheduled');
      setNotes(existingMeeting.notes || '');
    } else if (initialData.leadId) {
      setLeadId(initialData.leadId);
      setCompanyName(initialData.companyName || '');
      setContactPerson(initialData.contactPerson || '');
      setPhone(initialData.phone || '');
      setAddress(initialData.address || '');
      setTitle(`Apresentação Comercial Rede Conecta Mais — ${initialData.companyName || ''}`);
    } else {
      setTitle('Apresentação Comercial Conecta Mais (5 TVs)');
    }
  }, [existingMeeting, initialData, currentUser]);

  const handleLeadSelect = (selectedId) => {
    setLeadId(selectedId);
    if (!selectedId) return;
    const l = leads.find(x => x.id === selectedId);
    if (l) {
      setCompanyName(l.company || l.name);
      setContactPerson(l.name);
      setPhone(l.phone || '');
      setAddress(l.companyAddress || '');
      setTitle(`Apresentação Comercial Rede Conecta Mais — ${l.company || l.name}`);
    }
  };

  const handleGenMeetLink = () => {
    const code = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    setMeetLink(`https://meet.google.com/${code}`);
  };

  const toggleParticipant = (userId) => {
    setParticipantIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !companyName.trim()) {
      alert('Por favor, preencha o título e nome do estabelecimento.');
      return;
    }

    const payload = {
      title: title.trim(),
      leadId,
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      type,
      address: address.trim(),
      date,
      time,
      duration,
      scheduledBy,
      assignedPartnerId,
      participantIds,
      meetLink: meetLink.trim(),
      status,
      notes: notes.trim()
    };

    if (isEditing && existingMeeting) {
      updateMeeting(existingMeeting.id, payload);
    } else {
      addMeeting(payload);
    }
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '650px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarPlus style={{ width: '22px', height: '22px', color: 'var(--primary-bright)' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              {isEditing ? 'Editar Reunião Comercial' : 'Agendar Nova Reunião Comercial'}
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="form-group">
              <label className="form-label" htmlFor="meetingTitle">Título do Compromisso *</label>
              <input
                type="text"
                id="meetingTitle"
                className="form-control"
                placeholder="Ex: Apresentação da Rede Conecta Mais"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="meetingLeadId">Cliente Vinculado (Opcional)</label>
                <select
                  id="meetingLeadId"
                  className="form-select"
                  value={leadId}
                  onChange={(e) => handleLeadSelect(e.target.value)}
                >
                  <option value="">-- Selecione para autopreencher --</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.company || l.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="meetingCompanyName">Nome da Empresa / Estabelecimento *</label>
                <input
                  type="text"
                  id="meetingCompanyName"
                  className="form-control"
                  placeholder="Ex: Academia FitLife, Ótica Visão"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="meetingContactPerson">Nome do Decisor / Contato</label>
                <input
                  type="text"
                  id="meetingContactPerson"
                  className="form-control"
                  placeholder="Ex: Dr. Roberto (Proprietário)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="meetingPhone">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  id="meetingPhone"
                  className="form-control"
                  placeholder="(11) 98888-7777"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="meetingType">Formato do Encontro *</label>
                <select
                  id="meetingType"
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="presencial">📍 Presencial no Estabelecimento</option>
                  <option value="online">💻 Videochamada Online (Google Meet)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="meetingAddress">Endereço do Local</label>
                <input
                  type="text"
                  id="meetingAddress"
                  className="form-control"
                  placeholder="Av. Paulista, 1500 - Bela Vista"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="meetingDate">Data *</label>
                <input
                  type="date"
                  id="meetingDate"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="meetingTime">Horário de Início *</label>
                <input
                  type="time"
                  id="meetingTime"
                  className="form-control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="meetingDuration">Duração Estimada</label>
                <select
                  id="meetingDuration"
                  className="form-select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora e 30 min</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="meetingAssignedPartner">Sócio que vai Apresentar</label>
                <select
                  id="meetingAssignedPartner"
                  className="form-select"
                  value={assignedPartnerId}
                  onChange={(e) => setAssignedPartnerId(e.target.value)}
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role === 'vendedor' ? 'Vendedor' : 'Sócio'})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sócios / Participantes Conecta Mais:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {users.map(u => {
                  const isPart = participantIds.includes(u.id);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleParticipant(u.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: isPart ? 'rgba(0, 210, 255, 0.2)' : 'var(--bg-surface)',
                        border: `1px solid ${isPart ? 'var(--primary-bright)' : 'var(--border-medium)'}`,
                        color: isPart ? 'var(--primary-bright)' : 'var(--text-secondary)'
                      }}
                    >
                      {isPart ? '✓ ' : '+ '} {u.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="meetingLink">Link da Videochamada (Google Meet)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  id="meetingLink"
                  className="form-control"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary sm"
                  onClick={handleGenMeetLink}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Video style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                  Gerar Meet
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="meetingNotes">Pauta / Observações</label>
              <textarea
                id="meetingNotes"
                className="form-control"
                rows="2"
                placeholder="Ex: Levar amostra de vídeo em Pendrive, apresentar proposta do Plano Conecta (5 TVs)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>{isEditing ? 'Salvar Alterações' : 'Confirmar Agendamento'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

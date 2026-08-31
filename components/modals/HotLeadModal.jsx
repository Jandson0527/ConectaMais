'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  Flame,
  Check
} from 'lucide-react';

export default function HotLeadModal() {
  const {
    activeModal,
    closeModal,
    addHotLead,
    updateHotLead,
    plans
  } = useCRM();

  const isEditing = activeModal?.type === 'edit-hotlead';
  const existing = isEditing ? activeModal.data : null;

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [planInterest, setPlanInterest] = useState('plan-conecta');
  const [reasonNotClosed, setReasonNotClosed] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existing) {
      setName(existing.name || '');
      setCompany(existing.company || '');
      setCompanyAddress(existing.companyAddress || '');
      setPhone(existing.phone || '');
      setPlanInterest(existing.planInterest || 'plan-conecta');
      setReasonNotClosed(existing.reasonNotClosed || '');
      setNotes(existing.notes || '');
    } else {
      setName('');
      setCompany('');
      setCompanyAddress('');
      setPhone('');
      setPlanInterest('plan-conecta');
      setReasonNotClosed('');
      setNotes('');
    }
  }, [existing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !reasonNotClosed.trim()) {
      alert('Por favor, informe o contato, estabelecimento e o motivo pelo qual ainda não fechou.');
      return;
    }

    const payload = {
      name: name.trim(),
      company: company.trim(),
      companyAddress: companyAddress.trim(),
      phone: phone.trim(),
      planInterest,
      reasonNotClosed: reasonNotClosed.trim(),
      notes: notes.trim()
    };

    if (isEditing && existing) {
      updateHotLead(existing.id, payload);
    } else {
      addHotLead(payload);
    }
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame style={{ width: '22px', height: '22px', color: 'var(--accent-gold)' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
              {isEditing ? 'Editar Cliente em Potencial' : 'Cadastrar Cliente em Potencial / Quente'}
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="hotName">Nome do Contato *</label>
                <input
                  type="text"
                  id="hotName"
                  className="form-control"
                  placeholder="Ex: Roberto Silva / Dra. Patrícia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="hotCompany">Nome do Estabelecimento *</label>
                <input
                  type="text"
                  id="hotCompany"
                  className="form-control"
                  placeholder="Ex: Ótica Visão, Studio Glamour"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="hotPhone">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  id="hotPhone"
                  className="form-control"
                  placeholder="(11) 98765-4321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="hotPlan">Plano de Interesse</label>
                <select
                  id="hotPlan"
                  className="form-select"
                  value={planInterest}
                  onChange={(e) => setPlanInterest(e.target.value)}
                >
                  {plans.map(p => (
                    <option key={p.id} value={p.id}>{p.badge} {p.name} ({p.tvs} TVs)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hotAddress">Endereço do Estabelecimento</label>
              <input
                type="text"
                id="hotAddress"
                className="form-control"
                placeholder="Ex: Av. Paulista, 1500 - Bela Vista"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hotReason" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>
                Por qual motivo o cliente ainda não fechou a venda? *
              </label>
              <textarea
                id="hotReason"
                className="form-control"
                rows="2"
                placeholder="Ex: Analisando o orçamento; vai conversar com o sócio na quinta-feira; aguardando inauguração..."
                value={reasonNotClosed}
                onChange={(e) => setReasonNotClosed(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hotNotes">Outras Observações</label>
              <textarea
                id="hotNotes"
                className="form-control"
                rows="2"
                placeholder="Ex: Demonstrou interesse nas telas das academias..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-gold">
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>Salvar Cliente Quente</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

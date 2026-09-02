'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  MapPin,
  Check,
  Tv,
  Users,
  Building
} from 'lucide-react';

export default function ScreenModal() {
  const {
    activeModal,
    closeModal,
    addScreen,
    updateScreen
  } = useCRM();

  const isEditing = activeModal?.type === 'edit-screen';
  const existingScreen = isEditing ? activeModal.data : null;

  const [name, setName] = useState('');
  const [segment, setSegment] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo - SP');
  const [audienceEst, setAudienceEst] = useState('4.500 pessoas/mês');
  const [tvsCount, setTvsCount] = useState(1);
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingScreen) {
      setName(existingScreen.name || '');
      setSegment(existingScreen.segment || '');
      setAddress(existingScreen.address || '');
      setNeighborhood(existingScreen.neighborhood || '');
      setCity(existingScreen.city || 'São Paulo - SP');
      setAudienceEst(existingScreen.audienceEst || '4.500 pessoas/mês');
      setTvsCount(existingScreen.tvsCount || 1);
      setStatus(existingScreen.status || 'active');
      setNotes(existingScreen.notes || '');
    } else {
      setName('');
      setSegment('');
      setAddress('');
      setNeighborhood('');
      setCity('São Paulo - SP');
      setAudienceEst('4.500 pessoas/mês');
      setTvsCount(1);
      setStatus('active');
      setNotes('');
    }
  }, [existingScreen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !neighborhood.trim()) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const payload = {
      name: name.trim(),
      segment: segment.trim() || 'Comércio & Serviços',
      address: address.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      audienceEst: audienceEst.trim(),
      tvsCount: Number(tvsCount),
      status,
      notes: notes.trim()
    };

    if (isEditing && existingScreen) {
      updateScreen(existingScreen.id, payload);
    } else {
      addScreen(payload);
    }
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin style={{ width: '22px', height: '22px', color: 'var(--primary-bright)' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              {isEditing ? 'Editar Ponto de Tela' : 'Cadastrar Novo Ponto de Tela'}
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <div className="modal-body" style={{ overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="screenName">Nome do Estabelecimento *</label>
                <input
                  type="text"
                  id="screenName"
                  className="form-control"
                  placeholder="Ex: Clínica Rey, Barbearia Men's Prime"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="screenSegment">Segmento / Ramo *</label>
                <input
                  type="text"
                  id="screenSegment"
                  className="form-control"
                  placeholder="Ex: Clínica Médica, Academia, Barbearia"
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="screenAddress">Endereço Completo (Rua e Número) *</label>
              <input
                type="text"
                id="screenAddress"
                className="form-control"
                placeholder="Ex: Av. Principal, 450"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="screenNeighborhood">Bairro *</label>
                <input
                  type="text"
                  id="screenNeighborhood"
                  className="form-control"
                  placeholder="Ex: Centro, Jardins, Vila Mariana"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="screenCity">Cidade / UF *</label>
                <input
                  type="text"
                  id="screenCity"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label" htmlFor="screenAudience">Estimativa de Público</label>
                <input
                  type="text"
                  id="screenAudience"
                  className="form-control"
                  placeholder="Ex: 4.500 pessoas/mês"
                  value={audienceEst}
                  onChange={(e) => setAudienceEst(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="screenTvsCount">Qtd de Telas</label>
                <input
                  type="number"
                  id="screenTvsCount"
                  className="form-control"
                  min="1"
                  max="10"
                  value={tvsCount}
                  onChange={(e) => setTvsCount(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="screenStatus">Status Operacional</label>
                <select
                  id="screenStatus"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Ativa (Veiculando)</option>
                  <option value="maintenance">Em Manutenção</option>
                  <option value="planned">Em Instalação</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="screenNotes">Observações Técnicas / Posicionamento</label>
              <textarea
                id="screenNotes"
                className="form-control"
                rows="2"
                placeholder="Ex: Localização exata da TV (recepção, área cardio), modelo, internet..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Ponto de Tela'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

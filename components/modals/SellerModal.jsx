'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  UserPlus,
  Check,
  Percent
} from 'lucide-react';

export default function SellerModal() {
  const { closeModal, addSeller } = useCRM();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('conecta123');
  const [active, setActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    addSeller({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password || 'conecta123',
      active
    });
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus style={{ width: '22px', height: '22px', color: '#00d2ff' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
              Cadastrar Novo Vendedor Comercial
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
                <label className="form-label" htmlFor="sellerName">Nome do Vendedor *</label>
                <input
                  type="text"
                  id="sellerName"
                  className="form-control"
                  placeholder="Ex: Luciano Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sellerPhone">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  id="sellerPhone"
                  className="form-control"
                  placeholder="Ex: (11) 94777-8899"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="sellerEmail">E-mail de Acesso *</label>
                <input
                  type="email"
                  id="sellerEmail"
                  className="form-control"
                  placeholder="luciano@conectamais.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="sellerPassword">Senha Inicial</label>
                <input
                  type="text"
                  id="sellerPassword"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="info-note-box" style={{
              background: 'rgba(0, 210, 255, 0.08)',
              border: '1px solid rgba(0, 210, 255, 0.25)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '4px'
            }}>
              <strong style={{ color: '#00d2ff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Percent style={{ width: '14px', height: '14px' }} /> Regras de Acesso e Comissão:
              </strong>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '18px', lineHeight: 1.5 }}>
                <li>Comissão padrão de <strong>10% automática</strong> sobre cada venda aprovada.</li>
                <li>Acesso restrito: visualiza <strong>apenas seus próprios dados</strong>.</li>
                <li>Não tem acesso ao financeiro geral da empresa ou dados de outros vendedores.</li>
                <li>Toda venda cadastrada precisará da <strong>confirmação dos sócios</strong>.</li>
              </ul>
            </div>

            <div style={{ marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <span style={{ fontSize: '0.85rem', color: '#ffffff' }}>Vendedor ativo para login e cadastro de vendas</span>
              </label>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>Cadastrar Vendedor</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

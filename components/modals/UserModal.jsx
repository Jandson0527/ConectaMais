'use client';

import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function UserModal() {
  const { closeModal, addUser } = useCRM();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('conecta123');
  const [role, setRole] = useState('admin');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    addUser({
      name: name.trim(),
      email: email.trim(),
      password: password || 'conecta123',
      role,
      phone: phone.trim(),
      avatar: avatar.trim()
    });
  };

  return (
    <div className="modal-backdrop active" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div className="modal-dialog modal-md" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div className="modal-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck style={{ width: '22px', height: '22px', color: '#00d2ff' }} />
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
              Cadastrar Novo Sócio / Gestor
            </h3>
          </div>
          <button className="btn-icon modal-close-btn" onClick={closeModal}>
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div className="form-group">
              <label className="form-label" htmlFor="newUserName">Nome do Sócio *</label>
              <input
                type="text"
                id="newUserName"
                className="form-control"
                placeholder="Ex: Jandson, Thiago, Daniele, Damares"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newUserEmail">E-mail Corporativo *</label>
              <input
                type="email"
                id="newUserEmail"
                className="form-control"
                placeholder="nome@conectamais.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="newUserRole">Papel / Função *</label>
                <select
                  id="newUserRole"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="admin">Sócio Diretor (Acesso Total & Caixa)</option>
                  <option value="manager">Sócio & Gestor Comercial</option>
                  <option value="closer">Sócia & Executiva de Vendas / SDR</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="newUserPhone">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  id="newUserPhone"
                  className="form-control"
                  placeholder="(11) 98111-2233"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newUserAvatar">URL da Foto de Perfil (Opcional)</label>
              <input
                type="url"
                id="newUserAvatar"
                className="form-control"
                placeholder="https://exemplo.com/foto.jpg"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </div>

            <div style={{
              background: 'rgba(0, 210, 255, 0.08)',
              border: '1px solid rgba(0, 210, 255, 0.25)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <strong style={{ color: '#00d2ff', display: 'block', marginBottom: '4px' }}>Transparência dos Sócios:</strong>
              • Visualização de todos os clientes e contratos da rede.<br />
              • Acesso a faturamento, despesas e fluxo de caixa.<br />
              • Controle dos pontos de telas físicas e aprovação de vendedores.
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <Check style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              <span>Salvar Sócio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

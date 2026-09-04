import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Target } from 'lucide-react';

export default function GoalModal() {
  const { 
    activeModal, 
    closeModal, 
    addGoal, 
    updateGoal, 
    users, 
    isPartner 
  } = useCRM();

  const isEditing = Boolean(activeModal.data);
  const data = activeModal.data || {};

  const [title, setTitle] = useState(data.title || '');
  const [targetValue, setTargetValue] = useState(data.targetValue || '');
  const [type, setType] = useState(data.type || 'company'); // company, individual
  const [sellerId, setSellerId] = useState(data.sellerId || '');
  const [month, setMonth] = useState(data.month || new Date().getMonth() + 1);
  const [year, setYear] = useState(data.year || new Date().getFullYear());

  useEffect(() => {
    // If setting to individual and no seller selected, pick the first one
    if (type === 'individual' && !sellerId) {
      const sellers = users.filter(u => u.role === 'vendedor');
      if (sellers.length > 0) setSellerId(sellers[0].id);
    }
  }, [type, sellerId, users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !targetValue) return;

    const payload = {
      title,
      targetValue: Number(targetValue),
      type,
      sellerId: type === 'company' ? null : sellerId,
      month: Number(month),
      year: Number(year)
    };

    if (isEditing) {
      updateGoal(data.id, payload);
    } else {
      addGoal(payload);
    }
  };

  if (!isPartner()) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
          <h3>Acesso Restrito</h3>
          <p>Apenas sócios podem definir metas.</p>
          <button className="btn btn-secondary" onClick={closeModal} style={{ marginTop: '1rem' }}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target className="modal-icon" />
            <h2>{isEditing ? 'Editar Meta' : 'Definir Nova Meta'}</h2>
          </div>
          <button className="btn-icon" onClick={closeModal}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Título da Meta</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Ex: Faturamento Agosto, Bater R$10k..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Valor Alvo (R$)</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="Ex: 5000"
              value={targetValue}
              onChange={e => setTargetValue(e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mês</label>
              <select className="input-field" value={month} onChange={e => setMonth(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ano</label>
              <input 
                type="number" 
                className="input-field" 
                value={year}
                onChange={e => setYear(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tipo de Meta</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <input 
                  type="radio" 
                  name="goalType" 
                  value="company" 
                  checked={type === 'company'} 
                  onChange={() => setType('company')} 
                />
                Global (Empresa)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                <input 
                  type="radio" 
                  name="goalType" 
                  value="individual" 
                  checked={type === 'individual'} 
                  onChange={() => setType('individual')} 
                />
                Individual (Vendedor)
              </label>
            </div>
          </div>

          {type === 'individual' && (
            <div className="form-group">
              <label>Selecionar Vendedor</label>
              <select 
                className="input-field" 
                value={sellerId} 
                onChange={e => setSellerId(e.target.value)}
                required
              >
                {users.filter(u => u.role === 'vendedor').map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Salvar Alterações' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

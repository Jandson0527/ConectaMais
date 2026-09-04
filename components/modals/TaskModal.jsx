import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, CheckSquare } from 'lucide-react';

export default function TaskModal() {
  const { 
    activeModal, 
    closeModal, 
    addTask, 
    updateTask, 
    users, 
    isPartner 
  } = useCRM();

  const isEditing = Boolean(activeModal.data);
  const data = activeModal.data || {};

  const [title, setTitle] = useState(data.title || '');
  const [description, setDescription] = useState(data.description || '');
  const [dueDate, setDueDate] = useState(data.dueDate || new Date().toISOString().split('T')[0]);
  const [assignedTo, setAssignedTo] = useState(data.assignedTo || 'all');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const payload = {
      title,
      description,
      dueDate,
      assignedTo
    };

    if (isEditing) {
      updateTask(data.id, payload);
      closeModal();
    } else {
      addTask(payload);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckSquare className="modal-icon" />
            <h2>{isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          </div>
          <button className="btn-icon" onClick={closeModal}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Título da Tarefa</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="O que precisa ser feito?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição (Opcional)</label>
            <textarea 
              className="input-field" 
              placeholder="Detalhes adicionais..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data Limite</label>
              <input 
                type="date" 
                className="input-field" 
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
              />
            </div>
            
            {isPartner() && (
              <div className="form-group">
                <label>Atribuir Para</label>
                <select 
                  className="input-field" 
                  value={assignedTo} 
                  onChange={e => setAssignedTo(e.target.value)}
                >
                  <option value="all">Todos da Empresa</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

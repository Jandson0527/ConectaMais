import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Target, TrendingUp, Trophy } from 'lucide-react';

export default function GoalBanner() {
  const { 
    goals, 
    transactions, 
    leads, 
    currentUser, 
    isPartner, 
    openModal,
    formatCurrency 
  } = useCRM();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Find the active goal for this user
  // If partner: show company goal for this month, or their own if they prefer. Let's prioritize company goal.
  // If seller: show their individual goal, or fallback to company goal if no individual goal exists.
  let activeGoal = goals.find(g => g.month === currentMonth && g.year === currentYear && g.type === 'company');
  
  if (currentUser?.role === 'vendedor') {
    const sellerGoal = goals.find(g => g.month === currentMonth && g.year === currentYear && g.type === 'individual' && g.sellerId === currentUser.id);
    if (sellerGoal) activeGoal = sellerGoal;
  }

  // Se não tem meta, e é sócio, mostra botão sutil
  if (!activeGoal) {
    if (isPartner()) {
      return (
        <div style={{ padding: '8px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => openModal('goal')}>
            <Target style={{ width: '14px', height: '14px', marginRight: '6px' }} />
            Definir Meta do Mês
          </button>
        </div>
      );
    }
    return null;
  }

  // Calculate progress
  let currentAmount = 0;

  if (activeGoal.type === 'company') {
    // Somar transações de entrada pagas neste mês
    currentAmount = transactions
      .filter(t => {
        if (t.type !== 'income' || t.status !== 'paid') return false;
        const d = new Date(t.date || t.dueDate);
        return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + Number(t.amount), 0);
  } else {
    // Somar vendas ganhas deste vendedor neste mês
    currentAmount = leads
      .filter(l => {
        if (l.stage !== 'ganho' || l.sellerId !== activeGoal.sellerId) return false;
        const d = new Date(l.paymentDate || l.createdAt);
        return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, l) => acc + Number(l.value), 0);
  }

  const progressPercent = activeGoal.targetValue > 0 
    ? Math.min(100, Math.round((currentAmount / activeGoal.targetValue) * 100)) 
    : 0;

  const amountLeft = Math.max(0, activeGoal.targetValue - currentAmount);
  const isCompleted = currentAmount >= activeGoal.targetValue;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      color: 'var(--text-secondary)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {isCompleted ? (
          <Trophy style={{ color: 'var(--accent-gold)', width: '20px', height: '20px' }} />
        ) : (
          <Target style={{ color: 'var(--primary-bright)', width: '20px', height: '20px' }} />
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: isCompleted ? 'var(--accent-gold)' : 'var(--primary-bright)' }}>
            {activeGoal.title}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {activeGoal.type === 'company' ? 'Meta Global da Empresa' : 'Sua Meta Individual'}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 500 }}>
          <span>{formatCurrency(currentAmount)} atingido</span>
          <span>Objetivo: {formatCurrency(activeGoal.targetValue)}</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: isCompleted ? 'var(--accent-gold)' : 'linear-gradient(90deg, var(--primary), var(--primary-bright))',
            transition: 'width 1s ease-in-out'
          }}></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
        {isCompleted ? (
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>Meta Batida! 🎉</span>
        ) : (
          <>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Falta {formatCurrency(amountLeft)}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {progressPercent}% concluído
            </span>
          </>
        )}
      </div>

      {isPartner() && (
        <button 
          className="btn-icon" 
          onClick={() => openModal('goal', activeGoal)} 
          title="Editar Meta"
          style={{ marginLeft: '8px' }}
        >
          <TrendingUp style={{ width: '16px', height: '16px' }} />
        </button>
      )}
    </div>
  );
}

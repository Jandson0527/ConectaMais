/**
 * Conecta Mais - Kanban Board
 * Sales pipeline, drag and drop stages, deals summary.
 */

class KanbanManager {
  constructor() {
    this.board = document.getElementById('kanbanBoard');
    this.draggedLeadId = null;

    this.stages = [
      { id: 'novo', title: 'Novo Lead', color: '#94a3b8' },
      { id: 'qualificacao', title: 'Qualificação', color: '#3b82f6' },
      { id: 'reuniao', title: 'Reunião Agendada', color: '#a855f7' },
      { id: 'proposta', title: 'Proposta Enviada', color: '#f59e0b' },
      { id: 'negociacao', title: 'Em Negociação', color: '#ec4899' },
      { id: 'ganho', title: 'Ganho (Fechado) 🎉', color: '#10b981' }
    ];

    this.init();
  }

  init() {
    this.setupFilters();
    this.renderBoard();

    window.crmStore.subscribe(() => {
      this.renderBoard();
    });
  }

  setupFilters() {
    const searchInput = document.getElementById('kanbanSearchInput');
    const userFilter = document.getElementById('kanbanUserFilter');
    const priorityFilter = document.getElementById('kanbanPriorityFilter');

    if (searchInput) searchInput.addEventListener('input', () => this.renderBoard());
    if (userFilter) userFilter.addEventListener('change', () => this.renderBoard());
    if (priorityFilter) priorityFilter.addEventListener('change', () => this.renderBoard());
  }

  getFilteredLeads() {
    let leads = window.crmStore.getLeads();
    const searchVal = (document.getElementById('kanbanSearchInput')?.value || '').toLowerCase().trim();
    const userVal = document.getElementById('kanbanUserFilter')?.value || 'all';
    const priorityVal = document.getElementById('kanbanPriorityFilter')?.value || 'all';

    if (searchVal) {
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(searchVal) ||
        l.company.toLowerCase().includes(searchVal) ||
        (l.tags && l.tags.some(t => t.toLowerCase().includes(searchVal)))
      );
    }

    if (userVal !== 'all') {
      leads = leads.filter(l => l.assignedTo === userVal);
    }

    if (priorityVal !== 'all') {
      leads = leads.filter(l => l.priority === priorityVal);
    }

    return leads;
  }

  renderBoard() {
    if (!this.board) return;

    const allFilteredLeads = this.getFilteredLeads();

    this.board.innerHTML = this.stages.map(stage => {
      const stageLeads = allFilteredLeads.filter(l => l.stage === stage.id);
      const stageTotalValue = stageLeads.reduce((acc, l) => acc + (l.value || 0), 0);

      return `
        <div class="kanban-column" data-stage="${stage.id}" style="--stage-color: ${stage.color};">
          <div class="kanban-column-header">
            <div class="column-title-row">
              <div class="column-title-box">
                <span class="column-title">${stage.title}</span>
                <span class="column-badge-count">${stageLeads.length}</span>
              </div>
            </div>
            <div class="column-total-val">${window.crmStore.formatCurrency(stageTotalValue)}</div>
          </div>

          <div class="kanban-cards-container" data-stage="${stage.id}">
            ${stageLeads.length === 0 ? `
              <div class="column-empty-placeholder">Nenhum lead nesta etapa</div>
            ` : stageLeads.map(l => this.renderCard(l)).join('')}
          </div>
        </div>
      `;
    }).join('');

    this.setupDragAndDrop();
    if (window.lucide) window.lucide.createIcons();
  }

    const waClean = lead.phone.replace(/\D/g, '');
    const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Olá ${lead.name}, tudo bem? Sou da equipe comercial Conecta Mais.`)}`;

    const plan = window.crmStore.getPlanById(lead.planId);
    const planBadge = plan ? `<div style="font-size: 0.72rem; color: var(--primary-bright); font-weight: 700; display: flex; align-items: center; gap: 4px; margin-bottom: 0.25rem;"><i data-lucide="tv" style="width: 12px; height: 12px;"></i> ${plan.badge} ${plan.name} (${lead.tvsCount || plan.tvs} TVs)</div>` : '';

    const selectedScreens = (lead.selectedScreenIds || []).map(id => window.crmStore.getScreenById(id)).filter(Boolean);
    const screensPillRow = selectedScreens.length > 0 ? `
      <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 0.35rem;">
        ${selectedScreens.slice(0, 3).map(s => `<span style="font-size: 0.68rem; background: rgba(0, 210, 255, 0.08); color: var(--primary-bright); border: 1px solid rgba(0, 210, 255, 0.2); padding: 1px 5px; border-radius: 3px;">📍 ${s.name}</span>`).join('')}
        ${selectedScreens.length > 3 ? `<span style="font-size: 0.68rem; color: var(--text-muted); padding: 1px 4px;">+${selectedScreens.length - 3}</span>` : ''}
      </div>
    ` : '';

    return `
      <div class="kanban-card" draggable="true" data-lead-id="${lead.id}">
        <div class="card-top-row">
          <span class="card-lead-name" onclick="window.leadsManager.openLeadDetails('${lead.id}')" style="cursor: pointer;">${lead.name}</span>
          <span class="card-priority-badge ${lead.priority}">${lead.priority.toUpperCase()}</span>
        </div>

        <div class="card-company-name">
          <i data-lucide="building"></i>
          <span>${lead.company}</span>
        </div>

        ${planBadge}
        ${screensPillRow}

        ${(lead.tags && lead.tags.length > 0) ? `
          <div class="card-tags-row">
            ${lead.tags.slice(0, 3).map(t => `<span class="tag-pill">${t}</span>`).join('')}
          </div>
        ` : ''}

        <div class="card-footer-row">
          <span class="card-value-box">${window.crmStore.formatCurrency(lead.value)}</span>
          <div style="display: flex; align-items: center; gap: 6px;">
            <div class="card-assigned-avatar" title="Responsável: ${user ? user.name : 'N/A'}">
              ${userInitial}
            </div>
            <div class="card-quick-actions">
              <a href="${waUrl}" target="_blank" class="card-btn-action whatsapp" title="WhatsApp Web">
                <i data-lucide="message-circle"></i>
              </a>
              <button class="card-btn-action" title="Detalhes & Timeline" onclick="window.leadsManager.openLeadDetails('${lead.id}')">
                <i data-lucide="external-link"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupDragAndDrop() {
    const cards = this.board.querySelectorAll('.kanban-card');
    const dropZones = this.board.querySelectorAll('.kanban-cards-container');

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        this.draggedLeadId = card.dataset.leadId;
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.draggedLeadId);
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        this.draggedLeadId = null;
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const col = zone.closest('.kanban-column');
        if (col) col.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        const col = zone.closest('.kanban-column');
        if (col) col.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        const col = zone.closest('.kanban-column');
        if (col) col.classList.remove('drag-over');

        const leadId = e.dataTransfer.getData('text/plain') || this.draggedLeadId;
        const targetStage = zone.dataset.stage;

        if (leadId && targetStage) {
          const lead = window.crmStore.getLeadById(leadId);
          if (lead && lead.stage !== targetStage) {
            window.crmStore.updateLeadStage(leadId, targetStage);

            if (targetStage === 'ganho' && window.confetti) {
              window.confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
              });
            }

            window.notificationManager.showToast(
              `Lead "${lead.name}" movido para "${window.crmStore.getStageLabel(targetStage)}"`,
              targetStage === 'ganho' ? 'success' : 'info'
            );
          }
        }
      });
    });
  }
}

window.kanbanManager = new KanbanManager();

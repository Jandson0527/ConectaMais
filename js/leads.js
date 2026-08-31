/**
 * Conecta Mais - Leads Management
 * Search, filters, quick actions, export and CRUD modals for leads.
 */

class LeadsManager {
  constructor() {
    this.modalLead = document.getElementById('modalLead');
    this.modalLeadDetails = document.getElementById('modalLeadDetails');
    this.formLead = document.getElementById('formLead');
    this.formNewActivity = document.getElementById('formNewActivity');
    this.leadsTableBody = document.getElementById('leadsTableBody');
    this.tableEmptyState = document.getElementById('tableEmptyState');

    this.currentDetailedLeadId = null;
    this.tableSortField = 'createdAt';
    this.tableSortAsc = false;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderLeadsTable();

    window.crmStore.subscribe(() => {
      this.renderLeadsTable();
      if (this.currentDetailedLeadId) {
        this.renderLeadDetails(this.currentDetailedLeadId);
      }
    });
  }

  setupEventListeners() {
    // Quick / Toolbar / Dashboard New Lead buttons
    const selectors = ['#btnQuickNewLead', '#btnDashboardNewLead', '#btnTableNewLead', '#btnNewLead', '#btnKanbanNewLead'];
    selectors.forEach(sel => {
      const btn = document.querySelector(sel);
      if (btn) {
        btn.addEventListener('click', () => this.openNewLeadModal());
      }
    });

    // Modal Close
    const closeLead = document.getElementById('modalLeadClose');
    const cancelLead = document.getElementById('modalLeadCancel');
    if (closeLead) closeLead.addEventListener('click', () => this.closeLeadModal());
    if (cancelLead) cancelLead.addEventListener('click', () => this.closeLeadModal());

    const closeDetails = document.getElementById('modalLeadDetailsClose');
    if (closeDetails) closeDetails.addEventListener('click', () => this.closeLeadDetailsModal());

    // Lead Form Submit
    const form = document.getElementById('formLead');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLeadFormSubmit();
      });
    }

    // Lead Details Quick Action: Edit Button
    const btnEditFromDetails = document.getElementById('leadDetailBtnEdit');
    if (btnEditFromDetails) {
      btnEditFromDetails.addEventListener('click', () => {
        if (this.currentDetailedLeadId) {
          const leadId = this.currentDetailedLeadId;
          this.closeLeadDetailsModal();
          this.openEditLeadModal(leadId);
        }
      });
    }

    // Lead Details Quick Action: Schedule Meeting Button
    const btnScheduleFromDetails = document.getElementById('leadDetailBtnSchedule');
    if (btnScheduleFromDetails) {
      btnScheduleFromDetails.addEventListener('click', () => {
        if (this.currentDetailedLeadId) {
          const leadId = this.currentDetailedLeadId;
          this.closeLeadDetailsModal();
          window.calendarManager.openNewMeetingModal(leadId);
        }
      });
    }

    // Lead Details Stage Change Dropdown
    const detailStageSelect = document.getElementById('leadDetailStageSelect');
    if (detailStageSelect) {
      detailStageSelect.addEventListener('change', (e) => {
        if (this.currentDetailedLeadId) {
          const newStage = e.target.value;
          window.crmStore.updateLeadStage(this.currentDetailedLeadId, newStage);
          if (newStage === 'ganho' && window.confetti) {
            window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
          window.notificationManager.showToast(`Etapa atualizada para "${window.crmStore.getStageLabel(newStage)}"`, 'success');
        }
      });
    }

    // New Activity Submit in Lead Details
    if (this.formNewActivity) {
      this.formNewActivity.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleActivitySubmit();
      });
    }

    // Table Filters Listeners
    const searchInput = document.getElementById('tableSearchInput');
    const stageFilter = document.getElementById('tableStageFilter');
    const originFilter = document.getElementById('tableOriginFilter');
    const userFilter = document.getElementById('tableUserFilter');
    const clearBtn = document.getElementById('btnClearTableFilters');

    if (searchInput) searchInput.addEventListener('input', () => this.renderLeadsTable());
    if (stageFilter) stageFilter.addEventListener('change', () => this.renderLeadsTable());
    if (originFilter) originFilter.addEventListener('change', () => this.renderLeadsTable());
    if (userFilter) userFilter.addEventListener('change', () => this.renderLeadsTable());

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (stageFilter) stageFilter.value = 'all';
        if (originFilter) originFilter.value = 'all';
        if (userFilter) userFilter.value = 'all';
        this.renderLeadsTable();
      });
    }

    // Table Column Sorting
    const sortHeaders = document.querySelectorAll('#leadsTable th[data-sort]');
    sortHeaders.forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort;
        if (this.tableSortField === field) {
          this.tableSortAsc = !this.tableSortAsc;
        } else {
          this.tableSortField = field;
          this.tableSortAsc = true;
        }
        this.renderLeadsTable();
      });
    // Plan Selection Change Handler
    const planSelect = document.getElementById('leadPlan');
    const cycleSelect = document.getElementById('leadBillingCycle');
    if (planSelect) {
      planSelect.addEventListener('change', () => this.handlePlanChange());
    }
    if (cycleSelect) {
      cycleSelect.addEventListener('change', () => this.handlePlanChange());
    }

    // Select All Screens Button in Lead Form
    const btnSelectAllScreens = document.getElementById('btnSelectAllScreens');
    if (btnSelectAllScreens) {
      btnSelectAllScreens.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectAllScreens();
      });
    }
  }

  handlePlanChange() {
    const planSelect = document.getElementById('leadPlan');
    const cycleSelect = document.getElementById('leadBillingCycle');
    const valueInput = document.getElementById('leadValue');
    const tvsInput = document.getElementById('leadTvsCount');

    if (!planSelect) return;
    const planId = planSelect.value;
    const plan = window.crmStore.getPlanById(planId);
    if (!plan) return;

    const maxTvs = plan.tvs || 1;
    if (tvsInput) tvsInput.value = maxTvs;

    const cycle = cycleSelect ? cycleSelect.value : 'monthly';
    let computed = plan.monthlyPrice || 0;

    if (plan.isCampaign) {
      computed = plan.fixedPrice || 0;
      if (cycleSelect) cycleSelect.value = 'campaign';
    } else if (cycle === 'quarterly') {
      computed = plan.quarterlyPrice || 0;
    } else if (cycle === 'campaign') {
      if (cycleSelect) cycleSelect.value = 'monthly';
      computed = plan.monthlyPrice || 0;
    } else {
      computed = plan.monthlyPrice || 0;
    }

    const isSeller = window.crmStore.isSeller();
    if (valueInput) {
      valueInput.value = computed;
      if (isSeller) {
        valueInput.readOnly = true;
        valueInput.title = 'O valor do plano é travado conforme a tabela oficial da Conecta Mais.';
      } else {
        valueInput.readOnly = false;
      }
    }

    // Adjust selected screens to plan quota
    this.adjustScreensToQuota(maxTvs);
  }

  renderScreensSelector(selectedScreenIds = [], maxQuota = 1) {
    const container = document.getElementById('leadScreensChecklist');
    if (!container) return;

    const screens = window.crmStore.getScreens();

    container.innerHTML = screens.map(s => {
      const isChecked = selectedScreenIds.includes(s.id);
      return `
        <label class="screen-checkbox-card ${isChecked ? 'selected' : ''}" data-screen-id="${s.id}">
          <input type="checkbox" class="screen-cb-input" value="${s.id}" ${isChecked ? 'checked' : ''}>
          <div class="screen-cb-info">
            <span class="screen-cb-name">📍 ${s.name}</span>
            <span class="screen-cb-segment">${s.segment}</span>
            <span class="screen-cb-address">${s.address} (${s.neighborhood || ''})</span>
          </div>
        </label>
      `;
    }).join('');

    // Attach listeners
    const cards = container.querySelectorAll('.screen-checkbox-card');
    cards.forEach(card => {
      const cb = card.querySelector('.screen-cb-input');
      cb.addEventListener('change', () => {
        const checkedCount = container.querySelectorAll('.screen-cb-input:checked').length;
        const curPlanTvs = Number(document.getElementById('leadTvsCount')?.value) || maxQuota;

        if (cb.checked && checkedCount > curPlanTvs) {
          cb.checked = false;
          if (window.notificationsManager) {
            window.notificationsManager.showToast(
              'Limite de Telas do Plano',
              `O plano selecionado permite escolher no máximo ${curPlanTvs} ${curPlanTvs === 1 ? 'local' : 'locais'}. Para adicionar mais locais, selecione um plano superior.`,
              'warning'
            );
          }
          return;
        }

        if (cb.checked) card.classList.add('selected');
        else card.classList.remove('selected');

        this.updateScreensQuotaBadge(curPlanTvs);
      });
    });

    this.updateScreensQuotaBadge(maxQuota);
  }

  updateScreensQuotaBadge(maxQuota) {
    const badge = document.getElementById('leadScreensQuotaBadge');
    if (!badge) return;

    const checkedBoxes = document.querySelectorAll('#leadScreensChecklist .screen-cb-input:checked');
    const checkedCount = checkedBoxes.length;

    badge.textContent = `Selecionados: ${checkedCount} de ${maxQuota} permitido(s)`;
    badge.className = 'screens-quota-badge';

    if (checkedCount === maxQuota) {
      badge.classList.add('exact');
    } else if (checkedCount > maxQuota) {
      badge.classList.add('exceeded');
    }
  }

  adjustScreensToQuota(maxQuota) {
    const container = document.getElementById('leadScreensChecklist');
    if (!container) return;

    const checkedBoxes = Array.from(container.querySelectorAll('.screen-cb-input:checked'));
    if (checkedBoxes.length > maxQuota) {
      // Uncheck excess
      checkedBoxes.slice(maxQuota).forEach(cb => {
        cb.checked = false;
        cb.closest('.screen-checkbox-card')?.classList.remove('selected');
      });
    }

    this.updateScreensQuotaBadge(maxQuota);
  }

  selectAllScreens() {
    const container = document.getElementById('leadScreensChecklist');
    const tvsInput = document.getElementById('leadTvsCount');
    const planSelect = document.getElementById('leadPlan');
    if (!container) return;

    const screens = window.crmStore.getScreens();
    if (planSelect && planSelect.value !== 'plan-conecta' && planSelect.value !== 'plan-avulso-15' && planSelect.value !== 'plan-avulso-30') {
      planSelect.value = 'plan-conecta';
      this.handlePlanChange();
    }

    const maxQuota = Number(tvsInput?.value) || screens.length;
    const cards = container.querySelectorAll('.screen-checkbox-card');
    cards.forEach((card, idx) => {
      const cb = card.querySelector('.screen-cb-input');
      if (idx < maxQuota) {
        cb.checked = true;
        card.classList.add('selected');
      } else {
        cb.checked = false;
        card.classList.remove('selected');
      }
    });

    this.updateScreensQuotaBadge(maxQuota);
  }

  openNewLeadModal(prefillPlanId = null) {
    if (!this.formLead) this.formLead = document.getElementById('formLead');
    if (!this.modalLead) this.modalLead = document.getElementById('modalLead');
    if (!this.formLead) return;
    
    this.formLead.reset();
    document.getElementById('leadFormId').value = '';

    const curUser = window.crmStore.getCurrentUser();
    const isSeller = curUser?.role === 'vendedor';

    const titleEl = document.getElementById('modalLeadTitle');
    if (titleEl) {
      titleEl.textContent = isSeller ? 'Cadastrar Nova Venda (Aguardando Aprovação)' : 'Cadastrar Novo Cliente / Anunciante';
    }
    
    // Set default assigned to current user
    const assignedSelect = document.getElementById('leadAssignedTo');
    if (assignedSelect) {
      if (!assignedSelect.options || assignedSelect.options.length === 0) {
        if (window.authManager) window.authManager.populateUserSelects();
      }
      if (curUser) assignedSelect.value = curUser.id;
    }

    // Set default plan to Plano Conecta (5 TVs) or prefilled plan
    const planSelect = document.getElementById('leadPlan');
    if (planSelect) planSelect.value = prefillPlanId || (isSeller ? 'plan-presenca' : 'plan-conecta');
    const cycleSelect = document.getElementById('leadBillingCycle');
    if (cycleSelect) cycleSelect.value = 'monthly';
    const mediaSelect = document.getElementById('leadMediaFormat');
    if (mediaSelect) mediaSelect.value = 'foto';
    const stageSelect = document.getElementById('leadStage');
    if (stageSelect) stageSelect.value = isSeller ? 'novo' : 'ganho';

    this.handlePlanChange();

    // Select default screens based on plan
    const defaultQuota = isSeller ? 1 : 5;
    const initialScreens = window.crmStore.getScreens().slice(0, defaultQuota).map(s => s.id);
    this.renderScreensSelector(initialScreens, defaultQuota);

    if (this.modalLead) this.modalLead.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  openNewLeadModalWithPlan(planId) {
    this.openNewLeadModal(planId);
  }

  openEditLeadModal(leadId) {
    if (!this.formLead) this.formLead = document.getElementById('formLead');
    if (!this.modalLead) this.modalLead = document.getElementById('modalLead');
    const lead = window.crmStore.getLeadById(leadId);
    if (!lead || !this.formLead) return;

    document.getElementById('leadFormId').value = lead.id;
    document.getElementById('leadName').value = lead.name;
    document.getElementById('leadCompany').value = lead.company;
    const addrInput = document.getElementById('leadCompanyAddress');
    if (addrInput) addrInput.value = lead.companyAddress || '';
    document.getElementById('leadEmail').value = lead.email;
    document.getElementById('leadPhone').value = lead.phone;
    document.getElementById('leadRole').value = lead.role || '';
    
    const planSelect = document.getElementById('leadPlan');
    if (planSelect) planSelect.value = lead.planId || 'plan-presenca';
    const cycleSelect = document.getElementById('leadBillingCycle');
    if (cycleSelect) cycleSelect.value = lead.billingCycle || 'monthly';
    const mediaSelect = document.getElementById('leadMediaFormat');
    if (mediaSelect) mediaSelect.value = lead.mediaFormat || 'foto';
    const tvsInput = document.getElementById('leadTvsCount');
    if (tvsInput) tvsInput.value = lead.tvsCount || 1;

    document.getElementById('leadValue').value = lead.value || '';
    document.getElementById('leadPriority').value = lead.priority || 'media';
    document.getElementById('leadStage').value = lead.stage || 'novo';
    document.getElementById('leadOrigin').value = lead.origin || 'WhatsApp Direto';
    document.getElementById('leadAssignedTo').value = lead.assignedTo || '';
    document.getElementById('leadTags').value = (lead.tags || []).join(', ');
    document.getElementById('leadNotes').value = lead.notes || '';

    const plan = window.crmStore.getPlanById(lead.planId);
    const maxQuota = plan ? plan.tvs : (lead.tvsCount || 1);
    this.renderScreensSelector(lead.selectedScreenIds || [], maxQuota);

    document.getElementById('modalLeadTitle').textContent = 'Editar Informações do Cliente';
    if (this.modalLead) this.modalLead.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeLeadModal() {
    if (!this.modalLead) this.modalLead = document.getElementById('modalLead');
    if (this.modalLead) this.modalLead.classList.remove('active');
  }

  handleLeadFormSubmit() {
    const id = document.getElementById('leadFormId')?.value;
    const name = document.getElementById('leadName')?.value || 'Novo Cliente';
    const company = document.getElementById('leadCompany')?.value || name;
    const companyAddress = document.getElementById('leadCompanyAddress')?.value || '';
    const email = document.getElementById('leadEmail')?.value || '';
    const phone = document.getElementById('leadPhone')?.value || '';
    const role = document.getElementById('leadRole')?.value || '';
    const planId = document.getElementById('leadPlan')?.value || 'plan-conecta';
    const billingCycle = document.getElementById('leadBillingCycle')?.value || 'monthly';
    const mediaFormat = document.getElementById('leadMediaFormat')?.value || 'foto';
    const tvsCount = document.getElementById('leadTvsCount')?.value || 5;
    const value = document.getElementById('leadValue')?.value || 299.90;
    const priority = document.getElementById('leadPriority')?.value || 'alta';
    const stage = document.getElementById('leadStage')?.value || 'ganho';
    const origin = document.getElementById('leadOrigin')?.value || 'WhatsApp Direto';
    const assignedTo = document.getElementById('leadAssignedTo')?.value || window.crmStore.getCurrentUser()?.id;
    const tags = document.getElementById('leadTags')?.value || '';
    const notes = document.getElementById('leadNotes')?.value || '';

    // Selected Screens
    const selectedScreenIds = Array.from(document.querySelectorAll('#leadScreensChecklist .screen-cb-input:checked')).map(cb => cb.value);

    if (id) {
      window.crmStore.updateLead(id, { name, company, companyAddress, email, phone, role, planId, billingCycle, mediaFormat, tvsCount, selectedScreenIds, value, priority, stage, origin, assignedTo, tags, notes });
      if (window.notificationsManager) window.notificationsManager.showToast('Sucesso', `Cliente "${name}" atualizado!`, 'success');
    } else {
      const newLead = window.crmStore.addLead({ name, company, companyAddress, email, phone, role, planId, billingCycle, mediaFormat, tvsCount, selectedScreenIds, value, priority, stage, origin, assignedTo, tags, notes });
      const isSeller = window.crmStore.isSeller(assignedTo);
      if (window.notificationsManager) {
        if (isSeller) {
          const comm = window.crmStore.formatCurrency(newLead.value * 0.10);
          window.notificationsManager.showToast(
            'Venda Registrada!',
            `Venda de "${company || name}" enviada para aprovação dos sócios! Sua comissão estimada: ${comm} (10%).`,
            'info'
          );
        } else if (stage === 'ganho') {
          window.notificationsManager.showToast('Cliente Ativado!', `Cliente "${company || name}" ativado e faturamento de ${window.crmStore.formatCurrency(newLead.value)} somado no Caixa da empresa!`, 'success');
        } else {
          window.notificationsManager.showToast('Sucesso', `Cliente "${company || name}" cadastrado com sucesso!`, 'success');
        }
      }
    }

    this.closeLeadModal();
  }

  openLeadDetails(leadId) {
    this.currentDetailedLeadId = leadId;
    this.renderLeadDetails(leadId);
    if (this.modalLeadDetails) this.modalLeadDetails.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeLeadDetailsModal() {
    this.currentDetailedLeadId = null;
    if (this.modalLeadDetails) this.modalLeadDetails.classList.remove('active');
  }

  renderLeadDetails(leadId) {
    const lead = window.crmStore.getLeadById(leadId);
    if (!lead) return;

    const user = window.crmStore.getUserById(lead.assignedTo);
    const meetings = window.crmStore.getMeetingsForLead(leadId);
    const activities = window.crmStore.getActivitiesForLead(leadId);

    // Header info
    const initials = lead.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    document.getElementById('leadDetailAvatar').textContent = initials;
    document.getElementById('leadDetailName').textContent = lead.name;
    const plan = window.crmStore.getPlanById(lead.planId);
    const planText = plan ? `${plan.badge} ${plan.name} (${lead.tvsCount || plan.tvs} TVs • ${lead.billingCycle === 'quarterly' ? 'Trimestral' : (lead.billingCycle === 'campaign' ? 'Campanha' : 'Mensal')})` : 'Plano Personalizado';
    document.getElementById('leadDetailCompany').innerHTML = `
      <span>${lead.company || lead.name}</span>
      <span style="display: inline-block; margin-left: 6px; font-size: 0.78rem; padding: 2px 8px; background: rgba(0, 210, 255, 0.15); color: var(--primary-bright); border-radius: 4px; border: 1px solid rgba(0, 210, 255, 0.3); font-weight: 600;">${planText}</span>
    `;

    // Links & Actions
    const waClean = lead.phone.replace(/\D/g, '');
    const waLink = document.getElementById('leadDetailWhatsAppLink');
    if (waLink) {
      const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
      const msg = encodeURIComponent(`Olá ${lead.name}, tudo bem? Sou da equipe Conecta Mais e gostaria de falar sobre o projeto de marketing indoor da ${lead.company}.`);
      waLink.href = `https://wa.me/${waNumber}?text=${msg}`;
    }

    const emailLink = document.getElementById('leadDetailEmailLink');
    if (emailLink) {
      emailLink.href = `mailto:${lead.email}?subject=Acompanhamento Conecta Mais - ${encodeURIComponent(lead.company)}`;
    }

    // Meta box
    const stageBadge = document.getElementById('leadDetailStageBadge');
    stageBadge.className = `meta-value badge-stage stage-${lead.stage}`;
    stageBadge.textContent = window.crmStore.getStageLabel(lead.stage);

    document.getElementById('leadDetailValue').textContent = window.crmStore.formatCurrency(lead.value);
    document.getElementById('leadDetailPriority').innerHTML = `<span class="priority-${lead.priority}">${lead.priority.toUpperCase()}</span>`;
    document.getElementById('leadDetailOrigin').textContent = lead.origin;
    document.getElementById('leadDetailAssigned').textContent = user ? user.name : 'Não atribuído';
    document.getElementById('leadDetailPhone').textContent = lead.phone;
    document.getElementById('leadDetailEmail').textContent = lead.email;

    const mediaLabel = lead.mediaFormat === 'video' ? '🎥 Vídeo Comercial / Motion' : (lead.mediaFormat === 'ambos' ? '🔄 Foto + Vídeo' : '📸 Foto / Encarte Estático');
    const mediaEl = document.getElementById('leadDetailMediaFormat');
    if (mediaEl) mediaEl.textContent = mediaLabel;

    const addressEl = document.getElementById('leadDetailAddress');
    if (addressEl) addressEl.textContent = lead.companyAddress || 'Endereço não cadastrado';

    // Stage dropdown sync
    const stageSel = document.getElementById('leadDetailStageSelect');
    if (stageSel) stageSel.value = lead.stage;

    // Tags
    const tagsContainer = document.getElementById('leadDetailTags');
    if (tagsContainer) {
      tagsContainer.innerHTML = (lead.tags && lead.tags.length > 0)
        ? lead.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')
        : '<span style="font-size: 0.75rem; color: var(--text-muted);">Nenhuma tag</span>';
    }

    // Screens / Broadcast Locations
    const screensContainer = document.getElementById('leadDetailScreensList');
    if (screensContainer) {
      const selectedIds = lead.selectedScreenIds || [];
      const screens = selectedIds.map(id => window.crmStore.getScreenById(id)).filter(Boolean);
      
      if (screens.length === 0) {
        screensContainer.innerHTML = `
          <div style="font-size: 0.78rem; color: var(--text-muted); padding: 0.25rem 0;">
            Nenhum ponto físico específico vinculado a este contrato.
          </div>
        `;
      } else {
        screensContainer.innerHTML = screens.map(s => `
          <div style="display: flex; align-items: flex-start; gap: 6px; padding: 6px 8px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 6px; margin-bottom: 4px;">
            <i data-lucide="map-pin" style="width: 14px; height: 14px; color: var(--primary-bright); flex-shrink: 0; margin-top: 2px;"></i>
            <div>
              <div style="font-weight: 700; font-size: 0.8rem; color: var(--text-primary);">${s.name} <span style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 600;">(${s.segment})</span></div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${s.address} - ${s.neighborhood || ''}</div>
            </div>
          </div>
        `).join('');
      }
    }

    // Linked Meetings
    const meetingsContainer = document.getElementById('leadMeetingsList');
    if (meetingsContainer) {
      if (meetings.length === 0) {
        meetingsContainer.innerHTML = `
          <div style="font-size: 0.8rem; color: var(--text-muted); padding: 0.5rem 0;">
            Nenhuma reunião agendada para este lead.
          </div>
        `;
      } else {
        meetingsContainer.innerHTML = meetings.map(m => `
          <div class="dash-meeting-item" style="padding: 0.5rem 0.75rem;">
            <div class="meeting-item-left">
              <div style="font-size: 0.85rem; font-weight: 600;">
                <div>${m.title}</div>
                <span style="font-size: 0.72rem; color: var(--primary);">
                  📅 ${window.crmStore.formatDisplayDate(m.date)} às ${m.time} (${m.duration} min)
                </span>
              </div>
            </div>
            <div>
              ${m.link ? `<a href="${m.link}" target="_blank" class="btn btn-secondary sm" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;"><i data-lucide="video"></i> Acessar</a>` : ''}
            </div>
          </div>
        `).join('');
      }
    }

    // Timeline Activities
    const timelineContainer = document.getElementById('leadTimelineStream');
    if (timelineContainer) {
      if (activities.length === 0) {
        timelineContainer.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-muted);">Nenhuma atividade registrada ainda.</div>';
      } else {
        timelineContainer.innerHTML = activities.map(act => {
          const actUser = window.crmStore.getUserById(act.userId);
          const actDate = new Date(act.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

          let typeIcon = 'file-text';
          if (act.type === 'call') typeIcon = 'phone-call';
          if (act.type === 'whatsapp') typeIcon = 'message-circle';
          if (act.type === 'proposal') typeIcon = 'file-check';
          if (act.type === 'stage_change') typeIcon = 'git-commit';

          return `
            <div class="timeline-entry ${act.type}">
              <div class="timeline-entry-header">
                <div class="timeline-title">
                  <i data-lucide="${typeIcon}" style="width: 14px; height: 14px;"></i>
                  <span>${act.title}</span>
                </div>
                <span class="timeline-time">${actDate}</span>
              </div>
              <div class="timeline-desc">${act.description}</div>
              <div class="timeline-author">Registrado por: ${actUser ? actUser.name : 'Sistema'}</div>
            </div>
          `;
        }).join('');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  handleActivitySubmit() {
    if (!this.currentDetailedLeadId) return;

    const type = document.getElementById('activityTypeSelect').value;
    const title = document.getElementById('activityTitleInput').value;
    const desc = document.getElementById('activityDescInput').value;

    window.crmStore.addActivity({
      leadId: this.currentDetailedLeadId,
      type,
      title,
      description: desc
    });

    document.getElementById('activityTitleInput').value = '';
    document.getElementById('activityDescInput').value = '';
    window.notificationManager.showToast('Atividade registrada na linha do tempo!', 'success');
  }

  renderLeadsTable() {
    if (!this.leadsTableBody) return;

    let leads = [...window.crmStore.getLeads()];
    const searchVal = (document.getElementById('tableSearchInput')?.value || '').toLowerCase().trim();
    const stageVal = document.getElementById('tableStageFilter')?.value || 'all';
    const originVal = document.getElementById('tableOriginFilter')?.value || 'all';
    const userVal = document.getElementById('tableUserFilter')?.value || 'all';

    // Filters
    if (searchVal) {
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(searchVal) ||
        l.company.toLowerCase().includes(searchVal) ||
        l.email.toLowerCase().includes(searchVal) ||
        l.phone.includes(searchVal) ||
        (l.role && l.role.toLowerCase().includes(searchVal)) ||
        (l.tags && l.tags.some(t => t.toLowerCase().includes(searchVal)))
      );
    }

    if (stageVal !== 'all') {
      leads = leads.filter(l => l.stage === stageVal);
    }

    if (originVal !== 'all') {
      leads = leads.filter(l => l.origin === originVal);
    }

    if (userVal !== 'all') {
      leads = leads.filter(l => l.assignedTo === userVal);
    }

    // Sort
    leads.sort((a, b) => {
      let valA = a[this.tableSortField];
      let valB = b[this.tableSortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.tableSortAsc ? -1 : 1;
      if (valA > valB) return this.tableSortAsc ? 1 : -1;
      return 0;
    });

    // Update Counts & Sums
    const resultsCount = document.getElementById('tableResultsCount');
    const totalSumEl = document.getElementById('tableTotalValueSum');
    const totalValue = leads.reduce((acc, l) => acc + (l.value || 0), 0);

    if (resultsCount) resultsCount.textContent = `Mostrando ${leads.length} leads`;
    if (totalSumEl) totalSumEl.textContent = `Total em leads: ${window.crmStore.formatCurrency(totalValue)}`;

    // Update Sidebar & Kanban Badges
    const allLeads = window.crmStore.getLeads();
    const badgeLeads = document.getElementById('badgeLeadsCount');
    const badgeKanban = document.getElementById('badgeKanbanCount');
    if (badgeLeads) badgeLeads.textContent = allLeads.length;
    if (badgeKanban) badgeKanban.textContent = allLeads.filter(l => l.stage !== 'perdido').length;

    if (leads.length === 0) {
      this.leadsTableBody.innerHTML = '';
      if (this.tableEmptyState) this.tableEmptyState.style.display = 'flex';
      return;
    }

    if (this.tableEmptyState) this.tableEmptyState.style.display = 'none';

    this.leadsTableBody.innerHTML = leads.map(l => {
      const user = window.crmStore.getUserById(l.assignedTo);
      const meetings = window.crmStore.getMeetingsForLead(l.id).filter(m => m.status === 'scheduled');
      const nextMeeting = meetings[0];
      const initials = l.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

      const waClean = l.phone.replace(/\D/g, '');
      const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Olá ${l.name}, tudo bem? Sou da equipe comercial Conecta Mais.`)}`;

      const plan = window.crmStore.getPlanById(l.planId);
      const planBadge = plan ? `<span style="font-size: 0.72rem; color: var(--primary-bright); font-weight: 600;">• ${plan.badge} ${plan.name} (${l.tvsCount || plan.tvs} TVs)</span>` : '';
      const mediaIcon = l.mediaFormat === 'video' ? '🎥 Vídeo' : (l.mediaFormat === 'ambos' ? '🔄 Foto+Vídeo' : '📸 Foto');

      return `
        <tr>
          <td>
            <div class="lead-name-cell" style="cursor: pointer;" onclick="window.leadsManager.openLeadDetails('${l.id}')">
              <div class="lead-avatar-sm">${initials}</div>
              <div>
                <div class="lead-name-title">${l.name} <span style="font-size: 0.7rem; padding: 1px 6px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 4px; color: var(--accent-gold); font-weight: 600;">${mediaIcon}</span></div>
                <div class="lead-company-sub">${l.company} ${planBadge}</div>
                ${l.companyAddress ? `<div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 1px;">📍 ${l.companyAddress}</div>` : ''}
              </div>
            </div>
          </td>
          <td>
            <div class="contact-cell">
              <div class="contact-phone-row">
                <a href="${waUrl}" target="_blank" class="btn-icon-wa" title="Conversar no WhatsApp">
                  <i data-lucide="message-circle" style="width: 14px; height: 14px;"></i>
                </a>
                <span>${l.phone}</span>
              </div>
              <span class="text-muted" style="font-size: 0.75rem;">${l.email}</span>
            </div>
          </td>
          <td>
            <span class="badge-stage stage-${l.stage}">${window.crmStore.getStageLabel(l.stage)}</span>
          </td>
          <td class="font-bold text-success">
            ${window.crmStore.formatCurrency(l.value)}
          </td>
          <td>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${l.origin}</span>
          </td>
          <td>
            <span style="font-size: 0.8rem;">${user ? user.name : 'Não atribuído'}</span>
          </td>
          <td>
            ${nextMeeting ? `
              <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
                ${window.crmStore.formatDisplayDate(nextMeeting.date)} ${nextMeeting.time}
              </span>
            ` : '<span style="font-size: 0.75rem; color: var(--text-muted);">Sem agendamento</span>'}
          </td>
          <td class="text-right">
            <div class="table-actions">
              <button class="btn-icon" title="Ver Detalhes & Histórico" onclick="window.leadsManager.openLeadDetails('${l.id}')">
                <i data-lucide="eye"></i>
              </button>
              <button class="btn-icon" title="Editar Lead" onclick="window.leadsManager.openEditLeadModal('${l.id}')">
                <i data-lucide="edit-3"></i>
              </button>
              <button class="btn-icon" title="Excluir Lead" onclick="window.leadsManager.handleDeleteLead('${l.id}', '${l.name}')" style="color: var(--danger);">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  handleDeleteLead(id, name) {
    if (confirm(`Tem certeza que deseja excluir o lead "${name}" do CRM? Todos os dados vinculados serão removidos.`)) {
      window.crmStore.deleteLead(id);
      window.notificationManager.showToast(`Lead "${name}" removido com sucesso.`, 'info');
    }
  }
}

window.leadsManager = new LeadsManager();

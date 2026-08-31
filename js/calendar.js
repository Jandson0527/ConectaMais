/**
 * Conecta Mais - Calendar & Scheduler
 * Interactive calendar, time slots, Google Meet integration & .ics export.
 */

class CalendarManager {
  constructor() {
    this.currentDate = new Date();
    this.activeView = 'month'; // 'month', 'week', 'list'

    this.gridContainer = document.getElementById('calendarGridContainer');
    this.upcomingList = document.getElementById('calendarUpcomingList');
    this.sideCount = document.getElementById('calendarSideCount');
    this.currentTitle = document.getElementById('calCurrentTitle');
    this.modalMeeting = document.getElementById('modalMeeting');
    this.formMeeting = document.getElementById('formMeeting');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();

    window.crmStore.subscribe(() => {
      this.render();
      this.populateLeadSelect();
    });
  }

  setupEventListeners() {
    // Navigation controls
    const btnPrev = document.getElementById('btnCalPrev');
    const btnNext = document.getElementById('btnCalNext');
    const btnToday = document.getElementById('btnCalToday');

    if (btnPrev) btnPrev.addEventListener('click', () => this.navigateDate(-1));
    if (btnNext) btnNext.addEventListener('click', () => this.navigateDate(1));
    if (btnToday) btnToday.addEventListener('click', () => {
      this.currentDate = new Date();
      this.render();
    });

    // View toggles
    const btnMonth = document.getElementById('btnCalViewMonth');
    const btnWeek = document.getElementById('btnCalViewWeek');
    const btnList = document.getElementById('btnCalViewList');

    if (btnMonth) btnMonth.addEventListener('click', () => this.switchView('month'));
    if (btnWeek) btnWeek.addEventListener('click', () => this.switchView('week'));
    if (btnList) btnList.addEventListener('click', () => this.switchView('list'));

    // Open Modal buttons
    const btnQuickMeeting = document.getElementById('btnQuickMeeting');
    const btnCalNewMeeting = document.getElementById('btnCalendarNewMeeting');

    if (btnQuickMeeting) btnQuickMeeting.addEventListener('click', () => this.openNewMeetingModal());
    if (btnCalNewMeeting) btnCalNewMeeting.addEventListener('click', () => this.openNewMeetingModal());

    // Modal Close
    const closeBtn = document.getElementById('modalMeetingClose');
    const cancelBtn = document.getElementById('modalMeetingCancel');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeMeetingModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeMeetingModal());

    // Meet Link Generator
    const btnGenMeet = document.getElementById('btnGenMeetLink');
    if (btnGenMeet) {
      btnGenMeet.addEventListener('click', () => {
        const randStr = () => Math.random().toString(36).substring(2, 5);
        const link = `https://meet.google.com/${randStr()}-${randStr()}-${randStr()}`;
        document.getElementById('meetingLink').value = link;
        window.notificationManager.showToast('Link do Google Meet gerado!', 'info');
      });
    }

    // Form Submit
    if (this.formMeeting) {
      this.formMeeting.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleMeetingFormSubmit();
      });
    }
  }

  navigateDate(direction) {
    if (this.activeView === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    } else if (this.activeView === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    }
    this.render();
  }

  switchView(viewName) {
    this.activeView = viewName;
    ['btnCalViewMonth', 'btnCalViewWeek', 'btnCalViewList'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });

    if (viewName === 'month') document.getElementById('btnCalViewMonth')?.classList.add('active');
    if (viewName === 'week') document.getElementById('btnCalViewWeek')?.classList.add('active');
    if (viewName === 'list') document.getElementById('btnCalViewList')?.classList.add('active');

    this.render();
  }

  render() {
    this.updateHeaderTitle();
    this.renderUpcomingSidebar();

    if (this.activeView === 'month') {
      this.renderMonthGrid();
    } else if (this.activeView === 'week') {
      this.renderWeekGrid();
    } else {
      this.renderListView();
    }

    // Update meeting counter badge in sidebar
    const allMeetings = window.crmStore.getMeetings().filter(m => m.status === 'scheduled');
    const badgeEl = document.getElementById('badgeMeetingsCount');
    if (badgeEl) badgeEl.textContent = allMeetings.length;

    if (window.lucide) window.lucide.createIcons();
  }

  updateHeaderTitle() {
    if (!this.currentTitle) return;
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    this.currentTitle.textContent = `${months[this.currentDate.getMonth()]} de ${this.currentDate.getFullYear()}`;
  }

  renderMonthGrid() {
    if (!this.gridContainer) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Domingo
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const meetings = window.crmStore.getMeetings();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    let html = `
      <div class="calendar-month-grid">
        <div class="cal-weekday-header">Dom</div>
        <div class="cal-weekday-header">Seg</div>
        <div class="cal-weekday-header">Ter</div>
        <div class="cal-weekday-header">Qua</div>
        <div class="cal-weekday-header">Qui</div>
        <div class="cal-weekday-header">Sex</div>
        <div class="cal-weekday-header">Sáb</div>
    `;

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      html += `<div class="cal-day-cell other-month"><div class="day-header-row"><span class="day-number">${dayNum}</span></div></div>`;
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayMeetings = meetings.filter(m => m.date === dateStr);
      const isToday = isCurrentMonth && today.getDate() === day;

      html += `
        <div class="cal-day-cell ${isToday ? 'today' : ''}" onclick="window.calendarManager.handleDayCellClick('${dateStr}')">
          <div class="day-header-row">
            <span class="day-number">${day}</span>
            ${dayMeetings.length > 0 ? `<span style="font-size: 0.68rem; font-weight: 700; color: var(--primary);">${dayMeetings.length}</span>` : ''}
          </div>
          <div class="day-meetings-container">
            ${dayMeetings.map(m => {
              const lead = window.crmStore.getLeadById(m.leadId);
              return `
                <div class="meeting-chip ${m.status}" title="${m.title} (${m.time}) - Lead: ${lead ? lead.name : 'N/A'}" onclick="event.stopPropagation(); window.calendarManager.openEditMeetingModal('${m.id}')">
                  <span>${m.time}</span> ${m.title}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Next month padding days to complete grid (multiples of 7)
    const totalCellsSoFar = firstDayIndex + totalDays;
    const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
    for (let j = 1; j <= remainingCells; j++) {
      html += `<div class="cal-day-cell other-month"><div class="day-header-row"><span class="day-number">${j}</span></div></div>`;
    }

    html += '</div>';
    this.gridContainer.innerHTML = html;
  }

  renderWeekGrid() {
    if (!this.gridContainer) return;
    const meetings = window.crmStore.getMeetings();

    // Calculate current week start (Sunday)
    const current = new Date(this.currentDate);
    const dayOfWeek = current.getDay();
    const sunday = new Date(current.setDate(current.getDate() - dayOfWeek));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      weekDays.push(d);
    }

    let html = `
      <div class="calendar-month-grid">
        ${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((name, idx) => {
          const d = weekDays[idx];
          return `<div class="cal-weekday-header">${name} (${d.getDate()}/${d.getMonth() + 1})</div>`;
        }).join('')}
    `;

    weekDays.forEach(d => {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayMeetings = meetings.filter(m => m.date === dateStr);
      const isToday = new Date().toDateString() === d.toDateString();

      html += `
        <div class="cal-day-cell ${isToday ? 'today' : ''}" style="min-height: 220px;" onclick="window.calendarManager.handleDayCellClick('${dateStr}')">
          <div class="day-header-row">
            <span class="day-number">${d.getDate()}</span>
          </div>
          <div class="day-meetings-container" style="max-height: 180px;">
            ${dayMeetings.map(m => {
              const lead = window.crmStore.getLeadById(m.leadId);
              return `
                <div class="meeting-chip ${m.status}" title="${m.title}" onclick="event.stopPropagation(); window.calendarManager.openEditMeetingModal('${m.id}')" style="white-space: normal; padding: 0.35rem;">
                  <div style="font-weight: 700;">${m.time} - ${m.title}</div>
                  <div style="font-size: 0.68rem; opacity: 0.85;">${lead ? lead.name : ''}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    html += '</div>';
    this.gridContainer.innerHTML = html;
  }

  renderListView() {
    if (!this.gridContainer) return;
    const meetings = [...window.crmStore.getMeetings()].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    if (meetings.length === 0) {
      this.gridContainer.innerHTML = `
        <div class="table-empty-state">
          <div class="empty-icon"><i data-lucide="calendar-x"></i></div>
          <h3>Nenhuma reunião cadastrada</h3>
          <p>Clique no botão acima para agendar um compromisso com um lead.</p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = `
      <div class="calendar-list-view">
        ${meetings.map(m => {
          const lead = window.crmStore.getLeadById(m.leadId);
          const statusLabels = { scheduled: 'Agendada', completed: 'Realizada', cancelled: 'Cancelada' };

          return `
            <div class="calendar-list-item">
              <div style="display: flex; align-items: flex-start; gap: 1rem;">
                <div class="meeting-date-box">
                  <span class="day">${m.date.split('-')[2]}</span>
                  <span class="time">${m.time}</span>
                </div>
                <div>
                  <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff;">${m.title}</h4>
                  <div style="font-size: 0.825rem; color: var(--primary-bright); margin-top: 2px;">
                    🏢 <strong>${m.companyName || (lead ? lead.company : 'Empresa')}</strong>
                    ${m.contactPerson ? ` • 👤 Dono/Contato: <strong>${m.contactPerson}</strong>` : ''}
                    ${m.phone ? ` • 📞 ${m.phone}` : ''}
                  </div>
                  ${m.address ? `
                    <div style="font-size: 0.775rem; color: var(--text-secondary); margin-top: 3px;">
                      📍 <em>${m.address}</em>
                    </div>
                  ` : ''}
                  <div style="display: flex; align-items: center; gap: 6px; margin-top: 5px; flex-wrap: wrap;">
                    <span style="font-size: 0.725rem; color: var(--text-muted);">Sócios participantes:</span>
                    ${(m.participants || [m.assignedPartnerId]).map(pid => {
                      const pUser = window.crmStore.getUserById(pid);
                      return pUser ? `<span class="badge-role" style="font-size: 0.68rem; padding: 1px 6px; background: rgba(0, 210, 255, 0.15); color: #00d2ff; border-radius: 4px;">${pUser.name}</span>` : '';
                    }).join('')}
                    ${m.scheduledBy ? `
                      <span style="font-size: 0.7rem; color: var(--text-muted); margin-left: 6px;">(Marcada por: <strong>${window.crmStore.getUserById(m.scheduledBy)?.name || 'Sócio'}</strong>)</span>
                    ` : ''}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="badge-stage ${m.status === 'completed' ? 'stage-ganho' : (m.status === 'scheduled' ? 'stage-qualificacao' : 'stage-perdido')}">
                  ${statusLabels[m.status] || m.status}
                </span>

                ${m.link ? `
                  <a href="${m.link}" target="_blank" class="btn btn-secondary sm">
                    <i data-lucide="video"></i> Acessar Meet
                  </a>
                ` : ''}

                <button class="btn-icon" title="Editar" onclick="window.calendarManager.openEditMeetingModal('${m.id}')">
                  <i data-lucide="edit-3"></i>
                </button>
                <button class="btn-icon" title="Excluir" onclick="window.calendarManager.handleDeleteMeeting('${m.id}')" style="color: var(--danger);">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderUpcomingSidebar() {
    if (!this.upcomingList) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const meetings = window.crmStore.getMeetings()
      .filter(m => m.date >= todayStr && m.status === 'scheduled')
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

    if (this.sideCount) this.sideCount.textContent = meetings.length;

    if (meetings.length === 0) {
      this.upcomingList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.825rem; padding: 2rem 0;">
          Nenhuma reunião agendada para os próximos dias.
        </div>
      `;
      return;
    }

    this.upcomingList.innerHTML = meetings.slice(0, 8).map(m => {
      const lead = window.crmStore.getLeadById(m.leadId);
      const isToday = m.date === todayStr;
      const scheduledUser = window.crmStore.getUserById(m.scheduledBy);
      const assignedUser = window.crmStore.getUserById(m.assignedPartnerId);

      // WhatsApp Reminder link
      let waReminderUrl = '#';
      const phoneToUse = m.phone || (lead ? lead.phone : '');
      if (phoneToUse) {
        const waClean = phoneToUse.replace(/\D/g, '');
        const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
        const contactNameToUse = m.contactPerson || (lead ? lead.name : 'Cliente');
        const reminderText = encodeURIComponent(
          `Olá ${contactNameToUse}! Lembrando da nossa reunião na ${m.companyName || 'sua empresa'} agendada para ${window.crmStore.formatDisplayDate(m.date)} às ${m.time}.\n\nLocal: ${m.address || m.link || 'Presencial'}\nSócios Conecta Mais: ${(m.participants || []).map(p => window.crmStore.getUserById(p)?.name).filter(Boolean).join(', ')}`
        );
        waReminderUrl = `https://wa.me/${waNumber}?text=${reminderText}`;
      }

      return `
        <div class="upcoming-meeting-card" style="border-left: 3px solid ${isToday ? 'var(--accent-gold)' : 'var(--primary)'};">
          <div class="up-meeting-top">
            <div>
              <div class="up-meeting-title" style="font-weight: 700;">${m.title}</div>
              <div class="up-meeting-lead" style="font-size: 0.8rem; color: var(--primary-bright);">
                🏢 ${m.companyName || (lead ? lead.company : 'Empresa')}
                ${m.contactPerson ? ` • 👤 <strong>${m.contactPerson}</strong>` : ''}
              </div>
              ${m.address ? `
                <div style="font-size: 0.725rem; color: var(--text-secondary); margin-top: 2px;">
                  📍 ${m.address}
                </div>
              ` : ''}
            </div>
            ${isToday ? '<span class="badge-stage stage-proposta" style="font-size: 0.65rem; font-weight: 800;">HOJE</span>' : ''}
          </div>

          <div class="up-meeting-time" style="margin: 6px 0;">
            <i data-lucide="clock"></i>
            <span>${window.crmStore.formatDisplayDate(m.date)} às <strong>${m.time}</strong> (${m.duration} min)</span>
          </div>

          <div style="display: flex; align-items: center; gap: 4px; font-size: 0.725rem; color: var(--text-muted); margin-bottom: 6px; flex-wrap: wrap;">
            <span>Equipe:</span>
            ${(m.participants || [m.assignedPartnerId]).map(pid => {
              const u = window.crmStore.getUserById(pid);
              return u ? `<span style="background: rgba(255,255,255,0.08); padding: 1px 5px; border-radius: 4px; font-weight: 600; color: #cbd5e1;">${u.name}</span>` : '';
            }).join('')}
          </div>

          <div class="up-meeting-actions">
            <div class="up-actions-btns">
              ${m.link ? `
                <a href="${m.link}" target="_blank" class="btn btn-secondary sm" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;">
                  <i data-lucide="video"></i> Meet
                </a>
              ` : ''}
              ${phoneToUse ? `
                <a href="${waReminderUrl}" target="_blank" class="btn btn-whatsapp sm" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;" title="Enviar Lembrete no WhatsApp">
                  <i data-lucide="message-circle"></i> WhatsApp
                </a>
              ` : ''}
            </div>
            <button class="btn btn-secondary sm" style="padding: 0.25rem 0.5rem; font-size: 0.72rem;" title="Download Convite .ics" onclick="window.calendarManager.downloadICS('${m.id}')">
              <i data-lucide="calendar"></i> .ics
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  handleDayCellClick(dateStr) {
    this.openNewMeetingModal(null, dateStr);
  }

  populateFormDropdowns() {
    // Populate Leads
    const selLead = document.getElementById('meetingLeadId');
    if (selLead) {
      const leads = window.crmStore.getLeads();
      const curVal = selLead.value;
      let html = '<option value="">-- Selecionar Cliente / Lead Cadastrado (Opcional) --</option>';
      leads.forEach(l => {
        html += `<option value="${l.id}">${l.company} — ${l.name} (${l.phone || 'Sem tel'})</option>`;
      });
      selLead.innerHTML = html;
      if (curVal) selLead.value = curVal;
    }

    // Populate Partners: ScheduledBy and AssignedTo
    const users = window.crmStore.getUsers();
    const curUser = window.crmStore.getCurrentUser();

    const selScheduledBy = document.getElementById('meetingScheduledBy');
    if (selScheduledBy) {
      selScheduledBy.innerHTML = users.map(u => `<option value="${u.id}" ${u.id === curUser?.id ? 'selected' : ''}>${u.name} (${u.roleName.split(' ')[0]})</option>`).join('');
    }

    const selAssigned = document.getElementById('meetingAssignedPartner');
    if (selAssigned) {
      selAssigned.innerHTML = users.map(u => `<option value="${u.id}" ${u.id === curUser?.id ? 'selected' : ''}>${u.name} (${u.roleName.split(' ')[0]})</option>`).join('');
    }

    // Populate Participants checkboxes
    const partContainer = document.getElementById('meetingParticipantsCheckboxes');
    if (partContainer) {
      partContainer.innerHTML = users.map(u => `
        <label class="participant-check-label" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(51, 65, 85, 0.6); border-radius: 6px; cursor: pointer; font-size: 0.8rem;">
          <input type="checkbox" name="meetingParticipant" value="${u.id}" ${u.id === curUser?.id ? 'checked' : ''}>
          <span>${u.name}</span>
        </label>
      `).join('');
    }
  }

  openNewMeetingModal(leadId = null, prefillDate = null) {
    if (!this.formMeeting) return;
    this.formMeeting.reset();
    this.populateFormDropdowns();

    document.getElementById('meetingFormId').value = '';
    document.getElementById('modalMeetingTitle').textContent = 'Agendar Nova Reunião Comercial';

    if (leadId) {
      document.getElementById('meetingLeadId').value = leadId;
      this.handleLeadSelectChange(leadId);
    }

    const todayStr = prefillDate || new Date().toISOString().split('T')[0];
    document.getElementById('meetingDate').value = todayStr;
    document.getElementById('meetingTime').value = '14:00';
    document.getElementById('meetingDuration').value = '45';
    document.getElementById('meetingStatus').value = 'scheduled';
    document.getElementById('meetingType').value = 'presencial';

    if (this.modalMeeting) this.modalMeeting.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  handleLeadSelectChange(leadId) {
    if (!leadId) return;
    const lead = window.crmStore.getLeadById(leadId);
    if (!lead) return;

    const companyInput = document.getElementById('meetingCompanyName');
    const contactInput = document.getElementById('meetingContactPerson');
    const phoneInput = document.getElementById('meetingPhone');
    const addressInput = document.getElementById('meetingAddress');
    const titleInput = document.getElementById('meetingTitle');

    if (companyInput) companyInput.value = lead.company || '';
    if (contactInput) contactInput.value = lead.name || '';
    if (phoneInput) phoneInput.value = lead.phone || '';
    if (addressInput) addressInput.value = lead.companyAddress || '';
    if (titleInput && !titleInput.value) {
      titleInput.value = `Apresentação Conecta Mais — ${lead.company}`;
    }
  }

  openEditMeetingModal(meetingId) {
    const m = window.crmStore.getMeetingById(meetingId);
    if (!m || !this.formMeeting) return;
    this.populateFormDropdowns();

    document.getElementById('meetingFormId').value = m.id;
    document.getElementById('meetingTitle').value = m.title;
    if (document.getElementById('meetingLeadId')) document.getElementById('meetingLeadId').value = m.leadId || '';
    if (document.getElementById('meetingCompanyName')) document.getElementById('meetingCompanyName').value = m.companyName || '';
    if (document.getElementById('meetingContactPerson')) document.getElementById('meetingContactPerson').value = m.contactPerson || '';
    if (document.getElementById('meetingPhone')) document.getElementById('meetingPhone').value = m.phone || '';
    if (document.getElementById('meetingAddress')) document.getElementById('meetingAddress').value = m.address || '';
    if (document.getElementById('meetingType')) document.getElementById('meetingType').value = m.meetingType || 'presencial';
    if (document.getElementById('meetingScheduledBy')) document.getElementById('meetingScheduledBy').value = m.scheduledBy || '';
    if (document.getElementById('meetingAssignedPartner')) document.getElementById('meetingAssignedPartner').value = m.assignedPartnerId || '';

    // Check participants
    const parts = Array.isArray(m.participants) ? m.participants : (m.assignedPartnerId ? [m.assignedPartnerId] : []);
    const checkboxes = document.querySelectorAll('input[name="meetingParticipant"]');
    checkboxes.forEach(cb => {
      cb.checked = parts.includes(cb.value);
    });

    document.getElementById('meetingDate').value = m.date;
    document.getElementById('meetingTime').value = m.time;
    document.getElementById('meetingDuration').value = m.duration || '45';
    document.getElementById('meetingStatus').value = m.status || 'scheduled';
    document.getElementById('meetingLink').value = m.link || '';
    document.getElementById('meetingNotes').value = m.notes || '';

    document.getElementById('modalMeetingTitle').textContent = 'Editar Reunião Comercial';
    if (this.modalMeeting) this.modalMeeting.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeMeetingModal() {
    if (this.modalMeeting) this.modalMeeting.classList.remove('active');
  }

  handleMeetingFormSubmit() {
    const id = document.getElementById('meetingFormId').value;
    const title = document.getElementById('meetingTitle').value;
    const leadId = document.getElementById('meetingLeadId')?.value || null;
    const companyName = document.getElementById('meetingCompanyName')?.value || '';
    const contactPerson = document.getElementById('meetingContactPerson')?.value || '';
    const phone = document.getElementById('meetingPhone')?.value || '';
    const address = document.getElementById('meetingAddress')?.value || '';
    const meetingType = document.getElementById('meetingType')?.value || 'presencial';
    const scheduledBy = document.getElementById('meetingScheduledBy')?.value || window.crmStore.getCurrentUser()?.id;
    const assignedPartnerId = document.getElementById('meetingAssignedPartner')?.value || window.crmStore.getCurrentUser()?.id;

    // Collect checked participants
    const participants = [];
    document.querySelectorAll('input[name="meetingParticipant"]:checked').forEach(cb => {
      participants.push(cb.value);
    });
    if (participants.length === 0 && assignedPartnerId) {
      participants.push(assignedPartnerId);
    }

    const date = document.getElementById('meetingDate').value;
    const time = document.getElementById('meetingTime').value;
    const duration = document.getElementById('meetingDuration').value;
    const status = document.getElementById('meetingStatus').value;
    const link = document.getElementById('meetingLink')?.value || '';
    const notes = document.getElementById('meetingNotes')?.value || '';

    const payload = {
      title,
      leadId,
      companyName,
      contactPerson,
      phone,
      address,
      meetingType,
      scheduledBy,
      assignedPartnerId,
      participants,
      date,
      time,
      duration,
      status,
      link,
      notes
    };

    if (id) {
      window.crmStore.updateMeeting(id, payload);
      window.notificationManager.showToast('Reunião atualizada com sucesso!', 'success');
    } else {
      window.crmStore.addMeeting(payload);
      window.notificationManager.showToast('Reunião agendada com sucesso!', 'success');
    }

    this.closeMeetingModal();
  }

  handleDeleteMeeting(meetingId) {
    if (confirm('Deseja realmente excluir esta reunião?')) {
      window.crmStore.deleteMeeting(meetingId);
      window.notificationManager.showToast('Reunião excluída.', 'info');
    }
  }

  downloadICS(meetingId) {
    const m = window.crmStore.getMeetingById(meetingId);
    if (!m) return;
    const scheduledUser = window.crmStore.getUserById(m.scheduledBy);
    const assignedUser = window.crmStore.getUserById(m.assignedPartnerId);

    const startFormatted = m.date.replace(/-/g, '') + 'T' + m.time.replace(/:/g, '') + '00';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Conecta Mais//PT',
      'BEGIN:VEVENT',
      `SUMMARY:${m.title}`,
      `DESCRIPTION:Estabelecimento: ${m.companyName || 'N/A'}\\nContato / Dono: ${m.contactPerson || 'N/A'}\\nTelefone: ${m.phone || 'N/A'}\\nEndereço: ${m.address || 'N/A'}\\nMarcada por: ${scheduledUser?.name || 'Sócio'}\\nCondutor: ${assignedUser?.name || 'Sócio'}\\nNotas: ${m.notes || ''}\\nLink: ${m.link || ''}`,
      `LOCATION:${m.address || m.link || 'Presencial / Local da Empresa'}`,
      `DTSTART:${startFormatted}`,
      `DURATION:PT${m.duration || 45}M`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reuniao_${m.title.replace(/\s+/g, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.notificationManager.showToast('Convite do Google Agenda (.ics) baixado!', 'success');
  }
}

window.calendarManager = new CalendarManager();

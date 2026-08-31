/**
 * Conecta Mais - Dashboard & Analytics
 * KPIs, charts, visual funnel and upcoming meetings.
 */

class DashboardManager {
  constructor() {
    this.originChart = null;
    this.userPerfChart = null;
    this.pipelineChart = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();

    window.crmStore.subscribe(() => {
      this.render();
    });
  }

  setupEventListeners() {
    const periodSelect = document.getElementById('dashboardPeriodSelect');
    if (periodSelect) {
      periodSelect.addEventListener('change', () => this.render());
    }

    const btnDashLead = document.getElementById('btnDashboardNewLead');
    if (btnDashLead) {
      btnDashLead.addEventListener('click', () => {
        if (window.leadsManager) window.leadsManager.openNewLeadModal();
      });
    }

    const btnDashExpense = document.getElementById('btnDashboardNewExpense');
    if (btnDashExpense) {
      btnDashExpense.addEventListener('click', () => {
        if (window.financeManager) window.financeManager.openTransactionModal('expense');
      });
    }

    const btnQuickExpense = document.getElementById('btnQuickNewExpense');
    if (btnQuickExpense) {
      btnQuickExpense.addEventListener('click', () => {
        if (window.financeManager) window.financeManager.openTransactionModal('expense');
      });
    }

    const btnQuickLead = document.getElementById('btnQuickNewLead');
    if (btnQuickLead) {
      btnQuickLead.addEventListener('click', () => {
        if (window.leadsManager) window.leadsManager.openNewLeadModal();
      });
    }
  }

  getFilteredData() {
    const period = document.getElementById('dashboardPeriodSelect')?.value || 'month';
    let leads = window.crmStore.getLeads();
    let meetings = window.crmStore.getMeetings();

    const now = new Date();
    if (period === 'today') {
      const todayStr = now.toISOString().split('T')[0];
      leads = leads.filter(l => l.createdAt.startsWith(todayStr));
      meetings = meetings.filter(m => m.date === todayStr);
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 86400000);
      leads = leads.filter(l => new Date(l.createdAt) >= weekAgo);
      meetings = meetings.filter(m => new Date(m.date) >= weekAgo);
    } else if (period === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      leads = leads.filter(l => new Date(l.createdAt) >= monthStart);
      meetings = meetings.filter(m => new Date(m.date) >= monthStart);
    }

    return { leads, meetings, allLeads: window.crmStore.getLeads() };
  }

  render() {
    const { leads, meetings, allLeads } = this.getFilteredData();

    this.renderTodayAndTomorrowAlerts();
    this.renderKPIs(leads, meetings, allLeads);
    this.renderFunnelVisualizer(allLeads);
    this.renderOriginChart(allLeads);
    this.renderReportsCharts(allLeads);
    this.renderDashboardMeetings();
    this.renderDashboardActivities();
  }

  renderTodayAndTomorrowAlerts() {
    const container = document.getElementById('dashboardAgendaAlertsContainer');
    if (!container) return;

    const currentUser = window.crmStore.getCurrentUser();
    const todayMeetings = window.crmStore.getTodayMeetings();
    const tomorrowMeetings = window.crmStore.getTomorrowMeetings();

    const myTodayMeetings = todayMeetings.filter(m => 
      m.assignedPartnerId === currentUser?.id || 
      (Array.isArray(m.participants) && m.participants.includes(currentUser?.id)) ||
      m.scheduledBy === currentUser?.id
    );

    const myTomorrowMeetings = tomorrowMeetings.filter(m => 
      m.assignedPartnerId === currentUser?.id || 
      (Array.isArray(m.participants) && m.participants.includes(currentUser?.id)) ||
      m.scheduledBy === currentUser?.id
    );

    let alertHtml = '';

    // 1. Today Alert Card
    if (todayMeetings.length > 0) {
      alertHtml += `
        <div class="dash-schedule-alert today ${myTodayMeetings.length > 0 ? 'priority-mine' : ''}" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9)); border: 1px solid rgba(0, 210, 255, 0.35); border-radius: 12px; padding: 1.25rem; margin-bottom: 1.25rem; box-shadow: 0 4px 20px rgba(0, 210, 255, 0.1);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #00d2ff, #0077b6); display: flex; align-items: center; justify-content: center; color: white;">
                <i data-lucide="calendar-clock" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h4 style="font-size: 1rem; font-weight: 800; color: #fff; margin: 0;">
                  📅 Programação de HOJE (${window.crmStore.formatDisplayDate(new Date().toISOString().split('T')[0])})
                </h4>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">
                  ${myTodayMeetings.length > 0 
                    ? `<strong style="color: #00d2ff;">${currentUser?.name}</strong>, você possui <strong>${myTodayMeetings.length} compromisso(s)</strong> hoje!` 
                    : `A Conecta Mais possui <strong>${todayMeetings.length} compromisso(s)</strong> hoje com outros sócios.`}
                </div>
              </div>
            </div>
            <button class="btn btn-secondary sm" onclick="window.appRouter.navigate('calendar')" style="font-size: 0.78rem;">
              <i data-lucide="calendar"></i> Ver Agenda Completa
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
            ${todayMeetings.map(m => {
              const isMine = m.assignedPartnerId === currentUser?.id || (Array.isArray(m.participants) && m.participants.includes(currentUser?.id));
              const lead = window.crmStore.getLeadById(m.leadId);
              const phoneToUse = m.phone || (lead ? lead.phone : '');

              let waUrl = '#';
              if (phoneToUse) {
                const waClean = phoneToUse.replace(/\D/g, '');
                const waNumber = waClean.startsWith('55') ? waClean : `55${waClean}`;
                waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(`Olá ${m.contactPerson || 'Cliente'}! Confirmando nossa reunião de hoje às ${m.time}.`)}`;
              }

              return `
                <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid ${isMine ? 'rgba(0, 210, 255, 0.4)' : 'rgba(51, 65, 85, 0.6)'}; border-left: 4px solid ${isMine ? '#00d2ff' : '#64748b'}; border-radius: 8px; padding: 10px 12px;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="font-weight: 800; color: #fbbf24; font-size: 0.9rem;">⏰ ${m.time} (${m.duration} min)</div>
                    ${isMine ? '<span style="font-size: 0.68rem; padding: 1px 6px; border-radius: 4px; background: rgba(0, 210, 255, 0.15); color: #00d2ff; font-weight: 700;">SUA REUNIÃO</span>' : ''}
                  </div>
                  <div style="font-weight: 700; color: #fff; font-size: 0.875rem; margin-top: 2px;">${m.title}</div>
                  <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">
                    🏢 <strong>${m.companyName}</strong> ${m.contactPerson ? `• 👤 ${m.contactPerson}` : ''}
                  </div>
                  ${m.address ? `<div style="font-size: 0.725rem; color: #64748b; margin-top: 2px;">📍 ${m.address}</div>` : ''}
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding-top: 6px; border-top: 1px dashed rgba(51, 65, 85, 0.6);">
                    <div style="font-size: 0.725rem; color: #cbd5e1;">
                      Sócios: ${(m.participants || [m.assignedPartnerId]).map(pid => window.crmStore.getUserById(pid)?.name).filter(Boolean).join(', ')}
                    </div>
                    <div style="display: flex; gap: 6px;">
                      ${m.link ? `<a href="${m.link}" target="_blank" class="btn btn-secondary sm" style="padding: 2px 6px; font-size: 0.7rem;"><i data-lucide="video"></i> Meet</a>` : ''}
                      ${phoneToUse ? `<a href="${waUrl}" target="_blank" class="btn btn-whatsapp sm" style="padding: 2px 6px; font-size: 0.7rem;"><i data-lucide="message-circle"></i> Zap</a>` : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 2. Tomorrow Alert Card
    if (tomorrowMeetings.length > 0) {
      alertHtml += `
        <div class="dash-schedule-alert tomorrow" style="background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(251, 191, 36, 0.25); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(251, 191, 36, 0.15); color: #fbbf24; display: flex; align-items: center; justify-content: center;">
                <i data-lucide="sun" style="width: 18px; height: 18px;"></i>
              </div>
              <div>
                <h5 style="font-size: 0.9rem; font-weight: 700; color: #fff; margin: 0;">
                  🌅 Programação de AMANHÃ (${tomorrowMeetings.length} reuniões agendadas)
                </h5>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">
                  ${myTomorrowMeetings.length > 0 ? `Você tem <strong>${myTomorrowMeetings.length} reunião(ões) amanhã</strong>.` : 'Organize o dia seguinte com a equipe Conecta Mais.'}
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${tomorrowMeetings.map(m => `
                <span style="font-size: 0.75rem; padding: 4px 8px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(51, 65, 85, 0.8); border-radius: 6px; color: #e2e8f0;">
                  ⏰ <strong>${m.time}</strong> • ${m.companyName} (${(m.participants || [m.assignedPartnerId]).map(pid => window.crmStore.getUserById(pid)?.name).filter(Boolean).join(', ')})
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = alertHtml;
    if (window.lucide) window.lucide.createIcons();
  }

  renderKPIs(leads, meetings, allLeads) {
    // 1. Total Leads
    const totalLeadsEl = document.getElementById('kpiTotalLeads');
    const leadsActiveSub = document.getElementById('kpiLeadsActiveSub');
    const activeLeadsCount = allLeads.filter(l => l.stage !== 'perdido' && l.stage !== 'ganho').length;

    if (totalLeadsEl) totalLeadsEl.textContent = allLeads.length;
    if (leadsActiveSub) leadsActiveSub.textContent = `${activeLeadsCount} ativos no pipeline`;

    // 2. Pipeline Value
    const pipelineValueEl = document.getElementById('kpiPipelineValue');
    const wonValueEl = document.getElementById('kpiWonValue');
    const sidebarPipeline = document.getElementById('sidebarPipelineTotal');

    const openPipelineValue = allLeads
      .filter(l => l.stage !== 'perdido' && l.stage !== 'ganho')
      .reduce((sum, l) => sum + (l.value || 0), 0);

    const wonValue = allLeads
      .filter(l => l.stage === 'ganho')
      .reduce((sum, l) => sum + (l.value || 0), 0);

    if (pipelineValueEl) pipelineValueEl.textContent = window.crmStore.formatCurrency(openPipelineValue);
    if (wonValueEl) wonValueEl.textContent = `${window.crmStore.formatCurrency(wonValue)} fechados`;
    if (sidebarPipeline) sidebarPipeline.textContent = window.crmStore.formatCurrency(openPipelineValue);

    // 3. Meetings Scheduled
    const scheduledMeetings = window.crmStore.getMeetings().filter(m => m.status === 'scheduled');
    const completedMeetings = window.crmStore.getMeetings().filter(m => m.status === 'completed');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayMeetings = scheduledMeetings.filter(m => m.date === todayStr);

    const meetingsScheduledEl = document.getElementById('kpiMeetingsScheduled');
    const todayMeetingsEl = document.getElementById('kpiTodayMeetings');
    const completedMeetingsEl = document.getElementById('kpiMeetingsCompleted');

    if (meetingsScheduledEl) meetingsScheduledEl.textContent = scheduledMeetings.length;
    if (todayMeetingsEl) todayMeetingsEl.textContent = `${todayMeetings.length} hoje`;
    if (completedMeetingsEl) completedMeetingsEl.textContent = `${completedMeetings.length} reuniões realizadas`;

    // 4. Conversion Rate & Ticket
    const totalWon = allLeads.filter(l => l.stage === 'ganho').length;
    const totalFinished = allLeads.filter(l => l.stage === 'ganho' || l.stage === 'perdido').length;
    const conversionRate = totalFinished > 0 ? ((totalWon / totalFinished) * 100).toFixed(1) : (allLeads.length > 0 ? ((totalWon / allLeads.length) * 100).toFixed(1) : '0.0');

    const ticketAvg = totalWon > 0 ? (wonValue / totalWon) : (allLeads.length > 0 ? (openPipelineValue / allLeads.length) : 0);

    const conversionRateEl = document.getElementById('kpiConversionRate');
    const ticketAvgEl = document.getElementById('kpiTicketAverage');

    if (conversionRateEl) conversionRateEl.textContent = `${conversionRate}%`;
    if (ticketAvgEl) ticketAvgEl.textContent = `Ticket: ${window.crmStore.formatCurrency(ticketAvg)}`;
  }

  renderFunnelVisualizer(leads) {
    const container = document.getElementById('funnelVisualizer');
    if (!container) return;

    const stages = [
      { id: 'novo', name: '1. Novos Leads', color: '#64748b' },
      { id: 'qualificacao', name: '2. Qualificação', color: '#00b4d8' },
      { id: 'reuniao', name: '3. Reunião Agendada', color: '#0077b6' },
      { id: 'proposta', name: '4. Proposta Enviada', color: '#fbbf24' },
      { id: 'negociacao', name: '5. Negociação', color: '#f97316' },
      { id: 'ganho', name: '6. Ganho (Fechado)', color: '#10b981' }
    ];

    const maxCount = Math.max(...stages.map(s => leads.filter(l => l.stage === s.id).length), 1);

    container.innerHTML = stages.map(st => {
      const stageLeads = leads.filter(l => l.stage === st.id);
      const stageVal = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0);
      const pct = Math.max((stageLeads.length / maxCount) * 100, 8);

      return `
        <div class="funnel-step-bar">
          <div class="funnel-step-name">${st.name}</div>
          <div class="funnel-bar-track">
            <div class="funnel-bar-fill" style="width: ${stageLeads.length === 0 ? '4%' : `${pct}%`}; background-color: ${st.color};"></div>
          </div>
          <div class="funnel-step-stats">
            <span class="funnel-count">${stageLeads.length} leads</span>
            <span class="funnel-val">${window.crmStore.formatCurrency(stageVal)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderOriginChart(leads) {
    const canvas = document.getElementById('leadsOriginChart');
    if (!canvas) return;

    const originCounts = {};
    leads.forEach(l => {
      originCounts[l.origin] = (originCounts[l.origin] || 0) + 1;
    });

    const labels = Object.keys(originCounts);
    const data = Object.values(originCounts);

    if (this.originChart) {
      this.originChart.destroy();
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    this.originChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels.length > 0 ? labels : ['Sem dados'],
        datasets: [{
          data: data.length > 0 ? data : [1],
          backgroundColor: [
            '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#64748b'
          ],
          borderWidth: 2,
          borderColor: isDark ? '#151b2e' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 11 },
              color: isDark ? '#94a3b8' : '#475569'
            }
          }
        },
        cutout: '68%'
      }
    });
  }

  renderReportsCharts(leads) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    // 1. User Performance Chart
    const userPerfCanvas = document.getElementById('userPerformanceChart');
    if (userPerfCanvas) {
      const users = window.crmStore.getUsers();
      const userNames = users.map(u => u.name);
      const userValues = users.map(u => {
        return leads.filter(l => l.assignedTo === u.id).reduce((s, l) => s + (l.value || 0), 0);
      });

      if (this.userPerfChart) this.userPerfChart.destroy();

      this.userPerfChart = new Chart(userPerfCanvas, {
        type: 'bar',
        data: {
          labels: userNames,
          datasets: [{
            label: 'Volume de Leads (R$)',
            data: userValues,
            backgroundColor: '#00b4d8',
            hoverBackgroundColor: '#00d2ff',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { family: 'Plus Jakarta Sans', size: 11 },
                callback: (v) => 'R$ ' + (v / 1000) + 'k'
              }
            }
          }
        }
      });
    }

    // 2. Pipeline Value Chart
    const pipeCanvas = document.getElementById('pipelineValueChart');
    if (pipeCanvas) {
      const stages = ['novo', 'qualificacao', 'reuniao', 'proposta', 'negociacao', 'ganho'];
      const stageLabels = stages.map(s => window.crmStore.getStageLabel(s));
      const stageValues = stages.map(s => {
        return leads.filter(l => l.stage === s).reduce((sum, l) => sum + (l.value || 0), 0);
      });

      if (this.pipelineChart) this.pipelineChart.destroy();

      this.pipelineChart = new Chart(pipeCanvas, {
        type: 'bar',
        data: {
          labels: stageLabels,
          datasets: [{
            label: 'Valor Total (R$)',
            data: stageValues,
            backgroundColor: ['#64748b', '#00b4d8', '#0077b6', '#fbbf24', '#f97316', '#10b981'],
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
            },
            y: {
              grid: { color: gridColor },
              ticks: {
                color: textColor,
                font: { family: 'Plus Jakarta Sans', size: 11 },
                callback: (v) => 'R$ ' + (v / 1000) + 'k'
              }
            }
          }
        }
      });
    }
  }

  renderDashboardMeetings() {
    const container = document.getElementById('dashboardUpcomingMeetings');
    if (!container) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const meetings = window.crmStore.getMeetings()
      .filter(m => m.date >= todayStr && m.status === 'scheduled')
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, 4);

    if (meetings.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.825rem; padding: 1.5rem 0;">
          Nenhuma reunião pendente para hoje ou próximos dias.
        </div>
      `;
      return;
    }

    container.innerHTML = meetings.map(m => {
      const lead = window.crmStore.getLeadById(m.leadId);
      return `
        <div class="dash-meeting-item">
          <div class="meeting-item-left">
            <div class="meeting-date-box">
              <span class="day">${m.date.split('-')[2]}</span>
              <span class="time">${m.time}</span>
            </div>
            <div class="meeting-item-info">
              <h4>${m.title}</h4>
              <span>${lead ? `${lead.name} (${lead.company})` : 'Lead'}</span>
            </div>
          </div>
          <div>
            ${m.link ? `
              <a href="${m.link}" target="_blank" class="btn btn-secondary sm">
                <i data-lucide="video"></i> Acessar
              </a>
            ` : `
              <button class="btn btn-secondary sm" onclick="window.calendarManager.openEditMeetingModal('${m.id}')">
                Ver
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  renderDashboardActivities() {
    const container = document.getElementById('dashboardActivityFeed');
    if (!container) return;

    const activities = window.crmStore.getAllActivities().slice(0, 5);

    if (activities.length === 0) {
      container.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 0.825rem; padding: 1.5rem 0;">Nenhuma atividade recente.</div>';
      return;
    }

    container.innerHTML = activities.map(act => {
      const lead = window.crmStore.getLeadById(act.leadId);
      const user = window.crmStore.getUserById(act.userId);
      const timeStr = new Date(act.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      let iconName = 'file-text';
      let iconColor = 'var(--primary)';
      if (act.type === 'stage_change') { iconName = 'check-circle-2'; iconColor = 'var(--success)'; }
      if (act.type === 'call') { iconName = 'phone-call'; iconColor = 'var(--info)'; }
      if (act.type === 'whatsapp') { iconName = 'message-circle'; iconColor = '#25D366'; }
      if (act.type === 'proposal') { iconName = 'file-check'; iconColor = 'var(--warning)'; }

      return `
        <div class="dash-activity-item">
          <div class="activity-icon-bullet" style="color: ${iconColor};">
            <i data-lucide="${iconName}"></i>
          </div>
          <div class="activity-feed-text">
            <div><strong>${act.title}</strong></div>
            <div style="color: var(--text-secondary); font-size: 0.78rem;">${act.description}</div>
            <div class="activity-feed-meta">
              ${lead ? `Lead: <strong>${lead.name}</strong> • ` : ''}${user ? user.name : 'Sistema'} às ${timeStr}
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.dashboardManager = new DashboardManager();

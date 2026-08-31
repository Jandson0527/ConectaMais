/**
 * Conecta Mais - Screens & Venues Manager (Rede de Telas Físicas)
 * Gestão dos pontos de exibição, endereços, audiência e anunciantes por tela.
 */

class ScreensManager {
  constructor() {
    this.searchTerm = '';
    this.init();
  }

  init() {
    this.setupEventListeners();

    window.crmStore.subscribe(() => {
      if (window.appRouter && window.appRouter.currentView === 'screens') {
        this.render();
      }
    });
  }

  setupEventListeners() {
    // New Screen Button
    const btnNewScreen = document.getElementById('btnNewScreen');
    if (btnNewScreen) {
      btnNewScreen.addEventListener('click', () => this.openNewScreenModal());
    }

    // Modal Close buttons
    const modalClose = document.getElementById('modalScreenClose');
    const modalCancel = document.getElementById('modalScreenCancel');
    if (modalClose) modalClose.addEventListener('click', () => this.closeScreenModal());
    if (modalCancel) modalCancel.addEventListener('click', () => this.closeScreenModal());

    // Screen Form Submit
    const formScreen = document.getElementById('formScreen');
    if (formScreen) {
      formScreen.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleScreenSubmit();
      });
    }

    // Search input
    const searchInput = document.getElementById('screensSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.renderScreensGrid();
      });
    }
  }

  render() {
    this.renderHeroStats();
    this.renderScreensGrid();
    if (window.lucide) window.lucide.createIcons();
  }

  renderHeroStats() {
    const stats = window.crmStore.getScreenStats();
    const screens = window.crmStore.getScreens();

    let totalAudience = 0;
    screens.forEach(s => {
      const match = (s.audienceEst || '').replace(/\./g, '').match(/\d+/);
      if (match) totalAudience += parseInt(match[0], 10);
    });

    const statTotalEl = document.getElementById('statScreensTotal');
    const statActiveEl = document.getElementById('statScreensActive');
    const statAudienceEl = document.getElementById('statScreensAudience');
    const statAdvertisersEl = document.getElementById('statScreensAdvertisers');

    if (statTotalEl) statTotalEl.textContent = `${stats.totalScreens} Telas`;
    if (statActiveEl) statActiveEl.textContent = `${stats.activeScreensCount} Ativas`;
    if (statAudienceEl) statAudienceEl.textContent = `${totalAudience.toLocaleString('pt-BR')} /mês`;
    if (statAdvertisersEl) statAdvertisersEl.textContent = `${stats.activeAdvertisersCount} Anunciantes`;
  }

  renderScreensGrid() {
    const container = document.getElementById('screensGridContainer');
    if (!container) return;

    let screens = window.crmStore.getScreens();

    if (this.searchTerm) {
      screens = screens.filter(s => 
        s.name.toLowerCase().includes(this.searchTerm) ||
        s.segment.toLowerCase().includes(this.searchTerm) ||
        s.address.toLowerCase().includes(this.searchTerm) ||
        (s.neighborhood && s.neighborhood.toLowerCase().includes(this.searchTerm))
      );
    }

    if (screens.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <i data-lucide="tv" style="width: 40px; height: 40px; color: var(--text-muted); margin-bottom: 0.5rem;"></i>
          <h4 style="font-size: 1.1rem; color: var(--text-primary);">Nenhum ponto de tela encontrado</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">Cadastre um novo estabelecimento para expandir sua rede de marketing indoor.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = screens.map(s => {
      const activeLeads = window.crmStore.getLeadsForScreen(s.id).filter(l => l.stage === 'ganho');
      
      // Icon selection based on segment
      let iconName = 'tv';
      const segLower = (s.segment || '').toLowerCase();
      if (segLower.includes('clínica') || segLower.includes('saúde') || segLower.includes('médic')) iconName = 'heart-pulse';
      else if (segLower.includes('barbearia') || segLower.includes('estética') || segLower.includes('beleza')) iconName = 'scissors';
      else if (segLower.includes('academia') || segLower.includes('fitness') || segLower.includes('treino')) iconName = 'dumbbell';
      else if (segLower.includes('restaurante') || segLower.includes('hamburg') || segLower.includes('bar')) iconName = 'utensils';

      const statusLabels = {
        active: 'Ativa & Veiculando',
        maintenance: 'Em Manutenção',
        planned: 'Em Instalação'
      };

      return `
        <div class="screen-card">
          <div class="screen-card-header">
            <div class="screen-title-area">
              <div class="screen-icon-avatar">
                <i data-lucide="${iconName}"></i>
              </div>
              <div>
                <div class="screen-name">${s.name}</div>
                <div class="screen-segment-tag">${s.segment}</div>
              </div>
            </div>
            <span class="screen-status-badge ${s.status}">
              ${statusLabels[s.status] || 'Ativa'}
            </span>
          </div>

          <div class="screen-address-box">
            <i data-lucide="map-pin"></i>
            <div>
              <strong>${s.address}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${s.neighborhood ? s.neighborhood + ' • ' : ''}${s.city || 'São Paulo - SP'}</div>
            </div>
          </div>

          <div class="screen-metrics-row">
            <div class="screen-metric-item">
              <i data-lucide="users" style="width: 14px; height: 14px;"></i>
              <span>Audiência: <strong>${s.audienceEst || '3.000/mês'}</strong></span>
            </div>
            <div class="screen-metric-item">
              <i data-lucide="tv" style="width: 14px; height: 14px;"></i>
              <span>Telas: <strong>${s.tvsCount || 1} TV</strong></span>
            </div>
          </div>

          <div class="screen-advertisers-section">
            <div class="screen-advertisers-title">
              <span>Anunciantes Veiculando (${activeLeads.length})</span>
            </div>
            <div class="screen-advertisers-list">
              ${activeLeads.length > 0 ? activeLeads.map(lead => `
                <span class="screen-client-pill" title="${lead.company || lead.name}">
                  ${lead.company || lead.name}
                </span>
              `).join('') : '<span style="font-size: 0.75rem; color: var(--text-muted);">Nenhum anunciante ativo veiculando nesta tela.</span>'}
            </div>
          </div>

          <div class="screen-card-actions" style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-primary sm" style="width: 100%; font-weight: 700;" onclick="window.screensManager.openNewLeadForScreen('${s.id}')">
              <i data-lucide="plus-circle"></i> + Anunciar nesta Tela
            </button>
            <button class="btn btn-secondary sm" style="flex: 1;" onclick="window.screensManager.openEditScreenModal('${s.id}')">
              <i data-lucide="edit-3"></i> Editar Local
            </button>
            <button class="btn-icon sm" style="color: var(--danger);" title="Excluir Ponto" onclick="window.screensManager.deleteScreen('${s.id}', '${s.name}')">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // Modals & Form Handling
  openNewScreenModal() {
    const form = document.getElementById('formScreen');
    if (form) form.reset();

    const modalTitle = document.getElementById('modalScreenTitle');
    const screenFormId = document.getElementById('screenFormId');
    if (modalTitle) modalTitle.textContent = 'Cadastrar Novo Ponto de Tela';
    if (screenFormId) screenFormId.value = '';

    const modal = document.getElementById('modalScreen');
    if (modal) modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  openEditScreenModal(id) {
    const screen = window.crmStore.getScreenById(id);
    if (!screen) return;

    document.getElementById('screenFormId').value = screen.id;
    document.getElementById('screenName').value = screen.name;
    document.getElementById('screenSegment').value = screen.segment;
    document.getElementById('screenAddress').value = screen.address;
    document.getElementById('screenNeighborhood').value = screen.neighborhood || '';
    document.getElementById('screenCity').value = screen.city || 'São Paulo - SP';
    document.getElementById('screenAudience').value = screen.audienceEst || '';
    document.getElementById('screenTvsCount').value = screen.tvsCount || 1;
    document.getElementById('screenStatus').value = screen.status || 'active';
    document.getElementById('screenNotes').value = screen.notes || '';

    const modalTitle = document.getElementById('modalScreenTitle');
    if (modalTitle) modalTitle.textContent = `Editar Ponto: ${screen.name}`;

    const modal = document.getElementById('modalScreen');
    if (modal) modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeScreenModal() {
    const modal = document.getElementById('modalScreen');
    if (modal) modal.classList.remove('active');
    const form = document.getElementById('formScreen');
    if (form) form.reset();
  }

  handleScreenSubmit() {
    const id = document.getElementById('screenFormId').value;
    const name = document.getElementById('screenName').value;
    const segment = document.getElementById('screenSegment').value;
    const address = document.getElementById('screenAddress').value;
    const neighborhood = document.getElementById('screenNeighborhood').value;
    const city = document.getElementById('screenCity').value;
    const audienceEst = document.getElementById('screenAudience').value;
    const tvsCount = document.getElementById('screenTvsCount').value;
    const status = document.getElementById('screenStatus').value;
    const notes = document.getElementById('screenNotes').value;

    if (id) {
      window.crmStore.updateScreen(id, { name, segment, address, neighborhood, city, audienceEst, tvsCount, status, notes });
      if (window.notificationsManager) {
        window.notificationsManager.showToast('Sucesso', `Ponto "${name}" atualizado com sucesso!`, 'success');
      }
    } else {
      window.crmStore.addScreen({ name, segment, address, neighborhood, city, audienceEst, tvsCount, status, notes });
      if (window.notificationsManager) {
        window.notificationsManager.showToast('Sucesso', `Novo ponto "${name}" adicionado à rede!`, 'success');
      }
    }

    this.closeScreenModal();
    this.render();
  }

  deleteScreen(id, name) {
    if (confirm(`Tem certeza que deseja excluir o ponto de tela "${name}" da rede Conecta Mais?`)) {
      window.crmStore.deleteScreen(id);
      if (window.notificationsManager) {
        window.notificationsManager.showToast('Excluído', `Ponto "${name}" removido da rede.`, 'info');
      }
      this.render();
    }
  }

  openNewLeadForScreen(screenId) {
    if (window.leadsManager) {
      window.leadsManager.openNewLeadModal('plan-presenca');
      setTimeout(() => {
        const container = document.getElementById('leadScreensChecklist');
        if (container) {
          container.querySelectorAll('.screen-cb-input').forEach(cb => {
            if (cb.value === screenId) {
              cb.checked = true;
              cb.closest('.screen-checkbox-card')?.classList.add('selected');
            } else {
              cb.checked = false;
              cb.closest('.screen-checkbox-card')?.classList.remove('selected');
            }
          });
          window.leadsManager.updateScreensQuotaBadge(1);
        }
      }, 50);
    }
  }
}

// Global Screens Manager instance
window.screensManager = new ScreensManager();

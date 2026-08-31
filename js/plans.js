/**
 * Conecta Mais - Indoor Marketing Plans Manager
 * Catálogo dos planos de TVs, precificação e clientes ativos por plano.
 */

class PlansManager {
  constructor() {
    this.container = document.getElementById('plansGridContainer');
    this.init();
  }

  init() {
    window.crmStore.subscribe(() => {
      if (window.appRouter && window.appRouter.currentView === 'plans') {
        this.render();
      }
    });
  }

  render() {
    this.renderHeroStats();
    this.renderPlansGrid();
    if (window.lucide) window.lucide.createIcons();
  }

  renderHeroStats() {
    const activeLeads = window.crmStore.getLeads().filter(l => l.stage === 'ganho');
    const totalTvsOperando = 5; // Capacidade da rede Conecta Mais
    let tvsOcupadas = 0;

    activeLeads.forEach(l => {
      const p = window.crmStore.getPlanById(l.planId);
      tvsOcupadas += (l.tvsCount || (p ? p.tvs : 1));
    });

    const statTvsEl = document.getElementById('statTotalNetworkTvs');
    const statActiveClientsEl = document.getElementById('statActiveAnunciantes');
    const statMrrEl = document.getElementById('statNetworkMRR');

    const summary = window.crmStore.getFinancialSummary();

    if (statTvsEl) statTvsEl.textContent = `${totalTvsOperando} TVs`;
    if (statActiveClientsEl) statActiveClientsEl.textContent = `${activeLeads.length} Ativos`;
    if (statMrrEl) statMrrEl.textContent = window.crmStore.formatCurrency(summary.mrr);
  }

  renderPlansGrid() {
    if (!this.container) this.container = document.getElementById('plansGridContainer');
    if (!this.container) return;
    const plans = window.crmStore.getPlans().filter(p => p.id !== 'plan-custom');
    const leads = window.crmStore.getLeads();

    this.container.innerHTML = plans.map(p => {
      const activeClients = leads.filter(l => l.planId === p.id && l.stage === 'ganho');
      const isPopular = p.isPopular;
      const isCampaign = p.isCampaign;

      return `
        <div class="plan-card ${isPopular ? 'popular' : ''}">
          ${isPopular ? '<div class="plan-card-badge-top">👑 Mais Vendido • Top da Rede</div>' : ''}
          
          <div class="plan-card-header">
            <div class="plan-title-row">
              <div class="plan-name">${p.badge} ${p.name.replace(/^[^\s]+\s/, '')}</div>
              <span class="plan-tvs-pill">
                <i data-lucide="tv"></i> ${p.tvs} ${p.tvs === 1 ? 'TV' : 'TVs'}
              </span>
            </div>
            <p class="plan-desc">${p.tagline || p.description}</p>
          </div>

          <div class="plan-pricing-box">
            ${isCampaign ? `
              <div class="price-row-monthly">
                <span class="price-currency">R$</span>
                <span class="price-main">${p.fixedPrice.toFixed(2).replace('.', ',')}</span>
                <span class="price-period">/ ${p.periodDays} dias</span>
              </div>
              <div class="price-quarterly-row">
                <span class="quarterly-label">Modalidade:</span>
                <span class="quarterly-val">Campanha Avulsa sem fidelidade</span>
              </div>
            ` : `
              <div class="price-row-monthly">
                <span class="price-currency">R$</span>
                <span class="price-main">${p.monthlyPrice.toFixed(2).replace('.', ',')}</span>
                <span class="price-period">/ mês</span>
              </div>
              <div class="price-quarterly-row">
                <span class="quarterly-label">3 Meses Antecipados:</span>
                <span class="quarterly-val">R$ ${p.quarterlyPrice.toFixed(2).replace('.', ',')}</span>
              </div>
            `}
          </div>

          <ul class="plan-features-list">
            <li class="plan-feature-item">
              <i data-lucide="check-circle-2"></i>
              <span>Veiculação em <strong>${p.tvs} ${p.tvs === 1 ? 'TV' : 'TVs'}</strong> da nossa rede</span>
            </li>
            <li class="plan-feature-item">
              <i data-lucide="check-circle-2"></i>
              <span><strong>${p.changesPerMonth} ${p.changesPerMonth === 1 ? 'alteração' : 'alterações'}</strong> de anúncio por mês</span>
            </li>
            <li class="plan-feature-item">
              <i data-lucide="check-circle-2"></i>
              <span>Exibição contínua em alta definição Full HD</span>
            </li>
            <li class="plan-feature-item">
              <i data-lucide="check-circle-2"></i>
              <span>Relatório de veiculação e suporte comercial</span>
            </li>
          </ul>

          <div class="plan-clients-section">
            <div class="plan-clients-title">Anunciantes neste Plano (${activeClients.length})</div>
            <div class="plan-clients-tags">
              ${activeClients.length > 0 ? activeClients.map(c => `
                <span class="client-chip" title="${c.name}">${c.company || c.name}</span>
              `).join('') : '<span style="font-size: 0.75rem; color: var(--text-muted);">Nenhum cliente ativo no momento.</span>'}
            </div>
          </div>

          <button class="btn ${isPopular ? 'btn-gold' : 'btn-primary'}" style="width: 100%; margin-top: auto;" onclick="window.plansManager.openNewLeadWithPlan('${p.id}')">
            <i data-lucide="plus-circle"></i> Fechar Cliente neste Plano
          </button>
        </div>
      `;
    }).join('');
  }

  openNewLeadWithPlan(planId) {
    if (window.leadsManager) {
      window.leadsManager.openNewLeadModal();
      const planSelect = document.getElementById('leadPlan');
      if (planSelect) {
        planSelect.value = planId;
        window.leadsManager.handlePlanChange();
      }
    }
  }
}

// Global Plans Manager instance
window.plansManager = new PlansManager();

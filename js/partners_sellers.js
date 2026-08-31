/**
 * Conecta Mais - Partners' Sellers Management & Approval Manager (Painel dos Sócios)
 * Fila de Aprovação de Vendas, Dossiê Completo dos Vendedores e Cadastro de Vendedores.
 */

class PartnersSellersManager {
  constructor() {
    this.selectedDossierSellerId = null;
    this.init();
  }

  init() {
    this.setupEventListeners();

    window.crmStore.subscribe(() => {
      if (window.crmStore.isPartner()) {
        this.renderPendingApprovalBanner();
        if (window.appRouter?.currentView === 'partner-sellers') {
          this.renderSellersView();
        }
      }
    });
  }

  setupEventListeners() {
    // Form New Seller Submit
    const formNewSeller = document.getElementById('formNewSeller');
    if (formNewSeller) {
      formNewSeller.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewSellerSubmit();
      });
    }

    // Modal Close buttons
    const closeNewSeller = document.getElementById('modalNewSellerClose');
    const cancelNewSeller = document.getElementById('modalNewSellerCancel');
    if (closeNewSeller) closeNewSeller.addEventListener('click', () => this.closeNewSellerModal());
    if (cancelNewSeller) cancelNewSeller.addEventListener('click', () => this.closeNewSellerModal());

    const closeDossier = document.getElementById('modalSellerDossierClose');
    if (closeDossier) closeDossier.addEventListener('click', () => this.closeSellerDossierModal());

    const formDenySale = document.getElementById('formDenySale');
    if (formDenySale) {
      formDenySale.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleDenySaleSubmit();
      });
    }

    const closeDeny = document.getElementById('modalDenySaleClose');
    const cancelDeny = document.getElementById('modalDenySaleCancel');
    if (closeDeny) closeDeny.addEventListener('click', () => this.closeDenySaleModal());
    if (cancelDeny) cancelDeny.addEventListener('click', () => this.closeDenySaleModal());
  }

  // ==================== 1. FILA DE APROVAÇÃO DE VENDAS ====================
  renderPendingApprovalBanner() {
    const bannerContainer = document.getElementById('pendingApprovalQueueContainer');
    const pendingSales = window.crmStore.getPendingApprovalSales();

    if (!bannerContainer) return;

    if (pendingSales.length === 0) {
      bannerContainer.innerHTML = '';
      bannerContainer.style.display = 'none';
      return;
    }

    bannerContainer.style.display = 'block';
    bannerContainer.innerHTML = `
      <div class="approval-queue-banner">
        <div class="approval-queue-header">
          <div class="approval-queue-title">
            <span style="font-size: 1.3rem;">⏳</span>
            <div>
              <h3 style="color: #fbbf24;">Vendas Aguardando Aprovação dos Sócios (${pendingSales.length})</h3>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">Vendas cadastradas pelos vendedores aguardando liberação para entrar no faturamento e gerar comissão.</p>
            </div>
          </div>
        </div>

        <div class="approval-items-grid">
          ${pendingSales.map(s => {
            const seller = window.crmStore.getUserById(s.sellerId || s.assignedTo);
            const plan = window.crmStore.getPlanById(s.planId);
            const comm = s.commissionAmount || Number(((s.value || 0) * 0.10).toFixed(2));
            const net = Number(((s.value || 0) - comm).toFixed(2));
            const screens = (s.selectedScreenIds || []).map(sid => window.crmStore.getScreenById(sid)?.name).filter(Boolean).join(', ');

            return `
              <div class="approval-card">
                <div class="approval-card-top">
                  <div>
                    <span class="approval-seller-chip">Vendedor: ${seller ? seller.name : 'Vendedor'}</span>
                    <h4 style="font-size: 1rem; color: #fff; margin: 4px 0 2px;">${s.company || s.name}</h4>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${s.companyAddress || 'Endereço não informado'}</div>
                  </div>
                  <span class="badge-approval pending">Pendente</span>
                </div>

                <div class="approval-card-body">
                  <div><strong>Plano:</strong> ${plan ? plan.name : 'Plano'} (${s.tvsCount || 1} TV)</div>
                  <div><strong>Pontos Selecionados:</strong> ${screens || 'Não especificado'}</div>
                  <div><strong>Contato:</strong> ${s.name} (${s.phone || 'Sem telefone'})</div>
                </div>

                <div class="approval-financial-row">
                  <div>
                    <span style="color: var(--text-muted); font-size: 0.72rem; display: block;">VALOR DA VENDA</span>
                    <strong style="font-size: 0.95rem; color: #fff;">${window.crmStore.formatCurrency(s.value)}</strong>
                  </div>
                  <div>
                    <span style="color: var(--accent-gold); font-size: 0.72rem; display: block;">COMISSÃO (10%)</span>
                    <strong style="color: var(--accent-gold); font-size: 0.95rem;">${window.crmStore.formatCurrency(comm)}</strong>
                  </div>
                  <div>
                    <span style="color: #00d2ff; font-size: 0.72rem; display: block;">LÍQUIDO EMPRESA</span>
                    <strong style="color: #00d2ff; font-size: 0.95rem;">${window.crmStore.formatCurrency(net)}</strong>
                  </div>
                </div>

                <div class="approval-actions-row">
                  <button class="btn btn-secondary sm" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.4);" onclick="window.partnersSellersManager.openDenySaleModal('${s.id}')">
                    <i data-lucide="x-circle"></i> Negar Venda
                  </button>
                  <button class="btn btn-primary sm" style="flex: 1; font-weight: 700;" onclick="window.partnersSellersManager.handleApproveSale('${s.id}')">
                    <i data-lucide="check-circle"></i> CONFIRMAR VENDA
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  // ==================== 2. AÇÕES DE APROVAÇÃO & RECUSA ====================
  handleApproveSale(leadId) {
    const partner = window.crmStore.getCurrentUser();
    const lead = window.crmStore.getLeadById(leadId);
    if (!lead) return;

    if (confirm(`Deseja CONFIRMAR a venda de "${lead.company || lead.name}" no valor de ${window.crmStore.formatCurrency(lead.value)}?\n\nIsso lançará a receita no fluxo de caixa da empresa e liberará a comissão de 10% (${window.crmStore.formatCurrency(lead.value * 0.10)}) para o vendedor.`)) {
      window.crmStore.approveSale(leadId, partner?.id);
      
      if (window.notificationsManager) {
        window.notificationsManager.showToast('Venda Aprovada!', `Venda de ${lead.company} confirmada com sucesso no financeiro da empresa!`, 'success');
      }

      this.renderPendingApprovalBanner();
      if (window.appRouter?.currentView === 'partner-sellers') this.renderSellersView();
      if (this.selectedDossierSellerId) this.openSellerDossierModal(this.selectedDossierSellerId);
    }
  }

  openDenySaleModal(leadId) {
    this.pendingDenyLeadId = leadId;
    const lead = window.crmStore.getLeadById(leadId);
    const modal = document.getElementById('modalDenySale');
    const nameEl = document.getElementById('denySaleClientName');
    
    if (nameEl && lead) nameEl.textContent = `${lead.company || lead.name} (${window.crmStore.formatCurrency(lead.value)})`;
    if (modal) modal.classList.add('active');
  }

  closeDenySaleModal() {
    this.pendingDenyLeadId = null;
    const modal = document.getElementById('modalDenySale');
    if (modal) modal.classList.remove('active');
  }

  handleDenySaleSubmit() {
    if (!this.pendingDenyLeadId) return;
    const reason = document.getElementById('denySaleReason')?.value || 'Não aprovado pela diretoria';
    const partner = window.crmStore.getCurrentUser();

    window.crmStore.denySale(this.pendingDenyLeadId, partner?.id, reason);

    if (window.notificationsManager) {
      window.notificationsManager.showToast('Venda Recusada', `A venda foi marcada como negada e não entrará no financeiro.`, 'warning');
    }

    this.closeDenySaleModal();
    this.renderPendingApprovalBanner();
    if (window.appRouter?.currentView === 'partner-sellers') this.renderSellersView();
  }

  // ==================== 3. VIEW DE GESTÃO DE VENDEDORES (SÓCIOS) ====================
  renderSellersView() {
    this.renderPendingApprovalBanner();

    const sellers = window.crmStore.getSellers();
    const container = document.getElementById('partnerSellersListContainer');
    if (!container) return;

    if (sellers.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-subtle); color: var(--text-muted);">
          <i data-lucide="users" style="width: 42px; height: 42px; margin-bottom: 10px; display: block; margin-inline: auto;"></i>
          <h3 style="color: #fff; margin-bottom: 4px;">Nenhum vendedor cadastrado</h3>
          <p style="font-size: 0.85rem; max-width: 480px; margin: 0 auto 1.25rem;">Cadastre representantes comerciais para expandir as vendas de telas da Conecta Mais.</p>
          <button class="btn btn-primary sm" onclick="window.partnersSellersManager.openNewSellerModal()">
            <i data-lucide="user-plus"></i> + Cadastrar Novo Vendedor
          </button>
        </div>
      `;
    } else {
      container.innerHTML = sellers.map(seller => {
        const commData = window.crmStore.getSellerCommissions(seller.id);
        const hotLeads = window.crmStore.getHotLeads(seller.id);

        return `
          <div class="user-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
            <div class="user-card-header">
              <img src="${seller.avatar}" alt="${seller.name}" class="user-card-avatar" style="border: 2px solid #00d2ff;">
              <div class="user-card-info">
                <h4>${seller.name}</h4>
                <div style="font-size: 0.78rem; color: #00d2ff; font-weight: 700;">Vendedor Comercial (Comissão 10%)</div>
                <div class="user-card-email">${seller.email} • ${seller.phone || 'Sem tel'}</div>
              </div>
              <span class="badge ${seller.active ? 'badge-active' : 'badge-inactive'}">
                ${seller.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div class="seller-dossier-stats-grid" style="margin-bottom: 0;">
              <div class="seller-stat-mini-card">
                <div class="seller-stat-mini-val">${commData.approvedCount}</div>
                <div class="seller-stat-mini-label">Vendas Fechadas</div>
              </div>
              <div class="seller-stat-mini-card">
                <div class="seller-stat-mini-val" style="color: #fff;">${window.crmStore.formatCurrency(commData.totalSold)}</div>
                <div class="seller-stat-mini-label">Total Vendido</div>
              </div>
              <div class="seller-stat-mini-card">
                <div class="seller-stat-mini-val" style="color: var(--accent-gold);">${window.crmStore.formatCurrency(commData.approvedCommission)}</div>
                <div class="seller-stat-mini-label">Comissão 10%</div>
              </div>
              <div class="seller-stat-mini-card">
                <div class="seller-stat-mini-val" style="color: #fbbf24;">${hotLeads.length}</div>
                <div class="seller-stat-mini-label">Clientes Quentes</div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; margin-top: auto;">
              <button class="btn btn-secondary sm" onclick="window.partnersSellersManager.toggleSellerStatus('${seller.id}')" title="Alternar Status">
                <i data-lucide="power"></i> ${seller.active ? 'Desativar' : 'Ativar'}
              </button>
              <button class="btn btn-primary sm" style="flex: 1; font-weight: 700;" onclick="window.partnersSellersManager.openSellerDossierModal('${seller.id}')">
                <i data-lucide="folder-open"></i> Ver Dossiê Completo
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==================== 4. DOSSIÊ COMPLETO DO VENDEDOR ====================
  openSellerDossierModal(sellerId) {
    this.selectedDossierSellerId = sellerId;
    const dossier = window.crmStore.getSellerDossier(sellerId);
    if (!dossier || !dossier.seller) return;

    const modal = document.getElementById('modalSellerDossier');
    const container = document.getElementById('sellerDossierContent');

    if (!modal || !container) return;

    const s = dossier.seller;
    const comm = dossier.commissions;
    const hot = dossier.hotLeads;
    const meets = dossier.meetings;

    container.innerHTML = `
      <div class="seller-dossier-hero">
        <img src="${s.avatar}" alt="${s.name}" class="seller-dossier-avatar">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h2 style="font-size: 1.3rem; margin: 0; color: #fff;">${s.name}</h2>
            <span class="badge ${s.active ? 'badge-active' : 'badge-inactive'}">${s.active ? 'Vendedor Ativo' : 'Vendedor Inativo'}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 4px;">
            📧 ${s.email} | 📱 ${s.phone || 'Sem telefone'} | 💼 Regra de Comissão: <strong>10% por venda aprovada</strong>
          </div>
        </div>
      </div>

      <div class="seller-dossier-stats-grid">
        <div class="seller-stat-mini-card">
          <div class="seller-stat-mini-val" style="color: #fff;">${window.crmStore.formatCurrency(comm.totalSold)}</div>
          <div class="seller-stat-mini-label">Total Bruto Vendido</div>
        </div>
        <div class="seller-stat-mini-card">
          <div class="seller-stat-mini-val" style="color: var(--accent-gold);">${window.crmStore.formatCurrency(comm.approvedCommission)}</div>
          <div class="seller-stat-mini-label">Comissão Aprovada (10%)</div>
        </div>
        <div class="seller-stat-mini-card">
          <div class="seller-stat-mini-val" style="color: #fbbf24;">${window.crmStore.formatCurrency(comm.pendingCommission)}</div>
          <div class="seller-stat-mini-label">Comissão Pendente</div>
        </div>
        <div class="seller-stat-mini-card">
          <div class="seller-stat-mini-val">${comm.approvedCount} / ${comm.totalSalesCount}</div>
          <div class="seller-stat-mini-label">Vendas Aprovadas</div>
        </div>
        <div class="seller-stat-mini-card">
          <div class="seller-stat-mini-val" style="color: #ea580c;">${hot.length}</div>
          <div class="seller-stat-mini-label">Clientes Quentes</div>
        </div>
      </div>

      <!-- Dossier Tabs -->
      <div style="margin-top: 1.5rem;">
        <h4 style="color: #fff; font-size: 1rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="shopping-cart" style="color: #00d2ff; width: 18px; height: 18px;"></i>
          Vendas Cadastradas pelo Vendedor (${comm.salesList.length})
        </h4>

        ${comm.salesList.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.85rem;">Nenhuma venda registrada por este vendedor.</p>' : `
          <div class="table-container" style="max-height: 240px; overflow-y: auto; margin-bottom: 1.5rem;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Cliente / Empresa</th>
                  <th>Plano & TVs</th>
                  <th>Valor</th>
                  <th>Comissão (10%)</th>
                  <th>Status</th>
                  <th>Ações do Sócio</th>
                </tr>
              </thead>
              <tbody>
                ${comm.salesList.map(sale => {
                  const plan = window.crmStore.getPlanById(sale.planId);
                  const commVal = sale.commissionAmount || (sale.value * 0.10);
                  let statusBadge = '<span class="badge-approval pending">Pendente</span>';
                  if (sale.approvalStatus === 'approved' || sale.stage === 'ganho') statusBadge = '<span class="badge-approval approved">Aprovada</span>';
                  else if (sale.approvalStatus === 'denied') statusBadge = '<span class="badge-approval denied">Negada</span>';

                  let actionBtns = '-';
                  if (sale.approvalStatus === 'pending_approval') {
                    actionBtns = `
                      <button class="btn btn-primary xs" onclick="window.partnersSellersManager.handleApproveSale('${sale.id}')" title="Aprovar">
                        Aprovar
                      </button>
                      <button class="btn btn-secondary xs" style="color: #ef4444;" onclick="window.partnersSellersManager.openDenySaleModal('${sale.id}')" title="Negar">
                        Negar
                      </button>
                    `;
                  }

                  return `
                    <tr>
                      <td><strong>${sale.company || sale.name}</strong><br><small style="color: var(--text-muted);">${sale.companyAddress || ''}</small></td>
                      <td>${plan ? plan.name : 'Plano'} (${sale.tvsCount || 1} TV)</td>
                      <td><strong>${window.crmStore.formatCurrency(sale.value)}</strong></td>
                      <td style="color: var(--accent-gold); font-weight: 700;">${window.crmStore.formatCurrency(commVal)}</td>
                      <td>${statusBadge}</td>
                      <td><div style="display: flex; gap: 4px;">${actionBtns}</div></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}

        <!-- Hot Leads by this Seller -->
        <h4 style="color: #fff; font-size: 1rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="flame" style="color: var(--accent-gold); width: 18px; height: 18px;"></i>
          Clientes em Potencial / Quentes do Vendedor (${hot.length})
        </h4>

        ${hot.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.85rem;">Nenhum cliente quente cadastrado.</p>' : `
          <div class="hotleads-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); margin-bottom: 1.5rem;">
            ${hot.map(h => `
              <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle);">
                <strong>${h.company || h.name}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${h.phone || ''} • ${h.address || ''}</div>
                <div class="hotlead-reason-box" style="margin-top: 8px; padding: 6px 8px;">
                  <span style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 700;">Motivo do Vendedor:</span>
                  <div style="font-size: 0.8rem; color: #fff;">${h.reasonNotClosed}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `}

        <!-- Seller Meetings -->
        <h4 style="color: #fff; font-size: 1rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="calendar" style="color: #10b981; width: 18px; height: 18px;"></i>
          Reuniões & Compromissos do Vendedor (${meets.length})
        </h4>

        ${meets.length === 0 ? '<p style="color: var(--text-muted); font-size: 0.85rem;">Nenhum compromisso agendado.</p>' : `
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${meets.map(m => `
              <div style="padding: 10px; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>${m.title}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${m.companyName || ''} • ${m.address || ''}</div>
                </div>
                <div style="text-align: right; font-size: 0.8rem; color: #00d2ff;">
                  📅 ${m.date} às ${m.time}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeSellerDossierModal() {
    this.selectedDossierSellerId = null;
    const modal = document.getElementById('modalSellerDossier');
    if (modal) modal.classList.remove('active');
  }

  // ==================== 5. CADASTRO DE NOVO VENDEDOR PELOS SÓCIOS ====================
  openNewSellerModal() {
    const modal = document.getElementById('modalNewSeller');
    const form = document.getElementById('formNewSeller');
    if (form) form.reset();
    if (modal) modal.classList.add('active');
  }

  closeNewSellerModal() {
    const modal = document.getElementById('modalNewSeller');
    if (modal) modal.classList.remove('active');
  }

  handleNewSellerSubmit() {
    const name = document.getElementById('newSellerName')?.value || '';
    const email = document.getElementById('newSellerEmail')?.value || '';
    const password = document.getElementById('newSellerPassword')?.value || 'conecta123';
    const phone = document.getElementById('newSellerPhone')?.value || '';
    const active = document.getElementById('newSellerActive')?.checked !== false;

    if (!name || !email) {
      alert('Preencha o nome e o e-mail do vendedor.');
      return;
    }

    const seller = window.crmStore.addSeller({
      name,
      email,
      password,
      phone,
      active
    });

    if (window.notificationsManager) {
      window.notificationsManager.showToast('Vendedor Cadastrado!', `Vendedor "${seller.name}" cadastrado com sucesso com regra de 10% de comissão.`, 'success');
    }

    this.closeNewSellerModal();
    this.renderSellersView();
  }

  toggleSellerStatus(sellerId) {
    const seller = window.crmStore.toggleSellerStatus(sellerId);
    if (seller && window.notificationsManager) {
      window.notificationsManager.showToast('Status Atualizado', `Vendedor "${seller.name}" agora está ${seller.active ? 'Ativo' : 'Inativo'}.`, 'info');
    }
    this.renderSellersView();
  }
}

// Global Partners Sellers Manager instance
window.partnersSellersManager = new PartnersSellersManager();

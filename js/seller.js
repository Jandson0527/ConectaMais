/**
 * Conecta Mais - Seller Panel & Commission Manager (Módulo Exclusivo do Vendedor)
 * Dashboard Pessoal, Minhas Vendas (Status de Aprovação), Clientes Quentes e Comissões (10%).
 */

class SellerManager {
  constructor() {
    this.currentEditingHotLeadId = null;
    this.init();
  }

  init() {
    this.setupEventListeners();

    window.crmStore.subscribe(() => {
      if (window.crmStore.isSeller()) {
        this.renderCurrentSellerView();
      }
    });
  }

  setupEventListeners() {
    // Form Hot Lead Submit
    const formHotLead = document.getElementById('formHotLead');
    if (formHotLead) {
      formHotLead.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleHotLeadSubmit();
      });
    }

    // Modal Close buttons
    const closeHotLead = document.getElementById('modalHotLeadClose');
    const cancelHotLead = document.getElementById('modalHotLeadCancel');
    if (closeHotLead) closeHotLead.addEventListener('click', () => this.closeHotLeadModal());
    if (cancelHotLead) cancelHotLead.addEventListener('click', () => this.closeHotLeadModal());
  }

  renderCurrentSellerView() {
    const curView = window.appRouter?.currentView;
    if (curView === 'seller-dashboard') this.renderSellerDashboard();
    else if (curView === 'seller-sales') this.renderSellerSales();
    else if (curView === 'seller-hotleads') this.renderSellerHotLeads();
    else if (curView === 'seller-commissions') this.renderSellerCommissions();
  }

  // ==================== 1. PAINEL / DASHBOARD DO VENDEDOR ====================
  renderSellerDashboard() {
    const user = window.crmStore.getCurrentUser();
    if (!user) return;

    const commData = window.crmStore.getSellerCommissions(user.id);
    const hotLeads = window.crmStore.getHotLeads(user.id);
    const meetings = window.crmStore.getMeetings().filter(m => m.scheduledBy === user.id || m.assignedPartnerId === user.id);

    // Welcome banner text
    const nameEl = document.getElementById('sellerWelcomeName');
    if (nameEl) nameEl.textContent = user.name;

    // KPIs
    const kpiTotalSold = document.getElementById('kpiSellerTotalSold');
    const kpiApprovedComm = document.getElementById('kpiSellerApprovedComm');
    const kpiPendingComm = document.getElementById('kpiSellerPendingComm');
    const kpiSalesCount = document.getElementById('kpiSellerSalesCount');
    const kpiHotLeadsCount = document.getElementById('kpiSellerHotLeadsCount');

    if (kpiTotalSold) kpiTotalSold.textContent = window.crmStore.formatCurrency(commData.totalSold);
    if (kpiApprovedComm) kpiApprovedComm.textContent = window.crmStore.formatCurrency(commData.approvedCommission);
    if (kpiPendingComm) kpiPendingComm.textContent = window.crmStore.formatCurrency(commData.pendingCommission);
    if (kpiSalesCount) kpiSalesCount.textContent = `${commData.approvedCount} aprovadas • ${commData.pendingCount} pendentes`;
    if (kpiHotLeadsCount) kpiHotLeadsCount.textContent = hotLeads.length;

    // Recent Sales mini list
    const recentSalesContainer = document.getElementById('sellerRecentSalesList');
    if (recentSalesContainer) {
      const recentSales = commData.salesList.slice(0, 5);
      if (recentSales.length === 0) {
        recentSalesContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
            <i data-lucide="shopping-bag" style="width: 36px; height: 36px; margin-bottom: 8px; opacity: 0.5;"></i>
            <p>Você ainda não cadastrou nenhuma venda. Clique no botão acima para cadastrar seu primeiro cliente!</p>
          </div>
        `;
      } else {
        recentSalesContainer.innerHTML = recentSales.map(s => {
          const plan = window.crmStore.getPlanById(s.planId);
          const comm = s.commissionAmount || Number(((s.value || 0) * 0.10).toFixed(2));
          let badgeClass = 'pending';
          let badgeText = '⏳ Aguardando Aprovação';

          if (s.approvalStatus === 'approved' || s.stage === 'ganho') {
            badgeClass = 'approved';
            badgeText = '✅ Aprovada';
          } else if (s.approvalStatus === 'denied') {
            badgeClass = 'denied';
            badgeText = '❌ Negada';
          }

          return `
            <div class="approval-card" style="margin-bottom: 0.75rem;">
              <div class="approval-card-top">
                <div>
                  <strong style="font-size: 0.95rem; color: #fff;">${s.company || s.name}</strong>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">${plan ? plan.name : 'Plano'} • ${s.companyAddress || 'Endereço não informado'}</div>
                </div>
                <span class="badge-approval ${badgeClass}">${badgeText}</span>
              </div>
              <div class="approval-financial-row">
                <span>Valor: <strong>${window.crmStore.formatCurrency(s.value)}</strong></span>
                <span style="color: var(--accent-gold); font-weight: 700;">Sua Comissão (10%): <strong>${window.crmStore.formatCurrency(comm)}</strong></span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // Hot Leads preview
    const hotLeadsPreview = document.getElementById('sellerHotLeadsPreview');
    if (hotLeadsPreview) {
      if (hotLeads.length === 0) {
        hotLeadsPreview.innerHTML = `
          <div style="text-align: center; padding: 1.5rem; color: var(--text-muted);">
            <p style="font-size: 0.85rem;">Nenhum cliente em potencial cadastrado no momento.</p>
          </div>
        `;
      } else {
        hotLeadsPreview.innerHTML = hotLeads.slice(0, 3).map(h => `
          <div style="padding: 10px; background: var(--bg-surface); border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--border-subtle);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <strong>${h.company || h.name}</strong>
              <span style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 700;">🔥 Quente</span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 4px;">
              <strong>Motivo:</strong> ${h.reasonNotClosed}
            </div>
          </div>
        `).join('');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==================== 2. MINHAS VENDAS ====================
  renderSellerSales() {
    const user = window.crmStore.getCurrentUser();
    if (!user) return;

    const commData = window.crmStore.getSellerCommissions(user.id);
    const tbody = document.getElementById('sellerSalesTableBody');
    if (!tbody) return;

    if (commData.salesList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            <i data-lucide="inbox" style="width: 36px; height: 36px; margin-bottom: 8px; display: block; margin-inline: auto;"></i>
            Nenhuma venda registrada ainda. Clique em "+ Novo Cliente" para iniciar!
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = commData.salesList.map(s => {
        const plan = window.crmStore.getPlanById(s.planId);
        const comm = s.commissionAmount || Number(((s.value || 0) * 0.10).toFixed(2));
        const dt = s.createdAt ? new Date(s.createdAt).toLocaleDateString('pt-BR') : '-';

        let badgeClass = 'pending';
        let badgeText = '⏳ Aguardando Aprovação';
        let badgeSub = 'Aguardando liberação do sócio';

        if (s.approvalStatus === 'approved' || s.stage === 'ganho') {
          badgeClass = 'approved';
          badgeText = '✅ Aprovada';
          badgeSub = `Aprovado por ${s.approvedByName || 'Sócio'}`;
        } else if (s.approvalStatus === 'denied') {
          badgeClass = 'denied';
          badgeText = '❌ Negada';
          badgeSub = s.denialReason || 'Recusada pelo sócio';
        }

        return `
          <tr>
            <td>
              <div style="font-weight: 700; color: #fff;">${s.company || s.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${s.name} • ${s.phone || ''}</div>
            </td>
            <td>
              <div style="font-weight: 600; color: var(--primary-bright);">${plan ? plan.name : 'Plano'}</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">${s.tvsCount || 1} TV(s) • ${s.mediaFormat === 'video' ? 'Vídeo' : 'Foto'}</div>
            </td>
            <td>
              <span class="amount-display">${window.crmStore.formatCurrency(s.value)}</span>
            </td>
            <td>
              <span class="commission-val-highlight">${window.crmStore.formatCurrency(comm)}</span>
              <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">10% fixo</span>
            </td>
            <td>
              <span class="badge-approval ${badgeClass}">${badgeText}</span>
              <span style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 2px;">${badgeSub}</span>
            </td>
            <td style="font-size: 0.8rem; color: var(--text-secondary);">${dt}</td>
            <td>
              <button class="btn btn-secondary sm" onclick="window.leadsManager.openLeadDetails('${s.id}')" title="Ver Detalhes">
                <i data-lucide="eye"></i> Detalhes
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==================== 3. CLIENTES QUENTES / EM POTENCIAL ====================
  renderSellerHotLeads() {
    const user = window.crmStore.getCurrentUser();
    if (!user) return;

    const hotLeads = window.crmStore.getHotLeads(user.id);
    const container = document.getElementById('sellerHotLeadsGrid');
    if (!container) return;

    if (hotLeads.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--bg-card); border-radius: 12px; border: 1px dashed var(--border-subtle); color: var(--text-muted);">
          <i data-lucide="flame" style="width: 42px; height: 42px; color: var(--accent-gold); margin-bottom: 10px; display: block; margin-inline: auto;"></i>
          <h3 style="color: #fff; margin-bottom: 4px;">Nenhum cliente em potencial cadastrado</h3>
          <p style="font-size: 0.85rem; max-width: 480px; margin: 0 auto 1.25rem;">Cadastre aqui os clientes que demonstraram interesse nas telas mas ainda não fecharam a venda.</p>
          <button class="btn btn-gold sm" onclick="window.sellerManager.openHotLeadModal()">
            <i data-lucide="plus-circle"></i> + Cadastrar Cliente Quente
          </button>
        </div>
      `;
    } else {
      container.innerHTML = hotLeads.map(h => {
        const plan = window.crmStore.getPlanById(h.planInterestId);
        const waClean = (h.phone || '').replace(/\D/g, '');
        const waLink = waClean ? `https://wa.me/55${waClean}?text=${encodeURIComponent(`Olá ${h.name}, tudo bem? Sou o ${user.name} da Conecta Mais. Gostaria de dar seguimento na nossa proposta de Marketing Indoor!`)}` : '#';

        return `
          <div class="hotlead-card">
            <div class="hotlead-card-header">
              <div class="hotlead-title-box">
                <h3>${h.company || h.name}</h3>
                <span>Contato: <strong>${h.name}</strong></span>
              </div>
              <span class="tag-pill" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); border-color: rgba(245, 158, 11, 0.3); font-weight: 700;">
                🔥 Quente
              </span>
            </div>

            <div class="hotlead-reason-box">
              <div class="hotlead-reason-label">
                <i data-lucide="help-circle" style="width: 13px; height: 13px;"></i>
                Motivo do Não Fechamento Imediato:
              </div>
              <div class="hotlead-reason-text">${h.reasonNotClosed}</div>
            </div>

            <div class="hotlead-info-list">
              <div class="hotlead-info-item">
                <i data-lucide="phone"></i>
                <span>${h.phone || 'Sem telefone'}</span>
              </div>
              <div class="hotlead-info-item">
                <i data-lucide="map-pin"></i>
                <span style="font-size: 0.78rem;">${h.address || 'Endereço não informado'}</span>
              </div>
              <div class="hotlead-info-item">
                <i data-lucide="tv"></i>
                <span>Interesse: <strong>${plan ? plan.name : 'Plano de TVs'}</strong></span>
              </div>
            </div>

            <div class="hotlead-card-footer">
              <a href="${waLink}" target="_blank" class="btn btn-secondary sm" style="color: #10b981;" title="Conversar no WhatsApp">
                <i data-lucide="message-circle"></i> WhatsApp
              </a>
              <button class="btn btn-secondary sm" onclick="window.sellerManager.openHotLeadModal('${h.id}')" title="Editar Informações">
                <i data-lucide="edit-3"></i>
              </button>
              <button class="btn btn-gold sm" style="font-weight: 700; flex: 1;" onclick="window.sellerManager.handleConvertHotLeadToSale('${h.id}')">
                <i data-lucide="check-circle-2"></i> Fechar Venda
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==================== 4. MINHAS COMISSÕES (EXTRATO 10%) ====================
  renderSellerCommissions() {
    const user = window.crmStore.getCurrentUser();
    if (!user) return;

    const commData = window.crmStore.getSellerCommissions(user.id);

    const totalSoldEl = document.getElementById('commTotalSoldDisplay');
    const totalApprovedEl = document.getElementById('commTotalApprovedDisplay');
    const totalPendingEl = document.getElementById('commTotalPendingDisplay');
    const tbody = document.getElementById('sellerCommissionsTableBody');

    if (totalSoldEl) totalSoldEl.textContent = window.crmStore.formatCurrency(commData.totalSold);
    if (totalApprovedEl) totalApprovedEl.textContent = window.crmStore.formatCurrency(commData.approvedCommission);
    if (totalPendingEl) totalPendingEl.textContent = window.crmStore.formatCurrency(commData.pendingCommission);

    if (tbody) {
      if (commData.salesList.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
              Nenhum registro de comissão no momento.
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = commData.salesList.map(s => {
          const plan = window.crmStore.getPlanById(s.planId);
          const comm = s.commissionAmount || Number(((s.value || 0) * 0.10).toFixed(2));
          const netEmpresa = Number(((s.value || 0) - comm).toFixed(2));
          const dt = s.createdAt ? new Date(s.createdAt).toLocaleDateString('pt-BR') : '-';

          let statusBadge = `<span class="badge-approval pending">⏳ Aguardando Aprovação</span>`;
          if (s.approvalStatus === 'approved' || s.stage === 'ganho') {
            statusBadge = `<span class="badge-approval approved">✅ Liberada / Aprovada</span>`;
          } else if (s.approvalStatus === 'denied') {
            statusBadge = `<span class="badge-approval denied">❌ Cancelada / Negada</span>`;
          }

          return `
            <tr>
              <td>
                <div style="font-weight: 700; color: #fff;">${s.company || s.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${plan ? plan.name : 'Plano'}</div>
              </td>
              <td>${window.crmStore.formatCurrency(s.value)}</td>
              <td>
                <span class="tag-pill" style="background: rgba(0, 210, 255, 0.15); color: #00d2ff; font-weight: 700;">10% Fixo</span>
              </td>
              <td>
                <span class="commission-val-highlight">${window.crmStore.formatCurrency(comm)}</span>
              </td>
              <td>
                <span style="font-size: 0.85rem; color: var(--text-muted);">${window.crmStore.formatCurrency(netEmpresa)}</span>
              </td>
              <td>${statusBadge}</td>
              <td style="font-size: 0.8rem; color: var(--text-muted);">${dt}</td>
            </tr>
          `;
        }).join('');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // ==================== MODAL CLIENTE QUENTE (HOT LEAD) ====================
  openHotLeadModal(hotLeadId = null) {
    const modal = document.getElementById('modalHotLead');
    const form = document.getElementById('formHotLead');
    if (form) form.reset();

    this.currentEditingHotLeadId = hotLeadId;
    const titleEl = document.getElementById('modalHotLeadTitle');

    if (hotLeadId) {
      const hot = window.crmStore.getHotLeadById(hotLeadId);
      if (hot) {
        if (titleEl) titleEl.textContent = 'Editar Cliente em Potencial';
        document.getElementById('hotLeadName').value = hot.name || '';
        document.getElementById('hotLeadCompany').value = hot.company || '';
        document.getElementById('hotLeadPhone').value = hot.phone || '';
        document.getElementById('hotLeadAddress').value = hot.address || '';
        document.getElementById('hotLeadPlanInterest').value = hot.planInterestId || 'plan-presenca';
        document.getElementById('hotLeadReason').value = hot.reasonNotClosed || '';
        document.getElementById('hotLeadNotes').value = hot.notes || '';
      }
    } else {
      if (titleEl) titleEl.textContent = 'Cadastrar Cliente em Potencial / Quente';
    }

    if (modal) modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeHotLeadModal() {
    this.currentEditingHotLeadId = null;
    const modal = document.getElementById('modalHotLead');
    if (modal) modal.classList.remove('active');
  }

  handleHotLeadSubmit() {
    const name = document.getElementById('hotLeadName')?.value || 'Contato';
    const company = document.getElementById('hotLeadCompany')?.value || name;
    const phone = document.getElementById('hotLeadPhone')?.value || '';
    const address = document.getElementById('hotLeadAddress')?.value || '';
    const planInterestId = document.getElementById('hotLeadPlanInterest')?.value || 'plan-presenca';
    const reasonNotClosed = document.getElementById('hotLeadReason')?.value || 'Em análise';
    const notes = document.getElementById('hotLeadNotes')?.value || '';

    const user = window.crmStore.getCurrentUser();

    if (this.currentEditingHotLeadId) {
      window.crmStore.updateHotLead(this.currentEditingHotLeadId, {
        name, company, phone, address, planInterestId, reasonNotClosed, notes
      });
      if (window.notificationsManager) {
        window.notificationsManager.showToast('Sucesso', `Cliente potencial "${company}" atualizado!`, 'success');
      }
    } else {
      window.crmStore.addHotLead({
        name, company, phone, address, planInterestId, reasonNotClosed, notes, sellerId: user?.id
      });
      if (window.notificationsManager) {
        window.notificationsManager.showToast('Registrado', `Cliente potencial "${company}" adicionado aos seus Clientes Quentes!`, 'success');
      }
    }

    this.closeHotLeadModal();
    this.renderSellerHotLeads();
  }

  handleConvertHotLeadToSale(hotLeadId) {
    const hot = window.crmStore.getHotLeadById(hotLeadId);
    if (!hot) return;

    // Open Lead Registration Modal with prefilled values
    if (window.leadsManager) {
      window.leadsManager.openNewLeadModal(hot.planInterestId);

      setTimeout(() => {
        const nameInput = document.getElementById('leadName');
        const companyInput = document.getElementById('leadCompany');
        const phoneInput = document.getElementById('leadPhone');
        const addressInput = document.getElementById('leadCompanyAddress');
        const notesInput = document.getElementById('leadNotes');

        if (nameInput) nameInput.value = hot.name || '';
        if (companyInput) companyInput.value = hot.company || hot.name || '';
        if (phoneInput) phoneInput.value = hot.phone || '';
        if (addressInput) addressInput.value = hot.address || '';
        if (notesInput) notesInput.value = `Fechamento de Cliente Quente. Motivo anterior: ${hot.reasonNotClosed}. ${hot.notes || ''}`;

        // Tag conversion
        window.crmStore.deleteHotLead(hotLeadId);
      }, 80);
    }
  }
}

// Global Seller Manager instance
window.sellerManager = new SellerManager();

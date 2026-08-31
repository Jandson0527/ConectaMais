/**
 * Conecta Mais - Finance & Cash Flow Manager
 * Faturamento, Entradas, Despesas, Saldo Líquido, MRR e Divisão por Sócios.
 */

class FinanceManager {
  constructor() {
    this.currentFilter = 'all'; // 'all', 'income', 'expense', 'paid', 'pending'
    this.currentPartnerFilter = 'all'; // 'all' or userId
    this.chart = null;

    this.init();
  }

  init() {
    this.setupEventListeners();

    window.crmStore.subscribe(() => {
      if (window.appRouter && window.appRouter.currentView === 'finance') {
        this.render();
      }
    });
  }

  setupEventListeners() {
    // New Income Button
    const btnNewIncome = document.getElementById('btnNewIncome');
    if (btnNewIncome) {
      btnNewIncome.addEventListener('click', () => this.openTransactionModal('income'));
    }

    // New Expense Button
    const btnNewExpense = document.getElementById('btnNewExpense');
    if (btnNewExpense) {
      btnNewExpense.addEventListener('click', () => this.openTransactionModal('expense'));
    }

    // Export CSV Button
    const btnExportFinance = document.getElementById('btnExportFinance');
    if (btnExportFinance) {
      btnExportFinance.addEventListener('click', () => window.crmStore.exportTransactionsCSV());
    }

    // Modal Close buttons
    const modalClose = document.getElementById('modalTransactionClose');
    const modalCancel = document.getElementById('modalTransactionCancel');
    if (modalClose) modalClose.addEventListener('click', () => this.closeTransactionModal());
    if (modalCancel) modalCancel.addEventListener('click', () => this.closeTransactionModal());

    // Transaction Form Submit
    const formTx = document.getElementById('formTransaction');
    if (formTx) {
      formTx.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleTransactionSubmit();
      });
    }

    // Type change in modal
    const txTypeSelect = document.getElementById('txType');
    if (txTypeSelect) {
      txTypeSelect.addEventListener('change', (e) => this.updateCategoryOptions(e.target.value));
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.finance-toolbar .filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.dataset.filter || 'all';
        this.renderTransactionsTable();
      });
    });

    // Partner Filter Dropdown
    const partnerSelect = document.getElementById('financePartnerFilter');
    if (partnerSelect) {
      partnerSelect.addEventListener('change', (e) => {
        this.currentPartnerFilter = e.target.value;
        this.render();
      });
    }
  }

  render() {
    this.populatePartnerFilterSelect();
    this.renderKPIs();
    this.renderChart();
    this.renderPartnersBreakdown();
    this.renderTransactionsTable();
    if (window.lucide) window.lucide.createIcons();
  }

  populatePartnerFilterSelect() {
    const partnerSelect = document.getElementById('financePartnerFilter');
    if (!partnerSelect) return;
    const users = window.crmStore.getUsers();
    const cur = this.currentPartnerFilter;

    partnerSelect.innerHTML = `
      <option value="all" ${cur === 'all' ? 'selected' : ''}>Todos os Sócios</option>
      ${users.map(u => `<option value="${u.id}" ${cur === u.id ? 'selected' : ''}>${u.name}</option>`).join('')}
    `;
  }

  renderKPIs() {
    const summary = window.crmStore.getFinancialSummary(this.currentPartnerFilter);

    // 1. Incomes
    const incomeEl = document.getElementById('financeTotalIncome');
    const incomePendingEl = document.getElementById('financeIncomePending');
    if (incomeEl) incomeEl.textContent = window.crmStore.formatCurrency(summary.totalIncomePaid);
    if (incomePendingEl) incomePendingEl.textContent = `+ ${window.crmStore.formatCurrency(summary.totalIncomePending)} a receber`;

    // 2. Expenses (Custos Manuais + Custo Fixo de TVs R$ 35/TV)
    const expenseEl = document.getElementById('financeTotalExpense');
    const expensePendingEl = document.getElementById('financeExpensePending');
    if (expenseEl) expenseEl.textContent = window.crmStore.formatCurrency(summary.totalExpensePaid);
    if (expensePendingEl) {
      expensePendingEl.innerHTML = `Inclui <strong>${window.crmStore.formatCurrency(summary.tvFixedMonthlyCost)}</strong> de ${summary.totalNetworkTvs} TVs (${window.crmStore.formatCurrency(summary.costPerTv)}/TV)`;
    }

    // 3. Balance (Lucro Líquido Real)
    const balanceEl = document.getElementById('financeNetBalance');
    const balanceSubEl = document.getElementById('financeBalanceSub');
    if (balanceEl) balanceEl.textContent = window.crmStore.formatCurrency(summary.netBalance);
    if (balanceSubEl) {
      const isPos = summary.netBalance >= 0;
      balanceSubEl.textContent = isPos ? 'Resultado Positivo (Lucro Líquido)' : 'Atenção: Saldo Negativo';
      balanceSubEl.style.color = isPos ? '#10b981' : '#ef4444';
    }

    // 4. MRR & Active TVs
    const mrrEl = document.getElementById('financeMRR');
    const mrrSubEl = document.getElementById('financeMRRSub');
    if (mrrEl) mrrEl.textContent = window.crmStore.formatCurrency(summary.mrr);
    if (mrrSubEl) mrrSubEl.textContent = `${summary.totalActiveTVs} TVs ativas • ${summary.activeClientsCount} contratos`;
  }

  renderChart() {
    const canvas = document.getElementById('financeFlowChart');
    if (!canvas) return;

    const txs = window.crmStore.getTransactions();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#475569';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

    // Group last 6 months or categories
    const months = ['Jul', 'Ago', 'Set (Atual)'];
    const incomeData = [1200, 1550, txs.filter(t => t.type === 'income' && t.status === 'paid').reduce((s, t) => s + t.amount, 0)];
    const expenseData = [450, 520, txs.filter(t => t.type === 'expense' && t.status === 'paid').reduce((s, t) => s + t.amount, 0)];

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Entradas / Faturamento (R$)',
            data: incomeData,
            backgroundColor: '#00d2ff',
            borderRadius: 6
          },
          {
            label: 'Saídas / Despesas (R$)',
            data: expenseData,
            backgroundColor: '#ef4444',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 12 } }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: 'Plus Jakarta Sans' } }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: 'Plus Jakarta Sans' },
              callback: (v) => 'R$ ' + v
            }
          }
        }
      }
    });
  }

  renderPartnersBreakdown() {
    const container = document.getElementById('financePartnersList');
    if (!container) return;

    const users = window.crmStore.getUsers();
    const txs = window.crmStore.getTransactions();

    container.innerHTML = users.map(u => {
      const userIncomes = txs.filter(t => t.type === 'income' && t.status === 'paid' && t.partnerId === u.id).reduce((s, t) => s + (t.amount || 0), 0);
      const userLeadsWon = window.crmStore.getLeads().filter(l => l.assignedTo === u.id && l.stage === 'ganho').length;

      return `
        <div class="partner-income-item">
          <div class="partner-info-box">
            <img src="${u.avatar}" alt="${u.name}">
            <div>
              <div class="partner-name">${u.name}</div>
              <div class="partner-role-sub">${u.roleName || u.role} • ${userLeadsWon} fechamentos</div>
            </div>
          </div>
          <div class="partner-amount">${window.crmStore.formatCurrency(userIncomes)}</div>
        </div>
      `;
    }).join('');
  }

  renderTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;

    let txs = window.crmStore.getTransactions();

    // Filter by type or status
    if (this.currentFilter === 'income') txs = txs.filter(t => t.type === 'income');
    else if (this.currentFilter === 'expense') txs = txs.filter(t => t.type === 'expense');
    else if (this.currentFilter === 'paid') txs = txs.filter(t => t.status === 'paid');
    else if (this.currentFilter === 'pending') txs = txs.filter(t => t.status === 'pending');

    // Filter by Partner
    if (this.currentPartnerFilter && this.currentPartnerFilter !== 'all') {
      txs = txs.filter(t => t.partnerId === this.currentPartnerFilter);
    }

    const totalLabel = document.getElementById('transactionsTotalCount');
    if (totalLabel) totalLabel.textContent = `${txs.length} registros`;

    if (txs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">
            Nenhuma movimentação encontrada para o filtro selecionado.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = txs.map(t => {
      const partner = window.crmStore.getUserById(t.partnerId);
      const seller = t.sellerId ? window.crmStore.getUserById(t.sellerId) : null;
      const isIncome = t.type === 'income';

      return `
        <tr>
          <td>
            <span class="badge-type ${t.type}">
              <i data-lucide="${isIncome ? 'arrow-down-left' : 'arrow-up-right'}" style="width: 13px; height: 13px;"></i>
              ${isIncome ? 'Entrada' : 'Saída'}
            </span>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary); font-size: 0.875rem;">${t.description}</div>
            ${seller ? `
              <div style="font-size: 0.76rem; color: #00d2ff; margin-top: 2px;">
                👤 Vendedor: <strong>${seller.name}</strong> • Comissão 10%: <strong>${window.crmStore.formatCurrency(t.commissionAmount || (t.amount * 0.10))}</strong> • Líquido: <strong>${window.crmStore.formatCurrency(t.netAmount || (t.amount * 0.90))}</strong>
              </div>
            ` : ''}
            ${t.notes ? `<div style="font-size: 0.74rem; color: var(--text-muted);">${t.notes}</div>` : ''}
          </td>
          <td>
            <span class="category-tag">${t.category || 'Geral'}</span>
          </td>
          <td class="amount-display ${t.type}">
            ${isIncome ? '+' : '-'} ${window.crmStore.formatCurrency(t.amount)}
          </td>
          <td>
            <div style="font-size: 0.85rem; color: var(--text-primary);">${window.crmStore.formatDisplayDate(t.date)}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Venc: ${window.crmStore.formatDisplayDate(t.dueDate)}</div>
          </td>
          <td>
            <span class="badge-status ${t.status}" onclick="window.financeManager.toggleStatus('${t.id}')" title="Clique para alternar Pago / Pendente">
              <i data-lucide="${t.status === 'paid' ? 'check-circle-2' : 'clock'}" style="width: 12px; height: 12px;"></i>
              ${t.status === 'paid' ? 'Pago / Recebido' : 'Pendente'}
            </span>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="font-size: 0.8rem; color: var(--text-secondary);">${partner ? partner.name : 'Geral'}</span>
              <button class="btn-icon" style="width: 28px; height: 28px; margin-left: auto;" onclick="window.financeManager.deleteTransaction('${t.id}')" title="Excluir">
                <i data-lucide="trash-2" style="width: 14px; height: 14px; color: var(--danger);"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  toggleStatus(id) {
    const tx = window.crmStore.getTransactionById(id);
    if (!tx) return;
    const newStatus = tx.status === 'paid' ? 'pending' : 'paid';
    window.crmStore.updateTransaction(id, { status: newStatus });
    if (window.notificationsManager) {
      window.notificationsManager.showToast('Status Atualizado', `Movimentação marcada como "${newStatus === 'paid' ? 'Pago' : 'Pendente'}"`, 'success');
    }
    this.render();
  }

  deleteTransaction(id) {
    if (confirm('Tem certeza que deseja excluir esta movimentação financeira?')) {
      window.crmStore.deleteTransaction(id);
      if (window.notificationsManager) {
        window.notificationsManager.showToast('Excluído', 'Movimentação removida do fluxo de caixa.', 'info');
      }
      this.render();
    }
  }

  // Modals & Form
  openTransactionModal(defaultType = 'income') {
    const modal = document.getElementById('modalTransaction');
    if (!modal) return;

    const modalTitle = document.getElementById('modalTransactionTitle');
    const txType = document.getElementById('txType');
    const txPartner = document.getElementById('txPartner');

    if (modalTitle) modalTitle.textContent = defaultType === 'income' ? 'Nova Entrada (Faturamento)' : 'Nova Saída (Despesa)';
    if (txType) txType.value = defaultType;

    this.updateCategoryOptions(defaultType);

    // Populate partners dropdown in modal
    if (txPartner) {
      const users = window.crmStore.getUsers();
      const current = window.crmStore.getCurrentUser();
      txPartner.innerHTML = users.map(u => `
        <option value="${u.id}" ${u.id === current.id ? 'selected' : ''}>${u.name}</option>
      `).join('');
    }

    // Set today's date
    const txDate = document.getElementById('txDate');
    const txDueDate = document.getElementById('txDueDate');
    const today = new Date().toISOString().split('T')[0];
    if (txDate) txDate.value = today;
    if (txDueDate) txDueDate.value = today;

    modal.classList.add('active');
  }

  closeTransactionModal() {
    const modal = document.getElementById('modalTransaction');
    if (modal) modal.classList.remove('active');
    const form = document.getElementById('formTransaction');
    if (form) form.reset();
  }

  updateCategoryOptions(type) {
    const select = document.getElementById('txCategory');
    if (!select) return;

    if (type === 'income') {
      select.innerHTML = `
        <option value="Mensalidade / Plano">Mensalidade / Plano</option>
        <option value="Campanha Avulsa">Campanha Avulsa</option>
        <option value="Taxa de Instalação / Setup">Taxa de Instalação / Setup</option>
        <option value="Criação de Anúncio / Arte">Criação de Anúncio / Arte</option>
        <option value="Outras Receitas">Outras Receitas</option>
      `;
    } else {
      select.innerHTML = `
        <option value="Software & Licenças">Software & Licenças de TV</option>
        <option value="Infraestrutura / Internet">Infraestrutura / Internet / Chips</option>
        <option value="Manutenção / Hardware">Manutenção / Hardware / TVs / Dongles</option>
        <option value="Marketing & Anúncios">Marketing & Anúncios</option>
        <option value="Comissões de Sócios">Comissões de Sócios</option>
        <option value="Impostos & Taxas">Impostos & Taxas</option>
        <option value="Outras Despesas">Outras Despesas</option>
      `;
    }
  }

  handleTransactionSubmit() {
    const type = document.getElementById('txType').value;
    const description = document.getElementById('txDescription').value;
    const amount = document.getElementById('txAmount').value;
    const category = document.getElementById('txCategory').value;
    const date = document.getElementById('txDate').value;
    const dueDate = document.getElementById('txDueDate').value;
    const status = document.getElementById('txStatus').value;
    const paymentMethod = document.getElementById('txPaymentMethod').value;
    const partnerId = document.getElementById('txPartner').value;
    const notes = document.getElementById('txNotes').value;

    window.crmStore.addTransaction({
      type,
      description,
      amount,
      category,
      date,
      dueDate,
      status,
      paymentMethod,
      partnerId,
      notes
    });

    this.closeTransactionModal();
    if (window.notificationsManager) {
      window.notificationsManager.showToast('Sucesso', `${type === 'income' ? 'Entrada' : 'Despesa'} lançada com sucesso!`, 'success');
    }
    this.render();
  }
}

// Global Finance Manager instance
window.financeManager = new FinanceManager();

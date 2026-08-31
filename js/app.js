/**
 * Conecta Mais - Main Application Coordinator
 * View router, sidebar collapse, theme controller, search & shortcuts.
 */

class AppRouter {
  constructor() {
    this.currentView = 'dashboard';
    this.sidebar = document.getElementById('sidebar');
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupTheme();
    this.setupSidebarToggle();
    this.setupDropdowns();
    this.setupGlobalSearch();
    this.setupDataBackupAndRestore();

    // Initial Lucide Icons Render
    if (window.lucide) window.lucide.createIcons();

    // Default view
    this.navigate('dashboard');
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.view;
        if (view) this.navigate(view);
      });
    });
  }

  navigate(viewName) {
    this.currentView = viewName;

    // Update active nav button
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Switch view panel
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Refresh view specific components
    if (viewName === 'dashboard' && window.dashboardManager) {
      window.dashboardManager.render();
    } else if (viewName === 'seller-dashboard' && window.sellerManager) {
      window.sellerManager.renderSellerDashboard();
    } else if (viewName === 'seller-sales' && window.sellerManager) {
      window.sellerManager.renderSellerSales();
    } else if (viewName === 'seller-hotleads' && window.sellerManager) {
      window.sellerManager.renderSellerHotLeads();
    } else if (viewName === 'seller-commissions' && window.sellerManager) {
      window.sellerManager.renderSellerCommissions();
    } else if (viewName === 'partner-sellers' && window.partnersSellersManager) {
      window.partnersSellersManager.renderSellersView();
    } else if (viewName === 'kanban' && window.kanbanManager) {
      window.kanbanManager.renderBoard();
    } else if (viewName === 'leads' && window.leadsManager) {
      window.leadsManager.renderLeadsTable();
    } else if (viewName === 'screens' && window.screensManager) {
      window.screensManager.render();
    } else if (viewName === 'plans' && window.plansManager) {
      window.plansManager.render();
    } else if (viewName === 'finance' && window.financeManager) {
      window.financeManager.render();
    } else if (viewName === 'calendar' && window.calendarManager) {
      window.calendarManager.render();
    } else if (viewName === 'access' && window.authManager) {
      window.authManager.renderUsersTable();
    } else if (viewName === 'reports' && window.dashboardManager) {
      window.dashboardManager.renderReportsCharts(window.crmStore.getLeads());
    }

    // Close mobile menu if open
    if (this.sidebar) this.sidebar.classList.remove('mobile-open');

    if (window.lucide) window.lucide.createIcons();
  }

  setupTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    const savedTheme = localStorage.getItem('conecta_mais_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeUI(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const curTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = curTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('conecta_mais_theme', newTheme);
        this.updateThemeUI(newTheme);

        // Re-render charts for theme colors
        if (window.dashboardManager) {
          window.dashboardManager.render();
        }
      });
    }
  }

  updateThemeUI(theme) {
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    if (theme === 'dark') {
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
      if (themeText) themeText.textContent = 'Modo Escuro';
    } else {
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
      if (themeText) themeText.textContent = 'Modo Claro';
    }
    if (window.lucide) window.lucide.createIcons();
  }

  setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    if (sidebarToggle && this.sidebar) {
      sidebarToggle.addEventListener('click', () => {
        this.sidebar.classList.toggle('collapsed');
      });
    }

    if (mobileMenuBtn && this.sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        this.sidebar.classList.toggle('mobile-open');
      });
    }
  }

  setupDropdowns() {
    const btnData = document.getElementById('btnDataActions');
    const dataMenu = document.getElementById('dataDropdownMenu');
    const btnNotif = document.getElementById('btnNotificationCenter');
    const notifMenu = document.getElementById('notificationDropdown');

    if (btnData && dataMenu) {
      btnData.addEventListener('click', (e) => {
        e.stopPropagation();
        if (notifMenu) notifMenu.classList.remove('active');
        dataMenu.classList.toggle('active');
      });
    }

    if (btnNotif && notifMenu) {
      btnNotif.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dataMenu) dataMenu.classList.remove('active');
        notifMenu.classList.toggle('active');
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (dataMenu && !dataMenu.contains(e.target) && e.target !== btnData) {
        dataMenu.classList.remove('active');
      }
      if (notifMenu && !notifMenu.contains(e.target) && e.target !== btnNotif) {
        notifMenu.classList.remove('active');
      }
    });
  }

  setupGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (this.currentView !== 'leads' && val.length > 0) {
        this.navigate('leads');
      }
      const tableSearch = document.getElementById('tableSearchInput');
      if (tableSearch) {
        tableSearch.value = val;
        if (window.leadsManager) window.leadsManager.renderLeadsTable();
      }
    });

    // Keyboard shortcut '/' to focus global search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  setupDataBackupAndRestore() {
    const btnExportCSV = document.getElementById('btnExportCSV');
    const btnExportJSON = document.getElementById('btnExportJSON');
    const importInput = document.getElementById('importJsonFileInput');
    const btnResetDemo = document.getElementById('btnResetDemoData');

    if (btnExportCSV) {
      btnExportCSV.addEventListener('click', () => {
        window.crmStore.exportToCSV();
        window.notificationManager.showToast('Exportação de leads em CSV concluída!', 'success');
      });
    }

    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => {
        window.crmStore.exportToJSON();
        window.notificationManager.showToast('Backup completo em JSON gerado!', 'success');
      });
    }

    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            window.crmStore.importJSON(event.target.result);
            window.notificationManager.showToast('Backup restaurado com sucesso!', 'success');
            setTimeout(() => window.location.reload(), 800);
          } catch (err) {
            window.notificationManager.showToast('Arquivo de backup inválido!', 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    if (btnResetDemo) {
      btnResetDemo.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja restaurar os dados de demonstração padrão? Todas as alterações serão substituídas.')) {
          window.crmStore.resetDemoData();
          window.notificationManager.showToast('Dados de demonstração restaurados com sucesso!', 'info');
        }
      });
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.appRouter = new AppRouter();
});

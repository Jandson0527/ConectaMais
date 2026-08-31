/**
 * Conecta Mais - Auth & Access Management
 * User profiles, role-based access, partner switcher & settings.
 */

class AuthManager {
  constructor() {
    this.loginScreen = document.getElementById('loginScreen');
    this.formLogin = document.getElementById('formLogin');
    this.loginErrorAlert = document.getElementById('loginErrorAlert');
    this.loginErrorMessage = document.getElementById('loginErrorMessage');
    this.userAvatarImg = document.getElementById('userAvatarImg');
    this.currentUserName = document.getElementById('currentUserName');
    this.currentUserRole = document.getElementById('currentUserRole');
    this.usersTableBody = document.getElementById('usersTableBody');
    this.switchUserList = document.getElementById('switchUserList');
    this.modalUser = document.getElementById('modalUser');
    this.modalSwitchUser = document.getElementById('modalSwitchUser');
    this.formUser = document.getElementById('formUser');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupLoginScreen();
    this.renderCurrentUserInfo();
    this.renderUsersTable();
    this.renderSwitchUserModal();
    this.populateUserSelects();

    window.crmStore.subscribe(() => {
      this.checkAuthStatus();
      this.renderCurrentUserInfo();
      this.renderUsersTable();
      this.renderSwitchUserModal();
      this.populateUserSelects();
    });
  }

  setupLoginScreen() {
    this.renderQuickPartnerButtons();
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const isAuth = window.crmStore.isAuthenticated();
    if (!this.loginScreen) this.loginScreen = document.getElementById('loginScreen');
    if (!this.loginScreen) return;

    if (isAuth) {
      this.loginScreen.classList.add('hidden');
    } else {
      this.loginScreen.classList.remove('hidden');
      this.renderQuickPartnerButtons();
    }
  }

  renderQuickPartnerButtons() {
    const container = document.getElementById('quickPartnerBtnsContainer');
    if (!container) return;
    const users = window.crmStore.getUsers();

    container.innerHTML = users.map(u => {
      const isSeller = u.role === 'vendedor';
      const roleBadge = isSeller ? '💼 Vendedor' : '🛡️ Sócio';
      const borderColor = isSeller ? '#00d2ff' : 'var(--primary)';

      return `
        <button type="button" class="quick-partner-btn" style="border-left: 3px solid ${borderColor};" onclick="window.authManager.quickDemoLogin('${u.email}')">
          <img src="${u.avatar}" alt="${u.name}">
          <div class="quick-partner-info">
            <div class="quick-partner-name">${u.name}</div>
            <div class="quick-partner-role" style="${isSeller ? 'color: #00d2ff; font-weight: 700;' : ''}">${roleBadge}</div>
          </div>
        </button>
      `;
    }).join('');
  }

  quickDemoLogin(email) {
    const emailInput = document.getElementById('loginEmail');
    const pwdInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = email;
    if (pwdInput) pwdInput.value = 'conecta123';
    this.handleLoginSubmit();
  }

  handleLoginSubmit() {
    const email = document.getElementById('loginEmail')?.value || '';
    const pwd = document.getElementById('loginPassword')?.value || '';

    try {
      const user = window.crmStore.login(email, pwd);
      if (this.loginErrorAlert) this.loginErrorAlert.classList.remove('active');
      this.checkAuthStatus();
      this.renderCurrentUserInfo();

      const welcomeMsg = user.role === 'vendedor' 
        ? `Bem-vindo(a), ${user.name}! Painel do Vendedor e Comissões liberado.`
        : `Bem-vindo(a), ${user.name}! Painel Administrativo Conecta Mais liberado.`;

      window.notificationsManager.showToast('Login Realizado!', welcomeMsg, 'success');
      
      // Auto navigate based on role
      if (window.appRouter) {
        if (user.role === 'vendedor') {
          window.appRouter.navigate('seller-dashboard');
        } else {
          window.appRouter.navigate('dashboard');
        }
      }
    } catch (err) {
      if (this.loginErrorAlert && this.loginErrorMessage) {
        this.loginErrorMessage.textContent = err.message || 'Erro ao realizar login.';
        this.loginErrorAlert.classList.add('active');
      } else {
        window.notificationsManager.showToast('Erro de Login', err.message, 'error');
      }
    }
  }

  handleLogout() {
    window.crmStore.logout();
    this.checkAuthStatus();
    window.notificationsManager.showToast('Sessão Encerrada', 'Você saiu com sucesso do sistema.', 'info');
  }

  setupEventListeners() {
    // Login Form Submit
    if (this.formLogin) {
      this.formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLoginSubmit();
      });
    }

    // Toggle Password Visibility
    const btnTogglePwd = document.getElementById('btnToggleLoginPwd');
    if (btnTogglePwd) {
      btnTogglePwd.addEventListener('click', () => {
        const pwdInput = document.getElementById('loginPassword');
        if (!pwdInput) return;
        const isPwd = pwdInput.type === 'password';
        pwdInput.type = isPwd ? 'text' : 'password';
        btnTogglePwd.innerHTML = isPwd ? '<i data-lucide="eye-off" style="width: 16px; height: 16px;"></i>' : '<i data-lucide="eye" style="width: 16px; height: 16px;"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Logout button triggers
    const logoutBtns = document.querySelectorAll('.btn-logout-trigger');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleLogout());
    });

    // Switch User Trigger
    const switchBtn = document.getElementById('userSwitchBtn');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => this.openSwitchUserModal());
    }

    const closeSwitch = document.getElementById('modalSwitchUserClose');
    if (closeSwitch) {
      closeSwitch.addEventListener('click', () => this.closeSwitchUserModal());
    }

    // New User Button on Access View
    const btnNewUser = document.getElementById('btnNewUser');
    if (btnNewUser) {
      btnNewUser.addEventListener('click', () => this.openNewUserModal());
    }

    const closeUserModal = document.getElementById('modalUserClose');
    const cancelUserModal = document.getElementById('modalUserCancel');
    if (closeUserModal) closeUserModal.addEventListener('click', () => this.closeUserModal());
    if (cancelUserModal) cancelUserModal.addEventListener('click', () => this.closeUserModal());

    // Role selection dynamic permissions update in modal
    const userRoleSelect = document.getElementById('userRole');
    if (userRoleSelect) {
      userRoleSelect.addEventListener('change', (e) => {
        const permAdmin = document.getElementById('permAdminItem');
        if (permAdmin) {
          permAdmin.style.opacity = e.target.value === 'admin' ? '1' : '0.4';
        }
      });
    }

    // User Form Submit
    if (this.formUser) {
      this.formUser.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleUserFormSubmit();
      });
    }
  }

  renderCurrentUserInfo() {
    const user = window.crmStore.getCurrentUser();
    if (!user) return;

    if (this.userAvatarImg) this.userAvatarImg.src = user.avatar;
    if (this.currentUserName) this.currentUserName.textContent = user.name;
    if (this.currentUserRole) {
      this.currentUserRole.textContent = user.roleName || (user.role === 'vendedor' ? 'Vendedor Comercial (10%)' : (user.role === 'admin' ? 'Sócio Diretor' : 'Sócio'));
    }

    const isSeller = user.role === 'vendedor';

    // Show/Hide Seller vs Partner navigation items
    document.querySelectorAll('.nav-seller-only').forEach(el => {
      el.style.display = isSeller ? 'flex' : 'none';
    });

    document.querySelectorAll('.nav-partner-only').forEach(el => {
      el.style.display = isSeller ? 'none' : 'flex';
    });

    // Header badge
    const headerPartnerBadge = document.getElementById('headerPartnerBadge');
    if (headerPartnerBadge) {
      headerPartnerBadge.textContent = isSeller ? '💼 PAINEL DO VENDEDOR' : '🛡️ ACESSO SÓCIOS';
      headerPartnerBadge.style.color = isSeller ? '#00d2ff' : 'var(--primary)';
      headerPartnerBadge.style.borderColor = isSeller ? 'rgba(0, 210, 255, 0.3)' : 'rgba(0, 180, 216, 0.3)';
    }
  }

  renderUsersTable() {
    if (!this.usersTableBody) return;
    const users = window.crmStore.getUsers();
    const leads = window.crmStore.getLeads();
    const current = window.crmStore.getCurrentUser();

    const totalLabel = document.getElementById('usersListTotal');
    if (totalLabel) totalLabel.textContent = `${users.length} sócios cadastrados`;

    this.usersTableBody.innerHTML = users.map(u => {
      const userLeads = leads.filter(l => l.assignedTo === u.id);
      const isCurrent = current && u.id === current.id;

      return `
        <tr>
          <td>
            <div class="lead-name-cell">
              <img src="${u.avatar}" alt="${u.name}" style="width: 38px; height: 38px; border-radius: 9999px; object-fit: cover; border: 2px solid var(--border-medium);">
              <div>
                <div class="lead-name-title">${u.name} ${isCurrent ? '<span style="font-size: 0.7rem; color: var(--primary); font-weight: 700; margin-left: 4px;">(Você)</span>' : ''}</div>
                <div class="lead-company-sub">${u.phone || 'Sem telefone'}</div>
              </div>
            </div>
          </td>
          <td>${u.email}</td>
          <td>
            <span class="badge-stage ${u.role === 'admin' ? 'stage-perdido' : (u.role === 'manager' ? 'stage-reuniao' : 'stage-qualificacao')}">
              ${u.roleName || u.role}
            </span>
          </td>
          <td style="font-size: 0.8rem; color: var(--text-secondary);">
            <i data-lucide="check-circle-2" style="width: 14px; height: 14px; color: var(--success); vertical-align: middle;"></i> Visualização Total de Leads
          </td>
          <td>
            <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem; color: var(--success); font-weight: 600;">
              <span style="width: 7px; height: 7px; background-color: var(--success); border-radius: 9999px;"></span> Ativo
            </span>
          </td>
          <td><strong>${userLeads.length}</strong> leads</td>
          <td class="text-right">
            <div class="table-actions">
              <button class="btn-icon" title="Editar Usuário" onclick="window.authManager.openEditUserModal('${u.id}')">
                <i data-lucide="edit-3"></i>
              </button>
              ${users.length > 1 ? `
                <button class="btn-icon" title="Remover Acesso" onclick="window.authManager.handleDeleteUser('${u.id}', '${u.name}')" style="color: var(--danger);">
                  <i data-lucide="trash-2"></i>
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  renderSwitchUserModal() {
    if (!this.switchUserList) return;
    const users = window.crmStore.getUsers();
    const current = window.crmStore.getCurrentUser();

    this.switchUserList.innerHTML = users.map(u => `
      <div class="switch-user-item ${u.id === current.id ? 'active' : ''}" onclick="window.authManager.selectActiveUser('${u.id}')">
        <img src="${u.avatar}" alt="${u.name}" style="width: 38px; height: 38px; border-radius: 9999px; object-fit: cover;">
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 0.9rem;">${u.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">${u.roleName}</div>
        </div>
        ${u.id === current.id ? '<i data-lucide="check" class="text-primary" style="width: 18px; height: 18px;"></i>' : ''}
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  populateUserSelects() {
    const users = window.crmStore.getUsers();
    const selects = [
      document.getElementById('leadAssignedTo'),
      document.getElementById('kanbanUserFilter'),
      document.getElementById('tableUserFilter')
    ];

    selects.forEach(sel => {
      if (!sel) return;
      const isFilter = sel.id.includes('Filter');
      const curVal = sel.value;

      let options = '';
      if (isFilter) {
        options += '<option value="all">Todos os Responsáveis</option>';
      }

      users.forEach(u => {
        options += `<option value="${u.id}">${u.name} (${u.roleName.split(' ')[0]})</option>`;
      });

      sel.innerHTML = options;
      if (curVal && (curVal === 'all' || users.some(u => u.id === curVal))) {
        sel.value = curVal;
      }
    });
  }

  openSwitchUserModal() {
    this.renderSwitchUserModal();
    if (this.modalSwitchUser) this.modalSwitchUser.classList.add('active');
  }

  closeSwitchUserModal() {
    if (this.modalSwitchUser) this.modalSwitchUser.classList.remove('active');
  }

  selectActiveUser(userId) {
    window.crmStore.setCurrentUser(userId);
    this.closeSwitchUserModal();
    const user = window.crmStore.getCurrentUser();
    window.notificationManager.showToast(`Perfil alternado para ${user.name}`, 'info');
  }

  openNewUserModal() {
    if (!this.formUser) return;
    this.formUser.reset();
    document.getElementById('userFormId').value = '';
    document.getElementById('modalUserTitle').textContent = 'Cadastrar Novo Sócio / Membro';
    if (this.modalUser) this.modalUser.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  openEditUserModal(userId) {
    const user = window.crmStore.getUserById(userId);
    if (!user || !this.formUser) return;

    document.getElementById('userFormId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userPhone').value = user.phone || '';
    document.getElementById('userAvatar').value = user.avatar.includes('dicebear') ? '' : user.avatar;
    document.getElementById('modalUserTitle').textContent = 'Editar Sócio & Permissões';

    if (this.modalUser) this.modalUser.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  closeUserModal() {
    if (this.modalUser) this.modalUser.classList.remove('active');
  }

  handleUserFormSubmit() {
    const id = document.getElementById('userFormId').value;
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const phone = document.getElementById('userPhone').value;
    const avatar = document.getElementById('userAvatar').value;

    if (id) {
      window.crmStore.updateUser(id, { name, email, role, phone, ...(avatar ? { avatar } : {}) });
      window.notificationManager.showToast(`Sócio ${name} atualizado com sucesso!`, 'success');
    } else {
      window.crmStore.addUser({ name, email, role, phone, avatar });
      window.notificationManager.showToast(`Novo sócio ${name} cadastrado com sucesso!`, 'success');
    }

    this.closeUserModal();
  }

  handleDeleteUser(userId, userName) {
    if (confirm(`Tem certeza que deseja revogar o acesso e excluir o usuário "${userName}"?`)) {
      try {
        window.crmStore.deleteUser(userId);
        window.notificationManager.showToast(`Usuário "${userName}" removido com sucesso.`, 'info');
      } catch (err) {
        window.notificationManager.showToast(err.message, 'error');
      }
    }
  }
}

window.authManager = new AuthManager();

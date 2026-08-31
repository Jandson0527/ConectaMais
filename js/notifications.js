/**
 * Conecta Mais - Notifications & Toasts
 * System notifications, audio alerts, and toast feedback.
 */

class NotificationManager {
  constructor() {
    this.toastContainer = document.getElementById('toastContainer');
    this.notifList = document.getElementById('notificationList');
    this.notifDot = document.getElementById('notificationDot');
    this.init();
  }

  init() {
    // Subscribe to store updates for notifications
    window.crmStore.subscribe(() => {
      this.renderNotificationCenter();
    });

    const markBtn = document.getElementById('btnMarkNotificationsRead');
    if (markBtn) {
      markBtn.addEventListener('click', () => {
        window.crmStore.state.notifications = [];
        window.crmStore.saveState();
        this.showToast('Todas as notificações foram limpas.', 'info');
      });
    }

    this.renderNotificationCenter();
  }

  showToast(arg1, arg2 = 'success', arg3 = null, duration = 3500) {
    if (!this.toastContainer) this.toastContainer = document.getElementById('toastContainer');
    if (!this.toastContainer) return;

    let message = arg1;
    let type = arg2;

    if (arg3 && typeof arg3 === 'string') {
      message = `<strong>${arg1}:</strong> ${arg2}`;
      type = arg3;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'info') iconName = 'info';

    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
      <span class="toast-msg">${message}</span>
    `;

    this.toastContainer.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  renderNotificationCenter() {
    if (!this.notifList) this.notifList = document.getElementById('notificationList');
    if (!this.notifList) return;
    const notifs = (window.crmStore && window.crmStore.state) ? (window.crmStore.state.notifications || []) : [];

    if (this.notifDot) {
      this.notifDot.style.display = notifs.length > 0 ? 'block' : 'none';
    }

    if (notifs.length === 0) {
      this.notifList.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.825rem;">
          Nenhuma notificação recente.
        </div>
      `;
      return;
    }

    this.notifList.innerHTML = notifs.map(n => `
      <div class="notification-item">
        <div class="notif-icon ${n.type}">
          <i data-lucide="${n.type === 'meeting' ? 'calendar' : (n.type === 'won' ? 'trophy' : 'bell')}" style="width: 14px; height: 14px;"></i>
        </div>
        <div class="notif-content">
          <div>${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }
}

window.notificationManager = new NotificationManager();
window.notificationsManager = window.notificationManager;

'use client';

import React from 'react';
import { useCRM } from '../context/CRMContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import ModalDispatcher from '../components/modals/ModalDispatcher';
import ToastContainer from '../components/common/ToastContainer';

// Partner Views
import DashboardView from '../components/views/DashboardView';
import KanbanView from '../components/views/KanbanView';
import LeadsView from '../components/views/LeadsView';
import ScreensView from '../components/views/ScreensView';
import PlansView from '../components/views/PlansView';
import FinanceView from '../components/views/FinanceView';
import PartnerSellersView from '../components/views/PartnerSellersView';
import CalendarView from '../components/views/CalendarView';
import AccessView from '../components/views/AccessView';
import ReportsView from '../components/views/ReportsView';

// Seller Views
import SellerDashboardView from '../components/views/seller/SellerDashboardView';
import SellerSalesView from '../components/views/seller/SellerSalesView';
import SellerHotLeadsView from '../components/views/seller/SellerHotLeadsView';
import SellerCommissionsView from '../components/views/seller/SellerCommissionsView';

// Auth View
import LoginView from '../components/views/LoginView';

function SidebarBackdrop() {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useCRM();
  if (isSidebarCollapsed) return null;
  return <div className="sidebar-backdrop" onClick={() => setIsSidebarCollapsed(true)} />;
}

export default function Home() {
  const { currentView, isLoaded, currentUser } = useCRM();

  if (!isLoaded) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app, #f5f7fa)',
        color: 'var(--primary, #0284a6)',
        fontSize: '1.1rem',
        fontWeight: 700,
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        Iniciando Conecta Mais...
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView />;
  }

  const hasAccess = !currentUser.permissions || currentUser.permissions.includes(currentView);

  const renderView = () => {
    if (!hasAccess) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          color: 'var(--text-secondary)'
        }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Acesso Restrito</h2>
          <p>Você não tem permissão para acessar esta tela. Fale com um sócio para liberar o acesso.</p>
        </div>
      );
    }
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'kanban': return <KanbanView />;
      case 'leads': return <LeadsView />;
      case 'screens': return <ScreensView />;
      case 'plans': return <PlansView />;
      case 'finance': return <FinanceView />;
      case 'partner-sellers': return <PartnerSellersView />;
      case 'calendar': return <CalendarView />;
      case 'access': return <AccessView />;
      case 'reports': return <ReportsView />;
      case 'seller-dashboard': return <SellerDashboardView />;
      case 'seller-sales': return <SellerSalesView />;
      case 'seller-hotleads': return <SellerHotLeadsView />;
      case 'seller-commissions': return <SellerCommissionsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <SidebarBackdrop />
      <main className="main-content">
        <Topbar />
        <div className="content-body">
          {renderView()}
        </div>
      </main>
      <ModalDispatcher />
      <ToastContainer />
    </div>
  );
}

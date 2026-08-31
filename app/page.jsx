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

export default function Home() {
  const { currentView, isLoaded } = useCRM();

  if (!isLoaded) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#070b14',
        color: '#00d2ff',
        fontSize: '1.2rem',
        fontWeight: 700
      }}>
        Iniciando Conecta Mais...
      </div>
    );
  }

  const renderView = () => {
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

'use client';

import React from 'react';
import { useCRM } from '../../context/CRMContext';
import ClientModal from './ClientModal';
import LeadDetailsModal from './LeadDetailsModal';
import MeetingModal from './MeetingModal';
import ScreenModal from './ScreenModal';
import TransactionModal from './TransactionModal';
import UserModal from './UserModal';
import SellerModal from './SellerModal';
import SellerDossierModal from './SellerDossierModal';
import HotLeadModal from './HotLeadModal';
import DenySaleModal from './DenySaleModal';
import SwitchUserModal from './SwitchUserModal';
import RenewalModal from './RenewalModal';
import WhatsAppBillingModal from './WhatsAppBillingModal';
import LoginScreen from '../auth/LoginScreen';

export default function ModalDispatcher() {
  const { activeModal } = useCRM();

  if (!activeModal) return null;

  const type = activeModal.type;

  if (type === 'client' || type === 'new-client' || type === 'edit-client' || type === 'edit-lead') {
    return <ClientModal />;
  }
  if (type === 'renewal') {
    return <RenewalModal />;
  }
  if (type === 'whatsapp-billing' || type === 'whatsapp' || type === 'billing-message') {
    return <WhatsAppBillingModal />;
  }
  if (type === 'lead-details') {
    return <LeadDetailsModal />;
  }
  if (type === 'meeting' || type === 'edit-meeting') {
    return <MeetingModal />;
  }
  if (type === 'screen' || type === 'edit-screen') {
    return <ScreenModal />;
  }
  if (type === 'transaction') {
    return <TransactionModal />;
  }
  if (type === 'user') {
    return <UserModal />;
  }
  if (type === 'seller') {
    return <SellerModal />;
  }
  if (type === 'seller-dossier') {
    return <SellerDossierModal />;
  }
  if (type === 'hot-lead' || type === 'edit-hotlead') {
    return <HotLeadModal />;
  }
  if (type === 'deny-sale') {
    return <DenySaleModal />;
  }
  if (type === 'switch-user') {
    return <SwitchUserModal />;
  }
  if (type === 'login') {
    return <LoginScreen />;
  }

  return null;
}

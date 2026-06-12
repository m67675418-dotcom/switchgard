// client/src/Admin/AdminView.jsx
import React, { useState } from 'react';
import './AdminView.css';
import Sidebar from '../components/Sidebar';
import PageHeader from '../components/PageHeader';

import AddDoctor from '../Doctor/AddDoctor';
import ManageDoctor from '../Doctor/ManageDoctor';
import GetSingleDoctor from '../Doctor/GetSingleDoctor';
import AddNurse from '../Nurse/AddNurse';
import ManageNurse from '../Nurse/ManageNurse';
import AddPharmacist from '../pharmacist/AddPharmacist';
import ManagePharmacist from '../pharmacist/ManagePharmacist';
import AddFireFighter from '../FireFighter/AddFireFighter';
import ManageFireFighter from '../FireFighter/ManageFireFighter';
import GetSingleFireFighter from '../FireFighter/GetSingleFireFighter';
import AddDDS from '../DDS/AddDDS';
import ManageDDS from '../DDS/ManageDDS';
import GetSingleDDS from '../DDS/GetSingleDDS';
import AddMessage from '../message/AddMessage';
import ManageMessage from '../message/ManageMessage';
import GetSingleMessage from '../message/GetSingleMessage';
import AddGarde from '../garde/AddGarde';
import ManageGarde from '../garde/ManageGarde';
import GetSingleGarde from '../garde/GetSingleGarde';
import AddTransaction from '../transaction/AddTransaction';
import ManageTransactions from '../transaction/ManageTransactions';
import GetSingleTransaction from '../transaction/GetSingleTransaction';
import SendEmail from '../Email/SendEmail';
import GetSingleEmail from '../Email/GetSingleEmail';
import PendingAccounts from './PendingAccounts';

const SIDEBAR_ITEMS = [
  { view: 'dashboard', icon: '🛡️', label: 'Dashboard' },
  { view: 'pending',   icon: '⏳',  label: 'Approvals' },
];

const MODULES = [
  { key: 'doctors',      icon: '👨‍⚕️', name: 'Doctors',      desc: 'Add & manage doctors' },
  { key: 'nurses',       icon: '👩‍⚕️', name: 'Nurses',       desc: 'Add & manage nurses' },
  { key: 'pharmacists',  icon: '💊',   name: 'Pharmacists',  desc: 'Add & manage pharmacists' },
  { key: 'firefighters', icon: '🚒',   name: 'Firefighters', desc: 'Add & manage firefighters' },
  { key: 'dds',          icon: '👔',   name: 'Managers',     desc: 'Add & manage managers' },
  { key: 'guards',       icon: '🛡️',  name: 'Shifts',       desc: 'Manage staff shifts' },
  { key: 'messages',     icon: '💬',   name: 'Messages',     desc: 'All messages' },
  { key: 'transactions', icon: '💰',   name: 'Transactions', desc: 'Manage transactions' },
  { key: 'emails',       icon: '📧',   name: 'Emails',       desc: 'Send & manage emails' },
  { key: 'pending',      icon: '⏳',   name: 'Approvals',    desc: 'Approve new accounts' },
];

export default function AdminView({ currentUser, onLogout }) {
  const [activeModule, setActiveModule] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId]           = useState(null);
  const [selectedFireFighterId, setSelectedFireFighterId] = useState(null);
  const [selectedManagerId, setSelectedManagerId]         = useState(null);
  const [selectedMessageId, setSelectedMessageId]         = useState(null);
  const [selectedGardeId, setSelectedGardeId]             = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [selectedEmailId, setSelectedEmailId]             = useState(null);

  const handleSidebarNavigate = (view) => {
    if (view === 'dashboard') setActiveModule(null);
    else setActiveModule(view);
  };

  const moduleContent = {
    doctors: <><AddDoctor /><ManageDoctor onSelectDoctor={setSelectedDoctorId} /><GetSingleDoctor doctorId={selectedDoctorId} /></>,
    nurses: <><AddNurse /><ManageNurse /></>,
    pharmacists: <><AddPharmacist /><ManagePharmacist /></>,
    firefighters: <><AddFireFighter /><ManageFireFighter onSelectFireFighter={setSelectedFireFighterId} /><GetSingleFireFighter fireFighterId={selectedFireFighterId} /></>,
    dds: <><AddDDS /><ManageDDS onSelectDDS={setSelectedManagerId} /><GetSingleDDS ddsId={selectedManagerId} /></>,
    messages: <><AddMessage /><ManageMessage onSelectMessage={setSelectedMessageId} /><GetSingleMessage messageId={selectedMessageId} /></>,
    guards: <><AddGarde currentUser={currentUser} /><ManageGarde onSelectGarde={setSelectedGardeId} /><GetSingleGarde gardeId={selectedGardeId} /></>,
    transactions: <><AddTransaction /><ManageTransactions onSelectTransaction={setSelectedTransactionId} /><GetSingleTransaction transactionId={selectedTransactionId} /></>,
    emails: <><SendEmail onEmailSent={setSelectedEmailId} /><GetSingleEmail emailId={selectedEmailId} /></>,
    pending: <PendingAccounts />,
  };

  const activeItem = activeModule ? MODULES.find(m => m.key === activeModule) : null;

  return (
    <div className="av-wrapper role-admin">
      <Sidebar
        items={SIDEBAR_ITEMS}
        activeView={activeModule || 'dashboard'}
        onNavigate={handleSidebarNavigate}
        onLogout={onLogout}
      />
      <div className="av-main">
        <PageHeader
          greeting="Admin Control Panel"
          title={currentUser?.email || 'Administrator'}
          currentUser={currentUser}
          onBack={activeModule ? () => setActiveModule(null) : null}
        />
        <div className="av-content">
          {activeItem ? (
            <>
              <div className="av-module-content-title">{activeItem.icon} {activeItem.name}</div>
              <div className="av-module-content">{moduleContent[activeModule]}</div>
            </>
          ) : (
            <>
              <p className="av-page-title">Select a module to manage</p>
              <div className="av-modules-title">Modules</div>
              <div className="av-grid">
                {MODULES.map(({ key, icon, name, desc }) => (
                  <div key={key} className="av-module-card" onClick={() => setActiveModule(key)}>
                    <div className="av-module-icon">{icon}</div>
                    <p className="av-module-name">{name}</p>
                    <p className="av-module-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

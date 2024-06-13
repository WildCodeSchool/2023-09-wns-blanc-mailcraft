// pages/account.js
import NavBar from "@/components/NavBar";
import Sidebar from "@/components/SideBar";
import InformationsPersonnelles from "@/components/PersonalsInfo";
import React, { useState } from 'react';

export default function AccountPage() {
  const [currentView, setCurrentView] = useState('informations');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const renderContent = () => {
    // Ne pas afficher le contenu principal si la barre latérale est ouverte sur les petits écrans
    if (!isSidebarCollapsed && window.innerWidth < 768) {
      return null;
    }

    switch (currentView) {
      case 'informations':
        return <InformationsPersonnelles />;
      // Ajoutez d'autres cas pour d'autres composants si nécessaire
      default:
        return <InformationsPersonnelles />;
    }
  };

  return (
    <>
      <NavBar issignUpPage={true} />
      <section className="flex">
        <Sidebar
          onSelect={setCurrentView}
          onToggle={setIsSidebarCollapsed} // Ajouter cette ligne
        />
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </section>
    </>
  );
}

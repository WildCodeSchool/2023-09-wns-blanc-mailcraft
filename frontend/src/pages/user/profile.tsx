import NavBar from "@/components/NavBars/UserPagesNavBar";
import Sidebar from "@/components/NavBars/SideBar";
import UserInformation from "@/components/UserInformation";
import React, { useState } from 'react';

export default function profilePage() {
  const [currentView, setCurrentView] = useState('informations');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const renderContent = () => {
    // Ne pas afficher le contenu principal si la barre latérale est ouverte sur les petits écrans
    if (!isSidebarCollapsed && window.innerWidth < 768) {
      return null;
    }

    switch (currentView) {
      case 'informations':
        return <UserInformation />;
      // Ajoutez d'autres cas pour d'autres composants si nécessaire
      default:
        return <UserInformation />;
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
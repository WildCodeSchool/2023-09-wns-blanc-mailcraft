import NavBar from "@/components/NavBars/UserPagesNavBar";
import Sidebar from "@/components/NavBars/SideBar";
import React, { useState } from 'react';
import UserInformationForm from "@/components/Forms/UserInformationForm";
import MyLinksForm from "@/components/Forms/MyLinksForm";

export default function ProfilePage() {
  const [selectedForm, setSelectedForm] = useState('informations');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <>
      <NavBar />
      <section className="flex">
        <Sidebar onSelect={setSelectedForm} />
        <div className="flex-1 p-8">
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Erreur ! </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Succès ! </strong>
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          <div className="mt-3 md:ml-16">
            <h2 className="font-bold text-2xl mb-8">
              {selectedForm === 'informations' ? 'Informations Personnelles' : 'Mes Liens'}
            </h2>
            {selectedForm === 'informations' && (
              <UserInformationForm setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
            )}
            {selectedForm === 'links' && (
              <MyLinksForm setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

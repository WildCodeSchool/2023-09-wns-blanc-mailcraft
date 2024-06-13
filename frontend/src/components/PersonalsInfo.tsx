import React, { useState } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";


const InformationsPersonnelles = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const GET_ME = gql`
    query GetMe {
      getMe {
        lastname
        firstname
        email
      }
    }
  `;

 

  

  const { loading, error, data } = useQuery(GET_ME);
  
  

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const prenomData = data.getMe.firstname || ''; 
  const lastNameData = data.getMe.lastname || '';
  const emailData = data.getMe.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
      return;
    }

   
  };

  return (
    <div className="mt-8 ml-4 md:ml-16">
      <h2 className="font-bold text-2xl mb-8">Informations Personnelles</h2>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-full md:max-w-3xl">
        <div className="flex flex-col md:flex-row items-center">
          <label htmlFor="prenom" className="w-full md:w-1/5 text-sm font-medium text-gray-700">Prénom :</label>
          <input
            type="text"
            id="prenom"
            placeholder={prenomData}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <label htmlFor="nom" className="w-full md:w-1/5 text-sm font-medium text-gray-700">Nom :</label>
          <input
            type="text"
            id="nom"
            value={nom}
            placeholder={lastNameData}
            onChange={(e) => setNom(e.target.value)}
            className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <label htmlFor="email" className="w-full md:w-1/5 text-sm font-medium text-gray-700">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            placeholder={emailData}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <label htmlFor="password" className="w-full md:w-1/5 text-sm font-medium text-gray-700">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <label htmlFor="confirmPassword" className="w-full md:w-1/5 text-sm font-medium text-gray-700">Confirmation du mot de passe :</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow-md w-full md:w-1/2 bg-rose-100 p-2 border border-rose-100 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="shadow-xl inline-flex items-center px-4 py-2 mr-11 mt-8 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#E83B4E] hover:bg-red-600 hover:shadow-red-500/50 focus:ring-4 focus:outline-none"
          >
            Mettre à jour
          </button>
        </div>
      </form>
    </div>
  );
};

export default InformationsPersonnelles;

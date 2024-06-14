import React, { useState } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";

const InformationsPersonnelles = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const GET_ME = gql`
    query GetMe {
      getMe {
        lastname
        firstname
        email
      }
    }
  `;

  const UPDATE_USER = gql`
    mutation UpdateUser($email: String!, $firstname: String!, $lastname: String!) {
      updateUserName(email: $email, firstname: $firstname, lastname: $lastname)
    }
  `;

  const VERIFY_PASSWORD = gql`
    mutation VerifyPassword($email: String!, $password: String!) {
      verifyPassword(email: $email, password: $password)
    }
  `;

  const { loading, error, data } = useQuery(GET_ME);
  const [updateUser, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_USER);
  const [verifyPassword] = useMutation(VERIFY_PASSWORD);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const prenomData = data.getMe.firstname || ''; 
  const lastNameData = data.getMe.lastname || '';
  const emailData = data.getMe.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas. Veuillez réessayer.");
      return;
    }

    try {
      const { data: verifyData } = await verifyPassword({
        variables: {
          email: emailData,
          password: confirmPassword
        }
      });

      if (verifyData.verifyPassword) {
        const { data: updateData } = await updateUser({
          variables: {
            email: email || emailData,
            firstname: prenom || prenomData,
            lastname: nom || lastNameData
          }
        });

        if (updateData.updateUserName) {
          setSuccessMessage("Informations personnelles mises à jour avec succès.");
        }
      } else {
        setErrorMessage("Le mot de passe actuel est incorrect. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations personnelles:", error);
      setErrorMessage("Erreur lors de la mise à jour des informations personnelles. Veuillez réessayer.");
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
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Succès! </strong>
          <span className="block sm:inline">{successMessage}</span>
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

import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileForm } from '@/types/interfaces/profile/profileForm'
import { UPDATE_USER_INFORMATION, VERIFY_PASSWORD } from "@/client/mutations/user/user-mutations";

export default function UserInformationForm({ setErrorMessage, setSuccessMessage }: ProfileForm) {
    const { user, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updateUser] = useMutation(UPDATE_USER_INFORMATION);
    const [verifyPassword] = useMutation(VERIFY_PASSWORD);

    useEffect(() => {
        console.log(`User is ---> ${JSON.stringify(user)}`);
    }, [user]);

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
        }
    }, [user]);

    if (loading) return <p>Chargement en cours...</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                    email: email,
                    password: confirmPassword
                }
            });

            if (verifyData.verifyPassword) {
                const { data: updateData } = await updateUser({
                    variables: {
                        email: email
                    }
                });

                if (updateData.updateUserName) {
                    setSuccessMessage("Les informations personnelles ont été mises à jour.");
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
        <form onSubmit={handleSubmit} className="space-y-4 max-w-full md:max-w-3xl">
            <div className="flex flex-col md:flex-row items-center">
                <label htmlFor="email" className="w-full md:w-1/5 text-sm font-medium text-gray-700">Email :</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder={email}
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
            <div className="flex justify-center items-center">
                <button
                    type="submit"
                    className="shadow-xl inline-flex items-center px-4 py-2 md:mr-11 mt-8 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#E83B4E] hover:bg-red-600 hover:shadow-red-500/50 focus:ring-4 focus:outline-none"
                >
                    Mettre à jour
                </button>
            </div>
        </form>
    );
}

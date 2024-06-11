import { MailingContext } from "@/contexts/MailContext";
import { useContext } from "react";
import { useMailingUtils } from "@/utils/mailingUtils";
export default function MailArea() {
  const context = useContext(MailingContext);

  if (context === undefined) {
    throw new Error("ContactList.tsx must be used within a MailingProvider");
  }
  const { addresses } = context;
  const { removeAddress } = useMailingUtils();

  return (
    <section className="flex flex-col bg-pink-100 h-full w-[40%] mr-20 mt-10">
      <div className="bg-red-500  text-white text-center py-2 text-lg font-semibold">
        Nouveau Message
      </div>
      <div className="flex flex-col   bg-white rounded-b-lg shadow p-6 ">
        <div className="flex flex-col mb-4">
          <label
            htmlFor="to"
            className="block text-sm font-medium text-gray-700"
          >
            To :
          </label>
          <div className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-indigo-500 focus-within:border-indigo-500">
            {addresses && addresses.length > 0 ? (
              addresses.map((address, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-gray-200 rounded-full pl-2 pr-1 py-1 m-1"
                >
                  <span className="text-sm font-medium text-gray-700 p-2">
                    {address}
                  </span>
                  <button
                    onClick={() => removeAddress(address)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Value</div>
            )}
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700"
          >
            Objet :
          </label>
          <input
            type="text"
            id="subject"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="relative flex-grow">
          <div className="flex justify-center items-center h-40 border border-gray-300 rounded-md">
            <button
              className="text-blue-600 hover:text-blue-800 text-4xl"
              onClick={() => alert("Ouvrir Template")}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <div className="w-24 h-12"></div>
            <button
              className="ml-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => alert("Message envoyé")}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

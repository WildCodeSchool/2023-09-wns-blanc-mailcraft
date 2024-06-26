import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import TemplateCard from "@/components/Cards/TemplateCard";
import Link from "next/link";

const MyTemplates = () => {
  const [userId, setUserId] = useState(1);

  const GET_USER_TEMPLATES = gql`
    query GetAllUserCreatedTemplates($userId: Float!) {
      getAllUserCreatedTemplates(userId: $userId) {
        id
        title
        description
        templateNature
        zones {
          id
          templateId
          subZones {
            id
            content
            links
            moduleType
            size
            zoneId
          }
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_USER_TEMPLATES, {
    variables: { userId },
  });

  useEffect(() => {
    if (data) {
      console.log("User Templates retrieved", data.getAllUserCreatedTemplates);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      {/* <UserPagesNavBar /> */}
      <section className="w-full min-h-[90dvh] flex flex-col gap-10 justify-start items-center bg-[#FFEDED] bg-opacity-100 z-50">
        <h1 className="text-3xl text-black text-center font-semibold mt-7 md:mt-10">
          Mes Templates
        </h1>
        {/* <SearchBar value={searchTerm} onChange={handleChange} /> */}
        <div className="w-full flex justify-between items-center px-6 md:px-16">
          <Link href="/template/creation">
            <button className="flex justify-center items-center gap-3 md:text-lg text-white bg-red-500 hover:bg-red-600 rounded-xl w-44 xl:w-[14dvw] h-12 xl:h-[7dvh] shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Nouveau modèle
            </button>
          </Link>
          {/* <button className="h-12 w-12 bg-gray-400 hover:bg-gray-500 border border-gray-300 shadow-sm rounded-md flex justify-center items-center">
            <img src={filterLine.src} className="object-cover" />
          </button> */}
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-10 gap-y-12 md:gap-y-16 mb-5 md:my-3">
          {/* Je trie les templates par ordre d'id puis je map pour les afficher */}
          {/* {filteredTemplates
              .sort((a: any, b: any) => a.id - b.id)
              .map((template: any) => (
                <TemplateCard
                  key={template.id}
                  templateId={template.id}
                  title={template.title}
                  description={template.description}
                  zones={template.zones}
                  isCreated={true}
                />
              ))
          } */}
        </section>
      </section>
    </>
  );
};

export default MyTemplates;

import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import TemplateCard from "@/components/Cards/TemplateCard";
import UserPagesNavBar from "@/components/NavBars/UserPagesNavBar";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import FilterButton from "@/components/Buttons/FilterButton";
import { TailSpin } from "react-loader-spinner";
import { templateNatures } from "@/utils/templateNatures";
import { useAuth } from "@/contexts/AuthContext";

const GET_USER_DRAFT_TEMPLATES = gql`
  query GetAllUserDraftTemplates($userId: Float!) {
    getAllUserDraftTemplates(userId: $userId) {
      id
      title
      description
      templateNature
      status
      zones {
        id
        templateId
        order
        subZones {
          id
          content
          links
          moduleType
          width
          zoneId
          order
        }
      }
    }
  }
`;

const MyTemplates = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedNature, setSelectedNature] = useState<string>("");
  const [filteredDraftTemplates, setFilteredDraftTemplates] = useState<any[]>(
    []
  );
  const { data, loading, error, refetch } = useQuery(GET_USER_DRAFT_TEMPLATES, {
    variables: { userId },
    fetchPolicy: "cache-and-network",
    skip: !userId,
  });

  const router = useRouter();

  useEffect(() => {
    if (data) {
      const filteredAndSortedTemplates = data.getAllUserDraftTemplates
        .filter(
          (template) =>
            (!searchTerm ||
              template.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            (!selectedNature ||
              template.templateNature.includes(selectedNature))
        )
        .map((template) => {
          const sortedZones = template.zones
            .slice()
            .sort((a, b) => a.order - b.order);
          return { ...template, zones: sortedZones };
        });
      setTemplates(filteredAndSortedTemplates);
    }
  }, [data, searchTerm, selectedNature]);

  const applyFilters = () => {
    let templates = data.getAllUserDraftTemplates;

    if (searchTerm) {
      templates = data.getAllUserDraftTemplates.filter((template) =>
        template.title.toLowerCase().includes(searchTerm)
      );
    }

    if (selectedNature) {
      templates = data.getAllUserDraftTemplates.filter((template) =>
        template.templateNature.includes(selectedNature)
      );
    }
    setTemplates(templates);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      refetch();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, refetch]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters();
  };

  const handleFilter = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedNature = event.target.value;
    console.log("selected nature :", selectedNature);
    if (selectedNature === "Tous") {
      setSelectedNature("");
    } else {
      setSelectedNature(selectedNature);
    }
    applyFilters();
  };

  return (
    <>
      <UserPagesNavBar />
      <section className="w-full min-h-[90dvh] flex flex-col gap-10 justify-start items-center bg-[#FFEDED] bg-opacity-100">
        <h1 className="text-3xl text-black text-center font-semibold mt-7 md:mt-10">
          Mes Brouillons
        </h1>
        <SearchBar value={searchTerm} onChange={handleChange} />
        <div className="w-full flex justify-between items-center px-6 md:px-16">
          <Link href="/template/creation">
            <button className="flex justify-center items-center gap-3 md:text-lg text-white bg-red-500 hover:bg-red-600 rounded-xl w-44 xl:w-[14dvw] h-12 xl:h-[7dvh] shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Nouveau modèle
            </button>
          </Link>
          <FilterButton onChange={handleFilter} options={templateNatures} />
        </div>
        {loading && (
          <div className="loader flex flex-col justify-center items-center gap-6">
            <h1 className="text-xl">Chargement des templates...</h1>
            <TailSpin color="#6C6C6C" height={80} width={80} />
          </div>
        )}
        {error && <h1 className="text-xl">Error: {error.message}</h1>}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-x-10 gap-y-12 md:gap-y-16 mb-5 md:my-3">
          {[...templates]
            .sort((a: any, b: any) => a.id - b.id)
            .map((template: any) => (
              <TemplateCard
                key={template.id}
                templateId={template.id}
                title={template.title}
                description={template.description}
                zones={template.zones}
                isCreated={true}
                status={template.status}
              />
            ))}
        </section>
      </section>
    </>
  );
};

export default MyTemplates;

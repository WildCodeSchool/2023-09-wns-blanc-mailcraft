import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import TemplateCard from "@/components/Cards/TemplateCard";

const MyTemplates = () => {
  const [userId, setUserId] = useState(1);

  const GET_USER_DRAFT_TEMPLATES = gql`
    query GetAllUserDraftTemplates($userId: Float!) {
      getAllUserDraftTemplates(userId: $userId) {
        id
        title
        description
        zones {
          id
          moduleType
          content
          size
        }
        templateNature
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_USER_DRAFT_TEMPLATES, {
    variables: { userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section>
      <h1 className="text-2xl text-black text-center font-bold my-10">
        MES BROUILLONS DE TEMPLATES
      </h1>
      <section className="flex flex-wrap gap-10 justify-center mt-10">
        {data &&
          data.getAllUserDraftTemplates.map((template: any) => (
            <TemplateCard
              key={template.id}
              title={template.title}
              zones={template.zones}
              isCreated={false}
            />
          ))}
      </section>
    </section>
  );
};

export default MyTemplates;

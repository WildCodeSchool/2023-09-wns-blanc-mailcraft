import { gql, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import TemplateCard from "@/components/Cards/TemplateCard";

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
          moduleType
          content
          size
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
    <section>
      <h1 className="text-2xl text-black text-center font-bold my-10">
        MES TEMPLATES
      </h1>
      <section className="flex flex-wrap gap-10 justify-center mt-10">
        {data &&
          data.getAllUserCreatedTemplates.map((template: any) => (
            <TemplateCard
              key={template.id}
              title={template.title}
              zones={template.zones}
              isCreated={true}
            />
          ))}
      </section>
    </section>
  );
};

export default MyTemplates;

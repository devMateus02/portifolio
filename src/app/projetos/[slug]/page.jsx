"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectBySlug } from "@/services/projects";

export default function ProjectPage() {
  const [project, setProject] =
    useState(null);

  const params = useParams();

  useEffect(() => {
    if (!params?.slug) return;

    async function loadProject() {
      try {
        const data =
          await getProjectBySlug(
            params.slug
          );

        setProject(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadProject();
  }, [params]);

  if (!project) {
    return (
      <div className="text-white">
        Carregando...
      </div>
    );
  }

  return (
    <main className="text-white">
      <h1>{project.title}</h1>
    </main>
  );
}
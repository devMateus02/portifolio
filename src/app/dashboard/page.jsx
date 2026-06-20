"use client";
import { uploadImage } from "@/services/upload";
import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/projects";

export default function ProjetosDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const initialForm = {
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    stack: "",
    coverImage: "",
    githubUrl: "",
    projectUrl: "",
    gallery: [],
    challenge: "",
    solution: "",
    status: "Publicado",
    featured: false,
  };


  const [form, setForm] = useState({
    title: "",
    slug: "",
    subtitle: "",
    description: "",
    stack: "",
    coverImage: "",
    githubUrl: "",
    projectUrl: "",
    gallery: [],
    challenge: "",
    solution: "",
    status: "Publicado",
    featured: false,
  });

  const [editingProject, setEditingProject] =
  useState(null);

  const handleEdit = (project) => {
  setEditingProject(project);

  setForm({
    title: project.title || "",
    slug: project.slug || "",
    subtitle: project.subtitle || "",
    description: project.description || "",
    stack: project.stack?.join(", ") || "",
    coverImage: project.coverImage || "",
    gallery: project.gallery || [],
    featured: project.featured || false,
    githubUrl: project.githubUrl || "",
    projectUrl: project.projectUrl || "",
  });

  setOpenModal(true);
};

const handleDelete = async (id) => {
  const confirmDelete =
    window.confirm(
      "Deseja realmente excluir?"
    );

  if (!confirmDelete) return;

  try {
    await deleteProject(id);

    setProjects((prev) =>
      prev.filter(
        (project) =>
          project._id !== id
      )
    );
  } catch (error) {
    console.error(error);
  }
};

 const handleSubmit = async () => {
  try {
    let project;

    const payload = {
      ...form,
      stack: form.stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (editingProject) {
      project = await updateProject(
        editingProject._id,
        payload
      );

      setProjects((prev) =>
        prev.map((p) =>
          p._id === project._id
            ? project
            : p
        )
      );
    } else {
      project =
        await createProject(payload);

      setProjects((prev) => [
        project,
        ...prev,
      ]);
    }

    setForm(initialForm);
    setEditingProject(null);
    setOpenModal(false);

  } catch (error) {
    console.error(error);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        const imageUrl = await uploadImage(reader.result);

        console.log("Image URL:", imageUrl);

        setForm((prev) => ({
          ...prev,
          coverImage: imageUrl,
        }));
      } catch (error) {
        console.error(error);
      }
    };
  };

  const handleGalleryUpload = async (e) => {
  const files = Array.from(e.target.files);

  try {
    const uploadedImages = [];

    for (const file of files) {
      const base64 = await new Promise(
        (resolve) => {
          const reader = new FileReader();

          reader.readAsDataURL(file);

          reader.onloadend = () =>
            resolve(reader.result);
        }
      );

      const imageUrl =
        await uploadImage(base64);

      uploadedImages.push(imageUrl);
    }

    setForm((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        ...uploadedImages,
      ],
    }));
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();

        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060608] text-white p-10">
        Carregando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#060608] text-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold">Projetos</h1>

          <button
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
            onClick={() => setOpenModal(true)}
          >
            Novo Projeto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="border border-zinc-800 rounded-2xl p-6">
            Nenhum projeto cadastrado.
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="border border-zinc-800 rounded-2xl p-6"
              >
                <h2 className="text-2xl font-semibold">{project.title}</h2>

                <p className="text-zinc-400 mt-2">{project.subtitle}</p>
                <p className="text-zinc-400 mt-2">
                  {project.coverImage && (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="mt-4 h-full w-full object-cover rounded-xl"
                    />
                  )}
                </p>

                <div className="flex gap-2 mt-4">
                  {project.stack?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-zinc-900 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">

  <button
    onClick={() =>
      handleEdit(project)
    }
    className="px-4 py-2 rounded-lg bg-blue-600"
  >
    Editar
  </button>

  <button
    onClick={() =>
      handleDelete(project._id)
    }
    className="px-4 py-2 rounded-lg bg-red-600"
  >
    Excluir
  </button>

</div>
              </div>
            ))}
          </div>
        )}

        {openModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-2xl h-[80vh] overflow-y-auto rounded-3xl border border-zinc-800 bg-[#09090B] p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                   {editingProject
  ? "Editar Projeto"
  : "Novo Projeto"}
                  </h2>

                  <p className="text-zinc-500 text-sm mt-1">
                    Cadastre um novo projeto no portfólio
                  </p>
                </div>

                <button
                  onClick={() => setOpenModal(false)}
                  className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Título
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Casa Gomes"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Slug
                  </label>

                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="casa-gomes"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Subtítulo
                  </label>

                  <input
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="Plataforma Comercial Digital"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Descrição
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descreva o projeto..."
                    className="w-full min-h-[140px] rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Desafio
                  </label>
                  <textarea
                    name="challenge"
                    value={form.challenge}
                    onChange={handleChange}
                    placeholder="Descreva o desafio..."
                    className="w-full min-h-[140px] rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Solução
                  </label>
                  <textarea
                    name="solution"
                    value={form.solution}
                    onChange={handleChange}
                    placeholder="Descreva o desafio..."
                    className="w-full min-h-[140px] rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    githubUrl
                  </label>
                  <input
                    type="text"
                    name="githubUrl"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="link do github..."
                    className="w-full  rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    url do projeto
                  </label>
                  <input
                    tpe="text"
                    name="projectUrl"
                    value={form.projectUrl}
                    onChange={handleChange}
                    placeholder="link do projeto..."
                    className="w-full  rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Stack
                  </label>

                  <input
                    name="stack"
                    value={form.stack}
                    onChange={handleChange}
                    placeholder="React, Next.js, Node.js, MongoDB"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Capa do Projeto
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3"
                  />
                </div>

                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt="Preview"
                    className="mt-4 h-40 w-full object-cover rounded-xl"
                  />
                )}

<div>
  <label className="block text-sm text-zinc-400 mb-2">
    Galeria de Imagens
  </label>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={handleGalleryUpload}
    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3"
  />
</div>

{form.gallery.length > 0 && (
  <div className="grid grid-cols-3 gap-3 mt-4">

    {form.gallery.map((image, index) => (
      <div
        key={index}
        className="relative"
      >
        <img
          src={image}
          alt=""
          className="w-full h-28 object-cover rounded-xl"
        />

        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              gallery: prev.gallery.filter(
                (_, i) => i !== index
              ),
            }))
          }
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white"
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}
             
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />

                  <label className="text-zinc-300">
                    Exibir em Principais Trabalhos
                  </label>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-6">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="px-5 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
                  >
                    Salvar Projeto
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

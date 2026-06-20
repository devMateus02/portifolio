import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    subtitle: {
      type: String,
    },

    description: {
      type: String,
    },
    challenge: {
      type: String,
    },

    solution: {
      type: String,
    },

    coverImage: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    projectUrl: {
      type: String,
    },

    gallery: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Publicado", "Em Desenvolvimento"],
      default: "Publicado",
    },

    stack: {
      type: [String],
      default: [],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);

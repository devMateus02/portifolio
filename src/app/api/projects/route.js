import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";


export async function GET() {
  try {
    console.log("INICIOU GET PROJECTS");

    await connectDB();

    console.log("CONECTOU");

    const projects = await Project.find()
      .sort({ order: 1 });

    console.log("PROJETOS:", projects.length);

    return Response.json(projects);

  } catch (error) {

    console.error("ERRO API PROJECTS");

    console.error(error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const project = await Project.create(body);

    return Response.json(project);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
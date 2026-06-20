import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(req, context) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const project = await Project.findOne({
      slug,
    });

    return Response.json(project);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
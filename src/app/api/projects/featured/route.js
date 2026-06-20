import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find({
      featured: true,
    }).sort({ order: 1 });

    return Response.json(projects);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function PUT(req, context) {
  try {
    await connectDB();

    const body = await req.json();

    const { id } = await context.params;

    const project = await Project.findByIdAndUpdate(
      id,
      body,
      {
        returnDocument: "after",
      }
    );

    return Response.json(project);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  const { id } = await context.params;

  await Project.findByIdAndDelete(id);

  return Response.json({
    success: true,
  });
}
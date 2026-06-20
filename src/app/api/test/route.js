import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
console.log("MongoDB conectado com sucesso!");
  return Response.json({
    success: true,
    message: "MongoDB conectado com sucesso!"
  });
}
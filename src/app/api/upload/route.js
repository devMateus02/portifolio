import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();

    const result =
      await cloudinary.uploader.upload(
        body.image,
        {
          folder: "portfolio",
        }
      );

    return Response.json({
      url: result.secure_url,
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
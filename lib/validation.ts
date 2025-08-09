import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, { message: "Image is required" })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed",
  });

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string(),
  category: z.string().min(3).max(20),
  // link: z
  //   .string()
  //   .url()
  //   .refine(async (url) => {
  //     try {
  //       const res = await fetch(url, { method: "HEAD" });
  //       const contentType = res.headers.get("content-type");
  //       return contentType?.startsWith("image/");
  //     } catch (error) {
  //       console.log(error);
  //       return false;
  //     }
  //   }),
  image: imageSchema,
  pitch: z.string().min(10),
});

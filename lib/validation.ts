import { z } from "zod";

const MAX_IMAGE_BYTES = 7 * 1024 * 1024;
export const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, { message: "Image is required" })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed",
  })
  .refine((file) => file.size <= MAX_IMAGE_BYTES, {
    message: `Image must be ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))}MB or smaller`,
  });

export const formSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string(),
  category: z.string().min(3).max(20),
  pitch: z.string().min(10),
});

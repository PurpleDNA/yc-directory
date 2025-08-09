/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useActionState, useRef } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "../hooks/use-toast";
import { useRouter } from "next/navigation";
import { createStartup } from "@/lib/actions";
// import Image from "next/image";
import { Plus } from "lucide-react";

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const imageClickRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        pitch,
        // image: formData.get("image") as File | null,
      };

      await formSchema.parseAsync(formValues);

      const result = await createStartup(prevState, formData, pitch);
      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your Startup Pitch has been created successfully",
        });
        router.push(`/startup/${result._id}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });
        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { ...prevState, error: "Unexpected error", status: "ERROR" };
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "initial",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        {/* Title */}
        <label htmlFor="title" className="startup-form_label mb-4">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {errors.title && <p className="startup-form_error">{errors.title}</p>}

        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}

        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category"
        />
        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}

        <label htmlFor="image" className="startup-form_label">
          Upload Image
        </label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="startup-form_input hidden"
          onChange={handleFileChange}
          ref={imageClickRef}
        />
        <div
          className="border-[3px] border-black font-semibold rounded-lg mt-2 mb-3 h-60 flex items-center justify-center cursor-pointer"
          onClick={() => imageClickRef.current?.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-60 object-cover rounded-lg shadow cursor-pointer"
            />
          ) : (
            <div className="imageClicker border-red-400 rounded-sm">
              <Plus />
            </div>
          )}
        </div>
        {errors.image && <p className="startup-form_error">{errors.image}</p>}
      </div>

      {/* Pitch */}
      <div className="container" data-color-mode="light">
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ overflow: "hidden", borderRadius: 20 }}
          textareaProps={{
            placeholder:
              "Briefly Describe Your Idea and What Problem It Solves",
          }}
          previewOptions={{ disallowedElements: ["style"] }}
        />
        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Startup"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;

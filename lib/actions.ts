"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/writeClient";
import { FETCH_AUTHOR_USER_ID } from "@/sanity/lib/query";
import { client } from "@/sanity/lib/client";
import {
  // auth,
  signIn,
  signOut,
} from "@/auth";
// import type { Session } from "next-auth";
import { redirect } from "next/navigation";

export const getAuthorId = async (id: string) => {
  const nId = Number(id);
  const author = await client.fetch(FETCH_AUTHOR_USER_ID, {
    id: nId,
  });

  if (!author) {
    throw new Error(`Author with id ${id} not found`);
  }

  return author._id;
};

export const createStartup = async <T>(
  state: T,
  form: FormData,
  pitch: string
) => {
  const session = await auth();
  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const { title, description, category } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  const imageFile = form.get("image") as File | null;
  let imageRef = null;

  if (imageFile && imageFile.size > 0) {
    const asset = await writeClient.assets.upload("image", imageFile, {
      filename: imageFile.name,
    });

    imageRef = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  }

  const slug = slugify(title as string, { lower: true, strict: true });
  const authorId = session.id;

  try {
    const startup = {
      title,
      description,
      category,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: authorId,
      },
      pitch,
      image: imageRef,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log("createStartup Error>>>>>>>>>>>: ", error);
    // throw error;
    return {
      error: error,
      status: "ERROR",
    };
  }
};

export async function LogIn(provider: string) {
  "use server";
  try {
    await signIn(provider);
  } catch (error) {
    console.error("Sign in error details:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      provider,
    });

    // Handle the redirect that NextAuth throws
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    // For other errors, redirect to home with error
    redirect("/?error=SignInError");
  }
}
export async function LogOut() {
  "use server";
  try {
    await signOut({ redirectTo: "/" });
  } catch (error) {
    // Handle the redirect that NextAuth throws
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Sign out error:", error);
  }
}

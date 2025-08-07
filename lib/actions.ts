/* eslint-disable @typescript-eslint/no-explicit-any */
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
    id: nId, // Match the parameter name in the query
  });

  if (!author) {
    throw new Error(`Author with id ${id} not found`);
  }

  console.log(author._id);
  return author._id; // Return just the _id string
};

export const createStartup = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  const session = await auth();
  console.log(session?.id);
  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  const authorId = session.id;

  try {
    const startup = {
      title,
      description,
      category,
      image_url: link,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: authorId,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...startup });
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
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
    console.log(`Attempting to sign in with ${provider}`);
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

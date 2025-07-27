/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/writeClient";
import { FETCH_AUTHOR_BY_ID } from "@/sanity/lib/query";
import { client } from "@/sanity/lib/client";

const getAuthorId = async (id: string) => {
  const nId = Number(id);
  const author = await client.fetch(FETCH_AUTHOR_BY_ID, {
    id: nId, // Match the parameter name in the query
  });

  if (!author) {
    throw new Error(`Author with id ${id} not found`);
  }

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

  const authorId = await getAuthorId(session.id);

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

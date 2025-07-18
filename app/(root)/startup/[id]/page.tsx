/* eslint-disable @next/next/no-img-element */
import React, { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { FETCH_STARTUP_BY_ID } from "@/sanity/lib/query";
import { StartupTypeCard } from "@/components/StartupCard";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
export const experimental_ppr = true;
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const startup = (await client.fetch(FETCH_STARTUP_BY_ID, {
    id,
  })) as StartupTypeCard;
  if (!startup) notFound();

  const md = markdownit();
  const parsed_result = md.render(startup?.pitch || "");

  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag"> {formatDate(startup?._createdAt)}</p>
        <h1 className="heading">{startup.title}</h1>
        <p className="sub-heading !max-w-5xl">{startup.description}</p>
      </section>
      <section className="section_container">
        <img
          src={startup.image_url}
          alt="thumbnail"
          className="w-full h-auto max-h-[400px] rounded-xl"
        />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${startup.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={startup.author?.image ?? "https://placehold.co/48x48"}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />
              <div>
                <p className="text-20-medium">{startup.author?.name}</p>
                <p className="text-20-medium !text-black-300">
                  @{startup.author?.username}
                </p>
              </div>
            </Link>
            <p className="category-tag">{startup.category}</p>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsed_result ? (
            <article
              className="prose font-work-sans break-all max-w-4xl "
              dangerouslySetInnerHTML={{ __html: parsed_result }}
            />
          ) : (
            <p className="no-result">No pitch details available.</p>
          )}
        </div>
        <hr className="didvide" />
        {/* TODO: EDITOR SELECTED STARTUPS */}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </>
  );
};

export default page;

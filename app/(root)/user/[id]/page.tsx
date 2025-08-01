// import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/query";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";

const page = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);

  const user = await client.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
    id,
  });
  if (!user) {
    return notFound();
  }

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="uppercase text-center text-24-black">{user.name}</h3>
          </div>
          <Image
            src={user.image}
            alt={user.username}
            width={220}
            height={220}
            className="profile_image"
          />
          <p className="text-30-extrabold mt-7 text-center">@{user.username}</p>
          <p className="mt-1 text-center text-14-normal">{user?.bio}</p>
        </div>
        <div className="flex-1 flex flex-col gap-5 lg:mt-5">
          <p className="text-30-bold"></p>
        </div>
      </section>
    </>
  );
};

export default page;

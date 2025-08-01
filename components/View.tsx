import { after } from "next/server";
import React from "react";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { STARTUPS_VIEWS_QUERY } from "@/sanity/lib/query";
import { writeClient } from "@/sanity/lib/writeClient";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client.fetch(STARTUPS_VIEWS_QUERY, {
    id,
  });
  after(
    async () =>
      await writeClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );
  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black">{totalViews} views</span>
      </p>
    </div>
  );
};

export default View;

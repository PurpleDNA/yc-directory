import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_USER_QUERY } from "@/sanity/lib/query";
import React from "react";
import StartupCard from "./StartupCard";

const UserStartups = async ({ id }: { id: string }) => {
  const startups = await client.fetch(STARTUPS_BY_USER_QUERY, { id });
  return (
    <>
      {startups.length > 0 ? (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startups.map((startup: any) => (
          <StartupCard key={startup._id} post={startup} />
        ))
      ) : (
        <p className="no-result">No startups yet</p>
      )}
    </>
  );
};

export default UserStartups;

import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  token,
});

const startups = await writeClient.fetch('*[_type == "startup"]{_id,pitch}');
console.log("Startups fetched:", startups);

for (let i = 0; i < startups.length; i++) {
  writeClient
    .patch(startups[i]._id)
    .set({ title: startups[i].pitch.split(" ")[0] })
    .commit();
}

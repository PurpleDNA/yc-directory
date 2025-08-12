import { faker } from "@faker-js/faker";
import slugify from "slugify";
import fetch from "node-fetch";
import fs from "fs/promises";
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

const startupDataRaw = await fs.readFile(
  new URL("./startups-40.json", import.meta.url)
);
const startupData = JSON.parse(startupDataRaw.toString());
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
const shuffled = shuffleArray(startupData);

// const STARTUP_COUNT = 40;
// const AUTHOR_COUNT = 8;
// const CATEGORIES = [
//   "Fintech",
//   "HealthTech",
//   "EdTech",
//   "AI",
//   "SaaS",
//   "E-commerce",
// ];

const accessKey = process.env.UNSPLASH_ACCESS_KEY;

if (!accessKey) {
  throw new Error("UNSPLASH_ACCESS_KEY environment variable is not set");
}

// ------------------ IMAGE UPLOAD ------------------
async function uploadImageFromUrl(url) {
  const response = await fetch(url);
  const data = await response.json();
  const imageUrl = data.urls.full;

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) throw new Error("Failed to fetch image");

  const buffer = await imageResponse.buffer(); // Node.js Buffer, works with Sanity upload

  const asset = await writeClient.assets.upload("image", buffer, {
    filename: `startup-${Date.now()}.jpg`,
  });

  return asset._id;
}

// ------------------ CREATE AUTHORS ------------------
// async function createAuthors() {
//   const authors = [];
//   for (let i = 0; i < AUTHOR_COUNT; i++) {
//     const id = faker.string.uuid();
//     const author = {
//       _id: `author-${id}`,
//       _type: "author",
//       name: faker.person.fullName(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       bio: faker.person.bio(),
//       image: faker.image.avatar(),
//       account: [
//         {
//           _key: faker.string.uuid(),
//           provider: faker.helpers.arrayElement(["github", "google", "twitter"]),
//           providerAccountId: faker.string.uuid(),
//         },
//       ],
//     };
//     await writeClient.create(author);
//     authors.push(author);
//   }
//   console.log(`✅ Created ${authors.length} authors`);
//   return authors;
// }

// ------------------ CREATE STARTUPS ------------------
async function createStartups(authors) {
  for (let i = 0; i < shuffled.length; i++) {
    const category = shuffled[i].category;
    const description = shuffled[i].description;
    const pitch = shuffled[i].pitch;
    const title = shuffled[i].title;
    const imageId = await uploadImageFromUrl(
      `https://api.unsplash.com/photos/random/?query=${encodeURIComponent(category.toLowerCase())}&client_id=${accessKey}`
    );

    const startup = {
      _type: "startup",
      title,
      slug: { _type: "slug", current: slugify(title, { lower: true }) },
      author: {
        _type: "reference",
        _ref: faker.helpers.arrayElement(authors)._id,
      },
      description,
      category,
      pitch,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageId,
        },
      },
    };

    await writeClient.create(startup);
    console.log(`🚀 Created startup: ${title} (${category})`);
  }
}

// ------------------ RUN ------------------
(async function seed() {
  try {
    console.log("🌱 Seeding data to Sanity...");
    const authors = await writeClient.fetch(
      '*[_type == "author" && email != "kadirimaroof@gmail.com"]'
    );
    console.log(`✅ Fetched ${authors.length} authors>>>>>>>>>>>>>>:`, authors);
    await createStartups(authors);
    console.log("🎉 Done! Database is filled.");
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
})();

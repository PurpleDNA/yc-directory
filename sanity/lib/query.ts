import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY =
  defineQuery(`*[_type == "startup" && defined(slug.current) && !defined($search) || author -> name match $search || category match $search || title match $search] | order(_createdAt desc){
  _id,
  title, 
  description,
  slug,
  _createdAt, 
  author -> {
    _id,name,image,bio
  },
  views, 
  image_url,
  category
}
`);

export const FETCH_STARTUP_BY_ID =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
  _id, 
  title, 
  slug,
  _createdAt,
  author -> {
    _id, name, username, image, bio
  }, 
  views,
  description,
  category,
  image_url,
  pitch,
  }`);

export const STARTUPS_VIEWS_QUERY =
  defineQuery(`*[_type == "startup" && _id == $id][0]{
   _id,views
    }`);

export const AUTHOR_BY_GITHUB_ID_QUERY =
  defineQuery(`*[_type == "author" && id == $id][0]{
  _id,
  id,
  username,
  email,
  image,
  bio
  }`);

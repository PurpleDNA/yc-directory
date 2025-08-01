import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { startup } from "./startups";
import { playlist } from "./playlists";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, playlist],
};

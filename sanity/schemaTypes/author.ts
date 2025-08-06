import { UserIcon } from "lucide-react";
import { defineType, defineField } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "username",
      type: "string",
    }),
    defineField({
      name: "email",
      type: "string",
    }),
    defineField({
      name: "image",
      type: "url",
    }),
    defineField({
      name: "bio",
      type: "text",
    }),
    defineField({
      name: "account",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { type: "string", name: "provider" },
            { type: "string", name: "providerAccountId" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});

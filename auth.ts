import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "./sanity/lib/query";
import { writeClient } from "./sanity/lib/writeClient";

const config: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user: { name, email, image }, profile }) {
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
          id: profile?.id,
        });
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile?.id,
          name,
          username: profile?.login,
          email,
          image,
          bio: profile?.bio || "",
        });
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        token.id = user?.id;
      }
      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home on sign in
    error: "/", // Redirect to home on error (like cancel)
  },
  //   callbacks: {
  //     session({ session, token }) {
  //       if (token?.sub && session?.user) {
  //         session.user.id = token.sub;
  //       }
  //       return session;
  //     },
  //     jwt({ user, token }) {
  //       if (user) {
  //         token.sub = user.id;
  //       }
  //       return token;
  //     },
  //   },
};

export const { handlers, signIn, signOut, auth } = NextAuth(config);

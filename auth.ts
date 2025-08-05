import NextAuth, { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { client } from "./sanity/lib/client";
import {
  AUTHOR_BY_GITHUB_ID_QUERY,
  AUTHOR_BY_OAUTH_EMAIL_QUERY,
} from "./sanity/lib/query";
import { writeClient } from "./sanity/lib/writeClient";

const config: NextAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user: { name, email, image }, profile, account }) {
      const provider = account?.provider;
      const providerAccountId = account?.providerAccountId;

      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_OAUTH_EMAIL_QUERY, {
          email,
        });

      if (existingUser) {
        const hasProviderLinked = existingUser.accounts?.some(
          (acct: { provider: "string"; providerAccountId: "string" }) =>
            acct.provider === provider &&
            acct.providerAccountId === providerAccountId
        );

        if (!hasProviderLinked) {
          // Step 2: Link new provider to the existing user
          await writeClient
            .patch(existingUser._id)
            .setIfMissing({ account: [] })
            .append("account", [
              { provider, providerAccountId, _key: providerAccountId },
            ])
            .commit();
        }

        // ✅ Allow sign-in
        return true;
      }
      await writeClient.create({
        _type: "author",
        id: profile?.id,
        name,
        username: profile?.login,
        email,
        image,
        bio: profile?.bio || "",
        account: [{ provider, providerAccountId }],
      });

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
  trustHost: true, // Important for localhost
  debug: process.env.NODE_ENV === "development", // Enable debug in dev
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

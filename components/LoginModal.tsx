"use client";

import React from "react";
import {
  // auth,
  signIn,
} from "@/auth";
// import type { Session } from "next-auth";
import { redirect } from "next/navigation";

const LoginModal = () => {
  async function LogIn(provider: string) {
    "use server";
    try {
      await signIn(provider);
    } catch (error) {
      // Handle the redirect that NextAuth throws
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Sign in error:", error);
      redirect("/");
    }
  }
  return (
    <div className="login-modal z-20">
      <button onClick={() => LogIn("github")}>Sign in with GitHub</button>
      <button onClick={() => LogIn("google")}>Sign in with Google</button>
    </div>
  );
};

export default LoginModal;

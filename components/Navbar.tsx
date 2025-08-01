import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { BadgePlus, LogOutIcon } from "lucide-react";

const Navbar = async () => {
  const session: Session | null = await auth();
  // async function LogOut() {
  //   "use server";
  //   signOut();
  // }

  // async function LogIn() {
  //   "use server";
  //   signIn("github");
  // }

  async function LogIn() {
    "use server";
    try {
      await signIn("github");
    } catch (error) {
      // Handle the redirect that NextAuth throws
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Sign in error:", error);
      redirect("/");
    }
  }

  async function LogOut() {
    "use server";
    try {
      await signOut({ redirectTo: "/" });
    } catch (error) {
      // Handle the redirect that NextAuth throws
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        throw error;
      }
      console.error("Sign out error:", error);
    }
  }

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/create" className="cursor-pointer" prefetch={true}>
                <button className="font-bold py-1 px-2 bg-[#EE2B69] rounded-sm text-white-100 hidden md:block cursor-pointer">
                  Create
                </button>
                <BadgePlus
                  className="md:hidden p-1 rounded-full bg-[#EE2B69] text-white cursor-pointer"
                  size={30}
                />
              </Link>
              <form action={LogOut}>
                <button
                  type="submit"
                  className="font-bold py-1 px-2 bg-[#EE2B69] rounded-sm text-white-100 hidden md:block cursor-pointer"
                >
                  Logout
                </button>
                <LogOutIcon
                  className="md:hidden p-1 rounded-full bg-[#EE2B69] text-white cursor-pointer"
                  size={30}
                />
              </form>
              <Link href={`/user/${session?.id}`} prefetch={true}>
                <Image
                  alt="user image"
                  width={48}
                  height={48}
                  src={session?.user.image ?? "https://placehold.co/48x48"}
                  className="rounded-full"
                />
              </Link>
            </>
          ) : (
            <form action={LogIn}>
              <button
                type="submit"
                className="font-bold py-1 px-2 bg-[#EE2B69] rounded-sm text-white-100 cursor-pointer"
              >
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "@/lib/actions";
import type { Session } from "next-auth";
import { BadgePlus, LogOutIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const Navbar = ({ session }: { session: Session | null }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Handler to open the login modal
  const handleLoginClick = (e: React.MouseEvent) => {
    // Prevent form submission and page reload
    e.preventDefault();

    // Create new URLSearchParams from current searchParams
    const params = new URLSearchParams(searchParams.toString());
    params.set("showLogin", "true");

    // Update URL without causing a page reload
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
              <div onClick={LogOut}>
                <button className="font-bold py-1 px-2 bg-[#EE2B69] rounded-sm text-white-100 hidden md:block cursor-pointer">
                  Logout
                </button>
                <LogOutIcon
                  className="md:hidden p-1 rounded-full bg-[#EE2B69] text-white cursor-pointer"
                  size={30}
                />
              </div>
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
            // Removed the form wrapper - it was causing the page reload
            <button
              type="button"
              className="font-bold py-1 px-2 bg-[#EE2B69] rounded-sm text-white-100 cursor-pointer"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

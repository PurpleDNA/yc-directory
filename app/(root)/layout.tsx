import "../globals.css";
import Navbar from "@/components/Navbar";
// import "easymde/dist/easymde.min.css";
import LoginModal from "@/components/LoginModal";
import { auth } from "@/auth";
import type { Session } from "next-auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await auth();
  return (
    <div className={"font-work-sans"}>
      <Navbar session={session} />
      {children}
      <LoginModal />
    </div>
  );
}

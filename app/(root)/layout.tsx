import "../globals.css";
import Navbar from "@/components/Navbar";
// import "easymde/dist/easymde.min.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"font-work-sans"}>
      <Navbar />
      {children}
    </div>
  );
}

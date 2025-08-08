import LoginModal from "@/components/LoginModal";
import SearchForm from "@/components/SearchForm";
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/query";
import Link from "next/link";

interface HomeProps {
  searchParams: Promise<{ query?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { query, page } = await searchParams;
  const currentPage = Math.max(parseInt(page || "1", 10), 1);
  const perPage = 9;

  const params = { search: query || null };
  const startups: StartupTypeCard[] = await client.fetch(
    STARTUPS_QUERY,
    params
  );

  const totalPages = Math.ceil(startups.length / perPage);
  const validPage = Math.min(currentPage, totalPages || 1);

  const startIdx = (validPage - 1) * perPage;
  const paginatedStartups = startups.slice(startIdx, startIdx + perPage);

  const createPageLink = (p: number) => {
    const search = new URLSearchParams();
    if (query) search.set("query", query);
    search.set("page", p.toString());
    return `?${search.toString()}`;
  };

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // For wide screen: dynamic condensing
    if (validPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }
    if (validPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [validPage - 1, validPage, "...", totalPages];
  };

  return (
    <>
      <section className="pink_container maroof">
        <h1 className="heading">
          Pitch Your Startup, <br /> Connect With Entrepreneurs
        </h1>
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed In Virtual
          Competitions.
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {paginatedStartups.length > 0 ? (
            paginatedStartups.map((post) => (
              <StartupCard key={post._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 flex-wrap transition-all duration-300">
            {/* Multi-step back */}
            <Link
              href={createPageLink(Math.max(validPage - 3, 1))}
              className="px-3 py-2 rounded-lg text-white"
              style={{
                backgroundColor: "#EE2B69",
                opacity: validPage > 1 ? 1 : 0.5,
              }}
            >
              &laquo;
            </Link>

            {/* Single-step back */}
            <Link
              href={createPageLink(Math.max(validPage - 1, 1))}
              className="px-3 py-2 rounded-lg text-white"
              style={{
                backgroundColor: "#EE2B69",
                opacity: validPage > 1 ? 1 : 0.5,
              }}
            >
              &lsaquo;
            </Link>

            {/* Page numbers for desktop */}
            <div className="hidden md:flex gap-1">
              {renderPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={idx}
                    className="px-3 py-2 text-gray-400 select-none"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={createPageLink(p as number)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      p === validPage
                        ? "text-white scale-105"
                        : "text-black hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: p === validPage ? "#EE2B69" : "#f5f5f5",
                    }}
                  >
                    {p}
                  </Link>
                )
              )}
            </div>

            {/* Mobile view: current + prev/next */}
            <div className="flex md:hidden gap-1">
              <span className="px-3 py-2 rounded-lg bg-[#EE2B69] text-white">
                {validPage}
              </span>
              <span className="px-3 py-2 rounded-lg bg-gray-200">
                / {totalPages}
              </span>
            </div>

            {/* Single-step forward */}
            <Link
              href={createPageLink(Math.min(validPage + 1, totalPages))}
              className="px-3 py-2 rounded-lg text-white"
              style={{
                backgroundColor: "#EE2B69",
                opacity: validPage < totalPages ? 1 : 0.5,
              }}
            >
              &rsaquo;
            </Link>

            {/* Multi-step forward */}
            <Link
              href={createPageLink(Math.min(validPage + 3, totalPages))}
              className="px-3 py-2 rounded-lg text-white"
              style={{
                backgroundColor: "#EE2B69",
                opacity: validPage < totalPages ? 1 : 0.5,
              }}
            >
              &raquo;
            </Link>
          </div>
        )}

        <LoginModal />
      </section>
    </>
  );
}

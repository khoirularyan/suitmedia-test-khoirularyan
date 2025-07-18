"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ImageObj {
  url: string;
  [key: string]: any;
}

interface Idea {
  id: number;
  title: string;
  published_at: string;
  content: string;
  small_image?: ImageObj[];
  medium_image?: ImageObj[];
  [key: string]: any; // Allow any additional properties
}

export function List() {
  // State with localStorage and fallback
  const [sort, setSort] = useState<"newest" | "oldest">(() => {
    if (typeof window !== "undefined") {
      const value = localStorage.getItem("sort");
      return value === "oldest" ? "oldest" : "newest";
    }
    return "newest";
  });

  const [perPage, setPerPage] = useState<10 | 20 | 50>(() => {
    if (typeof window !== "undefined") {
      const saved = parseInt(localStorage.getItem("perPage") || "10");
      return [10, 20, 50].includes(saved) ? (saved as 10 | 20 | 50) : 10;
    }
    return 10;
  });

  const [page, setPage] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = parseInt(localStorage.getItem("page") || "1");
      return isNaN(saved) ? 1 : saved;
    }
    return 1;
  });

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem("sort", sort);
    localStorage.setItem("perPage", perPage.toString());
    localStorage.setItem("page", page.toString());
  }, [sort, perPage, page]);

  // Fetch data with error handling
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ideas?sort=${sort}&page[number]=${page}&page[size]=${perPage}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const { data, meta } = await res.json();
        setIdeas(Array.isArray(data) ? data : []);
        setTotal(meta?.total ?? 0);
      } catch (error) {
        console.error("Fetch error:", error);
        setIdeas([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sort, perPage, page]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get image URL
  const getImageUrl = (idea: Idea) => {
    const imageFields = ["medium_image", "small_image"];
    let url = "";
    for (const field of imageFields) {
      if (Array.isArray(idea[field]) && idea[field][0]?.url) {
        url = idea[field][0].url;
        break;
      }
    }
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `https://suitmedia-backend.suitdev.com${url}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white min-h-screen">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1 flex items-center">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * perPage + 1} -{" "}
            {Math.min(page * perPage, total)} of {total}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-black">Show per page:</span>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(parseInt(e.target.value) as 10 | 20 | 50);
              setPage(1);
            }}
            className="p-2 border rounded-full bg-white text-sm text-black"
          >
            {[10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num} per page
              </option>
            ))}
          </select>
          <span className="text-sm text-black ml-4">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as "newest" | "oldest");
              setPage(1);
            }}
            className="p-2 border rounded-full bg-white text-sm text-black"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Ideas Grid */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ideas.map((idea) => {
            const imageUrl = getImageUrl(idea);

            return (
              <div
                key={idea.id}
                className="border rounded-lg overflow-hidden drop-shadow-[0_5px_5px_rgba(0,0,0,0.10)] hover:drop-shadow-[0_5px_5px_rgba(0,0,0,0.15)] bg-white transform hover:scale-102 transition-all duration-300 ease-in-out"
              >
                {/* Image aspect ratio 4:3 */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={idea.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                      unoptimized={!imageUrl.includes("assets.suitdev.com")}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-gray-500 text-sm mb-2">
                    {formatDate(idea.published_at)}
                  </p>
                  <h3 className="font-semibold text-lg mb-2 text-black line-clamp-3">
                    {idea.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex justify-center mt-8 gap-1 items-center">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className={`w-7 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
              page === 1 ? "text-gray-300" : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="First"
          >
            &laquo;
          </button>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`w-7 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
              page === 1 ? "text-gray-300" : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Previous"
          >
            &lsaquo;
          </button>
          {/* Page Numbers */}
          {Array.from({ length: Math.ceil(total / perPage) }).map((_, i) => {
            if (
              i + 1 === 1 ||
              i + 1 === Math.ceil(total / perPage) ||
              Math.abs(page - (i + 1)) <= 1
            ) {
              return (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-8 flex items-center justify-center rounded-lg text-sm transition-colors font-medium ${
                    page === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-200 "
                  }`}
                >
                  {i + 1}
                </button>
              );
            }
            // Ellipsis
            if (
              (i === 1 && page > 3) ||
              (i === Math.ceil(total / perPage) - 2 &&
                page < Math.ceil(total / perPage) - 2)
            ) {
              return (
                <span key={i} className="px-2 text-gray-400 select-none">
                  ...
                </span>
              );
            }
            return null;
          })}
          {/* Next & Last */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === Math.ceil(total / perPage)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
              page === Math.ceil(total / perPage)
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Next"
          >
            &rsaquo;
          </button>
          <button
            onClick={() => setPage(Math.ceil(total / perPage))}
            disabled={page === Math.ceil(total / perPage)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
              page === Math.ceil(total / perPage)
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Last"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

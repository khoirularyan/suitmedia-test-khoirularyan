"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Idea {
  id: number;
  title: string;
  published_at: string;
  content: string;
  small_image?: { url: string }[];
  medium_image?: { url: string }[];
}

export function List() {
  // State dengan localStorage
  const [sort, setSort] = useState<'newest' | 'oldest'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sort') as 'newest' | 'oldest' || 'newest';
    }
    return 'newest';
  });

  const [perPage, setPerPage] = useState<10 | 20 | 50>(() => {
    if (typeof window !== 'undefined') {
      const saved = parseInt(localStorage.getItem('perPage') || '10');
      return [10, 20, 50].includes(saved) ? saved as 10 | 20 | 50 : 10;
    }
    return 10;
  });

  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('page') || '1');
    }
    return 1;
  });

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simpan state ke localStorage
  useEffect(() => {
    localStorage.setItem('sort', sort);
    localStorage.setItem('perPage', perPage.toString());
    localStorage.setItem('page', page.toString());
  }, [sort, perPage, page]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/ideas?sort=${sort}&page[number]=${page}&page[size]=${perPage}`
        );
        const { data, meta } = await res.json();
        setIdeas(data || []);
        setTotal(meta?.total || 0);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sort, perPage, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (idea: Idea) => {
    const url = idea.medium_image?.[0]?.url || idea.small_image?.[0]?.url || '';
    if (!url) return '';
    return url.startsWith('http') ? url : `https://suitmedia-backend.suitdev.com${url}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white min-h-screen">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-black">Our Latest Ideas</h1>
        
        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as 'newest' | 'oldest');
              setPage(1);
            }}
            className="p-2 border rounded bg-white text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(parseInt(e.target.value) as 10 | 20 | 50);
              setPage(1);
            }}
            className="p-2 border rounded bg-white text-sm"
          >
            {[10, 20, 50].map(num => (
              <option key={num} value={num}>{num} per page</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {(page - 1) * perPage + 1} - {Math.min(page * perPage, total)} of {total}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Ideas Grid */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ideas.map(idea => {
            const imageUrl = getImageUrl(idea);
            
            return (
              <div key={idea.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
                {/* Image with fixed aspect ratio (4:3) */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={idea.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      unoptimized={!imageUrl.includes('assets.suitdev.com')} // Optimize only for main domain
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-black line-clamp-3">
                    {idea.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">{formatDate(idea.published_at)}</p>
                  <p className="text-gray-700 line-clamp-3 text-sm">{idea.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination - Minimalist Style */}
      {!loading && total > 0 && (
        <div className="flex justify-center mt-8 gap-1">
          {Array.from({ length: Math.ceil(total / perPage) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
                page === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
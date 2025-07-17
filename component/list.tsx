"use client"

import { useEffect, useMemo, useState } from "react"

const itemsData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Idea Title ${i + 1} - ${'Very long title to test ellipsis '.repeat(2).trim()}`,
  date: new Date(Date.now() - i * 10000000),
}))

const SORT_OPTIONS = {
  newest: (a, b) => b.date - a.date,
  oldest: (a, b) => a.date - b.date,
}

export function List() {
  const [sortBy, setSortBy] = useState("newest")
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const sortedItems = useMemo(() => {
    return [...itemsData].sort(SORT_OPTIONS[sortBy])
  }, [sortBy])

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedItems.slice(start, start + itemsPerPage)
  }, [sortedItems, currentPage, itemsPerPage])

  useEffect(() => {
    localStorage.setItem("sortBy", sortBy)
    localStorage.setItem("itemsPerPage", itemsPerPage.toString())
    localStorage.setItem("currentPage", currentPage.toString())
  }, [sortBy, itemsPerPage, currentPage])

  useEffect(() => {
    const savedSort = localStorage.getItem("sortBy") || "newest"
    const savedItemsPerPage = parseInt(localStorage.getItem("itemsPerPage") || "10")
    const savedCurrentPage = parseInt(localStorage.getItem("currentPage") || "1")
    setSortBy(savedSort)
    setItemsPerPage(savedItemsPerPage)
    setCurrentPage(savedCurrentPage)
  }, [])

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Our Latest Ideas</h2>

          <div className="flex justify-between items-center mb-6">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="border p-2 rounded"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value))
                setCurrentPage(1)
              }}
              className="border p-2 rounded"
            >
              {[10, 20, 50].map((count) => (
                <option key={count} value={count}>
                  {count} per page
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {paginatedItems.map((item) => (
              <div key={item.id} className="bg-gray-50 p-6 rounded-lg">
                <div className="w-full h-48 bg-gray-200 rounded mb-4 overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${item.id}/600/400`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-3 overflow-hidden">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                  et dolore magna aliqua.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

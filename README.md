# Suitmedia Test Project

A Next.js + Tailwind CSS web app to display ideas from Suitmedia API, featuring responsive design, sorting, pagination, and animated UI.

## Features

- **Ideas List**: Fetches and displays ideas with images, title, and publish date.
- **Sorting & Pagination**: Sort by newest/oldest, set items per page, and navigate with modern pagination.
- **Responsive Grid**: 4-column layout on desktop, adapts for mobile.
- **Image Fallback**: Shows "No Image" if image fails to load.
- **Line Clamp**: Card titles are limited to 3 lines with ellipsis.
- **Animated Header**: Navigation with underline animation and mobile dropdown with fade animation.
- **Custom Tailwind Utilities**: Includes aspect ratio, line clamp, and dropdown animation.

## Getting Started

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/page.tsx` — Main page, renders header, banner, and ideas list.
- `component/header.tsx` — Responsive header with navigation and animation.
- `component/banner.tsx` — Banner section with parallax effect.
- `component/list.tsx` — Ideas grid, sorting, pagination, and image fallback.
- `pages/api/ideas.ts` — Next.js API route to proxy Suitmedia backend.
- `app/globals.css` — Tailwind custom utilities and global styles.

## Customization

- **Logo**: Replace `/public/logo.png`.
- **Banner**: Replace `/public/banner.jpg`.
- **Default Image**: Optionally add `/public/default.png` for image fallback.
- **Menu Items**: Edit `menuItems` array in `header.tsx`.

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or any platform supporting Next.js.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

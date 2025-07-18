// Next.js API route for fetching ideas from Suitmedia
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Backend API endpoint
    const baseUrl = 'https://suitmedia-backend.suitdev.com/api/ideas';
    const params = new URLSearchParams();

    // Append image fields to response
    params.append('append[]', 'small_image');
    params.append('append[]', 'medium_image');

    // Set sorting based on query param
    params.set('sort', req.query.sort === 'oldest' ? 'published_at' : '-published_at');

    // Set pagination from query params, with defaults
    params.set('page[number]', req.query['page[number]']?.toString() || '1');
    params.set('page[size]', req.query['page[size]']?.toString() || '10');

    // Fetch data from backend API
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });

    // Handle error response
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();

    // Return data to client
    res.status(200).json(data);
  } catch (error) {
    // Log and return error
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
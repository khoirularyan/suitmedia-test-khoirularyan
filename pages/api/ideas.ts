import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const baseUrl = 'https://suitmedia-backend.suitdev.com/api/ideas';
    const params = new URLSearchParams();

    // Default parameters
    params.append('append[]', 'small_image');
    params.append('append[]', 'medium_image');
    params.set('sort', req.query.sort === 'oldest' ? 'published_at' : '-published_at');
    params.set('page[number]', req.query['page[number]']?.toString() || '1');
    params.set('page[size]', req.query['page[size]']?.toString() || '10');

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
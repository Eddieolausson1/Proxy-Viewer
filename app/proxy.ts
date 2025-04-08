// pages/api/proxy.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

type Data = {
  proxyUrl?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { url, proxy } = req.query;

  if (!url || !proxy) {
    return res.status(400).json({ error: 'Missing URL or proxy information' });
  }

  console.log('Received URL:', url);
  console.log('Received Proxy:', proxy);

  // Construct the proxy URL
  const proxyUrl = `http://${proxy}?url=${encodeURIComponent(url)}`;

  try {
    // Log the proxy URL to check if it's correctly formatted
    console.log('Constructed Proxy URL:', proxyUrl);

    // Fetch the URL through the proxy server
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from the proxy: ${response.statusText}`);
    }

    const data = await response.text();

    // Return the proxy URL as the response
    res.status(200).json({ proxyUrl });
  } catch (error) {
    console.error('Error proxying the request:', error);
    res.status(500).json({ error: `Failed to fetch the URL using the proxy: ${error.message}` });
  }
}

// pages/api/proxy.js

import fetch from 'node-fetch'; // You can install this with `npm install node-fetch`

export default async function handler(req, res) {
  const { url, proxy } = req.query;

  if (!url || !proxy) {
    return res.status(400).json({ error: 'Missing URL or proxy information' });
  }

  // Construct the proxy URL
  const proxyUrl = `http://${proxy}?url=${encodeURIComponent(url)}`;

  try {
    // Fetch the URL through the proxy server
    const response = await fetch(proxyUrl);
    const data = await response.text();

    // Return the proxy URL as the response
    res.status(200).json({ proxyUrl });
  } catch (error) {
    console.error('Error proxying the request:', error);
    res.status(500).json({ error: 'Failed to fetch the URL using the proxy' });
  }
}

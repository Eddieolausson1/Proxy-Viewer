"use server"

interface ProxyResponse {
  data: Proxy[]
}

interface Proxy {
  ip: string
  port: string
  country: string
  type: string
}

export async function getProxy(): Promise<Proxy | null> {
  try {
    // PubProxy API endpoint
    const response = await fetch("http://pubproxy.com/api/proxy?limit=1&format=json&https=true")

    if (!response.ok) {
      console.error("Failed to fetch proxy:", response.statusText)
      return null
    }

    const data: ProxyResponse = await response.json()

    if (data.data && data.data.length > 0) {
      return data.data[0]
    }

    return null
  } catch (error) {
    console.error("Error fetching proxy:", error)
    return null
  }
}

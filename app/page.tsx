"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getProxy } from "@/app/actions"
import { Globe, Loader2 } from "lucide-react"

export default function ProxyViewer() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proxyUrl, setProxyUrl] = useState<string | null>(null)

  // Update the handleSubmit function to redirect to the proxy information page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Make sure URL has http:// or https:// prefix
      let formattedUrl = url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        formattedUrl = "https://" + url
      }

      const proxy = await getProxy()
      if (proxy) {
        // Format the proxy URL
        const proxyAddress = `http://${proxy.ip}:${proxy.port}`
        setProxyUrl(proxyAddress)

        // Redirect to the proxy information page
        window.location.href = `/proxy-view?url=${encodeURIComponent(formattedUrl)}&proxy=${encodeURIComponent(proxyAddress)}`
      } else {
        setError("Could not retrieve a proxy server. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while fetching the proxy")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Proxy Viewer</CardTitle>
          <CardDescription>Enter a URL to view it through a proxy server</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter URL (e.g., example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching proxy...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  View through proxy
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-xs text-muted-foreground">
            This tool uses PubProxy API to fetch proxy servers. Use responsibly and only for legitimate purposes.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

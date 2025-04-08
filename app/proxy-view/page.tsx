"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"

// Update the ProxyViewPage component to include proxy information and manual instructions
export default function ProxyViewPage() {
  const searchParams = useSearchParams()
  const url = searchParams.get("url")
  const proxy = searchParams.get("proxy")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url || !proxy) {
      setError("Missing URL or proxy information")
      setLoading(false)
      return
    }

    // Just display the information, not actually proxying
    setLoading(false)
  }, [url, proxy])

  const handleDirectAccess = async () => {
    if (url && proxy) {
      try {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}&proxy=${encodeURIComponent(proxy)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch the URL using the proxy');
        }
        const data = await response.json();
        window.open(data.proxyUrl, "_blank");
      } catch (error) {
        console.error("Proxy Error:", error);
        setError('Failed to use proxy. Please try again later.');
      }
    }
  }

  // Extract proxy parts for manual configuration
  const proxyParts = proxy ? proxy.replace("http://", "").split(":") : []
  const proxyHost = proxyParts[0] || ""
  const proxyPort = proxyParts[1] || ""

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <CardTitle>Proxy Information</CardTitle>
            <div className="w-24" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Target URL</h3>
                <p className="p-2 bg-muted rounded-md break-all">{url}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Proxy Server</h3>
                <p className="p-2 bg-muted rounded-md">{proxy}</p>
              </div>

              <div className="space-y-4 bg-muted p-4 rounded-md">
                <h3 className="text-lg font-medium">Manual Proxy Configuration</h3>
                <div className="space-y-2">
                  <p className="text-sm">To use this proxy manually in your browser:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm pl-2">
                    <li>Open your browser settings</li>
                    <li>Find the network or proxy settings section</li>
                    <li>
                      Enter the following details:
                      <ul className="list-disc list-inside pl-4 mt-1">
                        <li>
                          Proxy Host: <span className="font-mono">{proxyHost}</span>
                        </li>
                        <li>
                          Proxy Port: <span className="font-mono">{proxyPort}</span>
                        </li>
                        <li>Type: HTTP</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleDirectAccess} className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open URL directly (with proxy)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

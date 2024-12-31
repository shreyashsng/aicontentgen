'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  ClipboardIcon, 
  CheckIcon, 
  SparklesIcon,
  UserCircleIcon,
  ArrowRightIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

type Platform = 'instagram' | 'twitter'

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [prompt, setPrompt] = useState('')
  const [captions, setCaptions] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Authentication effect
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!session) {
          router.push('/')
          return
        }
        setUser(session.user)
      } catch (error) {
        console.error('Error:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const handleGenerateCaptions = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt')
      return
    }

    setCaptions([]) // Clear previous captions
    setGenerating(true)
    try {
      const response = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          platform,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate captions')
      }

      setCaptions(data.captions)
    } catch (error) {
      console.error('Error generating captions:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate captions. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyCaption = (caption: string, index: number) => {
    navigator.clipboard.writeText(caption)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000) // Reset after 2 seconds
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-[250px]" />
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b bg-slate-950/80 backdrop-blur-xl border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2">
              <Squares2X2Icon className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                Caption Generator
              </h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <UserCircleIcon className="w-6 h-6 text-slate-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
                <DropdownMenuLabel className="text-slate-200">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="text-slate-400 focus:text-slate-200 focus:bg-slate-800">
                  {user?.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="text-red-400 focus:text-red-300 focus:bg-slate-800"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-200">Generate Social Media Captions</CardTitle>
            <CardDescription className="text-slate-400">
              Create engaging captions for your social media content using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Platform
                </label>
                <Select
                  value={platform}
                  onValueChange={(value) => setPlatform(value as Platform)}
                >
                  <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800">
                    <SelectItem value="instagram" className="text-slate-200 focus:bg-slate-800 focus:text-slate-200">
                      Instagram
                    </SelectItem>
                    <SelectItem value="twitter" className="text-slate-200 focus:bg-slate-800 focus:text-slate-200">
                      Twitter
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleGenerateCaptions}
                  disabled={!prompt.trim() || generating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {generating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5" />
                      Generate Captions
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">
                Describe your content
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A cozy coffee shop scene with latte art and pastries"
                className="min-h-[120px] bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Generated Captions */}
        {captions.length > 0 && (
          <div className="mt-8 space-y-6">
            {captions.map((caption, index) => (
              <Card
                key={index}
                className="bg-slate-900/50 border-slate-800 overflow-hidden group hover:bg-slate-900/70 transition-colors"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">
                    Caption {index + 1}
                  </CardTitle>
                  <Button
                    onClick={() => handleCopyCaption(caption, index)}
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-200"
                  >
                    {copiedIndex === index ? (
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">Copied!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ClipboardIcon className="w-4 h-4" />
                        <span>Copy</span>
                      </div>
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 whitespace-pre-wrap">
                    {caption}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 
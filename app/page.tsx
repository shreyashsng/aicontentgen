'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      }
      setLoading(false)
    }
    checkUser()
  }, [supabase, router])

  if (loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-slate-950/80 backdrop-blur-xl border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                Caption Generator
              </span>
            </div>
            <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-slate-200">Create an account</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Sign in or create an account to start generating captions
                  </DialogDescription>
                </DialogHeader>
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#2563eb',
                          brandAccent: '#1d4ed8',
                          brandButtonText: 'white',
                          defaultButtonBackground: '#1e293b',
                          defaultButtonBackgroundHover: '#334155',
                          inputBackground: '#0f172a',
                          inputBorder: '#1e293b',
                          inputBorderHover: '#334155',
                          inputBorderFocus: '#2563eb',
                          inputText: '#f8fafc',
                          inputPlaceholder: '#64748b',
                        },
                      },
                    },
                    className: {
                      container: 'w-full',
                      button: 'w-full px-4 py-2 rounded-md',
                      input: 'w-full px-4 py-2 rounded-md bg-slate-950 border border-slate-800 text-slate-200',
                      label: 'text-slate-200',
                      loader: 'text-slate-200',
                    },
                  }}
                  theme="default"
                  providers={['google', 'github']}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-4xl sm:text-6xl font-bold text-slate-200">
            Generate Engaging{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
              Social Media Captions
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Create compelling captions for your Instagram and Twitter posts using AI. Save time and boost engagement.
          </p>
          <Button 
            onClick={() => setIsAuthOpen(true)}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Generating
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="rounded-lg p-2 w-12 h-12 bg-blue-500/10 mb-4">
                <SparklesIcon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                AI-Powered Generation
              </h3>
              <p className="text-slate-400">
                Leverage advanced AI to create unique and engaging captions tailored to your content.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="rounded-lg p-2 w-12 h-12 bg-blue-500/10 mb-4">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                Platform Optimized
              </h3>
              <p className="text-slate-400">
                Get captions specifically formatted for Instagram or Twitter's unique requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="rounded-lg p-2 w-12 h-12 bg-blue-500/10 mb-4">
                <svg
                  className="w-8 h-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">
                Save Time
              </h3>
              <p className="text-slate-400">
                Generate multiple captions instantly instead of spending hours crafting them manually.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

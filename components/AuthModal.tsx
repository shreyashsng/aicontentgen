import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  view: 'sign_in' | 'sign_up';
}

export function AuthModal({ isOpen, onClose, view }: AuthModalProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard')
        onClose()
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1821] rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <Auth
          supabaseClient={supabase}
          view={view}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#344966',
                  brandAccent: '#B4CDED',
                  defaultButtonBackground: '#344966',
                  defaultButtonBackgroundHover: '#B4CDED',
                }
              }
            },
            className: {
              container: 'text-white',
              label: 'text-white',
              button: 'text-white hover:text-[#0D1821]',
              divider: 'bg-white/20',
            }
          }}
          providers={['google']}
          magicLink={false}
        />
      </div>
    </div>
  )
} 
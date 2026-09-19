import { useState, useEffect } from 'react'

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(
    typeof window !== 'undefined' ? window.deferredPwaPrompt || null : null
  )
  const [isInstallable, setIsInstallable] = useState(
    typeof window !== 'undefined' ? Boolean(window.deferredPwaPrompt) : false
  )
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    // Check if already installed / running in standalone window
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')

    setIsInstalled(Boolean(isStandalone))

    // Check if iOS device
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIos(isIosDevice)

    if (window.deferredPwaPrompt) {
      setDeferredPrompt(window.deferredPwaPrompt)
      setIsInstallable(true)
    }

    // Capture standard PWA installation event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      window.deferredPwaPrompt = e
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handlePromptReady = () => {
      if (window.deferredPwaPrompt) {
        setDeferredPrompt(window.deferredPwaPrompt)
        setIsInstallable(true)
      }
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      window.deferredPwaPrompt = null
      console.log('[RefineIQ PWA] App was successfully installed')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('pwa-prompt-ready', handlePromptReady)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('pwa-prompt-ready', handlePromptReady)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    const promptEvent = deferredPrompt || window.deferredPwaPrompt
    if (promptEvent) {
      promptEvent.prompt()
      const { outcome } = await promptEvent.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
      }
      setDeferredPrompt(null)
      window.deferredPwaPrompt = null
      return outcome
    }
    return null
  }

  return {
    isInstallable,
    isInstalled,
    isIos,
    hasDeferredPrompt: Boolean(deferredPrompt || (typeof window !== 'undefined' && window.deferredPwaPrompt)),
    promptInstall,
  }
}

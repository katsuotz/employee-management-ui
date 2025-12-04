import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock sonner toast with DOM rendering
const toastMessages: { [key: string]: string[] } = {
  success: [],
  error: [],
  info: [],
  warning: [],
}

const createToastElement = (message: string, type: string) => {
  const toast = document.createElement('div')
  toast.setAttribute('data-testid', `toast-${type}`)
  toast.setAttribute('data-message', message)
  toast.textContent = message
  toast.className = `toast toast-${type}`
  document.body.appendChild(toast)
  return toast
}

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn((message: string) => {
      toastMessages.success.push(message)
      createToastElement(message, 'success')
    }),
    error: vi.fn((message: string) => {
      toastMessages.error.push(message)
      createToastElement(message, 'error')
    }),
    info: vi.fn((message: string) => {
      toastMessages.info.push(message)
      createToastElement(message, 'info')
    }),
    warning: vi.fn((message: string) => {
      toastMessages.warning.push(message)
      createToastElement(message, 'warning')
    }),
    // Helper for tests
    __getMessages: () => toastMessages,
    __clearMessages: () => {
      Object.keys(toastMessages).forEach(key => {
        toastMessages[key as keyof typeof toastMessages] = []
      })
      document.querySelectorAll('[data-testid^="toast-"]').forEach(el => el.remove())
    },
  },
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock File API
global.File = class File {
  name: string
  size: number
  type: string

  constructor(chunks: any[], name: string, options: { type?: string }) {
    this.name = name
    this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    this.type = options.type || ''
  }
} as any

global.FileReader = class FileReader {
  result: string | null = null
  error: any = null
  readyState: number = 0

  onload: ((event: any) => void) | null = null
  onerror: ((event: any) => void) | null = null

  readAsDataURL() {
    setTimeout(() => {
      this.readyState = 2
      if (this.onload) this.onload({ target: this })
    }, 0)
  }
} as any

// Global test cleanup
beforeEach(async () => {
  // Clear toast messages before each test
  const { toast } = await import('sonner')
  // @ts-ignore - Custom mock methods
  toast.__clearMessages?.()
})

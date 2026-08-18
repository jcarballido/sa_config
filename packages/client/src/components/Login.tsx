import { useState, type FormEvent } from 'react'
import { sendMagicLink } from '../api/auth'
import { Message } from './Message'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_FEEDBACK_DELAY = 1000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function Login() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    const trimmed = email.trim()
    if (!trimmed || !EMAIL_PATTERN.test(trimmed)) {
      setValidationError('Enter a valid email address.')
      return
    }
    setSubmitting(true)
    setValidationError(null)
    setError(null)
    try {
      await Promise.all([sendMagicLink(trimmed), sleep(MIN_FEEDBACK_DELAY)])
      setSubmitted(true)
    } catch (err) {
      setError(String(err))
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(value: string) {
    setEmail(value)
    if (validationError) setValidationError(null)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 p-6 text-zinc-100">
      <h1 className="text-xl font-semibold">Asset Studio</h1>

      <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-sm font-medium text-zinc-300">Sign in</h2>
        <p className="text-sm text-zinc-500">
          Enter your email and we'll send you a magic link.
        </p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-zinc-400">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="you@example.com"
              disabled={submitting}
              aria-invalid={validationError !== null}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-zinc-500 focus:outline-none disabled:opacity-50"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? 'Sending…' : 'Send magic link'}
          </button>
        </form>

        {validationError && <Message variant="error">{validationError}</Message>}

        {submitted && (
          <Message variant="info">
            If your email is whitelisted, a magic link is on its way.
          </Message>
        )}

        {error && (
          <Message variant="error">
            Couldn't reach the server. Check your connection and try again.
          </Message>
        )}
      </div>
    </div>
  )
}
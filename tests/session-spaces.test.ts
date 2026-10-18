import { describe, expect, it } from 'vitest'
import { defaultSpaceForSession, getSessionSpace, setSessionSpace, shortSessionSpace } from '../src/session-spaces.ts'

describe('session-spaces', () => {
  it('derives a stable, safe default from a session id', () => {
    expect(shortSessionSpace('01JABC-def/ghi')).toBe('sess-01JABC-defgh')
    expect(shortSessionSpace(undefined)).toBeUndefined()
    expect(shortSessionSpace('///')).toBeUndefined()
  })

  it('prefers an explicit mapping and remembers it per session', () => {
    const session = '01JTEST-session-one'
    expect(defaultSpaceForSession(session, 'default')).toBe('sess-01JTEST-sess')
    setSessionSpace(session, 'task-login')
    expect(getSessionSpace(session)).toBe('task-login')
    expect(defaultSpaceForSession(session, 'default')).toBe('task-login')
    // A different session is unaffected.
    expect(defaultSpaceForSession('01JTEST-session-two', 'default')).toBe('sess-01JTEST-sess')
  })

  it('falls back to the configured space without a session id', () => {
    expect(defaultSpaceForSession(undefined, 'dsh-agent')).toBe('dsh-agent')
    expect(getSessionSpace('')).toBeUndefined()
  })
})

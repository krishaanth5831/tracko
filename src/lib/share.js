// Shareable tracker links: the tracker JSON, UTF-8 encoded, as base64url in
// the URL hash. No backend — the link *is* the data.

export function buildShareUrl(item, kind) {
  const clean = { ...item }
  delete clean.id
  // uploaded logos are data URLs far too large for a link
  if (clean.image?.type === 'upload') clean.image = null
  const json = JSON.stringify({ v: 1, k: kind, item: clean })
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  const b64 = btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '')
  return `${location.origin}${location.pathname}#share=${b64}`
}

export function parseShareHash(hash = location.hash) {
  const m = hash.match(/^#share=([A-Za-z0-9_-]+)$/)
  if (!m) return null
  try {
    const b64 = m[1].replaceAll('-', '+').replaceAll('_', '/')
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    const { k, item } = JSON.parse(new TextDecoder().decode(bytes))
    if ((k !== 'event' && k !== 'goal') || typeof item?.name !== 'string') return null
    if (k === 'event' && !item.date) return null
    if (k === 'goal' && !(item.target > 0)) return null
    return { kind: k, item }
  } catch {
    return null
  }
}

export function clearShareHash() {
  history.replaceState(null, '', location.pathname + location.search)
}

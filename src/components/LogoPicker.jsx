import { useEffect, useRef, useState } from 'react'
import { searchImages, attribution } from '../lib/imageSearch.js'

// Searches Openverse for real photos matching `query` and lets the user pick
// one as the tracker logo. `value` is the selected image (or null for emoji).
export function LogoPicker({ query, value, onChange, fallbackEmoji }) {
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | done | error
  const lastQuery = useRef('')

  useEffect(() => {
    const q = query.trim()
    if (q.length < 3 || q === lastQuery.current) return
    const t = setTimeout(() => {
      lastQuery.current = q
      setStatus('loading')
      searchImages(q)
        .then((r) => {
          setResults(r)
          setStatus('done')
        })
        .catch(() => setStatus('error'))
    }, 600)
    return () => clearTimeout(t)
  }, [query])

  if (query.trim().length < 3) return null

  return (
    <div>
      <p className="mono text-[10px] text-white/40 mb-2">
        Logo {status === 'loading' && '· searching…'}
        {status === 'error' && '· search failed, using emoji'}
      </p>
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          title="No photo — use emoji"
          className={`aspect-square rounded-lg flex items-center justify-center text-2xl border transition-colors ${
            !value ? 'border-white bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/30'
          }`}
        >
          {fallbackEmoji}
        </button>
        {results.map((img) => (
          <button
            type="button"
            key={img.id}
            onClick={() => onChange(value?.id === img.id ? null : img)}
            title={attribution(img)}
            className={`aspect-square rounded-lg overflow-hidden border transition-colors ${
              value?.id === img.id ? 'border-white' : 'border-white/10 hover:border-white/30'
            }`}
          >
            <img src={img.thumb} alt={img.title} loading="lazy" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {value && (
        <p className="text-[10px] text-white/30 mt-1.5 truncate">
          <a href={value.link} target="_blank" rel="noreferrer" className="hover:text-white/60">
            {attribution(value)}
          </a>
        </p>
      )}
    </div>
  )
}

// Shared logo square used on cards: photo if set, otherwise emoji tile.
export function Logo({ image, emoji, size = 'w-12 h-12' }) {
  if (image) {
    return (
      <img
        src={image.thumb}
        alt=""
        title={attribution(image)}
        className={`${size} rounded-lg object-cover shrink-0 border border-white/10`}
      />
    )
  }
  return (
    <div
      className={`${size} rounded-lg flex items-center justify-center text-2xl shrink-0 bg-white/5 border border-white/10`}
    >
      {emoji}
    </div>
  )
}

// Search CC-licensed photos via the Openverse API (no key needed).
// https://api.openverse.org/v1/#tag/images
export async function searchImages(query, count = 6) {
  const params = new URLSearchParams({
    q: query,
    page_size: String(count),
    license_type: 'commercial',
    mature: 'false',
  })
  const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Image search failed (${res.status})`)
  const data = await res.json()
  return (data.results ?? []).map((r) => ({
    type: 'openverse',
    id: r.id,
    thumb: r.thumbnail,
    url: r.url,
    title: r.title,
    creator: r.creator,
    license: `CC ${r.license.toUpperCase()} ${r.license_version ?? ''}`.trim(),
    link: r.foreign_landing_url,
  }))
}

export function attribution(image) {
  return `"${image.title}" by ${image.creator} · ${image.license}`
}

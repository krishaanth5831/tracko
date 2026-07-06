// Turn an uploaded file into a compact logo image. Everything lives in
// localStorage (~5MB quota total), so originals are never stored: downscale
// to ≤512px on the long edge and re-encode as WebP/JPEG.
export async function fileToLogo(file, maxEdge = 512) {
  const img = await decode(file)
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(img.width * scale))
  canvas.height = Math.max(1, Math.round(img.height * scale))
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  img.close?.()

  let dataUrl = canvas.toDataURL('image/webp', 0.8)
  if (!dataUrl.startsWith('data:image/webp')) dataUrl = canvas.toDataURL('image/jpeg', 0.8)
  return { type: 'upload', dataUrl }
}

function decode(file) {
  if ('createImageBitmap' in window) return createImageBitmap(file)
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image'))
    }
    img.src = url
  })
}

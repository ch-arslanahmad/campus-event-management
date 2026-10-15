import { useState } from 'react'

// Shows a photo. If the file is missing, falls back to an illustration or a coloured block.
export default function Photo({ src, fallback, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return fallback
      ? <img src={fallback} alt={alt} className={className} />
      : <div className={`photo-fallback ${className}`} role="img" aria-label={alt} />
  }
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
}

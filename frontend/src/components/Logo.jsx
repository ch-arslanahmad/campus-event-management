import { useState } from 'react'

const logo = new URL('../assets/uol-logo.png', import.meta.url).href

// Shows the University of Lahore logo. If the file is missing, shows the coloured dots instead.
export default function Logo() {
  const [failed, setFailed] = useState(false)
  if (failed) return <span className="brand__dot" />
  return <img src={logo} alt="University of Lahore logo" className="brand__logo" onError={() => setFailed(true)} />
}

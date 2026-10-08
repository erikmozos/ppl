import { useEffect, useState } from 'react'

export interface Route { parts: string[]; query: URLSearchParams }

function parse(): Route {
  const raw = location.hash.replace(/^#\/?/, '')
  const [path, q = ''] = raw.split('?')
  return { parts: path.split('/').filter(Boolean), query: new URLSearchParams(q) }
}

export function useRoute() {
  const [r, setR] = useState(parse)
  useEffect(() => {
    const f = () => { setR(parse()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return r
}

export const go = (to: string) => { location.hash = to }

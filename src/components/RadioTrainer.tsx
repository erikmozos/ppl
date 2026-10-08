import { useEffect, useMemo, useRef, useState } from 'react'
import type { RadioLine, RadioScenario } from '../data/licenses/types'
import { speakRadio, stopSpeech, useSpeech, type RadioVoice } from '../speech'
import { actions } from '../store'

type Lang = 'es' | 'en' | 'both'
const voiceOf = (who: RadioLine['who'], l: 'es' | 'en'): RadioVoice => `${l}-${who === 'ATC' ? 'atc' : 'pilot'}` as RadioVoice
const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(p => p[1])

/** Lista de escenarios del simulador de radio */
export function RadioList({ scenarios, base }: { scenarios: RadioScenario[]; base: string }) {
  return (
    <div className="subject-grid">
      {scenarios.map(sc => (
        <a key={sc.id} className="card subject-card" href={`${base}&s=${sc.id}`}>
          <span className="subject-icon">{sc.icon}</span>
          <h3>{sc.title}</h3>
          <p className="small muted">{sc.desc}</p>
          <div className="stats"><span><b>{sc.lines.length}</b> mensajes</span><span><b>{sc.lines.filter(l => l.wrong).length}</b> para practicar</span></div>
        </a>
      ))}
    </div>
  )
}

/** Simulador: escuchar el intercambio (ES/EN) o practicar contestando como piloto */
export function RadioTrainer({ sc, back, quizKey }: { sc: RadioScenario; back: string; quizKey: string }) {
  const sp = useSpeech()
  const [lang, setLang] = useState<Lang>(() => { try { return (localStorage.getItem('cf.radioLang') as Lang) || 'both' } catch { return 'both' } })
  const [mode, setMode] = useState<'listen' | 'practice'>('listen')
  const [notes, setNotes] = useState(true)
  const setL = (l: Lang) => { setLang(l); try { localStorage.setItem('cf.radioLang', l) } catch { /* sin almacenamiento */ } }
  useEffect(() => () => stopSpeech(), [])

  return (
    <div className="radio">
      <div className="ac-head">
        <div>
          <a className="back" href={back}>← Escenarios</a>
          <h2>{sc.icon} {sc.title}</h2>
          <p className="muted small">{sc.desc}</p>
        </div>
      </div>
      <div className="card radio-bar">
        <div className="seg small-seg" role="tablist" aria-label="Idioma">
          {([['es', '🇪🇸 Español'], ['en', '🇬🇧 English'], ['both', 'Ambos']] as const).map(([k, t]) => <button key={k} className={lang === k ? 'on' : ''} onClick={() => setL(k)}>{t}</button>)}
        </div>
        <div className="seg small-seg" role="tablist" aria-label="Modo">
          <button className={mode === 'listen' ? 'on' : ''} onClick={() => { stopSpeech(); setMode('listen') }}>🎧 Escuchar</button>
          <button className={mode === 'practice' ? 'on' : ''} onClick={() => { stopSpeech(); setMode('practice') }}>🎙️ Practicar como piloto</button>
        </div>
        <label className="check small"><input type="checkbox" checked={notes} onChange={e => setNotes(e.target.checked)} /> Explicaciones</label>
        {!sp.prefs.enabled && <span className="small muted">La voz está desactivada (ajustes de voz)</span>}
      </div>
      {mode === 'listen'
        ? <Listen sc={sc} lang={lang} notes={notes} />
        : <Practice key={lang} sc={sc} lang={lang === 'both' ? 'es' : lang} notes={notes} quizKey={quizKey} />}
    </div>
  )
}

function Bubble({ line, lang, notes, active, onPlay }: { line: RadioLine; lang: Lang; notes: boolean; active?: boolean; onPlay?: () => void }) {
  return (
    <div className={`bubble ${line.who === 'ATC' ? 'atc' : 'pilot'} ${active ? 'active' : ''}`}>
      <div className="bubble-who">{line.who === 'ATC' ? '🗼 Controlador' : '🧑‍✈️ Piloto'}{onPlay && <button className="btn ghost sm" onClick={onPlay} aria-label="Escuchar mensaje">🔊</button>}</div>
      {lang !== 'en' && <p className="bubble-es">{lang === 'both' && <span className="flag">ES</span>}{line.es}</p>}
      {lang !== 'es' && <p className="bubble-en">{lang === 'both' && <span className="flag">EN</span>}{line.en}</p>}
      {notes && line.note && <p className="bubble-note">💡 {line.note}</p>}
    </div>
  )
}

function Listen({ sc, lang, notes }: { sc: RadioScenario; lang: Lang; notes: boolean }) {
  const [cur, setCur] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const run = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => () => { run.current++ }, [])
  useEffect(() => { listRef.current?.querySelector('.bubble.active')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [cur])

  const playLine = async (i: number) => {
    const l = sc.lines[i]
    if (lang !== 'en') await speakRadio(l.es, voiceOf(l.who, 'es'))
    if (lang !== 'es') await speakRadio(l.en, voiceOf(l.who, 'en'))
  }
  const playAll = async (from = 0) => {
    const my = ++run.current
    setPlaying(true)
    for (let i = from; i < sc.lines.length; i++) {
      if (run.current !== my) return
      setCur(i)
      await playLine(i)
      if (run.current !== my) return
      await new Promise(r => setTimeout(r, 500))
    }
    if (run.current === my) setPlaying(false)
  }
  const stop = () => { run.current++; stopSpeech(); setPlaying(false) }

  return (
    <div className="radio-chat-wrap">
      <div className="row gap wrap-row">
        <button className="btn primary sm" onClick={() => (playing ? stop() : playAll(cur >= 0 && cur < sc.lines.length - 1 ? cur : 0))}>{playing ? '❚❚ Pausa' : '▶ Reproducir el intercambio'}</button>
        <span className="small muted">Toca 🔊 en cualquier mensaje para escucharlo solo.</span>
      </div>
      <div className="radio-chat" ref={listRef}>
        {sc.lines.map((l, i) => <Bubble key={i} line={l} lang={lang} notes={notes} active={i === cur} onPlay={() => { run.current++; setPlaying(false); setCur(i); playLine(i) }} />)}
      </div>
    </div>
  )
}

function Practice({ sc, lang, notes, quizKey }: { sc: RadioScenario; lang: 'es' | 'en'; notes: boolean; quizKey: string }) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [ok, setOk] = useState(0)
  const total = sc.lines.filter(l => l.wrong?.length).length
  const line = sc.lines[i]
  const done = i >= sc.lines.length
  const options = useMemo(() => {
    if (!line?.wrong?.length) return []
    return shuffle([{ text: line[lang], right: true, why: line.note ?? '' }, ...line.wrong.map(w => ({ text: w[lang], right: false, why: w.why }))])
  }, [i, lang]) // eslint-disable-line react-hooks/exhaustive-deps
  const listRef = useRef<HTMLDivElement>(null)

  // los mensajes del controlador (y los del piloto sin pregunta) se reproducen y avanzan solos
  useEffect(() => {
    if (done) return
    listRef.current?.lastElementChild?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    if (line.wrong?.length) return
    let cancelled = false
    speakRadio(line[lang], voiceOf(line.who, lang)).then(() => { if (!cancelled) setTimeout(() => !cancelled && setI(x => x + 1), 600) })
    return () => { cancelled = true }
  }, [i]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (done && total) actions.quizResult(quizKey, Math.round((ok / total) * 100)) }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  function choose(k: number) {
    if (picked !== null) return
    setPicked(k)
    if (options[k].right) setOk(x => x + 1)
    speakRadio(line[lang], voiceOf('P', lang))
  }
  const shown = sc.lines.slice(0, Math.min(i + (line?.wrong?.length && picked === null ? 0 : 1), sc.lines.length))

  return (
    <div className="radio-chat-wrap">
      <div className="radio-chat" ref={listRef}>
        {shown.map((l, k) => <Bubble key={k} line={l} lang={lang} notes={notes && (k < i || picked !== null)} />)}
      </div>
      {!done && line.wrong?.length ? (
        <div className="card quiz">
          <p className="eyebrow">Tu turno · ¿qué transmites?</p>
          <div className="quiz-opts">
            {options.map((o, k) => (
              <button key={k} className={`quiz-opt ${picked === null ? '' : o.right ? 'right' : k === picked ? 'wrong' : 'dim'}`} onClick={() => choose(k)} disabled={picked !== null}>
                <span className="quiz-letter">{'ABC'[k]}</span>{o.text}
              </button>
            ))}
          </div>
          {picked !== null && (
            <div className={`quiz-why ${options[picked].right ? 'ok' : 'ko'}`}>
              <b>{options[picked].right ? '✓ Correcto.' : '✗ Así no.'}</b> {options[picked].right ? line.note : options[picked].why}
            </div>
          )}
          {picked !== null && <button className="btn primary" onClick={() => { setPicked(null); setI(x => x + 1) }}>Continuar →</button>}
        </div>
      ) : done ? (
        <div className="card quiz">
          <p className="eyebrow">Fin del escenario</p>
          <div className={`result ${ok / Math.max(1, total) >= 0.75 ? 'good' : 'mid'}`}>{ok}/{total}</div>
          <button className="btn primary" onClick={() => { setI(0); setOk(0); setPicked(null) }}>Repetir</button>
        </div>
      ) : null}
    </div>
  )
}

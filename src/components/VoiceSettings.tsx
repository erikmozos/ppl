import { TEST_TEXT, bestVoice, setPrefs, speak, useSpeech } from '../speech'

/** Ajustes de la voz narradora (voces neuronales del sistema) */
export function VoiceSettings() {
  const sp = useSpeech()
  const best = bestVoice()
  const neural = sp.prefs.engine === 'neural' && sp.neuralCount > 0
  return (
    <div className="card voice">
      <div className="row between">
        <h3>Voz narradora</h3>
        <label className="check"><input type="checkbox" checked={sp.prefs.enabled} onChange={e => setPrefs({ enabled: e.target.checked })} /> Activa</label>
      </div>
      <label className="field">Motor de voz
        <select value={sp.prefs.engine} onChange={e => setPrefs({ engine: e.target.value as 'neural' | 'system' })}>
          <option value="neural">Neuronal natural (Piper{sp.neuralVoice ? ` · ${sp.neuralVoice}` : ''}){sp.neuralCount ? '' : ' — sin generar'}</option>
          <option value="system" disabled={!sp.supported}>Voz del sistema (navegador)</option>
        </select>
      </label>
      {!neural && sp.supported && <label className="field">Voz del sistema
        <select value={sp.prefs.voice || best?.name || ''} onChange={e => setPrefs({ voice: e.target.value })}>
          {sp.voices.length === 0 && <option value="">Voz del sistema</option>}
          {sp.voices.map(v => <option key={v.name} value={v.name}>{v.name} · {v.lang}</option>)}
        </select>
      </label>}
      <label className="field">Velocidad · {sp.prefs.rate.toFixed(2)}×
        <input type="range" min={0.7} max={1.4} step={0.05} value={sp.prefs.rate} onChange={e => setPrefs({ rate: Number(e.target.value) })} />
      </label>
      <button className="btn ghost sm" onClick={() => speak(TEST_TEXT)}>Probar voz</button>
      <p className="small muted">{neural
        ? `Audio neuronal pregenerado para ${sp.neuralCount} narraciones. Los pasos de flows que crees o edites tú se leen con la voz del sistema.`
        : 'La voz neuronal se genera con «npm run audio». Mientras tanto se usa la voz del sistema; en Mac puedes instalar una voz «Mejorada» en Ajustes › Accesibilidad › Contenido leído.'}</p>
    </div>
  )
}

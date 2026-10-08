"""Genera el audio neuronal de cada texto de public/audio/texts.json con Piper (TTS open source, offline).

Uso:  npm run audio        (o: PIPER_VOICE=es_ES-sharvard-medium npm run audio)
Crea public/audio/<hash>.m4a y public/audio/manifest.json. Solo genera los que faltan.
"""
import json, os, subprocess, sys, tempfile, urllib.request, wave
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

VOICE = os.environ.get("PIPER_VOICE", "es_ES-davefx-medium")
# voces del simulador de radio: (modelo, speaker_id)
RADIO = {
    "es-atc": ("es_ES-sharvard-medium", 1),
    "es-pilot": ("es_ES-davefx-medium", None),
    "en-atc": ("en_GB-alan-medium", None),
    "en-pilot": ("en_US-ryan-medium", None),
}
OUT = Path("public/audio")
VOICES = Path("scripts/.voices")


def ensure_voice(name: str) -> Path:
    locale, speaker, quality = name.split("-")
    VOICES.mkdir(parents=True, exist_ok=True)
    onnx = VOICES / f"{name}.onnx"
    base = f"https://huggingface.co/rhasspy/piper-voices/resolve/main/{locale.split('_')[0]}/{locale}/{speaker}/{quality}/{name}"
    for suffix in (".onnx", ".onnx.json"):
        dest = VOICES / f"{name}{suffix}"
        if not dest.exists():
            print(f"Descargando {dest.name}…", flush=True)
            urllib.request.urlretrieve(base + suffix, dest)
    return onnx


def main():
    texts = json.loads((OUT / "texts.json").read_text())
    voices = {}

    def get(v):
        model, speaker = RADIO.get(v, (VOICE, None))
        if model not in voices:
            voices[model] = PiperVoice.load(str(ensure_voice(model)))
        # narración algo más pausada; la radio, a ritmo de radio
        cfg = SynthesisConfig(length_scale=1.08 if v is None else 0.98, noise_scale=0.6, noise_w_scale=0.75, speaker_id=speaker)
        return voices[model], cfg

    todo = [x for x in texts if not (OUT / f"{x['h']}.m4a").exists()]
    print(f"{len(texts)} textos · {len(todo)} por generar", flush=True)
    tmp = Path(tempfile.mkdtemp())
    convert = []
    for i, x in enumerate(todo, 1):
        wav = tmp / f"{x['h']}.wav"
        voice, cfg = get(x.get("v"))
        with wave.open(str(wav), "wb") as wf:
            voice.synthesize_wav(x["t"], wf, syn_config=cfg)
        convert.append(wav)
        if i % 50 == 0:
            print(f"  {i}/{len(todo)}", flush=True)

    def to_m4a(wav: Path):
        subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "48000", str(wav), str(OUT / (wav.stem + ".m4a"))], check=True)
        wav.unlink()

    with ThreadPoolExecutor(8) as ex:
        list(ex.map(to_m4a, convert))
    # borra audios de textos que ya no existen (pasos editados o eliminados)
    wanted = {x["h"] for x in texts}
    for f in OUT.glob("*.m4a"):
        if f.stem not in wanted:
            f.unlink()
    files = sorted(p.stem for p in OUT.glob("*.m4a"))
    (OUT / "manifest.json").write_text(json.dumps({"voice": VOICE, "files": files}))
    print(f"Listo: {len(files)} audios", flush=True)


if __name__ == "__main__":
    sys.exit(main())

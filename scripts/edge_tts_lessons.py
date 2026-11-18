# Voces naturales de las lecciones: Microsoft Neural (es-ES-AlvaroNeural) con edge-tts.
# Lee public/audio/lessons/texts.json, genera solo lo que falta (HE-AAC 24 kbps mono) y reescribe el manifiesto.
# Uso: uv run --python 3.12 --with edge-tts python scripts/edge_tts_lessons.py
import asyncio, json, subprocess, tempfile
from pathlib import Path
import edge_tts

VOICE, RATE, PAR = "es-ES-AlvaroNeural", "-4%", 4
out = Path("public/audio/lessons")
items = json.loads((out / "texts.json").read_text())
todo = [x for x in items if not (out / f"{x['h']}.m4a").exists()]
print(f"{len(items)} secciones, faltan {len(todo)}")

async def one(x, sem, n):
    async with sem:
        for intento in range(4):
            try:
                with tempfile.NamedTemporaryFile(suffix=".mp3") as tmp:
                    await edge_tts.Communicate(x["t"], VOICE, rate=RATE).save(tmp.name)
                    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp.name, "-ac", "1", "-ar", "44100", "-c:a", "aac_at", "-profile:a", "4", "-b:a", "24k", str(out / f"{x['h']}.m4a")], check=True)
                print(f"✓ {n}/{len(todo)}", flush=True)
                return
            except Exception as e:
                print(f"reintento {x['h']}: {e}", flush=True)
                await asyncio.sleep(3 * (intento + 1))

async def main():
    sem = asyncio.Semaphore(PAR)
    await asyncio.gather(*(one(x, sem, i + 1) for i, x in enumerate(todo)))
    keep = {x["h"] for x in items}
    for f in out.glob("*.m4a"):
        if f.stem not in keep: f.unlink()
    files = sorted(f.stem for f in out.glob("*.m4a"))
    (out / "manifest.json").write_text(json.dumps({"voice": VOICE, "files": files}))
    print(f"listo: {len(files)} audios")

asyncio.run(main())

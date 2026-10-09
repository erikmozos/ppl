# Voz natural del vídeo: Microsoft Neural (es-ES-AlvaroNeural) con edge-tts. Una pista por escena.
import asyncio, json, sys
from pathlib import Path
import edge_tts

VOICE = "es-ES-AlvaroNeural"
out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)

async def main():
    for s in json.loads((Path(__file__).parent / "scenes.json").read_text()):
        mp3 = out / f"{s['id']}.mp3"
        await edge_tts.Communicate(s["text"], VOICE, rate="-4%").save(str(mp3))
        print(s["id"])

asyncio.run(main())

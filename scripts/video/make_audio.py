# Voz del vídeo de presentación: una pista WAV por escena con Piper (es_ES-davefx-medium)
import json, sys, wave
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
voice = PiperVoice.load(str(Path(__file__).parent.parent / ".voices" / "es_ES-davefx-medium.onnx"))
cfg = SynthesisConfig(length_scale=1.04, noise_scale=0.62, noise_w_scale=0.8)
for s in json.loads((Path(__file__).parent / "scenes.json").read_text()):
    with wave.open(str(out / f"{s['id']}.wav"), "wb") as wf:
        voice.synthesize_wav(s["text"], wf, syn_config=cfg)
    print(s["id"])

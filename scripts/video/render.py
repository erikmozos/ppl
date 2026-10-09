# Monta el vídeo de presentación: cada captura con su pista de voz, zoom lento y fundidos
import subprocess, sys, json
from pathlib import Path
src = Path(sys.argv[1]); out = Path(sys.argv[2])
clips = src / "clips"; clips.mkdir(exist_ok=True)
scenes = json.loads((Path(__file__).parent / "scenes.json").read_text())
dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)]))
lst = []
for s in scenes:
    i = s["id"]; T = round(dur(src / "audio" / f"{i}.wav") + 0.9, 2); N = int(T * 30)
    vf = (f"[0:v]scale=2560:1440,zoompan=z=1+0.035*on/{N}:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2):d={N}:s=1280x720:fps=30,"
          f"fade=t=in:st=0:d=0.35:color=0xf7f7f5,fade=t=out:st={T-0.35}:d=0.35:color=0xf7f7f5,format=yuv420p[v];"
          f"[1:a]adelay=350|350,apad,atrim=0:{T},aresample=44100[a]")
    c = clips / f"{i}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", str(src / "frames" / f"{i}.png"), "-i", str(src / "audio" / f"{i}.wav"),
                    "-filter_complex", vf, "-map", "[v]", "-map", "[a]", "-t", str(T), "-c:v", "libx264", "-preset", "medium", "-crf", "21",
                    "-c:a", "aac", "-b:a", "128k", str(c)], check=True)
    lst.append(f"file '{c}'"); print(i, T)
(src / "list.txt").write_text("\n".join(lst))
out.parent.mkdir(parents=True, exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(src / "list.txt"), "-c", "copy", "-movflags", "+faststart", str(out)], check=True)
# subtítulos WebVTT con el texto de cada escena
t = 0.0; vtt = ["WEBVTT", ""]
f = lambda x: f"{int(x // 3600):02d}:{int(x % 3600 // 60):02d}:{x % 60:06.3f}"
for s in scenes:
    T = round(dur(src / "audio" / f"{s['id']}.wav") + 0.9, 2)
    vtt += [f"{f(t + 0.35)} --> {f(t + T - 0.3)}", s["text"], ""]; t += T
out.with_suffix(".vtt").write_text("\n".join(vtt))

# Schema de `src/data/videos/<grupo>.json`

Array de objetos, um por `id` de `src/data/ids.md`:

```json
{
  "id": "rehab_ext_rot_band",
  "kind": "youtube" | "file" | "image-seq" | "svg",
  "url": "https://www.youtube.com/watch?v=XXXX" | "https://.../video.mp4" | "/media/xxx.svg",
  "youtubeId": "XXXX",           // só para kind=youtube
  "startSec": 12,                // trecho que mostra a variação certa
  "endSec": 38,
  "poster": "https://...jpg",    // opcional (thumbnail)
  "source": "wger" | "free-exercise-db" | "wikimedia" | "musclewiki" | "youtube:<canal>" | "próprio",
  "license": "CC-BY-SA 4.0" | "CC0" | "YouTube embed (ToS)" | "...",
  "quality": "ok" | "abaixo-do-ideal",
  "reason": "por que foi escolhido e como foi verificado contra as restrições",
  "flags": ["braço acima do ombro em 0:05–0:08, usar startSec depois"]  // opcional
}
```

Regras:
- Verificar cada vídeo contra: braço acima da linha do ombro, ombros forçados para trás e para baixo, barra nas costas, carga pesada pendurada nos braços. Se o vídeo mostra isso na variação, descartar.
- Trecho ≤ ~30 s.
- `kind=youtube`: usar embed `https://www.youtube-nocookie.com/embed/<id>?start=<s>&end=<e>`.
- `kind=file`: URL direta de mp4/gif/webm com licença aberta (wger: https://wger.de/api/v2/video/ ; free-exercise-db: https://github.com/yuhonas/free-exercise-db/tree/main/exercises/<name>/ imagens 0.jpg e 1.jpg — usar `image-seq` com `frames: [url0, url1]`).
- `kind=image-seq`: campo extra `frames: string[]`.

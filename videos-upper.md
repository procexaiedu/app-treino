# Vídeos — membros superiores (treino principal)

Dados em `src/data/videos/upper.json`. Os vídeos do YouTube foram confirmados via oEmbed e baixados trecho a trecho para conferir quadro a quadro.

Restrições verificadas em cada item: (A) braço acima da linha do ombro, (B) ombros forçados para trás e para baixo, (C) barra nas costas, (D) carga pesada pendurada nos braços.

**Resumo:** 11 ok, 2 abaixo-do-ideal, 0 svg.

| id | Fonte | Licença | Trecho | Por que foi escolhido | Restrições A/B/C/D | Abaixo do ideal? |
|---|---|---|---|---|---|---|
| db_row_unilateral | free-exercise-db `One-Arm_Dumbbell_Row` (image-seq) | Unlicense (domínio público) | 2 quadros | Mão e joelho no banco, cotovelo junto ao corpo | nenhuma aparece | não |
| chest_supported_row | YouTube Quasar Fitness `7oqpWiwSjtY` | YouTube embed (ToS) | 2–20 s | "Chest-Supported Machine Row - Neutral-Grip": apoio no peito, pegada neutra, vistas lateral e frontal | nenhuma aparece | não |
| incline_pushup_plus | YouTube Move365 Whitby `b-twM1u_8eE` | YouTube embed (ToS) | 3–23 s | Mãos no banco, protração escapular (plus) seguida da flexão inclinada | nenhuma aparece (sem carga) | não |
| hammer_curl | YouTube The Queen of Lean `qI7fKreMp_0` | YouTube embed (ToS) | 0–15 s | Sentado, pegada neutra, alternado, halteres leves | nenhuma aparece | não |
| tricep_kickback | wger vídeo 655 (`69e8c1e5-….MOV`, H.264, 12 s) | CC-BY-SA 4.0 (Goulart / wger) | vídeo inteiro (12 s) | Tronco apoiado no banco, braço paralelo ao chão, unilateral | nenhuma aparece | não (flag: .MOV; alternativa image-seq `Tricep_Dumbbell_Kickback`) |
| sidelying_ext_rot_db | YouTube Comeback Performance `ub2n-iZeqoU` | YouTube embed (ToS) | 0–12 s | Deitado de lado, cotovelo apoiado, halter leve | nenhuma aparece | não |
| incline_prone_db_row | YouTube Andrew Kwong (DeltaBolic) `G35gTqGcXXA` | YouTube embed (ToS) | 0–11 s | Peito no banco inclinado, halteres, cotovelos ~45° | nenhuma no trecho; 13–16 s mostra cotovelo a 90°, que fica fora do trecho | não |
| machine_row_unilateral | YouTube Live Lean TV `nhcmIbjUdlE` | YouTube embed (ToS) | 3–30 s | Máquina articulada com apoio no peito, um braço por vez | nenhuma aparece | **sim**: câmera distante e pegada neutra não visível. Alternativa exata permitida ("ou halter"): free-exercise-db `One-Arm_Dumbbell_Row` |
| incline_pushup_pause | YouTube Joel Lynch `DfwaGm-Rtq8` | YouTube embed (ToS) | 0–10 s | Mãos no banco, pausa visível embaixo | nenhuma aparece | não |
| db_curl_unilateral | free-exercise-db `Dumbbell_Alternate_Bicep_Curl` (image-seq) | Unlicense (domínio público) | 2 quadros | Um braço por vez | nenhuma aparece | não |
| db_skullcrusher_neutral | YouTube Ty Training `jhmxpVN7qjo` | YouTube embed (ToS) | 13–30 s | Deitado, pegada neutra, halter desce ao lado da cabeça | nenhuma grave; o halter não vai para trás da cabeça | **sim**: leve deriva do cotovelo para trás em algumas repetições (o ids.md pede braço VERTICAL). Descartados: fedb `Lying_Dumbbell_Tricep_Extension` e wger 245 (braço inclinado para trás), `m0nx3a5ePuE` (pesado, atrás da cabeça) |
| db_shrug_light | YouTube Sunderland MSK `iPVAdgf81s0` | YouTube embed (ToS) | 6–24 s | Fisioterapia (série para dor cervical), halteres de ~1–2 kg, sobe e segura | nenhuma aparece (carga leve) | não. Descartados: fedb `Dumbbell_Shrug` e RP `_t3lrPI6Ns4` (pesados), wger 570 (barra), `k8L0yJRu7zc` (braço acima da cabeça aos 25 s) |
| pallof_press | YouTube MEAUXTION FITNESS `Y0e2w0aKOXw` | YouTube embed (ToS) | 2–30 s | Elástico horizontal na altura do peito, braços estendidos à frente | nenhuma aparece | não (alternativa: `AH_QZLm_0-s` 12–30 s) |

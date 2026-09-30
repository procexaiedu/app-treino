# Vídeos de demonstração — registro de fontes

Um item por exercício, alongamento e item de reabilitação do plano (45 no total). Dados em `src/data/videos/*.json`, lidos pelo app via `import.meta.glob`.

Ordem de preferência usada: bancos com licença aberta (free-exercise-db, wger) → embed do YouTube com início/fim → SVG próprio. Nenhum item precisou de SVG.

## Resumo

| Grupo | Itens | ok | abaixo do ideal |
|---|---|---|---|
| Superior (treinos A e C) | 13 | 11 | 2 — `machine_row_unilateral`, `db_skullcrusher_neutral` |
| Inferior + core (treinos B, D, E) | 14 | 14 | 0 |
| Reabilitação, alongamentos, cardio | 18 | 16 | 2 — `rehab_ext_rot_band`, `cardio_elliptical` |
| **Total** | **45** | **41** | **4** |

Tipos: 30 embeds YouTube (precisam de internet; a miniatura fica em cache), 14 sequências de 2 imagens do free-exercise-db (Unlicense, ficam em cache offline após a primeira abertura), 1 arquivo .MOV H.264 do wger (CC-BY-SA 4.0; se não tocar, o app cai para a sequência de imagens).

Restrições checadas em todos os trechos: braço acima da linha do ombro · ombros forçados para trás e para baixo · barra nas costas · carga pesada pendurada nos braços.

### Itens abaixo do ideal

| id | Problema | O que fazer |
|---|---|---|
| `machine_row_unilateral` | Câmera longe; não dá para confirmar a pegada neutra | Siga a dica do app: pegada neutra. Alternativa exata: remada unilateral com halter (`db_row_unilateral`) |
| `db_skullcrusher_neutral` | Em algumas repetições o cotovelo vai um pouco para trás | Mantenha o braço vertical; halter desce ao lado da cabeça, nunca atrás |
| `rehab_ext_rot_band` | Rotação passa do neutro e não há toalha entre cotovelo e tronco | Use a toalha e pare a rotação um pouco antes do neutro se doer |
| `cardio_elliptical` | Resolução não confirma se as mãos estão nas barras fixas | Mãos nas barras fixas, não nas alavancas que se movem |

### Avisos em itens "ok"

- `stretch_pec_doorway`: demo com os dois braços ao mesmo tempo; no plano é um lado por vez.
- `rehab_chin_tuck`: mostra só a fase 1 (cabeça no chão); a elevação de 1–2 cm das fases seguintes não aparece.
- `rehab_prone_w`: trecho começa em 74 s de propósito — antes disso há braços acima da cabeça.
- `stretch_pec_roller`: trecho termina em 68 s de propósito — depois os braços sobem.
- `cardio_intervals_bike`: só mostra a bike; o cronômetro 8 × (30 s forte + 90 s leve) é do texto do app.
- `tricep_kickback`: arquivo .MOV; fallback automático para imagens.
- Áudio dos vídeos do YouTube não foi verificado (embed toca sem som).

---

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


---

# Vídeos: membro inferior + core (14 itens)

Arquivo de dados: `src/data/videos/lower-core.json`

Resumo: **14 ok · 0 abaixo do ideal · 0 svg** (10 image-seq do free-exercise-db, 4 embeds do YouTube).

Como foi verificado:
- **free-exercise-db** (licença Unlicense, domínio público, confirmada via GitHub API): os dois frames (0.jpg/1.jpg) de cada exercício foram baixados e inspecionados visualmente.
- **YouTube**: cada ID foi confirmado via oEmbed, e o storyboard do player (1 miniatura a cada 1–2 s) foi baixado e inspecionado quadro a quadro para escolher o trecho e checar as restrições. O áudio **não** foi verificado.
- **wger**: há vídeos CC-BY-SA 4 (autor "Goulart") de Hip Thrust (294), Leg Curls (365/366), Leg Press (371), Sitting Calf Raises (590) e Romanian Deadlift (507, barra). Não foram usados porque são arquivos .MOV em HEVC de 27–390 MB (não tocam no Chrome/Firefox) e não deu para inspecionar o conteúdo deles sem ffmpeg. Ficam como alternativa caso sejam transcodificados.

Restrições checadas em todos: braço acima da linha do ombro · ombros forçados para trás e para baixo · barra nas costas · carga pesada pendurada nos braços.

| id | Fonte | Licença | Trecho | Por que foi escolhido | Restrições | Qualidade |
|---|---|---|---|---|---|---|
| goblet_squat | free-exercise-db `Goblet_Squat` | Unlicense | 2 frames | Kettlebell junto ao peito | Cotovelos abaixo do ombro, sem barra nas costas ✔ | ok |
| leg_press | free-exercise-db `Leg_Press` | Unlicense | 2 frames | Leg press 45° | Mãos nas manoplas laterais ✔ | ok |
| bulgarian_split_squat | YouTube Torokhtiy Weightlifting Library `oGTVhFgRnes` | YouTube embed | 8–38 s | Búlgaro sem carga, pé de trás no banco, mãos na cintura, vistas lateral e frontal. O fedb só tem split squat sem banco | Sem carga, braços baixos ✔ (0–7 s descartado) | ok |
| leg_extension_unilateral | free-exercise-db `Single-Leg_Leg_Extension` | Unlicense | 2 frames | Uma perna por vez | Mãos no assento ✔ | ok |
| calf_raise_seated | free-exercise-db `Seated_Calf_Raise` | Unlicense | 2 frames | Máquina sentada, apoio nos joelhos. Alternativa: `Calf_Press_On_The_Leg_Press_Machine` | Nada sobre os ombros ✔ | ok |
| hip_thrust | YouTube One Minute Tutorial `8xJ0Vxjv0sw` | YouTube embed | 22–42 s | Hip thrust em máquina, repetições contínuas | Mãos nas manoplas na cintura ✔. Descartados 8–10 s (exemplo de erro) e 44–47 s (ilustração). fedb `Barbell_Hip_Thrust` rejeitado: braços abertos sobre o banco na linha do ombro | ok |
| rdl_db | YouTube J2FIT `hQgFixeXdZo` | YouTube embed | 44–74 s | RDL com halteres leves/moderados, vistas frontal-oblíqua e lateral. fedb `Stiff-Legged_Dumbbell_Deadlift` rejeitado (stiff, carga maior) | Ombros neutros visualmente ✔. **Flag:** tem narração não verificada; ignorar se houver o cue "ombros para trás e para baixo" | ok (com flag) |
| leg_curl | free-exercise-db `Seated_Leg_Curl` | Unlicense | 2 frames | Cadeira flexora sentada | Mãos junto ao quadril ✔. `Lying_Leg_Curls` rejeitado: braços à frente da cabeça | ok |
| back_extension_45 | free-exercise-db `Hyperextensions_Back_Extensions` | Unlicense | 2 frames | Banco ~45° | **Braços cruzados no peito** ✔. Flag: não descer/subir além da lombar neutra | ok (com flag) |
| hip_abduction_machine | free-exercise-db `Thigh_Abductor` | Unlicense | 2 frames | Cadeira abdutora | Mãos no assento ✔ | ok |
| dead_bug | free-exercise-db `Dead_Bug` | Unlicense | 2 frames | Braços **verticais para o teto nos 2 frames**, só a perna muda | Não mostra braço acima da cabeça ✔. Flag: frames estáticos | ok (com flag) |
| plank | free-exercise-db `Plank` | Unlicense | 2 frames | Prancha nos antebraços | Cotovelos sob os ombros ✔ | ok |
| side_plank | free-exercise-db `Side_Bridge` | Unlicense | 2 frames | Antebraço no chão, cotovelo sob o ombro, mão de cima no quadril | Braço não sobe ✔. Flag: mostra pernas estendidas; na Fase 1 fazer com os joelhos apoiados | ok (com flag) |
| bird_dog_leg | YouTube Transform Chiropractic `V8-dWU-U5ag` | YouTube embed | 48–78 s | Cartela "Bird Dog/Cross Crawl Beginner – Leg only": perna reta até a horizontal | **As duas mãos no chão o tempo todo** ✔. BioEndurance `u9cwfMYwXVo` rejeitado (bird dog clássico com braço a partir de 36 s) | ok |

Pontos para revisão humana:
1. `rdl_db`: ouvir o áudio de 44 a 74 s do J2FIT e conferir se tem o cue "ombros para trás e para baixo".
2. `side_plank`: o vídeo não mostra a versão com os joelhos apoiados da Fase 1. Se isso for essencial, trocar por uma SVG ou por outro vídeo.
3. As image-seq têm só 2 frames. Se o app precisar de movimento contínuo, os vídeos wger (CC-BY-SA 4) podem ser transcodificados para H.264/webm para leg press, leg curl, calf sentado e hip thrust.


---

# Vídeos: aquecimento, reabilitação, alongamentos e cardio

Os dados estão em `src/data/videos/rehab-stretch-cardio.json`. Cada vídeo do YouTube foi confirmado via oEmbed (título, canal e duração). Depois, o trecho foi baixado e conferido quadro a quadro em folha de contato.

Restrições verificadas em cada item:
- (A) braço acima da linha do ombro
- (B) ombros forçados para trás e para baixo
- (C) barra nas costas
- (D) carga pesada pendurada nos braços

Bancos abertos consultados primeiro:
- **wger:** nenhum dos 78 vídeos cobre estes itens.
- **free-exercise-db:** usado onde a variação batia exatamente.

**Resumo:** 16 ok, 2 abaixo-do-ideal, 0 svg.

| id | Fonte | Licença | Trecho | Por que foi escolhido | Restrições A/B/C/D | Abaixo do ideal? |
|---|---|---|---|---|---|---|
| warmup_bike | YouTube Rehab My Patient `HoA9Jzf9A2E` ("Cycling rehab") | YouTube embed (ToS) | 0–29 s | Bike ergométrica vertical, cadência leve. É um vídeo diferente do usado em cardio_bike e em cardio_intervals_bike | nenhuma aparece | não |
| rehab_breathing | YouTube Rehab My Patient `6YB0pv3iv0g` | YouTube embed (ToS) | 0–23 s | Deitada de costas, mão na barriga e mão no peito, setas mostram a barriga subindo e o peito parado | nenhuma aparece | não |
| rehab_chin_tuck | YouTube [P]rehab `kaplx1ocaw8` ("Supine Chin Tuck") | YouTube embed (ToS) | 18–45 s | Deitado de costas, queixo para dentro sem tirar a cabeça do apoio | nenhuma no trecho. 12–18 s (mãos tocando o pescoço) ficou fora | não. Flag: só a Fase 1; a elevação de 1–2 cm da Fase 2+ não aparece |
| rehab_thoracic_ext_roller | YouTube Rehab My Patient `9Y11Kc0E0og` | YouTube embed (ToS) | 0–30 s | Rolo transversal na torácica, **braços cruzados no peito** o tempo todo | nenhuma aparece | não. Descartados por mãos atrás da cabeça: Baptist Health `gCNmsijJdFY`, 3DPT `_KVE3qEytJ4` |
| rehab_open_book | YouTube Elite Performance Institute `peeW19ofFUg` | YouTube embed (ToS) | 6–36 s | Deitado de lado, rolo sob o joelho, braço estendido perpendicular ao tronco (altura do ombro) abrindo em rotação | nenhuma; o braço não passa da linha do ombro em relação ao tronco | não. Descartado: Revival Performance PT `rDviWORCWEw` (braço acima da cabeça) |
| rehab_ext_rot_band | YouTube Rehab My Patient `ybNV36DoRfY` | YouTube embed (ToS) | 0–27 s | Em pé, cotovelo colado ao corpo a 90°, elástico | nenhuma aparece (carga leve) | **sim**: a amplitude passa da neutra e não há toalha. Mesma limitação na alternativa aberta: free-exercise-db `External_Rotation_with_Band` |
| rehab_band_row | YouTube Rehab My Patient `TT_JGLeMwiA` | YouTube embed (ToS) | 0–27 s | Elástico na porta, puxada com cotovelos junto ao corpo, escápulas se aproximando | nenhuma; sem cue de "ombros para baixo" | não. Flag: mãos terminam um pouco abaixo da linha do peito |
| rehab_pushup_plus_wall | YouTube Rehab My Patient `wuqK1W8ApFc` | YouTube embed (ToS) | 0–30 s | Mãos na parede na altura do ombro, setas de protração no fim | nenhuma aparece | não. Alternativa: Town Center Orthopaedics `8m7pffdU8cM` 0–26 s |
| rehab_prone_w | YouTube Thrive Physical Therapy `RJ1p_u85KWw` | YouTube embed (ToS) | 74–101 s | De bruços na maca, "W" com cotovelos ~45° do corpo, polegares para cima, sustentação | nenhuma no trecho. **Não iniciar antes de 74 s**: 36–62 s tem braço acima da cabeça | não |
| stretch_pec_doorway | YouTube Venture Rehabilitation Sciences Group / Bourassa `RyQ46QJpIJs` ("Chest stretch 60 degree") | YouTube embed (ToS) | 13–33 s | Mãos no batente com braço a ~45–60°, cotovelo claramente abaixo do ombro | nenhuma aparece | não. Flag: bilateral e com cotovelo estendido; fazer um lado por vez com o mesmo ângulo. Descartados por braço na altura ou acima do ombro: Rehab My Patient `OHtz3C0v9lM`, Baptist Health `B9uY01NoqBg`, BalancePT `x5o0GUgClBk`, University Chiropractic `T0QOfOewn58`, Wellen `bZ-eaBPOGiM`, FitLife `LSU52o4jTIs`. Alternativa unilateral mais baixa (mão no quadril): Dr. Leo `k3oWnCnXyW4` 6–36 s |
| stretch_pec_roller | YouTube Coury & Buehler PT `AN0YqS3dnXs` | YouTube embed (ToS) | 44–68 s | Rolo ao longo da coluna, braços abertos ~30–45°, palmas para cima, relaxados | nenhuma no trecho. **Não passar de 68 s**: depois os braços sobem em direção à cabeça | não |
| stretch_upper_trap_scalenes | YouTube Exercise for Healing `x9vxV6Do9fc` | YouTube embed (ToS) | 16–46 s | Sentado, orelha ao ombro oposto, mão do lado alongado ancorada na cadeira, sem mão na cabeça | nenhuma aparece | não. Descartados: Achilles Healers `XKOjeAakmwk` e Ryan Klepps `DwdEkATOppo` (mão puxando a cabeça, braço acima do ombro); `2nH6bWtoYl4` (acrescenta extensão cervical, contraindicada na discopatia) |
| stretch_levator | YouTube Rehab My Patient `UBvtRC9gjms` | YouTube embed (ToS) | 0–30 s | Sentada segurando a cadeira, nariz em direção à axila oposta, sem mão na cabeça | nenhuma aparece | não. Descartados por mão sobre a cabeça: Peak Form `RcqDyKVB_EQ`, NUH Singapore `0_RO8NbdKBc`, AskDoctorJo `GSoXPJRnR6E` |
| stretch_hip_flexor | free-exercise-db `Kneeling_Hip_Flexor` (image-seq) | Unlicense (domínio público) | 2 quadros | Afundo com joelho no chão, mãos no quadril | nenhuma aparece | não. Alternativa em vídeo: Rehab My Patient `K5EZ8ztNEcw` 0–30 s |
| cardio_bike | free-exercise-db `Bicycling_Stationary` (image-seq) | Unlicense (domínio público) | 2 quadros | Bike ergométrica vertical, mãos no guidão | nenhuma aparece | não |
| cardio_treadmill_incline | YouTube Scottish Rite for Children `y3CEhUdzBLM` ("Incline Walks") | YouTube embed (ToS) | 5–20 s | Caminhada em esteira inclinada, com legenda "walk up and down an inclined surface" | nenhuma aparece | não. Flag: canal pediátrico, e 12–20 s é close nos pés. Descartados por esteira plana: Rehab My Patient `xBr64BIyr-M`, free-exercise-db `Walking_Treadmill` |
| cardio_elliptical | YouTube Exercise Library dot com `CvTqvnDmfLQ` | YouTube embed (ToS) | 0–20 s | Elíptico, mãos nas pegadas junto ao painel, altura do peito | nenhuma aparece | **sim**: pela resolução não dá para confirmar 100% que são as barras fixas. Alternativa com a mesma incerteza: Rehab My Patient `GOAmEBBt6Cs` 8–30 s. Descartado: free-exercise-db `Elliptical_Trainer` (alças móveis) |
| cardio_intervals_bike | YouTube Rehab My Patient `SpE0XMsPTvQ` ("Stationary Bike") | YouTube embed (ToS) | 0–30 s | Bike ergométrica, a única variação que o ids.md exige | nenhuma aparece | não. Flag: o protocolo 8 × (30 s forte + 90 s leve) não aparece; o timer deve vir da interface do app. Os vídeos de intervalos encontrados (GCN) têm 20–30 min |

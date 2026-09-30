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

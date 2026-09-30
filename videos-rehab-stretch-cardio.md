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

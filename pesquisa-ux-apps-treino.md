# Pesquisa UX — apps de treino mobile (set/2026)

Objetivo: descobrir o que os apps de treino mais bem avaliados fazem na tela de sessão ativa, no registro de séries, no descanso, no fechamento e no progresso. Depois, escolher o que faz sentido para este PWA (iPhone, uma mão, tema escuro, offline, plano de 12 semanas com regras de reabilitação).

## Fontes consultadas

**Hevy**
- https://www.hevyapp.com/hevy-tutorial/ (tela de registro, cabeçalho com duração/volume/séries, check que dispara o descanso, resumo ao finalizar)
- https://www.hevyapp.com/features/track-exercises/ (coluna "PREVIOUS" no formato `45kg x 9`; tocar copia para a série atual)
- https://www.hevyapp.com/features/live-activity/ (descanso com ±15 s e "pular"; exercício atual e próxima série visíveis)
- https://www.hevyapp.com/features/track-workouts/ e https://www.hevyapp.com/features/workout-log/ (resumo: duração, exercícios, séries, volume, recordes)
- https://apps.apple.com/us/app/hevy-workout-tracker-gym-log/id1458862350 (4,9★ com 95 mil avaliações; reclamações pontuais)
- https://repreturn.com/hevy-app-review/ (preenchimento automático como "o recurso mais útil"; recorde avisado durante o treino, "motivador sem ser chato")

**Strong**
- https://help.strongapp.io/article/229-my-first-workout (exercícios em ordem, checkbox por série, dá para finalizar a qualquer momento)
- https://screensdesign.com/showcase/strong-workout-tracker-gym-log (timer embutido e automático; detalhes em camadas: tocar no exercício abre recordes e gráfico)
- https://repreturn.com/strong-app-vs-hevy/ (Strong como o registro mais rápido: "cada toque tem que ter motivo")
- https://repreturn.com/strong-app-review/

**Fitbod**
- https://apps.apple.com/us/app/fitbod-gym-fitness-planner/id1041517543?see-all=reviews e https://www.trustpilot.com/review/www.fitbod.me (reclamações: não dá para navegar com o treino aberto, série que não conta, "registrar todas" sem confirmação, não diz a ordem)

**Boostcamp**
- https://barbend.com/boostcamp-review/ (mostra séries e reps exatas da última sessão; séries marcadas como aquecimento/trabalho/falha)
- https://www.garagegymreviews.com/boostcamp-review e https://www.boostcamp.app/vs/strong (RPE/RIR, recordes e e1RM grátis)

**Juggernaut AI**
- https://www.garagegymreviews.com/juggernautai-review (RPE/RIR a cada série; o app corta séries quando o RPE passa do alvo; reclamação: "azul sobre preto difícil de ler", painel carregado)
- https://powerliftingtechnique.com/juggernaut-ai-review/

**Ladder, Nike Training Club, Freeletics, Gymshark, Apple Fitness+**
- https://www.bustle.com/wellness/ladder-app-review e https://www.sensai.fit/blog/ladder-app-review-2026 (contagem regressiva grande, barra de progresso da sessão, aviso do próximo movimento)
- https://ixd.prattsi.org/2023/09/design-critique-nike-training-club-iphone-app/ (barra de progresso do programa funciona bem; excesso de troféus causa sobrecarga)
- https://www.wareable.com/apple/workout-apps-apple-watch-7952 (anéis e métricas grandes no Fitness+)
- https://fitnesstoolsreviewed.com/app-reviews/gymshark-training-review-worth-the-hype-after-testing/ e https://tomsguide.com/wellness/fitness/gymshark-training-app-review-effective-workouts-for-free (registro rápido sem menus entre séries; análises rasas; perda de dados é a maior reclamação)

**UX geral / padrões**
- https://screensdesign.com/articles/workout-tracker-app-design-examples/ (separar visualmente alvo, histórico e o que foi confirmado hoje; mostrar progresso parcial explícito; resumo com duração, volume e recordes)
- https://www.liftosaur.com/features/workout-screen (campos e check grandes; vibra e inicia o descanso; "Last / Best" por série; **a próxima série pendente abre sozinha**)
- https://dev.to/magnificode/building-opentrainer-real-time-workout-tracking-with-convex-and-nextjs-59h4 (registrar tomava quase 1 min de um descanso de 60–90 s; solução: 2 toques, stepper ±, alvos ≥ 48 px)
- https://github.com/justinahn711/weight-training-app/issues/134 (menos toques, finalizar/retomar explícito, corrigir série já registrada)
- https://stormotion.io/blog/fitness-app-ux/ e https://www.sportfitnessapps.com/blog/5-uiux-mistakes-in-fitness-apps-to-avoid (alvos grandes, zona do polegar, barra enchendo e feedback ao concluir série)

> Obs.: Mobbin e Dribbble exigem login ou carregam por JS, então não abriram direto. As descrições de tela vêm das páginas oficiais, da central de ajuda e dos reviews acima.

## O que cada app faz bem

| App | Pontos fortes para este projeto |
|---|---|
| **Hevy** | Coluna "anterior" (`20kg x 12`) ao lado de cada série, com toque para copiar. O check da série dispara o descanso configurado por exercício. Descanso com −15/+15 s e **pular**. Cabeçalho fixo com **duração · volume · séries**. Resumo com volume, séries e recordes. |
| **Strong** | O registro mais rápido do mercado. Checkbox por série no fim da linha. Descanso automático e embutido. Detalhes em camadas (a tela principal fica limpa e o histórico abre com um toque). Dá para finalizar a qualquer momento. |
| **Boostcamp** | Repete as séries e reps exatas da última sessão, o que ajuda a progredir. Tipos de série e RIR/RPE ficam na própria linha. |
| **Juggernaut AI** | RIR/RPE por série é o que move a progressão, e o app reage a isso. O contra-exemplo é o azul sobre preto, que tem pouco contraste. |
| **Liftosaur** | Campos grandes. A **próxima série pendente abre sozinha** depois do check. Mostra "Last/Best" por série. Vibra ao concluir. |
| **Ladder / NTC / Fitness+** | Contagem regressiva enorme, barra de progresso da sessão, aviso de "próximo" e números grandes e legíveis. |
| **Gymshark** | Sem menus entre séries. Ponto fraco: perda de dados (reforça nosso offline + backup). |

## O que os usuários reclamam
1. **Toques demais**: toca no campo, espera o teclado, digita, fecha, repete tudo para as reps e procura o "salvar". O registro come o descanso inteiro.
2. **Não saber a ordem / o que vem depois** (Fitbod).
3. **Série que "não conta"** ou estado ambíguo de concluído (Fitbod).
4. **Ação destrutiva sem confirmação** ("registrar todas", Fitbod).
5. **Contraste ruim** no tema escuro (Juggernaut).
6. **Excesso de enfeite** (troféus no NTC) competindo com a informação útil.
7. **Perda de dados** (Gymshark).

## Padrões priorizados para aplicar aqui

1. **"Última vez" por série (Hevy/Strong/Boostcamp).**
   *Por quê:* é o recurso mais elogiado. Sem ele não dá para progredir sem lembrar de cabeça.
   *Como no nosso app:* abaixo de cada linha de série aparece `última: 20 kg × 12 · RIR 2`, vindo da sessão anterior do mesmo exercício, lado e série (`db.setLogs`, data < hoje). No card fechado aparece o resumo `Última vez: 20 kg × 12`. Os placeholders dos campos mostram os números anteriores.

2. **Check pré-preenche e inicia o descanso (Hevy/Strong/Liftosaur).**
   *Por quê:* registrar em 1 toque quando a série saiu como planejada.
   *Como:* mantido. Agora o pré-preenchimento usa a carga da mesma série na última vez (e o direito continua limitado pelo esquerdo).

3. **Stepper ±kg / ±rep na série ativa (OpenTrainer/Strong).**
   *Por quê:* evita o teclado e dá para fazer com uma mão.
   *Como:* a série em foco (ou a próxima pendente) ganha uma fileira de botões de 48 px: `−2,5 kg` `+2,5 kg` `−1 rep` `+1 rep`. O passo vem de `loadStepKg` do exercício.

4. **A próxima série pendente vira a "ativa" sozinha (Liftosaur).**
   *Por quê:* nada de caçar a próxima linha.
   *Como:* depois do check, o destaque e os steppers passam para a próxima série pendente (o esquerdo termina antes do direito). O Enter/"próximo" do teclado pula para o campo seguinte.

5. **Barra de progresso da sessão fixa no topo (Hevy/Ladder/NTC).**
   *Por quê:* mostra o progresso parcial, não só "começou/terminou" (screensdesign).
   *Como:* barra fixa no topo durante a sessão com `exercícios feitos/total`, `séries`, `duração` e uma barra de preenchimento.

6. **"Próximo exercício" (Ladder/Fitbod-reclamação).**
   *Por quê:* os usuários reclamam de não saber a ordem.
   *Como:* botão "Próximo: <exercício>" na barra fixa. Ele rola até o card e o abre.

7. **Descanso grande, na zona do polegar, com −15/+15 e Pular (Hevy/Ladder).**
   *Por quê:* é a ação mais repetida da sessão.
   *Como:* `RestTimerBar` com contagem grande, contexto ("depois: Série 2 · Direito"), `−15 s`, `+15 s` e **Pular**, acima da navegação.

8. **Resumo ao encerrar (Hevy/Strong).**
   *Por quê:* fecha o ciclo e mostra os recordes, o que motiva.
   *Como:* a sheet de encerrar mostra antes de salvar: duração, séries, volume (kg × reps) e exercícios feitos. Depois de salvar, lista os **recordes de carga** do dia junto com as mensagens das regras.

9. **Blocos com ícone e contador (NTC/Gymshark).**
   *Por quê:* a sessão tem aquecimento, reabilitação, principal, cardio e alongamento, e um ícone por bloco ajuda a se localizar rolando rápido.
   *Como:* cabeçalho do bloco com ícone por tipo e `2/4 feitos`.

10. **Estado "em andamento" explícito no card (screensdesign/Fitbod-reclamação).**
    *Por quê:* evita a série que "não contou".
    *Como:* o card ganha a pílula `Em andamento 2/6` e borda de acento. Quando termina, check e borda cheia.

11. **Recordes e progresso por exercício (Hevy/Strong).**
    *Por quê:* os gráficos só servem se respondem "estou progredindo?".
    *Como:* em Progresso, cards com melhor carga, última carga e variação desde o início do exercício escolhido, mais a lista de recordes. No Plano, a fase atual fica marcada e há uma barra de semanas.

12. **Contraste e números tabulares (Juggernaut-reclamação, Fitness+).**
    *Por quê:* os números têm que ser lidos com o braço estendido.
    *Como:* números tabulares grandes nos campos e no descanso. Texto ≥ 14 px e alvos ≥ 48 px mantidos. O acento verde fica só no que é acionável ou já concluído.

**Não aplicado de propósito:** social e feed (Hevy), troféus (NTC critica o excesso), IA que corta séries (Juggernaut; aqui quem decide são as regras do plano em `src/lib`) e botão flutuante de alerta (removido de propósito; os sinais de alerta ficam em Mais).

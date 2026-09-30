# Treino 12 Semanas — PWA

App de celular (PWA) com o plano de treino de 12 semanas e o guia de alimentação. Funciona offline, sem conta e sem senha. Todos os dados ficam no aparelho (IndexedDB), com exportação/importação em JSON.

## Rodar local

```bash
npm install
npm run dev          # desenvolvimento
npm run build        # gera dist/
npm run preview      # serve dist/ em http://localhost:4173
```

Para abrir no iPhone na mesma rede Wi-Fi: `npx vite preview --host --port 4173` e acesse `http://<IP-do-Mac>:4173`.

## Publicar (GitHub Pages)

Publicado em `https://procexaiedu.github.io/app-treino/` a partir do branch `gh-pages` (build local; o GitHub Actions da conta está bloqueado por cobrança, então o workflow em `.github/workflows/pages.yml` fica como alternativa).

Para republicar depois de mudar algo:

```bash
npm run deploy
```

## Instalar no iPhone

1. Abra a URL no Safari.
2. Toque em Compartilhar (quadrado com seta).
3. Toque em "Adicionar à Tela de Início" e confirme.
4. Abra pelo ícone: modo tela cheia, funciona sem internet (os vídeos do YouTube precisam de rede; as sequências de imagens ficam em cache depois da primeira abertura).

## Estrutura

- `src/data/plan.ts`, `nutrition.ts`, `tracking.ts` — fonte única do plano (tipos em `types.ts`).
- `src/data/videos/*.json` — demonstração por exercício; registro completo em `videos.md`.
- `src/lib/phase.ts` — semana/fase a partir da data de início.
- `src/lib/rules.ts` — regras de progressão, assimetria, sintoma e ajuste de calorias.
- `src/lib/db.ts` — IndexedDB (Dexie) e backup.
- `src/pages/` — Hoje, Plano, Comida, Progresso, Mais.

## Regras aplicadas automaticamente

- Aumento de carga só quando as 3 condições fecham (topo da faixa em todas as séries com o RIR da fase, sem sintoma, dor ≤ 3/10).
- Membro superior: sugestão de aumento no máximo 1× a cada 14 dias.
- Direito nunca recebe mais carga que o esquerdo (o app limita o valor).
- Sintoma em 2 sessões seguidas no mesmo exercício → volta uma fase nesse exercício; na 2ª vez, marca para troca.
- Peso: média semanal; regras de perda lenta/rápida e semana 12 viram sugestões na aba Progresso.

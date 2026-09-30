// Fonte única do plano de treino (derivado de plano.md).
// IDs seguem src/data/ids.md — não renomear.

import type { Exercise, PhaseId, Plan, Prescription } from './types';

// ---------------- Helpers de prescrição ----------------

const NO_RIR = '—';
const WEEK1_NOTE = 'Semana 1: 2 séries';

/** Mesma prescrição nas 4 fases. */
function same(p: Prescription): Record<PhaseId, Prescription> {
  return { 1: { ...p }, 2: { ...p }, 3: { ...p }, 4: { ...p } };
}

/**
 * Prescrição a partir das tabelas do plano: séries e RIR "F1 / F2 / F3".
 * Fase 4 (semana 12) = 2 séries, RIR 3 (ou "—" quando não há RIR), mesmas reps.
 * Se a Fase 1 tem 3 séries, a nota lembra que a semana 1 tem só 2.
 */
function table(
  sets: [number, number, number],
  reps: string,
  restSec: number,
  rir: [string, string, string],
  notes: Partial<Record<PhaseId, string>> = {},
): Record<PhaseId, Prescription> {
  const hasRir = rir[0] !== NO_RIR;
  const week1 = sets[0] > 2 ? WEEK1_NOTE : undefined;
  const join = (...parts: (string | undefined)[]) => {
    const s = parts.filter(Boolean).join('. ');
    return s.length ? s : undefined;
  };
  const mk = (s: number, r: string, note?: string): Prescription =>
    note ? { sets: s, reps, restSec, rir: r, note } : { sets: s, reps, restSec, rir: r };
  return {
    1: mk(sets[0], rir[0], join(week1, notes[1])),
    2: mk(sets[1], rir[1], notes[2]),
    3: mk(sets[2], rir[2], notes[3]),
    4: mk(2, hasRir ? '3' : NO_RIR, join('Volume −40%', notes[4])),
  };
}

// ---------------- Exercícios ----------------

const exerciseList: Exercise[] = [
  // Aquecimento
  {
    id: 'warmup_bike',
    name: 'Aquecimento na bike, 5 min',
    kind: 'warmup',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: ['Bike ergométrica leve.'],
    equipment: ['bike'],
    prescription: same({ sets: 1, reps: '5 min', restSec: 0, rir: NO_RIR }),
  },

  // Bloco fixo de reabilitação
  {
    id: 'rehab_breathing',
    name: 'Respiração diafragmática deitado',
    kind: 'rehab',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: [
      'Deitado de costas, mão na barriga.',
      'Barriga sobe e o peito fica parado.',
      'Relaxa os músculos do pescoço (escalenos).',
    ],
    equipment: [],
    prescription: same({ sets: 1, reps: '6 respirações lentas', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'rehab_chin_tuck',
    name: 'Chin tuck deitado',
    kind: 'rehab',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: [
      'Deitado de costas.',
      'Queixo para dentro, sem tirar a cabeça do chão.',
      'Fase 2+: elevar a cabeça 1–2 cm, 3 × 5 × 5 s.',
    ],
    equipment: [],
    prescription: {
      1: { sets: 1, reps: '10 × 5 s', restSec: 0, rir: NO_RIR },
      2: { sets: 3, reps: '5 × 5 s', restSec: 0, rir: NO_RIR, note: 'Elevar a cabeça 1–2 cm' },
      3: { sets: 3, reps: '5 × 5 s', restSec: 0, rir: NO_RIR, note: 'Elevar a cabeça 1–2 cm' },
      4: { sets: 2, reps: '5 × 5 s', restSec: 0, rir: NO_RIR, note: 'Elevar a cabeça 1–2 cm. Volume −40%' },
    },
  },
  {
    id: 'rehab_thoracic_ext_roller',
    name: 'Extensão torácica no rolo',
    kind: 'rehab',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: ['Rolo transversal na coluna torácica.', 'Braços cruzados no peito.'],
    cautions: ['Braços nunca atrás da cabeça.'],
    equipment: ['rolo'],
    prescription: same({ sets: 1, reps: '10 reps', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'rehab_open_book',
    name: 'Open book (rotação torácica deitado de lado)',
    kind: 'rehab',
    unilateral: true,
    loaded: false,
    upperBody: true,
    cues: ['Deitado de lado.', 'Braço na altura do ombro.'],
    cautions: ['Sem subir o braço acima da linha do ombro.'],
    equipment: [],
    prescription: same({ sets: 1, reps: '8 por lado', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'rehab_ext_rot_band',
    name: 'Rotação externa com elástico',
    kind: 'rehab',
    unilateral: true,
    loaded: true,
    upperBody: true,
    cues: [
      'Em pé, cotovelo colado ao corpo com uma toalha.',
      'Rotação externa até a neutra.',
      'Começar pelo esquerdo.',
      'Use elástico mais forte a cada 2–3 semanas, se não houver sintomas.',
    ],
    equipment: ['elástico', 'toalha'],
    prescription: {
      1: { sets: 2, reps: '15', restSec: 30, rir: NO_RIR },
      2: { sets: 3, reps: '12', restSec: 30, rir: NO_RIR },
      3: { sets: 3, reps: '12', restSec: 30, rir: NO_RIR },
      4: { sets: 2, reps: '12', restSec: 30, rir: NO_RIR, note: 'Volume −40%' },
    },
  },
  {
    id: 'rehab_band_row',
    name: 'Remada com elástico (retração escapular)',
    kind: 'rehab',
    unilateral: false,
    loaded: true,
    upperBody: true,
    cues: ['Braços na altura do peito.', 'Aproximar as escápulas sem forçar para baixo.'],
    cautions: ['Não forçar os ombros para trás e para baixo.'],
    equipment: ['elástico'],
    prescription: same({ sets: 2, reps: '15', restSec: 30, rir: NO_RIR }),
  },
  {
    id: 'rehab_pushup_plus_wall',
    name: 'Push-up plus na parede (Fase 2+: no banco)',
    kind: 'rehab',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: [
      'Mãos na altura do ombro.',
      'Protração das escápulas no fim do movimento.',
      'Trabalha o serrátil.',
    ],
    equipment: ['parede', 'banco'],
    prescription: {
      1: { sets: 2, reps: '12', restSec: 30, rir: NO_RIR, note: 'Na parede' },
      2: { sets: 2, reps: '12', restSec: 30, rir: NO_RIR, note: 'No banco' },
      3: { sets: 2, reps: '12', restSec: 30, rir: NO_RIR, note: 'No banco' },
      4: { sets: 2, reps: '12', restSec: 30, rir: NO_RIR, note: 'No banco' },
    },
  },
  {
    id: 'rehab_prone_w',
    name: '"W" deitado de bruços',
    kind: 'rehab',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: ['Cotovelos a ~45° do corpo.', 'Polegares para cima.', 'Segurar 2 s.'],
    equipment: [],
    prescription: same({ sets: 2, reps: '10, segurar 2 s', restSec: 30, rir: NO_RIR }),
  },

  // Treino A
  {
    id: 'db_row_unilateral',
    name: 'Remada unilateral com halter apoiada no banco',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: true,
    cues: [
      'Mão e joelho apoiados no banco.',
      'Cotovelo junto ao corpo.',
      'Esquerdo primeiro.',
      'Descanso de 60 s entre lados.',
    ],
    cautions: ['Sem forçar o ombro para baixo.'],
    equipment: ['halter', 'banco'],
    loadStepKg: 2,
    prescription: table([3, 3, 4], '10–12', 60, ['4', '3', '2']),
  },
  {
    id: 'chest_supported_row',
    name: 'Remada com apoio no peito (máquina), pegada neutra',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: true,
    cues: ['Máquina com apoio no peito.', 'Pegada neutra.'],
    equipment: ['máquina'],
    loadStepKg: 5,
    prescription: table([3, 3, 3], '10–12', 90, ['4', '2–3', '1–2']),
  },
  {
    id: 'incline_pushup_plus',
    name: 'Flexão de braço inclinada (mãos no banco) com "plus" no fim',
    kind: 'main',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: ['Mãos no banco.', 'Protração escapular no topo ("plus").'],
    equipment: ['banco'],
    prescription: table([2, 3, 3], '8–15', 90, ['4', '3', '3']),
  },
  {
    id: 'hammer_curl',
    name: 'Rosca martelo alternada, sentado',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: true,
    cues: ['Sentado.', 'Pegada neutra.'],
    equipment: ['halter', 'banco'],
    loadStepKg: 2,
    prescription: table([2, 3, 3], '10–12', 60, ['3', '2', '1–2']),
  },
  {
    id: 'tricep_kickback',
    name: 'Tríceps coice unilateral apoiado',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: true,
    cues: ['Tronco apoiado no banco.', 'Braço paralelo ao chão.'],
    equipment: ['halter', 'banco'],
    loadStepKg: 2,
    prescription: table([2, 3, 3], '12–15', 60, ['3', '2', '1–2']),
  },
  {
    id: 'sidelying_ext_rot_db',
    name: 'Rotação externa deitado de lado com halter',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: true,
    cues: ['Deitado de lado, cotovelo apoiado no quadril com uma toalha.', 'Halter leve.', 'Esquerdo primeiro.'],
    equipment: ['halter', 'toalha'],
    loadStepKg: 2,
    prescription: table([2, 3, 3], '12–15', 45, ['3', '3', '2']),
  },
  {
    id: 'dead_bug',
    name: 'Dead bug',
    kind: 'main',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: ['Os braços ficam parados apontando para o teto e só as pernas se movem.'],
    equipment: [],
    prescription: table([2, 3, 3], '8 por lado', 45, [NO_RIR, NO_RIR, NO_RIR]),
  },

  // Treino B
  {
    id: 'goblet_squat',
    name: 'Goblet squat (halter junto ao peito)',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: false,
    cues: [
      'Halter ou kettlebell junto ao peito.',
      'Quando o halter ficar pesado demais para segurar no peito, deixe a carga pesada para o leg press.',
    ],
    equipment: ['halter'],
    loadStepKg: 2,
    prescription: table([3, 3, 4], '8–12', 120, ['4', '2–3', '1–2']),
  },
  {
    id: 'leg_press',
    name: 'Leg press 45°',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: false,
    cues: ['Leg press 45°.'],
    equipment: ['leg press'],
    loadStepKg: 10,
    prescription: table([3, 3, 4], '10–12', 120, ['4', '2', '1–2']),
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Agachamento búlgaro',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: false,
    cues: [
      'Pé de trás no banco.',
      'Sem carga → halter junto ao peito.',
      'Esquerdo primeiro.',
      'Descanso de 60 s entre lados.',
    ],
    cautions: ['Nunca halteres pendurados pesados.'],
    equipment: ['banco', 'halter'],
    loadStepKg: 2,
    prescription: table([2, 3, 3], '8–12', 60, ['3', '2–3', '2']),
  },
  {
    id: 'leg_extension_unilateral',
    name: 'Cadeira extensora unilateral',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: false,
    cues: ['Uma perna por vez.', 'Esquerdo primeiro.'],
    equipment: ['máquina'],
    loadStepKg: 5,
    prescription: table([2, 3, 3], '12–15', 45, ['3', '2', '1']),
  },
  {
    id: 'calf_raise_seated',
    name: 'Panturrilha no leg press ou sentado',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: false,
    cues: ['No leg press ou na máquina sentada.'],
    cautions: ['Não use a máquina de panturrilha em pé com apoio nos ombros. Ela carrega o trapézio.'],
    equipment: ['máquina', 'leg press'],
    loadStepKg: 5,
    prescription: table([3, 3, 3], '12–15', 60, ['2', '1–2', '1']),
  },
  {
    id: 'pallof_press',
    name: 'Pallof press com elástico',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: true,
    cues: ['Elástico na altura do peito.', 'Braços estendidos à frente.'],
    equipment: ['elástico'],
    prescription: table([2, 3, 3], '10 por lado', 45, [NO_RIR, NO_RIR, NO_RIR]),
  },

  // Treino C
  {
    id: 'incline_prone_db_row',
    name: 'Remada com halteres deitado de bruços no banco inclinado',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: true,
    cues: ['Peito apoiado no banco inclinado.', 'Cotovelos a ~45°.'],
    equipment: ['halter', 'banco inclinado'],
    loadStepKg: 2,
    prescription: table([3, 3, 4], '10–12', 90, ['4', '2–3', '1–2']),
  },
  {
    id: 'machine_row_unilateral',
    name: 'Remada unilateral em máquina articulada, ou com halter se não houver',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: true,
    cues: ['Um braço por vez, pegada neutra.', 'Esquerdo primeiro.', 'Descanso de 60 s entre lados.'],
    equipment: ['máquina', 'halter'],
    loadStepKg: 5,
    prescription: table([2, 3, 3], '10–12', 60, ['4', '3', '2']),
  },
  {
    id: 'incline_pushup_pause',
    name: 'Flexão inclinada com pausa de 1 s embaixo',
    kind: 'main',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: ['Mãos no banco.', 'Pausa de 1 s embaixo.'],
    equipment: ['banco'],
    prescription: table([2, 3, 3], '8–12', 90, ['4', '3', '3']),
  },
  {
    id: 'db_curl_unilateral',
    name: 'Rosca direta unilateral com halter',
    kind: 'main',
    unilateral: true,
    loaded: true,
    upperBody: true,
    cues: ['Um braço por vez.', 'Esquerdo primeiro.'],
    equipment: ['halter'],
    loadStepKg: 2,
    prescription: table([2, 3, 3], '10–12', 60, ['3', '2', '1–2']),
  },
  {
    id: 'db_skullcrusher_neutral',
    name: 'Tríceps testa com halteres, pegada neutra',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: true,
    cues: [
      'Deitado, braço vertical apontando para o teto.',
      'O halter desce ao lado da cabeça.',
    ],
    cautions: ['O braço não vai para trás da cabeça.'],
    equipment: ['halter', 'banco'],
    loadStepKg: 2,
    prescription: table([2, 3, 3], '12–15', 60, ['3', '2', '2']),
  },
  {
    id: 'db_shrug_light',
    name: 'Encolhimento leve com halteres (Fase 2+)',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: true,
    cues: ['Halteres leves.', 'Subir e segurar 2 s.'],
    cautions: [
      'No máximo ~10 kg em cada mão.',
      'Se aparecer qualquer formigamento, tire o exercício.',
    ],
    equipment: ['halter'],
    loadStepKg: 2,
    maxLoadKg: 10,
    fromPhase: 2,
    prescription: {
      1: { sets: 0, reps: '12', restSec: 60, rir: NO_RIR, note: 'Só a partir da Fase 2' },
      2: { sets: 2, reps: '12', restSec: 60, rir: '3' },
      3: { sets: 2, reps: '12', restSec: 60, rir: '3' },
      4: { sets: 2, reps: '12', restSec: 60, rir: '3', note: 'Volume −40%' },
    },
  },
  {
    id: 'plank',
    name: 'Prancha frontal nos antebraços',
    kind: 'main',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: ['Apoio nos antebraços.'],
    equipment: [],
    prescription: table([2, 3, 3], '20–40 s', 45, [NO_RIR, NO_RIR, NO_RIR]),
  },

  // Treino D
  {
    id: 'hip_thrust',
    name: 'Hip thrust (barra ou máquina)',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: false,
    cues: ['Máquina, ou barra no quadril com as costas no banco.'],
    equipment: ['máquina', 'barra', 'banco'],
    loadStepKg: 5,
    prescription: table([3, 3, 4], '8–12', 120, ['4', '2–3', '1–2']),
  },
  {
    id: 'rdl_db',
    name: 'Terra romeno com halteres, leve',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: false,
    cues: ['Halteres, carga leve/moderada.', 'Ombros neutros.'],
    cautions: [
      'Nestas 12 semanas o teto é 2×24 kg, porque é carga pendurada nos braços. Esse teto é uma escolha conservadora.',
    ],
    equipment: ['halter'],
    loadStepKg: 2,
    maxLoadKg: 24,
    prescription: table([2, 3, 3], '10–12', 90, ['4', '3', '3'], { 1: 'Começar com 2×12 kg' }),
  },
  {
    id: 'leg_curl',
    name: 'Mesa flexora, ou cadeira flexora unilateral',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: false,
    cues: ['Deitado (mesa) ou sentado (cadeira).', 'Descanso de 60–90 s.'],
    equipment: ['máquina'],
    loadStepKg: 5,
    prescription: table([3, 3, 3], '10–12', 90, ['3', '2', '1–2']),
  },
  {
    id: 'back_extension_45',
    name: 'Hiperextensão 45°, braços cruzados no peito',
    kind: 'main',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: ['Banco 45°.', 'Braços cruzados no peito.'],
    equipment: ['banco 45°'],
    prescription: table([2, 3, 3], '12–15', 60, ['3', '2', '2']),
  },
  {
    id: 'hip_abduction_machine',
    name: 'Cadeira abdutora',
    kind: 'main',
    unilateral: false,
    loaded: true,
    upperBody: false,
    cues: ['Máquina.'],
    equipment: ['máquina'],
    loadStepKg: 5,
    prescription: table([2, 2, 3], '15', 45, ['2', '2', '1']),
  },
  {
    id: 'side_plank',
    name: 'Prancha lateral (com os joelhos apoiados na Fase 1)',
    kind: 'main',
    unilateral: true,
    loaded: false,
    upperBody: false,
    cues: ['Antebraço no chão, cotovelo abaixo do ombro.'],
    equipment: [],
    prescription: table([2, 3, 3], '20–40 s', 45, [NO_RIR, NO_RIR, NO_RIR], {
      1: 'Com os joelhos apoiados',
    }),
  },

  // Treino E — itens exclusivos
  {
    id: 'bird_dog_leg',
    name: 'Bird dog só com a perna',
    kind: 'main',
    unilateral: true,
    loaded: false,
    upperBody: false,
    cues: ['Quatro apoios.', 'Estende só a perna; os braços ficam no chão.'],
    cautions: ['O braço do bird dog comum sobe acima da linha do ombro, por isso só a perna.'],
    equipment: [],
    prescription: same({ sets: 2, reps: '8 por lado', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'cardio_intervals_bike',
    name: 'Intervalos na bike: 8 × (30 s forte + 90 s leve)',
    kind: 'cardio',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: ['Bike ergométrica.', 'Depois, mais 10 min moderado.'],
    equipment: ['bike'],
    prescription: {
      1: { sets: 0, reps: '30 s forte + 90 s leve', restSec: 0, rir: NO_RIR, note: 'Só nas Fases 2–3' },
      2: { sets: 8, reps: '30 s forte + 90 s leve', restSec: 0, rir: NO_RIR, note: 'Mais 10 min moderado' },
      3: { sets: 8, reps: '30 s forte + 90 s leve', restSec: 0, rir: NO_RIR, note: 'Mais 10 min moderado' },
      4: { sets: 0, reps: '30 s forte + 90 s leve', restSec: 0, rir: NO_RIR, note: 'Só nas Fases 2–3' },
    },
  },

  // Cardio
  {
    id: 'cardio_bike',
    name: 'Bike ergométrica moderada',
    kind: 'cardio',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: ['A principal opção de cardio.', 'Moderado = RPE 4–5, dá para falar frases.'],
    equipment: ['bike'],
    prescription: same({ sets: 1, reps: '15 min', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'cardio_treadmill_incline',
    name: 'Esteira inclinada, caminhando',
    kind: 'cardio',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: ['Esteira com inclinação, caminhando.', 'Moderado = RPE 4–5, dá para falar frases.'],
    equipment: ['esteira'],
    prescription: same({ sets: 1, reps: '15 min', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'cardio_elliptical',
    name: 'Elíptico segurando nas barras fixas',
    kind: 'cardio',
    unilateral: false,
    loaded: false,
    upperBody: false,
    cues: [
      'Segure nas barras fixas se o movimento dos braços der sintoma.',
      'Moderado = RPE 4–5, dá para falar frases.',
    ],
    equipment: ['elíptico'],
    prescription: same({ sets: 1, reps: '15 min', restSec: 0, rir: NO_RIR }),
  },

  // Alongamentos
  {
    id: 'stretch_pec_doorway',
    name: 'Peitoral na porta',
    kind: 'stretch',
    unilateral: true,
    loaded: false,
    upperBody: true,
    cues: ['Cotovelo abaixo da linha do ombro (~45–60°).'],
    cautions: ['Nunca com o cotovelo acima da linha do ombro.'],
    equipment: ['porta'],
    prescription: same({ sets: 2, reps: '2 × 30 s por lado', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'stretch_pec_roller',
    name: 'Peitoral no rolo',
    kind: 'stretch',
    unilateral: false,
    loaded: false,
    upperBody: true,
    cues: ['Rolo ao longo da coluna.', 'Braços abertos a ~45°, relaxados.'],
    equipment: ['rolo'],
    prescription: same({ sets: 1, reps: '1–2 min', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'stretch_upper_trap_scalenes',
    name: 'Trapézio superior e escalenos',
    kind: 'stretch',
    unilateral: true,
    loaded: false,
    upperBody: true,
    cues: ['Orelha em direção ao ombro oposto.', 'Segure o banco com a mão do lado alongado.'],
    equipment: ['banco'],
    prescription: same({ sets: 2, reps: '2 × 30 s por lado', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'stretch_levator',
    name: 'Levantador da escápula',
    kind: 'stretch',
    unilateral: true,
    loaded: false,
    upperBody: true,
    cues: ['Nariz em direção à axila oposta.'],
    equipment: [],
    prescription: same({ sets: 2, reps: '2 × 30 s por lado', restSec: 0, rir: NO_RIR }),
  },
  {
    id: 'stretch_hip_flexor',
    name: 'Flexor do quadril (posição de afundo)',
    kind: 'stretch',
    unilateral: true,
    loaded: false,
    upperBody: false,
    cues: ['Posição de afundo, joelho no chão.', 'Contra o tempo sentado.'],
    equipment: [],
    prescription: same({ sets: 2, reps: '2 × 30 s por lado', restSec: 0, rir: NO_RIR }),
  },
];

const exercises: Record<string, Exercise> = Object.fromEntries(exerciseList.map((e) => [e.id, e]));

// ---------------- Blocos comuns ----------------

const REHAB_ITEMS = [
  'rehab_breathing',
  'rehab_chin_tuck',
  'rehab_thoracic_ext_roller',
  'rehab_open_book',
  'rehab_ext_rot_band',
  'rehab_band_row',
  'rehab_pushup_plus_wall',
  'rehab_prone_w',
];

const STRETCH_ITEMS = [
  'stretch_pec_doorway',
  'stretch_pec_roller',
  'stretch_upper_trap_scalenes',
  'stretch_levator',
  'stretch_hip_flexor',
];

const MODERATE = 'Moderado = RPE 4–5, dá para falar frases';
const CARDIO_OPTIONS = 'Bike ergométrica (principal), esteira com inclinação caminhando, ou elíptico';

const warmupBlock = { kind: 'warmup' as const, title: 'Aquecimento', minutes: 5, items: ['warmup_bike'] };
const rehabBlock = {
  kind: 'rehab' as const,
  title: 'Bloco fixo de reabilitação',
  minutes: 15,
  items: REHAB_ITEMS,
  note: 'A rotação externa usa elástico mais forte a cada 2–3 semanas, se não houver sintomas.',
};
const stretchBlock = {
  kind: 'stretch' as const,
  title: 'Alongamentos',
  minutes: 8,
  items: STRETCH_ITEMS,
  note: 'Nenhum alongamento deve dar formigamento. Se der, diminua a amplitude.',
};

function steadyCardio(minutes: string) {
  const c = { type: 'Bike ergométrica', minutes, detail: `${MODERATE}. Alternativas: esteira inclinada ou elíptico.` };
  return { 1: { ...c }, 2: { ...c }, 3: { ...c }, 4: { ...c } };
}

function cardioBlock(minutes: string) {
  return {
    kind: 'cardio' as const,
    title: 'Cardio',
    items: ['cardio_bike'],
    note: `${minutes} min. ${CARDIO_OPTIONS}. ${MODERATE}.`,
    overrides: {
      cardio_bike: {
        1: { reps: `${minutes} min` },
        2: { reps: `${minutes} min` },
        3: { reps: `${minutes} min` },
        4: { reps: `${minutes} min` },
      },
    },
  };
}

// ---------------- Plano ----------------

export const plan: Plan = {
  meta: {
    title: 'Plano de treino e alimentação (12 semanas)',
    weeks: 12,
    assumptions: [
      'Na segunda a aula é das 10:00 às 11:30.',
      'A academia tem halteres, leg press, extensora, flexora e banco. Você leva um elástico de resistência.',
      'Almoço por volta de 13:45 e jantar por volta de 20:00.',
      '"Polias com tração alta" pode querer dizer polia no alto ou carga alta no cabo. Tratei como as duas coisas: o plano não usa nenhuma polia, só halter, máquina e elástico.',
      'Sem formigamento nem mudança de cor na mão em repouso.',
    ],
    researchFile: '/Users/farjallat/EU/pesquisa-treino-desfiladeiro-toracico.md',
  },

  reading: [
    {
      title: 'Desfiladeiro torácico',
      paragraphs: [
        'A artéria e a veia que vão para o braço passam entre a clavícula e a primeira costela. Nas suas posições de risco esse espaço fecha e elas são apertadas: braço acima da linha do ombro; ombros forçados para trás e para baixo; carga pesada puxando os braços para baixo; barra apoiada nas costas.',
        'Por isso ficam fora do plano:',
      ],
      bullets: [
        'puxada frontal e barra fixa, que levam o braço acima da cabeça;',
        'agachamento com barra nas costas, que coloca o braço exatamente na posição do teste que provoca os sintomas;',
        "farmer's walk pesado;",
        'encolhimento pesado.',
      ],
    },
    {
      title: 'Nervos',
      paragraphs: [
        'A eletroneuromiografia mostra lesão leve e antiga dos nervos do braço, pior à esquerda. Isso explica boa parte da fraqueza do lado esquerdo. A força volta, mas mais devagar do que só por destreino, e a diferença pode não zerar em 12 semanas.',
        'Formigamento durante o treino quer dizer que o nervo está sendo apertado naquela posição. Não é algo para aguentar.',
      ],
    },
    {
      title: 'Bursite e coluna',
      paragraphs: [
        'A bursite pede fortalecimento do manguito e da escápula, sem carga com o braço elevado. Dor local de até 3/10 no ombro é aceitável se passar em 24 h.',
        'A coluna cervical tem desgaste inicial nos discos, sem tocar nos nervos. Ela não impede o treino. Só evite carga apoiada no pescoço e nos ombros, como barra nas costas ou mochila pesada.',
      ],
    },
    {
      title: 'Ajuste na correção postural',
      paragraphs: [
        'O comando clássico de "ombro para trás e para baixo" piora o desfiladeiro. Use sempre escápula neutra: aproximar as escápulas, sem forçar para baixo.',
      ],
    },
    {
      title: 'NEM 1',
      paragraphs: [
        'Ela não restringe o treino. O problema mais comum da NEM 1 é na paratireoide, que aumenta o cálcio e o risco de cálculo renal. Na prática isso significa quatro coisas:',
      ],
      bullets: [
        'beber bastante água;',
        'não cortar laticínios;',
        'manter a proteína em até ~2 g/kg;',
        'avisar o endocrinologista que você toma creatina. Ela aumenta a creatinina no exame de sangue sem indicar lesão nos rins.',
      ],
    },
  ],

  phases: [
    {
      id: 1,
      name: 'Readaptação',
      weeks: [1, 4],
      setsRule: '2 na semana 1; 3 a partir da semana 2',
      rirRule: '3–4',
      goal: 'Técnica, achar as cargas, testar tolerância',
    },
    {
      id: 2,
      name: 'Progressão',
      weeks: [5, 8],
      setsRule: '3 (4 nos inferiores principais)',
      rirRule: '2–3',
      goal: 'Subir carga; séries extras para o lado esquerdo',
      entryRule:
        'Só passe para a Fase 2 depois de 2 semanas seguidas sem nenhum sintoma de alerta. Se não der, fique mais tempo na Fase 1.',
    },
    {
      id: 3,
      name: 'Progressão',
      weeks: [9, 11],
      setsRule: '3–4',
      rirRule: '1–2 nos inferiores e remadas; 3 no resto',
      goal: 'Mais intensidade',
    },
    {
      id: 4,
      name: 'Ajuste',
      weeks: [12, 12],
      setsRule: '2 (volume −40%)',
      rirRule: '3',
      goal: 'Recuperar e reavaliar tudo',
    },
  ],

  sessions: [
    {
      id: 'A',
      weekday: 1,
      title: 'Treino A — segunda',
      subtitle: 'Superior (costas e manguito)',
      cardio: steadyCardio('15'),
      blocks: [
        warmupBlock,
        rehabBlock,
        {
          kind: 'main',
          title: 'Treino principal',
          minutes: 40,
          items: [
            'db_row_unilateral',
            'chest_supported_row',
            'incline_pushup_plus',
            'hammer_curl',
            'tricep_kickback',
            'sidelying_ext_rot_db',
            'dead_bug',
          ],
        },
        cardioBlock('15'),
        stretchBlock,
      ],
    },
    {
      id: 'B',
      weekday: 2,
      title: 'Treino B — terça',
      subtitle: 'Inferior (joelho)',
      cardio: steadyCardio('15–20'),
      blocks: [
        warmupBlock,
        rehabBlock,
        {
          kind: 'main',
          title: 'Treino principal',
          minutes: 40,
          items: [
            'goblet_squat',
            'leg_press',
            'bulgarian_split_squat',
            'leg_extension_unilateral',
            'calf_raise_seated',
            'pallof_press',
          ],
        },
        cardioBlock('15–20'),
        stretchBlock,
      ],
    },
    {
      id: 'C',
      weekday: 3,
      title: 'Treino C — quarta',
      subtitle: 'Superior (costas e braços)',
      cardio: steadyCardio('15'),
      blocks: [
        warmupBlock,
        rehabBlock,
        {
          kind: 'main',
          title: 'Treino principal',
          minutes: 40,
          items: [
            'incline_prone_db_row',
            'machine_row_unilateral',
            'incline_pushup_pause',
            'db_curl_unilateral',
            'db_skullcrusher_neutral',
            'db_shrug_light',
            'plank',
          ],
        },
        cardioBlock('15'),
        stretchBlock,
      ],
    },
    {
      id: 'D',
      weekday: 4,
      title: 'Treino D — quinta',
      subtitle: 'Inferior (quadril e cadeia posterior leve)',
      cardio: steadyCardio('15–20'),
      blocks: [
        warmupBlock,
        rehabBlock,
        {
          kind: 'main',
          title: 'Treino principal',
          minutes: 40,
          items: ['hip_thrust', 'rdl_db', 'leg_curl', 'back_extension_45', 'hip_abduction_machine', 'side_plank'],
        },
        cardioBlock('15–20'),
        stretchBlock,
      ],
    },
    {
      id: 'E',
      weekday: 5,
      title: 'Treino E — sexta',
      subtitle: 'Condicionamento, lado esquerdo e mobilidade',
      cardio: {
        1: { type: 'Bike ergométrica', minutes: '30–35', detail: `${MODERATE}.` },
        2: {
          type: 'Intervalos na bike',
          minutes: '16 + 10',
          detail: `8 × (30 s forte + 90 s leve) na bike, mais 10 min moderado. ${MODERATE}.`,
        },
        3: {
          type: 'Intervalos na bike',
          minutes: '16 + 10',
          detail: `8 × (30 s forte + 90 s leve) na bike, mais 10 min moderado. ${MODERATE}.`,
        },
        4: { type: 'Bike ergométrica', minutes: '20', detail: `${MODERATE}.` },
      },
      blocks: [
        warmupBlock,
        { ...rehabBlock, note: 'Bloco fixo completo.' },
        {
          kind: 'main',
          title: 'Lado esquerdo (Fase 2+)',
          items: ['db_row_unilateral', 'sidelying_ext_rot_db', 'leg_extension_unilateral'],
          note: 'Só o lado esquerdo, RIR 3. A partir da Fase 2 (na Fase 1 este bloco não é feito).',
          overrides: {
            db_row_unilateral: {
              1: { sets: 0, reps: '12', rir: '3', note: 'Só a partir da Fase 2' },
              2: { sets: 2, reps: '12', rir: '3', note: 'Só o lado esquerdo' },
              3: { sets: 2, reps: '12', rir: '3', note: 'Só o lado esquerdo' },
              4: { sets: 2, reps: '12', rir: '3', note: 'Só o lado esquerdo' },
            },
            sidelying_ext_rot_db: {
              1: { sets: 0, reps: '15', rir: '3', note: 'Só a partir da Fase 2' },
              2: { sets: 2, reps: '15', rir: '3', note: 'Só o lado esquerdo' },
              3: { sets: 2, reps: '15', rir: '3', note: 'Só o lado esquerdo' },
              4: { sets: 2, reps: '15', rir: '3', note: 'Só o lado esquerdo' },
            },
            leg_extension_unilateral: {
              1: { sets: 0, reps: '15', rir: '3', note: 'Só a partir da Fase 2' },
              2: { sets: 2, reps: '15', rir: '3', note: 'Só o lado esquerdo' },
              3: { sets: 2, reps: '15', rir: '3', note: 'Só o lado esquerdo' },
              4: { sets: 2, reps: '15', rir: '3', note: 'Só o lado esquerdo' },
            },
          },
        },
        {
          kind: 'main',
          title: 'Core',
          items: ['dead_bug', 'pallof_press', 'bird_dog_leg'],
          note: 'O braço do bird dog comum sobe acima da linha do ombro, por isso só a perna.',
          overrides: {
            dead_bug: {
              1: { sets: 3, reps: '8 por lado', note: undefined },
              2: { sets: 3, reps: '8 por lado' },
              3: { sets: 3, reps: '8 por lado' },
            },
            pallof_press: {
              1: { sets: 3, reps: '10 por lado', note: undefined },
              2: { sets: 3, reps: '10 por lado' },
              3: { sets: 3, reps: '10 por lado' },
            },
          },
        },
        {
          kind: 'cardio',
          title: 'Cardio',
          items: ['cardio_intervals_bike', 'cardio_bike'],
          note: `Fase 1: 30–35 min moderado. Fases 2–3: 8 × (30 s forte + 90 s leve) na bike, mais 10 min moderado. Semana 12: 20 min moderado. ${MODERATE}.`,
          overrides: {
            cardio_bike: {
              1: { reps: '30–35 min' },
              2: { reps: '10 min' },
              3: { reps: '10 min' },
              4: { reps: '20 min' },
            },
          },
        },
        { ...stretchBlock, title: 'Alongamentos — versão longa', minutes: 10, note: `Versão longa (10 min). ${stretchBlock.note}` },
      ],
    },
  ],

  exercises,

  progression: {
    increaseConditions: [
      'Chegou ao topo da faixa de repetições em todas as séries, com o RIR da fase.',
      'Não teve formigamento, dormência nem mudança de cor na sessão.',
      'A dor no ombro ficou em até 3/10 e voltou ao normal em 24 h.',
    ],
    increments: [
      'halter: +1–2 kg',
      'máquina: +1 placa',
      'leg press: +10 kg',
      'Aumente o menor valor possível. Depois volte para o começo da faixa de repetições.',
    ],
    upperBodyMaxOnePer: {
      days: 14,
      text: 'Nos exercícios de parte superior, suba no máximo uma vez a cada 2 semanas por exercício.',
    },
    asymmetry: [
      'Todo exercício unilateral começa pelo esquerdo.',
      'O direito faz a mesma carga e as mesmas repetições que o esquerdo conseguiu, nunca mais que isso.',
      'Nos exercícios bilaterais, use a carga que o esquerdo aguenta com boa técnica.',
      'A partir da Fase 2, o esquerdo ganha séries extras na sexta. Treinar um lado também aumenta ~12% a força do outro, então o direito não fica para trás.',
    ],
    symptomRegress: {
      consecutiveSessions: 2,
      text: 'Se acontecer 2 treinos seguidos, troque o exercício e volte uma fase nele.',
    },
    acceptablePain: 'Dor local de até 3/10 no ombro é aceitável se passar em 24 h.',
  },

  alerts: [
    {
      level: 'stop-set',
      title: 'Parar a série na hora',
      items: [
        'formigamento ou dormência na mão, nos dedos ou no braço;',
        'mão fria ou pálida;',
        'dor no ombro acima de 3/10, ou que cresce durante a série;',
        'braço pesado ou "morto" de um jeito diferente do cansaço muscular.',
      ],
      action:
        'Descanse. Se passar em poucos minutos, continue com menos carga ou menos amplitude. Se voltar, tire o exercício naquele dia. Se acontecer 2 treinos seguidos, troque o exercício e volte uma fase nele.',
    },
    {
      level: 'er-today',
      title: 'Parar o treino e ir ao pronto-socorro no mesmo dia',
      items: [
        'braço inchado de repente, arroxeado ou pesado, ou veias saltadas no ombro ou no peito. É suspeita de trombose na veia do braço;',
        'mão pálida ou fria que não volta ao normal em ~10 min, ou dor forte na mão.',
      ],
      action: 'Parar o treino e ir ao pronto-socorro no mesmo dia.',
    },
    {
      level: 'emergency',
      title: 'Emergência (SAMU 192)',
      items: ['falta de ar;', 'dor no peito.'],
      action: 'Ligar para o SAMU (192).',
    },
    {
      level: 'physio',
      title: 'Procurar a fisioterapia ou o médico',
      items: [
        'sintomas que aparecem à noite ou no dia seguinte e duram mais de 24–48 h;',
        'perda de força ou de coordenação na mão que vai piorando;',
        'dor no ombro que não volta ao normal em 24 h.',
      ],
      action: 'Procurar a fisioterapia ou o médico.',
    },
  ],

  asymmetryTest: {
    everyWeeks: 4,
    exercises: ['db_row_unilateral', 'sidelying_ext_rot_db', 'leg_extension_unilateral'],
    target: 'Diferença abaixo de 10–15%',
    text: 'Teste a cada 4 semanas: máximo de repetições com a mesma carga, em cada lado, na remada unilateral, na rotação externa e na extensora unilateral. Meta: diferença abaixo de 10–15%. Por causa da lesão no nervo, o esquerdo pode evoluir mais devagar. Não force para compensar.',
  },

  cardioGuide: {
    types: [
      'Bike ergométrica, a principal.',
      'Esteira com inclinação, caminhando.',
      'Elíptico, segurando nas barras fixas se o movimento dos braços der sintoma.',
    ],
    avoid: [
      'Remo ergômetro: movimento repetido de puxar com carga.',
      'Natação: braço acima da cabeça.',
      'Corrida: desnecessária com 95 kg e destreinado. Pode entrar depois da semana 12.',
    ],
    weeklyMinutes: '~120–150 min',
    offGym: [
      'Meta de 7–8 mil passos por dia.',
      'Nas tardes no computador, levante a cada 45–60 min e faça 5 chin tucks.',
    ],
  },

  stretchNote: 'Nenhum alongamento deve dar formigamento. Se der, diminua a amplitude.',

  backpackNote:
    'Mochila: use as duas alças e leve pouco peso. Mochila pesada também aperta o mesmo espaço entre a clavícula e a costela.',
};

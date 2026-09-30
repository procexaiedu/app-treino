// Fonte única de tipos do plano. Todas as telas leem de plan.ts / nutrition.ts
// através destes tipos. Nenhum texto do plano fica copiado em componentes.

export type PhaseId = 1 | 2 | 3 | 4; // 4 = semana 12 (ajuste / deload)

export type ItemKind =
  | 'warmup'
  | 'rehab'
  | 'main'
  | 'cardio'
  | 'stretch';

export type Side = 'L' | 'R' | 'both';

/** Prescrição para uma fase. Valores livres em texto quando não são numéricos. */
export interface Prescription {
  sets: number;
  /** ex.: "10–12", "8 por lado", "20–40 s", "6 respirações lentas" */
  reps: string;
  /** Descanso em segundos entre séries (0 = sem cronômetro). */
  restSec: number;
  /** RIR alvo em texto, ex.: "3–4", "2", "—" */
  rir: string;
  /** Observação específica da fase (opcional). */
  note?: string;
}

export interface Exercise {
  id: string;
  name: string;
  kind: ItemKind;
  /** Unilateral => registra esquerdo e direito separados e começa pelo esquerdo. */
  unilateral: boolean;
  /** Tem carga a registrar (halter, máquina, elástico). false para isometria/respiração/cardio. */
  loaded: boolean;
  /** Membro superior: regra de "subir no máximo 1x a cada 2 semanas". */
  upperBody: boolean;
  /** Instruções curtas de execução / ajustes (uma frase por item). */
  cues: string[];
  /** Avisos específicos do caso (TOS, bursite, cervical). */
  cautions?: string[];
  /** Equipamento, ex.: "halter", "máquina", "elástico", "bike" */
  equipment: string[];
  /** Incremento de carga sugerido em kg (halter 1–2, máquina 1 placa ≈ 5, leg press 10). */
  loadStepKg?: number;
  /** Teto de carga definido pelo plano (ex.: RDL 24 kg por halter; encolhimento 10 kg). */
  maxLoadKg?: number;
  /** Só aparece a partir desta fase (ex.: encolhimento leve a partir da Fase 2). */
  fromPhase?: PhaseId;
  /** Prescrição por fase. Chaves 1..4. */
  prescription: Record<PhaseId, Prescription>;
}

export interface SessionBlock {
  kind: ItemKind;
  title: string;
  /** Duração estimada em minutos (para o roteiro). */
  minutes?: number;
  /** IDs de exercícios, na ordem. */
  items: string[];
  /** Texto do bloco (ex.: descrição do cardio da fase). */
  note?: string;
  /** Sobrescreve a prescrição de um item só neste bloco (ex.: lado esquerdo na sexta). */
  overrides?: Record<string, Partial<Record<PhaseId, Partial<Prescription>>>>;
}

export interface Session {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  /** 1 = segunda … 5 = sexta */
  weekday: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  /** Cardio do dia em texto, por fase. */
  cardio: Record<PhaseId, { type: string; minutes: string; detail: string }>;
  blocks: SessionBlock[];
}

export interface Phase {
  id: PhaseId;
  name: string;
  weeks: [number, number];
  setsRule: string;
  rirRule: string;
  goal: string;
  /** Regra de entrada na fase (ex.: 2 semanas sem sintomas para a Fase 2). */
  entryRule?: string;
}

export interface ProgressionRules {
  /** As três condições para subir carga. */
  increaseConditions: string[];
  /** Incrementos por equipamento em texto. */
  increments: string[];
  /** Regra do membro superior. */
  upperBodyMaxOnePer: { days: number; text: string };
  /** Regra da assimetria. */
  asymmetry: string[];
  /** Sintoma em N treinos seguidos => voltar uma fase no exercício. */
  symptomRegress: { consecutiveSessions: number; text: string };
  /** Dor aceitável. */
  acceptablePain: string;
}

export interface AlertGroup {
  level: 'stop-set' | 'er-today' | 'emergency' | 'physio';
  title: string;
  items: string[];
  action: string;
}

export interface AsymmetryTest {
  everyWeeks: number;
  exercises: string[]; // ids
  target: string;
  text: string;
}

export interface Plan {
  meta: {
    title: string;
    weeks: number;
    assumptions: string[];
    researchFile: string;
  };
  reading: { title: string; paragraphs: string[]; bullets?: string[] }[];
  phases: Phase[];
  sessions: Session[];
  exercises: Record<string, Exercise>;
  progression: ProgressionRules;
  alerts: AlertGroup[];
  asymmetryTest: AsymmetryTest;
  cardioGuide: { types: string[]; avoid: string[]; weeklyMinutes: string; offGym: string[] };
  stretchNote: string;
  backpackNote: string;
}

// ---------------- Alimentação ----------------

export interface MealSlot {
  time: string;
  name: string;
  kcal: string;
  protein: string;
  note?: string;
}

export interface FoodOption {
  label: string;
  items: string;
  protein?: string;
  kcal?: string;
}

export interface PlateItem {
  item: string;
  lunch: string;
  dinner: string;
}

export interface Swap {
  instead: string;
  use: string;
}

export interface Supplement {
  name: string;
  dose: string;
  note: string;
}

export interface Drink {
  name: string;
  kcal: string;
}

export interface Nutrition {
  calc: { label: string; value: string; detail?: string }[];
  targets: { kcalDay: number; kcalWeek: number; proteinG: number; fatG: number; carbG: number; rate: string };
  weekdayMeals: MealSlot[];
  weekdayMealsNote: string[];
  plate: PlateItem[];
  plateNote: string;
  swaps: Swap[];
  breakfast: FoodOption[];
  collegeSnack: FoodOption[];
  collegeSnackNote: string;
  afternoonSnack: FoodOption[];
  weekend: { title: string; bullets: string[] }[];
  drinks: Drink[];
  water: string[];
  supplements: Supplement[];
  supplementsNote: string;
}

// ---------------- Acompanhamento ----------------

export interface TrackingRow {
  what: string;
  when: string;
  how: string;
}

export interface AdjustRule {
  id: string;
  trigger: string;
  action: string;
}

export interface Tracking {
  rows: TrackingRow[];
  rules: AdjustRule[];
  week12: string;
}

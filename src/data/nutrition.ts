// Fonte única do guia alimentar (seção 3 de plano.md).

import type { Nutrition } from './types';

export const nutrition: Nutrition = {
  calc: [
    {
      label: 'Gasto em repouso (fórmula de Mifflin-St Jeor)',
      value: '2.005 kcal',
      detail: '10 × 95 + 6,25 × 184 − 5 × 20 + 5 = 950 + 1.150 − 100 + 5 = 2.005 kcal.',
    },
    {
      label: 'Fator de atividade',
      value: '~2.900 kcal',
      detail:
        'Trabalho sentado mais 5 treinos por semana, entre 1,375 e 1,55. Dá 2.757–3.108 kcal. Estimativa de manutenção: ~2.900 kcal.',
    },
    {
      label: 'Alvo',
      value: '~2.400 kcal/dia em média',
      detail:
        '2.900 − 500 = ~2.400 kcal/dia em média, ou ~16.800 por semana. Com mais de ~500 de déficit você perde a chance de ganhar músculo enquanto perde gordura.',
    },
    {
      label: 'Proteína',
      value: '~160 g/dia',
      detail:
        'É 1,7 g/kg do peso atual ou ~1,9 g/kg de um peso-alvo de 85 kg. O limite é ~2 g/kg, por causa da NEM 1.',
    },
    {
      label: 'Resto',
      value: '~70 g de gordura e ~280 g de carboidrato',
      detail: 'Você não precisa contar isso. O prato em gramas já chega perto.',
    },
    {
      label: 'Ritmo esperado',
      value: '0,5–1 kg por semana',
      detail: 'Nas 2 primeiras semanas cai mais rápido porque você perde água.',
    },
  ],

  targets: {
    kcalDay: 2400,
    kcalWeek: 16800,
    proteinG: 160,
    fatG: 70,
    carbG: 280,
    rate: '0,5–1 kg por semana',
  },

  weekdayMeals: [
    { time: '7:30', name: 'Café da manhã', kcal: '~400', protein: '~30 g' },
    { time: '9:40', name: 'Lanche da faculdade', kcal: '~250', protein: '~8 g' },
    { time: '13:10', name: '30 g de whey com água, logo após o treino', kcal: '~120', protein: '~24 g' },
    { time: '~13:45', name: 'Almoço', kcal: '~700', protein: '~50 g' },
    { time: '~17:00', name: 'Lanche da tarde', kcal: '~300', protein: '~20 g' },
    { time: '~20:00', name: 'Jantar', kcal: '~600', protein: '~40 g' },
  ],

  weekdayMealsNote: [
    'Dia útil: ~2.370 kcal, ~165 g de proteína.',
    'Na segunda, o café é às ~9:40. Não precisa do lanche das 9:40. Se tiver fome antes do treino, coma uma banana.',
  ],

  plate: [
    { item: 'Arroz', lunch: '150 g', dinner: '100–120 g' },
    { item: 'Feijão com caldo', lunch: '120 g (1 concha)', dinner: '100 g' },
    { item: 'Frango, patinho, alcatra, lombo ou peixe', lunch: '150 g', dinner: '130–150 g' },
    { item: 'Legumes e salada', lunch: '≥150 g (metade do prato)', dinner: '≥150 g' },
    { item: 'Azeite ou óleo na salada', lunch: '1 colher de chá', dinner: '1 colher de chá' },
    { item: 'Total aproximado', lunch: '~620–720 kcal', dinner: '~520–620 kcal' },
  ],

  plateNote: 'Pesar o alimento cozido. As trocas valem para 150 g de arroz ou 150 g de frango.',

  swaps: [
    {
      instead: '150 g de arroz',
      use: '150 g de macarrão cozido, 150 g de mandioca, 170 g de cuscuz ou 350 g de batata cozida',
    },
    {
      instead: '150 g de frango',
      use: '130 g de carne magra, 1 lata de atum escorrido, ou 3 ovos + ½ porção de carne',
    },
    {
      instead: 'Proteína magra',
      use: 'Carne gorda (costela, picanha, acém) ou hambúrguer caseiro: 100–120 g e 30 g a menos de arroz',
    },
    { instead: 'Proteína grelhada', use: 'Frita ou empanada: tire 50 g do arroz' },
    {
      instead: 'Macarronada ou lasanha como prato único',
      use: '300 g da massa pronta + salada; se tiver pouca carne, complete com proteína no lanche',
    },
    {
      instead: 'Comida pedida',
      use: 'Pizza: 2–3 fatias + salada. Hambúrguer: sem batata grande. Japonês: 15–20 peças, com prioridade para sashimi',
    },
  ],

  // Café da manhã (até 10 min, ~400 kcal)
  breakfast: [
    {
      label: 'Opção 1',
      items: '3 ovos mexidos + 1 pão francês + café com 150 ml de leite',
      protein: '~30 g',
      kcal: '~400',
    },
    {
      label: 'Opção 2',
      items: 'Vitamina: 250 ml de leite + 1 banana + 30 g de aveia + 30 g de whey',
      protein: '~37 g',
      kcal: '~400',
    },
    {
      label: 'Opção 3',
      items: '2 fatias de pão integral + 2 ovos + 30 g de queijo branco + 1 fruta',
      protein: '~25 g',
      kcal: '~400',
    },
    {
      label: 'Opção 4',
      items: 'Tapioca (40 g de goma) + 2 ovos + 30 g de queijo + café com leite',
      protein: '~25 g',
      kcal: '~400',
    },
  ],

  // Lanche da faculdade (sem geladeira, barato, ~250 kcal)
  collegeSnack: [
    { label: 'Opção 1', items: '1 banana + 25 g de amendoim torrado', kcal: '~250' },
    { label: 'Opção 2', items: '1 pão francês com 1 colher de sopa de pasta de amendoim', kcal: '~250' },
    { label: 'Opção 3', items: '1 maçã + 1 paçoca + 20 g de castanhas ou amendoim', kcal: '~250' },
    { label: 'Opção 4', items: '3 torradas ou bolachas de arroz + pasta de amendoim + 1 fruta', kcal: '~250' },
  ],

  collegeSnackNote:
    'O pós-treino é whey em pó levado no shaker, com água colocada na hora. Não precisa de geladeira.',

  // Lanche da tarde (~300 kcal, ~20 g de proteína)
  afternoonSnack: [
    {
      label: 'Opção 1',
      items: 'Sanduíche: 2 fatias de pão integral + 60 g de frango desfiado ou peito de peru + queijo branco',
      protein: '~20 g',
      kcal: '~300',
    },
    { label: 'Opção 2', items: '2 ovos cozidos + 1 fruta + café com leite', protein: '~20 g', kcal: '~300' },
    {
      label: 'Opção 3',
      items: '170 g de iogurte natural + 1 fruta + 20 g de aveia (com whey, se o dia estiver baixo em proteína)',
      protein: '~20 g',
      kcal: '~300',
    },
    {
      label: 'Opção 4',
      items: 'Tapioca com 60 g de frango ou atum + requeijão light',
      protein: '~20 g',
      kcal: '~300',
    },
  ],

  weekend: [
    {
      title: 'Orçamento',
      bullets: [
        'Segunda a quinta ~2.300 kcal. Sobram ~2.500 kcal/dia de sexta a domingo, com a bebida incluída.',
      ],
    },
    {
      title: 'Sábado e domingo sem café da manhã',
      bullets: [
        'Tudo bem. Faça 3 refeições:',
        'primeira refeição com ~40–50 g de proteína;',
        'lanche com proteína à tarde;',
        'jantar de verdade antes de sair.',
      ],
    },
    {
      title: 'Nunca beba em jejum',
      bullets: ['Comer antes reduz a ressaca e o risco de hipoglicemia.'],
    },
    {
      title: 'Na saída',
      bullets: [
        'prefira destilado com refrigerante zero ou água com gás, ou cerveja no lugar de drinks doces;',
        'intercale 1 copo de água a cada 1–2 doses.',
      ],
    },
    {
      title: 'Comida da madrugada',
      bullets: ['Se for comer, conte 1 lanche simples ou 2–3 fatias de pizza, e só isso.'],
    },
    {
      title: 'Dia seguinte',
      bullets: [
        'proteína na primeira refeição;',
        'água com um pouco de sal;',
        'caminhada de 30–40 min, que conta como cardio.',
      ],
    },
    {
      title: 'Segunda',
      bullets: ['Volte ao normal. Não compense com jejum nem com cardio extra.'],
    },
  ],

  drinks: [
    { name: 'Cerveja lata 350 ml', kcal: '~150' },
    { name: 'Chope 300 ml', kcal: '~130' },
    { name: 'Dose de destilado (50 ml) + refrigerante zero', kcal: '~110' },
    { name: 'Dose de destilado + refrigerante comum (200 ml)', kcal: '~195' },
    { name: 'Taça de vinho 150 ml', kcal: '~125' },
    { name: 'Caipirinha', kcal: '~250–300' },
    { name: 'Drink com energético', kcal: '~200–250' },
  ],

  water: [
    'Nos dias de treino ou de calor, suba de 2,5 L para ~3 L.',
    'A urina deve ficar clara.',
    'Isso é mais importante por causa do risco de cálculo renal na NEM 1.',
    'Pelo mesmo motivo, mantenha leite, iogurte e queijo e não exagere no sal.',
  ],

  supplements: [
    {
      name: 'Creatina',
      dose: '3–5 g/dia, todos os dias, inclusive no fim de semana',
      note: 'Horário não importa. Avise o endocrinologista por causa da creatinina',
    },
    { name: 'Whey', dose: '30 g depois do treino', note: 'Nos outros dias, só se faltar proteína' },
    {
      name: 'Cafeína (opcional)',
      dose: '1–2 xícaras de café antes do treino (~100–200 mg)',
      note: 'Nada depois das 16:00',
    },
    { name: 'Vitamina D', dose: 'Como o endocrinologista prescreveu', note: 'Não mudar por conta própria' },
  ],

  supplementsNote:
    'Nada além disso. Termogênico, BCAA e glutamina não têm evidência forte que justifique o gasto.',
};

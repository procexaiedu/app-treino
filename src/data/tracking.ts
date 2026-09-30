// Fonte única do acompanhamento e ajustes (seção 4 de plano.md).

import type { Tracking } from './types';

export const tracking: Tracking = {
  rows: [
    {
      what: 'Peso',
      when: 'Todo dia útil, ao acordar, depois do banheiro',
      how: 'Use a média semanal. Pesagem no fim de semana ou na segunda sai distorcida pela bebida e pelo sal',
    },
    {
      what: 'Cintura',
      when: '1 vez por semana, na mesma manhã',
      how: 'Fita na altura do umbigo, depois de soltar o ar',
    },
    {
      what: 'Fotos',
      when: 'A cada 4 semanas',
      how: 'Frente, lado e costas, mesma luz e mesma hora. A foto de lado também mostra a posição da cabeça',
    },
    {
      what: 'Cargas',
      when: 'Todo treino',
      how: 'Caderno ou app: carga, repetições, RIR e sintomas (sim/não), separados por lado',
    },
    {
      what: 'Assimetria',
      when: 'Semanas 4, 8 e 12',
      how: 'Teste de repetições descrito na seção de assimetria',
    },
  ],

  rules: [
    {
      id: 'slow_loss',
      trigger: 'Peso cai menos de 0,25 kg por semana por 2 semanas e a cintura não muda',
      action: 'Tire ~150–200 kcal (−30 g de arroz no almoço e no jantar) ou some 2 mil passos por dia.',
    },
    {
      id: 'fast_loss',
      trigger: 'Peso cai mais de 1 kg por semana depois da semana 2 e a força cai',
      action: 'Some ~150–200 kcal.',
    },
    {
      id: 'stalled_load',
      trigger: 'Uma carga parou de subir por 2 semanas',
      action: 'Confira sono e fim de semana primeiro. Depois troque a variação do exercício.',
    },
    {
      id: 'symptom',
      trigger: 'Sintoma de alerta',
      action: 'Volte uma fase no exercício que provocou. Se repetir, troque o exercício.',
    },
    {
      id: 'week12',
      trigger: 'Semana 12',
      action:
        'Refaça as medidas e leve o registro à fisioterapia. Pergunte se já pode liberar exercícios acima da linha do ombro.',
    },
  ],

  week12:
    'Refaça as medidas e leve o registro à fisioterapia. Pergunte se já pode liberar exercícios acima da linha do ombro.',
};

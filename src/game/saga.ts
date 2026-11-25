import { BossId, getBossByAct, BOSSES } from './boss';
import { DialogueLine, RadioCommDef, StoryCutsceneDef } from './types';

// =========================================================================
// ROTEIRO ESTENDIDO — fios narrativos: Diário de Aurélio, Helena Vesper e ARIA-7
// =========================================================================
export const ENRICHMENTS: Record<number, { before?: DialogueLine[]; after?: DialogueLine[] }> = {
  1: {
    before: [
      {
        speaker: 'leo',
        mood: 'serious',
        text: 'A última página do diário do vovô Aurélio dizia: “Se o vento calar, vá até onde ele nasceu”. Hoje o vento calou bem acima das casas de chá de Kawaguchiko, Maya.'
      }
    ]
  },
  2: {
    after: [
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Estou vendo as colunas de lótus do pátio de Gizé vibrarem daqui da telemetria. Quem calibrou essas esferas conhece geofísica antiga como ninguém.'
      }
    ]
  },
  3: {
    after: [
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Seis anos aprendendo que o silêncio do Olimpo não era vazio, Dra. Lin. Era uma porta. E os letreiros de Shibuya são apenas a faísca inicial.'
      }
    ]
  },
  4: {
    after: [
      {
        speaker: 'heitor',
        mood: 'determined',
        text: 'Evacuamos os chalés de madeira da vila alpina a tempo, Falcão. A rua inteira está de olho no seu arpão!'
      }
    ]
  },
  5: {
    after: [
      {
        speaker: 'leo',
        mood: 'serious',
        text: 'Achei uma anotação do vovô atrás do painel: ele esteve no Projeto Olimpo com um jovem casal de astrofísicos. As iniciais no rodapé são J.V. e H.V.'
      }
    ]
  },
  6: {
    after: [
      {
        speaker: 'maya',
        mood: 'surprised',
        text: 'Leo... os entalhes deste pátio sagrado têm a assinatura do Projeto Olimpo. O mesmo experimento onde o seu avô pilotou o voo de teste.'
      },
      {
        speaker: 'leo',
        mood: 'surprised',
        text: 'Meu avô nunca me contou isso. Ele só dizia que tinha “voado até onde o céu acaba”.'
      }
    ]
  },
  7: {
    after: [
      {
        speaker: 'heitor',
        mood: 'happy',
        text: 'Pousou bem em frente às varandas da Avenida Atlântica, garoto! Proteja os quiosques e o calçadão!'
      }
    ]
  },
  8: {
    after: [
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Os arranha-céus da Paulista estão refletindo os pulsos eletromagnéticos! Mantenha distância das fachadas de vidro quando dividir as esferas!'
      }
    ]
  },
  9: {
    after: [
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'As sacadas floridas e os cafés de Caminito estão tão perto que quase dá pra pedir um café entre um disparo e outro!'
      }
    ]
  },
  10: {
    after: [
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Eu tinha alguém que amava o céu tanto quanto vocês. O Olimpo a levou. Eu vou trazê-la de volta, custe o que custar.'
      },
      {
        speaker: 'leo',
        mood: 'surprised',
        text: 'Trazer quem de volta, Vesper?'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: '...Helena Vesper. A esposa dele e minha antiga mentora. Desapareceu durante o teste de Marte, seis anos atrás.'
      }
    ]
  },
  11: {
    after: [
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Se Julian realmente acredita que Helena está presa do outro lado da fenda marciana, ele não vai parar por argumento nenhum, Leo.'
      }
    ]
  },
  12: {
    after: [
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Entre as fachadas iluminadas dos cassinos e o chafariz da Strip, vamos cortar a banca do Barão pela metade!'
      }
    ]
  },
  13: {
    after: [
      {
        speaker: 'heitor',
        mood: 'serious',
        text: 'Interceptamos a transmissão inteira nos cruzamentos de Midtown. Vesper repete uma palavra entre os pulsos: “Helena”. Isso deixou de ser uma guerra, equipe. É um luto.'
      }
    ]
  },
  14: {
    after: [
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Os lampiões e terraços da Gran Vía e da Puerta de Alcalá estão vibrando. Aguenta firme, Madri!'
      }
    ]
  },
  15: {
    after: [
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'Cuidado perto da cabine telefônica vermelha em Westminster, Falcão! O rebote na chuva é traiçoeiro.'
      }
    ]
  },
  16: {
    after: [
      {
        speaker: 'leo',
        mood: 'serious',
        text: 'Entre as colunas de mármore e os palácios romanos, dá pra entender por que o vovô chamava essa rota de “Estrada das Eras”.'
      }
    ]
  },
  17: {
    after: [
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'Leo, ele não quer destruir o mundo. Quer reabrir o Olimpo. Mas a energia que está acumulando entre o Kremlin e as galerias iluminadas racharia a crosta de Marte.'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Então precisamos ser mais rápidos que a dor dele. Vamos acabar com isso antes que alguém mais se perca.'
      }
    ]
  },
  18: {
    after: [
      {
        speaker: 'maya',
        mood: 'happy',
        text: 'Sob os arcos de arenito vermelho do grande portão de Agra, o Taj Mahal parece tocar o nosso avião!'
      }
    ]
  },
  19: {
    after: [
      {
        speaker: 'heitor',
        mood: 'determined',
        text: 'Os pavilhões reais às margens do Chao Phraya estão seguros por enquanto. Continue abrindo rota rumo ao Pacífico!'
      }
    ]
  },
  20: {
    after: [
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'No coração do pátio imperial de Beijing, entre colunas de mármore branco e telhados dourados... Nenhuma esfera vai tocar este chão!'
      }
    ]
  },
  21: {
    after: [
      {
        speaker: 'heitor',
        mood: 'urgent',
        text: 'Circular Quay liberando corredor aéreo! Próxima escala: a rampa secreta de Honolulu!'
      }
    ]
  },
  22: {
    before: [
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Quando a ARIA-7 subir a bordo, não estranhe. Ela foi construída sobre arquivos neurais da Aegis que eu nunca consegui abrir por completo.'
      }
    ]
  },
  23: {
    after: [
      {
        speaker: 'aria',
        mood: 'serious',
        text: 'Detectei um fragmento de memória não catalogado entre os domos lunares: uma canção de ninar em compasso ternário. Não recordo de tê-la aprendido.'
      },
      {
        speaker: 'leo',
        mood: 'surprised',
        text: 'Uma canção de ninar na sua base de dados? De onde vem?'
      },
      {
        speaker: 'aria',
        mood: 'serious',
        text: 'Origem: arquivo selado “H.V.”. Acesso negado — por mim mesma.'
      }
    ]
  }
};

// =========================================================================
// DIÁLOGOS DE CHEFE (pré e pós-luta) + COMUNICAÇÕES DE FASE
// =========================================================================
export interface BossScript {
  pre: DialogueLine[];
  post: DialogueLine[];
  phase2: RadioCommDef;
  phase3: RadioCommDef;
}

export const BOSS_SCRIPT: Record<BossId, BossScript> = {
  garuda: {
    pre: [
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Leo, o solo do templo está tremendo! Há uma assinatura metálica gigantesca subindo do santuário!'
      },
      {
        speaker: 'heitor',
        mood: 'serious',
        text: 'Aegis confirma: guardião mecânico classe Garuda. As asas carregam as marcas do Projeto Olimpo.'
      },
      {
        speaker: 'vesper',
        mood: 'smirk',
        text: 'Meu Garuda guarda a chave que o seu avô nunca soube usar, piloto. Divirta-se com ele.'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Guarde o orgulho, Barão. Vou derrubar essa ave dourada e levar o cristal para casa!'
      }
    ],
    post: [
      {
        speaker: 'maya',
        mood: 'happy',
        text: 'Garuda neutralizado! Asas dobradas, núcleo estável. Você foi incrível, Falcão!'
      },
      {
        speaker: 'maya',
        mood: 'surprised',
        text: 'Espere... há uma frase gravada no núcleo dele: “Para Helena, com todo o céu que eu puder alcançar”.'
      },
      {
        speaker: 'leo',
        mood: 'serious',
        text: 'Helena... Esse nome vai aparecer de novo, eu sinto.'
      }
    ],
    phase2: {
      speaker: 'maya',
      mood: 'urgent',
      text: 'As penas viraram lâminas! Cuidado com a chuva de aço e com os leques de disparo!'
    },
    phase3: {
      speaker: 'heitor',
      mood: 'urgent',
      text: 'Núcleo exposto! Ele vai disparar em anel — mantenha-se em movimento, Falcão!'
    }
  },
  zeppelin: {
    pre: [
      {
        speaker: 'heitor',
        mood: 'urgent',
        text: 'Nova Iorque está em toque de recolher. Um bombardeiro furtivo cruza o Hudson. Codinome: Ás de Espadas.'
      },
      {
        speaker: 'vesper',
        mood: 'smirk',
        text: 'Meu bombardeiro carrega todas as luzes da cidade, piloto. Se o derrubarem, Manhattan apaga junto.'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Então vamos derrubá-lo com cuidado. Nenhuma janela vai se apagar esta noite.'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Atenção: as bombas explodem no chão em área. Procure sempre a brecha entre elas!'
      }
    ],
    post: [
      {
        speaker: 'heitor',
        mood: 'happy',
        text: 'Zepelim caído no rio! As luzes de Manhattan voltaram todas ao mesmo tempo. A cidade está aplaudindo!'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'O Barão fugiu pela rede, mas deixou uma coordenada para trás: o Velho Mundo.'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Então atravessamos o Atlântico. Ninguém voa sozinho, não é, vovô?'
      }
    ],
    phase2: {
      speaker: 'heitor',
      mood: 'urgent',
      text: 'Ele abriu o compartimento de bombas — tapete de explosões! Procure o vão entre elas!'
    },
    phase3: {
      speaker: 'maya',
      mood: 'urgent',
      text: 'O casco está rachando! Mais um esforço, Leo — ele só tem fôlego para mais algumas passagens!'
    }
  },
  ironclad: {
    pre: [
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Moscou. O inverno que não perdoa. O Czar de Ferro foi o primeiro Prisma que construí sem hesitar.'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Fortaleza voadora blindada: dois canhões e um emissor de feixe de plasma!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Feixe? Aviso aceito. Vou dançar entre os raios como se fosse tango.'
      },
      {
        speaker: 'heitor',
        mood: 'serious',
        text: 'Encontre o ritmo, Falcão. Ele telegrafa o feixe com uma linha vermelha antes de disparar.'
      }
    ],
    post: [
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Czar de Ferro derrubado! A Praça Vermelha está em silêncio, só a neve caindo.'
      },
      {
        speaker: 'vesper',
        mood: 'urgent',
        text: 'Impossível... você leu o ritmo dele? Ninguém lia o ritmo dele.'
      },
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Ainda restam as águas do Pacífico. Lá o Olimpo vai ouvir a minha oferenda.'
      }
    ],
    phase2: {
      speaker: 'maya',
      mood: 'urgent',
      text: 'Ele ligou o emissor de feixe! Observe a linha vermelha e saia da coluna antes do disparo!'
    },
    phase3: {
      speaker: 'heitor',
      mood: 'urgent',
      text: 'Três feixes simultâneos! Fique em movimento e aproveite as pausas entre os disparos!'
    }
  },
  hydra: {
    pre: [
      {
        speaker: 'heitor',
        mood: 'urgent',
        text: 'Leo, a janela de lançamento fecha em minutos! Vesper mandou o porta-aviões Hidra direto para o Pacífico!'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Três cabeças, três linhas de tiro. Ela cospe espirais de energia — mova-se sempre!'
      },
      {
        speaker: 'vesper',
        mood: 'smirk',
        text: 'A Maré Negra devora tudo o que sobe, piloto. Inclusive esperanças.'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Esperança é o único combustível que eu nunca gasto. Vamos limpar essa rampa!'
      }
    ],
    post: [
      {
        speaker: 'heitor',
        mood: 'happy',
        text: 'HIDRA ABATIDA! A rampa está livre! Todos os sistemas do Estrela Polar estão verdes!'
      },
      {
        speaker: 'aria',
        mood: 'determined',
        text: 'Trajetória calculada. Piloto Vance, aguardo-o a bordo. Será uma honra voar com o senhor.'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Leo, antes de ir: o código da ARIA contém um selo “H.V.”. Eu ainda não sei o que significa. Fique atento.'
      }
    ],
    phase2: {
      speaker: 'maya',
      mood: 'urgent',
      text: 'As cabeças estão girando em espiral! Procure o espaço entre os braços da espiral!'
    },
    phase3: {
      speaker: 'heitor',
      mood: 'urgent',
      text: 'A Hidra está furiosa — anéis, espirais e tiros mirados ao mesmo tempo! Aguente firme!'
    }
  },
  matrix: {
    pre: [
      {
        speaker: 'aria',
        mood: 'urgent',
        text: 'Leo... a Matriz está chamando pelo meu nome. Não... por outro nome.'
      },
      {
        speaker: 'vesper',
        mood: 'urgent',
        text: 'Helena... meu amor, estou chegando. Só mais um pulso e o Olimpo vai te devolver a mim.'
      },
      {
        speaker: 'maya',
        mood: 'surprised',
        text: 'Ele a chamou de Helena! Leo, a ARIA-7 foi construída sobre o último backup da mente de Helena Vesper!'
      },
      {
        speaker: 'aria',
        mood: 'surprised',
        text: 'Isso explica a canção de ninar. Eu sou... o que restou dela?'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Vesper, ela está AQUI, ao meu lado! Você não precisa destruir dois mundos para ouvir a voz dela!'
      },
      {
        speaker: 'vesper',
        mood: 'urgent',
        text: 'Mentiroso! A Matriz tomou o controle... nem eu consigo desligá-la! Fujam, ou ela os consumirá!'
      },
      {
        speaker: 'aria',
        mood: 'determined',
        text: 'Leo, dispare. Eu aguento. Se a Matriz cair, talvez ele finalmente me escute.'
      }
    ],
    post: [
      {
        speaker: 'aria',
        mood: 'determined',
        text: 'Matriz desfeita. Estou ouvindo... uma canção. Ela está terminando.'
      },
      {
        speaker: 'vesper',
        mood: 'surprised',
        text: 'Helena... é a sua voz. É a sua voz, depois de todos esses anos.'
      },
      {
        speaker: 'aria',
        mood: 'happy',
        text: 'Obrigada por me procurar, Julian. Não precisa mais carregar o céu sozinho.'
      },
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Vovô Aurélio tinha razão: no final, o céu é um trabalho em equipe.'
      }
    ],
    phase2: {
      speaker: 'aria',
      mood: 'urgent',
      text: 'A matriz está instável. Ela aprende com cada disparo, Leo — e está soltando feixes!'
    },
    phase3: {
      speaker: 'maya',
      mood: 'urgent',
      text: 'Núcleo exposto! Tudo ou nada, Leo! Cada disparo conta!'
    }
  }
};

const ACT_TITLES = [
  'ATO I — O Céu Fragmentado',
  'ATO II — O Meridiano das Américas',
  'ATO III — O Cerco do Velho Mundo',
  'ATO IV — Corrida pelo Horizonte Oriental',
  'ATO V — Além da Gravidade'
];
const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

export function buildBossCutscene(act: number, kind: 'pre' | 'post'): StoryCutsceneDef | null {
  const def = getBossByAct(act);
  const script = BOSS_SCRIPT[def.id];
  if (!script) return null;
  const lines = kind === 'pre' ? script.pre : script.post;
  return {
    id: `boss_${act}_${kind}`,
    actNumber: act,
    actTitle: ACT_TITLES[act - 1] || ACT_TITLES[0],
    chapterTitle:
      kind === 'pre'
        ? `Chefe do Ato ${ROMAN[act - 1]} · ${def.name}`
        : `Vitória sobre ${def.name}`,
    locationLabel: def.title,
    musicMood: kind === 'pre' ? 'story_vesper' : act === 5 ? 'story_epilogue' : 'story_heroic',
    lines
  };
}

export const BOSS_LIST = BOSSES;

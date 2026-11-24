import {
  CharacterId,
  DialogueLine,
  RadioCommDef,
  StoryCutsceneDef,
  StoryMusicMood
} from './types';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  callsign: string;
  role: string;
  frequency: string;
  accentColor: string;
  badgeBg: string;
  voicePitch: number;
  voiceWave: OscillatorType;
  bio: string;
}

export const CHARACTERS: Record<CharacterId, CharacterProfile> = {
  leo: {
    id: 'leo',
    name: 'Leo "Falcão" Vance',
    callsign: 'FALCÃO-01',
    role: 'Piloto Ás do Esquadrão Pang',
    frequency: '118.45 MHz',
    accentColor: '#fbbf24',
    badgeBg: '#451a03',
    voicePitch: 295,
    voiceWave: 'triangle',
    bio: 'Aviador destemido que herdou o lendário biplano turbo Albatroz Vermelho e o arpão pneumático Vento Norte de seu avô. Jamais recua diante de turbulência — nem mesmo fora da atmosfera.'
  },
  maya: {
    id: 'maya',
    name: 'Dra. Maya Lin',
    callsign: 'PRISMA-LAB',
    role: 'Cientista-Chefe & Engenheira Tática',
    frequency: '124.80 MHz',
    accentColor: '#22d3ee',
    badgeBg: '#083344',
    voicePitch: 430,
    voiceWave: 'sine',
    bio: 'Especialista em geofísica quântica e criadora das cápsulas de Arpão Duplo, Cabo Magnético e Relógio Crono. Decifra a assinatura energética das Esferas Prisma em tempo real.'
  },
  heitor: {
    id: 'heitor',
    name: 'Comandante Heitor Silva',
    callsign: 'AEGIS-HQ',
    role: 'Diretor da Defesa Aérea Global',
    frequency: '131.10 MHz',
    accentColor: '#34d399',
    badgeBg: '#064e3b',
    voicePitch: 190,
    voiceWave: 'square',
    bio: 'Veterano estrategista brasileiro que coordena os corredores aéreos internacionais e lidera secretamente o projeto do foguete orbital Estrela Polar.'
  },
  vesper: {
    id: 'vesper',
    name: 'Barão Vesper',
    callsign: 'SINAL-OMEGA',
    role: 'Arquiteto da Rede Prisma',
    frequency: '666.00 kHz',
    accentColor: '#f43f5e',
    badgeBg: '#4c0519',
    voicePitch: 155,
    voiceWave: 'sawtooth',
    bio: 'Ex-astrofísico brilhante e obcecado que projetou as Esferas Prisma para drenar o campo geomagnético e as cores dos monumentos terrestres rumo ao antigo Núcleo Olímpico em Marte.'
  },
  aria: {
    id: 'aria',
    name: 'ARIA-7',
    callsign: 'ORBITAL-AI',
    role: 'IA de Navegação Interplanetária',
    frequency: '2.40 GHz',
    accentColor: '#c084fc',
    badgeBg: '#3b0764',
    voicePitch: 560,
    voiceWave: 'sine',
    bio: 'Unidade sintética embarcada no módulo espacial Estrela Polar. Calcula trajetórias balísticas em baixa gravidade com precisão milimétrica e humor seco.'
  }
};

export interface StoryActDef {
  actNumber: number;
  title: string;
  subtitle: string;
  stageRange: [number, number];
  synopsis: string;
}

export const STORY_ACTS: StoryActDef[] = [
  {
    actNumber: 1,
    title: 'ATO I — O Céu Fragmentado',
    subtitle: 'Do Monte Fuji ao Templo Dourado (Fases 01–06)',
    stageRange: [1, 6],
    synopsis:
      'Esferas colossais de plasma iridescente surgem sobre santuários antigos e metrópoles, congelando os ventos do planeta. Leo e Dra. Maya descobrem que os monumentos estão sendo usados como antenas geomagnéticas.'
  },
  {
    actNumber: 2,
    title: 'ATO II — O Meridiano das Américas',
    subtitle: 'Do Rio de Janeiro a Nova Iorque (Fases 07–13)',
    stageRange: [7, 13],
    synopsis:
      'Convocados pelo Comandante Heitor, o Esquadrão cruza as Américas de sul a norte. Nas ruínas de Machu Picchu e nos céus de Manhattan, eles rastreiam o misterioso Barão Vesper.'
  },
  {
    actNumber: 3,
    title: 'ATO III — O Cerco do Velho Mundo',
    subtitle: 'De Madri à Nevasca de Moscou (Fases 14–17)',
    stageRange: [14, 17],
    synopsis:
      'Barão Vesper acelera a sobrecarga sobre a Europa. Em meio à neblina do Tâmisa e ao inverno russo, Vesper revela seu plano final: canalizar a energia terrestre para despertar Marte.'
  },
  {
    actNumber: 4,
    title: 'ATO IV — Corrida pelo Horizonte Oriental',
    subtitle: 'De Nova Délhi à Plataforma de Honolulu (Fases 18–22)',
    stageRange: [18, 22],
    synopsis:
      'Com o relógio global no limite, Leo desativa os últimos âncoras na Ásia e na Austrália enquanto Maya e Heitor preparam o lançamento do foguete Estrela Polar no Havaí.'
  },
  {
    actNumber: 5,
    title: 'ATO V — Além da Gravidade',
    subtitle: 'Órbita Lunar & Confronto Final em Marte (Fases 23–24)',
    stageRange: [23, 24],
    synopsis:
      'Com traje espacial pressurizado e auxílio da IA ARIA-7, Leo destrói o retransmissor lunar e enfrenta a Matriz Suprema de Vesper aos pés do Monte Olimpo em Marte.'
  }
];

export interface StageStoryEntry {
  levelId: number;
  actNumber: number;
  chapterTitle: string;
  journalSummary: string;
  introMusic: StoryMusicMood;
  introLines: DialogueLine[];
  midComm: RadioCommDef;
  outroMusic?: StoryMusicMood;
  outroLines?: DialogueLine[];
}

export const STAGE_STORY_SCRIPT: StageStoryEntry[] = [
  // =========================================================================
  // ATO I (FASES 1 - 6)
  // =========================================================================
  {
    levelId: 1,
    actNumber: 1,
    chapterTitle: 'Capítulo 01 · Pétalas e Plasma sobre o Fuji',
    journalSummary:
      'Durante um voo de patrulha ao pôr do sol no Monte Fuji, a primeira Esfera Prisma apareceu sobre o Lago Kawaguchiko. O arpão pneumático de Leo provou ser a única arma capaz de fracionar a membrana quântica.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Céu limpo sobre o Monte Fuji, pétalas de sakura no vento... Confessa, Maya, você me mandou para o Japão só para testar as asas novas do Albatroz!'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Segure a comemoração, Falcão! Meus sensores geomagnéticos acabaram de disparar no vermelho. Algo imenso está condensando a luz acima do Lago Kawaguchiko!'
      },
      {
        speaker: 'heitor',
        mood: 'serious',
        text: 'Aqui é o Comando Aegis. Anomalias idênticas acabaram de surgir em vinte e dois pontos históricos do globo! A aviação civil está paralisada.'
      },
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'É uma Esfera Prisma — plasma contido por tensão superficial harmônica. Se você perfurá-la com o arpão de titânio, ela se divide até dissipar!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Ajustando os óculos de voo e armando o arpão Vento Norte. Deixa comigo, doutora — vamos limpar o horizonte do Fuji!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'determined',
      text: 'Excelente impacto! Cuidado ao dividir as esferas: cada fragmento salta mais rápido, mas pode soltar minhas cápsulas de suporte!'
    }
  },
  {
    levelId: 2,
    actNumber: 1,
    chapterTitle: 'Capítulo 02 · O Alinhamento de Gizé',
    journalSummary:
      'No Egito, descobrimos que as esferas utilizam o calcário das Pirâmides como amplificador. Blocos flutuantes de contenção começaram a bloquear a linha de tiro.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'leo',
        mood: 'surprised',
        text: 'Pousamos nas dunas de Gizé! O ar está vibrando como cordas de alaúde ao redor da Grande Pirâmide.'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Não é coincidência, Leo. Quem plantou essas esferas escolheu vértices exatos da malha telúrica da Terra. E atenção: há blocos minerais suspensos protegendo o núcleo!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Blocos rachados eu quebro no arpão; os maciços eu uso para calcular o ricochete. Hora de proteger a Esfinge!'
      }
    ],
    midComm: {
      speaker: 'heitor',
      mood: 'serious',
      text: 'Relatório do Cairo: a tempestade de areia está subindo. Quebre as barreiras frágeis para abrir espaço de manobra!'
    }
  },
  {
    levelId: 3,
    actNumber: 1,
    chapterTitle: 'Capítulo 03 · Curto-Circuito em Neo-Tóquio',
    journalSummary:
      'Sob a chuva néon de Tóquio, o autor do ataque invadiu nossa frequência de rádio pela primeira vez: o renegado astrofísico Barão Vesper.',
    introMusic: 'story_vesper',
    introLines: [
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Tóquio inteira está sofrendo picos de energia! As Esferas Prisma estão drenando os letreiros e o monotrilho da baía... Espere, alguém está invadindo nosso canal!'
      },
      {
        speaker: 'vesper',
        mood: 'smirk',
        text: 'Ora, ora... Um biplano romântico tentando costurar o futuro com cabos de aço? Que espetáculo deliciosamente obsoleto.'
      },
      {
        speaker: 'maya',
        mood: 'surprised',
        text: 'Essa voz... Doutor Julian Vesper?! Você desapareceu após o cancelamento do Projeto Olimpo há seis anos!'
      },
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Chame-me de Barão Vesper, cara Dra. Lin. A Terra desperdiça energia demais em suas luzes de néon. Minhas Esferas apenas... recolhem o tributo para um mundo superior.'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Pois avise seu mundo superior que o tributo foi cancelado, Vesper! Acelerando entre os arranha-céus!'
      }
    ],
    midComm: {
      speaker: 'vesper',
      mood: 'smirk',
      text: 'Admirável reflexo sob a chuva ácida, aviador... mas esta é apenas uma fração da minha sinfonia!'
    }
  },
  {
    levelId: 4,
    actNumber: 1,
    chapterTitle: 'Capítulo 04 · Aurora sobre o Matterhorn',
    journalSummary:
      'Nos Alpes Suíços, uma aurora artificial provocada pela rede de Vesper ameaçava soterrar o viaduto alpino. O gelo exigiu precisão cirúrgica.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'leo',
        mood: 'surprised',
        text: 'Brrr! Do vapor de néon direto para o frio suíço! Aquela aurora verde sobre o Matterhorn é natural, Maya?'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Negativo! É vazamento magnético da rede do Vesper. Se essas duas esferas gigantes entrarem em ressonância, provocarão uma avalanche sobre o expresso alpino!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Ninguém estraga a viagem daquele trem enquanto o Falcão estiver na pista. Segure meu chocolate quente!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'happy',
      text: 'Se encontrar o Cabo Fixo, prenda-o na viga central de gelo sobre o viaduto — ele fatia as bolhas automaticamente!'
    }
  },
  {
    levelId: 5,
    actNumber: 1,
    chapterTitle: 'Capítulo 05 · Maré Prisma no Caribe',
    journalSummary:
      'Cruzamos o Atlântico rumo a uma baía caribenha onde anomalias gravitacionais estavam fervendo os recifes de coral e alterando as marés.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'heitor',
        mood: 'determined',
        text: 'Bom trabalho na Europa Central, equipe! Mas um vórtice tropical acabou de despertar sobre o arquipélago do Caribe.'
      },
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Sol dourado, mar turquesa e brisa nas palmeiras... Se não fossem três esferas explosivas quicando sobre o píer, seriam férias perfeitas!'
      },
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'Aproveite a visibilidade limpa, Leo. Precisamos recolher amostras dessa maré energética para prever o próximo passo do Vesper.'
      }
    ],
    midComm: {
      speaker: 'leo',
      mood: 'happy',
      text: 'Ouviu esse ritmo de steelpan no rádio? Até estourar plasma fica mais leve no Caribe!'
    }
  },
  {
    levelId: 6,
    actNumber: 1,
    chapterTitle: 'Capítulo 06 · O Segredo do Templo Dourado',
    journalSummary:
      'No coração da selva asiática, defendemos as torres sagradas do Templo Dourado e recuperamos o primeiro fragmento cristalino com coordenadas interplanetárias.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Chegamos ao fechamento do primeiro anel energético: o Templo Dourado. As piras sagradas estão queimando em frequência harmônica com as esferas!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Cinco plataformas de pedra antiga cercando o pátio... O Vesper montou uma verdadeira fortaleza aqui.'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Derrube todas elas, Leo! Se conseguirmos o núcleo residual intacto, saberei exatamente para onde toda essa energia está sendo enviada!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'surprised',
      text: 'As brasas do templo estão subindo ao contrário! Mantenha o centro da arena sob controle!'
    },
    outroMusic: 'story_mystery',
    outroLines: [
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Última esfera neutralizada! E olha só o que caiu no altar: um cristal facetado que ainda pulsa como uma bússola.'
      },
      {
        speaker: 'maya',
        mood: 'surprised',
        text: 'Pelos céus... Leo, a telemetria desse cristal não aponta para nenhuma base na Terra. Ele está mirando um ponto além da órbita lunar — mas antes precisa carregar o Meridiano das Américas!'
      },
      {
        speaker: 'heitor',
        mood: 'urgent',
        text: 'Confirmado, Maya! Minha terra natal está sob ataque agora mesmo. Esferas Prisma sobre a Baía de Guanabara! Rumo ao Rio de Janeiro, imediatamente!'
      }
    ]
  },

  // =========================================================================
  // ATO II (FASES 7 - 13)
  // =========================================================================
  {
    levelId: 7,
    actNumber: 2,
    chapterTitle: 'Capítulo 07 · Redentor sob Fogo Cruzado',
    journalSummary:
      'Abrimos o Ato das Américas no Rio de Janeiro, protegendo o bondinho do Pão de Açúcar e o calçadão de Copacabana sob um entardecer eletrizante.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'heitor',
        mood: 'determined',
        text: 'Bem-vindos ao Rio de Janeiro, Esquadrão! O bondinho do Pão de Açúcar está retido nos cabos e há esferas quicando sobre o calçadão de Copacabana!'
      },
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Que visual espetacular, Comandante! Com o Cristo Redentor lá no alto vigiando a baía, não podemos errar um único disparo.'
      },
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'Recalibrei o compressor do seu arpão para resposta rápida, Falcão. Mostre ao Vesper como o Brasil recebe invasores!'
      }
    ],
    midComm: {
      speaker: 'heitor',
      mood: 'happy',
      text: 'Isso aí, garoto! O pessoal na praia até abriu espaço no calçadão para aplaudir!'
    }
  },
  {
    levelId: 8,
    actNumber: 2,
    chapterTitle: 'Capítulo 08 · Pulso Noturno na Paulista',
    journalSummary:
      'Em São Paulo, Vesper tentou drenar a subestação da Ponte Estaiada e as antenas da Avenida Paulista durante a madrugada.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Sem descanso! Vesper redirecionou a sobrecarga para a malha metropolitana de São Paulo. Os cabos de LED da Ponte Estaiada estão oscilando descontroladamente!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Helicópteros de reportagem no céu, vão livre do MASP à esquerda... A selva de pedra nunca dorme, e hoje nós também não!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'determined',
      text: 'Use o corredor entre as duas plataformas blindadas para fatiar as bolhas gêmeas!'
    }
  },
  {
    levelId: 9,
    actNumber: 2,
    chapterTitle: 'Capítulo 09 · Compasso de Aço em La Boca',
    journalSummary:
      'Em Buenos Aires, um pilar magnético dividiu a arena exatamente ao meio diante do Obelisco, exigindo movimentação em dois flancos.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'leo',
        mood: 'surprised',
        text: 'Olha as cores de Caminito em Buenos Aires! Mas tem um pilar maciço dividindo a praça bem na frente do Obelisco!'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'É uma armadilha tática do Vesper: ele isolou a arena em dois hemisférios para impedir você de cruzar direto. Você terá de dançar conforme o compasso do tango!'
      },
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Dois pra lá, dois pra cá e arpão pro alto! Vamos nessa!'
      }
    ],
    midComm: {
      speaker: 'leo',
      mood: 'determined',
      text: 'Esse pilar central não me segura — vou limpar um lado de cada vez!'
    }
  },
  {
    levelId: 10,
    actNumber: 2,
    chapterTitle: 'Capítulo 10 · Ecos dos Incas nos Andes',
    journalSummary:
      'Acima das nuvens em Machu Picchu, descobrimos entalhes astronômicos que provam que o antigo reator marciano já interagiu com os céus da Terra milênios atrás.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'maya',
        mood: 'surprised',
        text: 'Arrepiante... Aqui no alto de Machu Picchu, o relógio solar Intihuatana está emitindo um contra-pulso natural que retarda a drenagem do Vesper!'
      },
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Observadora brilhante como sempre, Dra. Lin. Os antigos astrônomos andinos viram o brilho rubro de Marte quando o Núcleo Olímpico adormeceu.'
      },
      {
        speaker: 'leo',
        mood: 'serious',
        text: 'Então é isso que você está tentando ligar lá fora? À custa da atmosfera inteira da Terra?!'
      },
      {
        speaker: 'vesper',
        mood: 'smirk',
        text: 'Toda grande alvorada exige combustível, Sr. Vance. Vejamos se seu fôlego resiste ao ar rarefeito da cordilheira!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'urgent',
      text: 'Proteja os terraços incas, Leo! Não deixe o Vesper silenciar a pedra solar!'
    }
  },
  {
    levelId: 11,
    actNumber: 2,
    chapterTitle: 'Capítulo 11 · Brisa Quente no Malecón',
    journalSummary:
      'Em La Habana, enfrentamos uma formação rápida de quatro esferas simultâneas à beira do paredão marítimo de Cuba.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Sobrevoando o Malecón em La Habana! Carros clássicos desfilando lá embaixo e o farol do Morro piscando no horizonte.'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Atenção redobrada, Falcão: são quatro Esferas Prisma médias já em velocidade alta logo na largada!'
      }
    ],
    midComm: {
      speaker: 'heitor',
      mood: 'determined',
      text: 'Ritmo acelerado! Um Arpão Duplo faz milagres contra formações múltiplas!'
    }
  },
  {
    levelId: 12,
    actNumber: 2,
    chapterTitle: 'Capítulo 12 · Tudo ou Nada em Las Vegas',
    journalSummary:
      'No deserto de Nevada, Vesper transformou os holofotes e fontes da Strip de Las Vegas num salão de espelhos eletromagnéticos.',
    introMusic: 'story_vesper',
    introLines: [
      {
        speaker: 'vesper',
        mood: 'smirk',
        text: 'Bem-vindos a Las Vegas, meus persistentes convidados! Que tal dobrarmos a aposta sob o feixe da pirâmide de obsidiana?'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'A casa nem sempre vence quando o Esquadrão Pang entra na mesa, Barão!'
      }
    ],
    midComm: {
      speaker: 'leo',
      mood: 'happy',
      text: 'As fontes dançantes estão subindo no ritmo dos nossos combos!'
    }
  },
  {
    levelId: 13,
    actNumber: 2,
    chapterTitle: 'Capítulo 13 · Meia-Noite em Manhattan',
    journalSummary:
      'Encerramos a campanha americana em Nova Iorque, salvando a Estátua da Liberdade e capturando o decodificador orbital de Vesper no topo do Empire State.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'heitor',
        mood: 'urgent',
        text: 'Alerta máximo em Nova Iorque! A antena do Empire State está servindo de torre de transmissão para todo o Atlântico Norte!'
      },
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'Leo, se derrubarmos este nodo sobre a Ponte do Brooklyn, libertamos todo o continente americano de uma só vez!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Pela tocha da Liberdade — vamos apagar o sinal desse Barão agora mesmo!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'determined',
      text: 'Falta pouco para libertar o Meridiano Oeste! Use a cobertura da ponte central!'
    },
    outroMusic: 'story_heroic',
    outroLines: [
      {
        speaker: 'heitor',
        mood: 'happy',
        text: 'Sensacional! As redes elétricas do Rio a Nova Iorque acabaram de estabilizar! As Américas estão livres!'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Consegui decodificar o destino final do feixe: Monte Olimpo, Marte! Mas Comandante... nosso avião Albatroz não voa no vácuo do espaço!'
      },
      {
        speaker: 'heitor',
        mood: 'determined',
        text: 'Deixe isso comigo, doutora. Temos uma base aeroespacial secreta em Honolulu com o protótipo Estrela Polar. Enquanto eu preparo o foguete no Pacífico, segurem o Barão Vesper na Europa!'
      }
    ]
  },

  // =========================================================================
  // ATO III (FASES 14 - 17)
  // =========================================================================
  {
    levelId: 14,
    actNumber: 3,
    chapterTitle: 'Capítulo 14 · Sol e Granito em Madri',
    journalSummary:
      'Cruzamos o Atlântico até a Puerta de Alcalá, em Madri, onde esferas velozes flanqueavam as gigantes sob o sol ibérico.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Chegamos à Europa! Os arcos da Puerta de Alcalá e a fonte de Cibeles estão cercados por esferas duplas.'
      },
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Vesper sabe que perdemos zero tempo nas Américas, então misturou esferas pequenas hipervelozes junto com as gigantes. Olhos bem abertos!'
      }
    ],
    midComm: {
      speaker: 'leo',
      mood: 'determined',
      text: 'Olé! Passou raspando pelo meu cachecol!'
    }
  },
  {
    levelId: 15,
    actNumber: 3,
    chapterTitle: 'Capítulo 15 · Badaladas sob a Chuva de Londres',
    journalSummary:
      'Às margens do Tâmisa, sob garoa cerrada e diante do Big Ben e da London Eye, rompemos a barreira blindada britânica.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Chuva fina sobre Londres e neblina baixa no Tâmisa. As Esferas Prisma estão sincronizadas com o pêndulo do Big Ben!'
      },
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Pontualidade britânica? Então vamos terminar antes da próxima badalada do relógio!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'happy',
      text: 'Quebre as comportas centrais da ponte para abrir linha direta até o topo!'
    }
  },
  {
    levelId: 16,
    actNumber: 3,
    chapterTitle: 'Capítulo 16 · Arena Eterna em Roma',
    journalSummary:
      'No Coliseu de Roma, enfrentamos quatro grandes esferas simultâneas numa verdadeira arena de gladiadores modernos.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'vesper',
        mood: 'smirk',
        text: 'Quatro colossos saltando diante do Coliseu de Roma! Diga-me, aviador: você sente o peso dos antigos gladiadores na arena?'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'A diferença, Vesper, é que hoje a plateia inteira da Cidade Eterna está torcendo contra o imperador!'
      }
    ],
    midComm: {
      speaker: 'heitor',
      mood: 'urgent',
      text: 'Quatro frentes ativas em Roma! Se cair uma Dinamite ou Relógio Crono, não hesite!'
    }
  },
  {
    levelId: 17,
    actNumber: 3,
    chapterTitle: 'Capítulo 17 · Nevasca Vermelha em Moscou',
    journalSummary:
      'Diante das cúpulas coloridas da Catedral de São Basílio em Moscou, desativamos o hub europeu sob intensa nevasca, forçando Vesper a recuar para o Oriente.',
    introMusic: 'story_vesper',
    introLines: [
      {
        speaker: 'leo',
        mood: 'serious',
        text: 'Nevasca pesada na Praça Vermelha! As cúpulas de São Basílio brilham como joias no escuro, mas o frio quase congela o gatilho!'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Este é o último bastião europeu da rede, Leo! A estrutura de blocos forma uma pirâmide invertida — use os vãos laterais!'
      }
    ],
    midComm: {
      speaker: 'vesper',
      mood: 'serious',
      text: 'Inútil! Mesmo sem a Europa, a carga acumulada no Oriente bastará para incendiar o céu de Marte!'
    },
    outroMusic: 'story_vesper',
    outroLines: [
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'A Europa inteira respira aliviada! Mas Vesper falou sério: ele concentrou 80% da potência restante entre a Índia, a China e o Pacífico!'
      },
      {
        speaker: 'heitor',
        mood: 'determined',
        text: 'Notícia boa do Havaí, equipe: o foguete Estrela Polar já está na rampa de Honolulu e o traje espacial do Leo ficou pronto! Abram caminho pela Ásia até o Pacífico!'
      }
    ]
  },

  // =========================================================================
  // ATO IV (FASES 18 - 22)
  // =========================================================================
  {
    levelId: 18,
    actNumber: 4,
    chapterTitle: 'Capítulo 18 · Espelho de Mármore em Nova Délhi',
    journalSummary:
      'Nos jardins e espelhos d’água do Taj Mahal, dissipamos a tríade de esferas solares que distorcia a luz indiana.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'maya',
        mood: 'happy',
        text: 'Veja como o mármore branco do Taj Mahal reflete o alvorecer... Não podemos deixar as esferas racharem os minaretes!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Precisão máxima sobre o espelho d’água. Contagem regressiva para Honolulu iniciada!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'determined',
      text: 'A plataforma suspensa acima da piscina reflete o ângulo perfeito para combos!'
    }
  },
  {
    levelId: 19,
    actNumber: 4,
    chapterTitle: 'Capítulo 19 · Lanternas sobre o Chao Phraya',
    journalSummary:
      'Em Bangcoc, centenas de lanternas flutuantes iluminaram nossa batalha noturna diante das torres douradas do Wat Arun.',
    introMusic: 'story_mystery',
    introLines: [
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Olha quantas lanternas subindo pelo rio Chao Phraya em Bangcoc! Parece que a cidade inteira acendeu luzes para guiar nosso voo.'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Quatro esferas cruzando sobre os degraus indestrutíveis do templo Wat Arun! Mantenha o ritmo constante, Falcão!'
      }
    ],
    midComm: {
      speaker: 'leo',
      mood: 'determined',
      text: 'Entre as lanternas e os barcos — nenhum fragmento escapa hoje!'
    }
  },
  {
    levelId: 20,
    actNumber: 4,
    chapterTitle: 'Capítulo 20 · A Muralha do Dragão em Beijing',
    journalSummary:
      'Entre a Cidade Proibida e a Grande Muralha da China, quebramos a linha imperial de três esferas gigantes de Vesper.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'maya',
        mood: 'serious',
        text: 'Fase 20: Beijing! Vesper alinhou três esferas colossais sobre o Portão da Harmonia Suprema e a Grande Muralha!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Uma muralha de blocos bem no meio do céu? Vamos abrir brechas nas peças douradas e domar esse dragão!'
      }
    ],
    midComm: {
      speaker: 'heitor',
      mood: 'determined',
      text: 'Faltam apenas duas escalas até a rampa de lançamento! Aguente firme, Falcão!'
    }
  },
  {
    levelId: 21,
    actNumber: 4,
    chapterTitle: 'Capítulo 21 · Sinfonia na Baía de Sydney',
    journalSummary:
      'Diante das velas brancas da Opera House e da Harbour Bridge em Sydney, fogos de artifício celebraram a libertação do hemisfério sul.',
    introMusic: 'story_heroic',
    introLines: [
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'Vento oceânico batendo nas velas da Opera House de Sydney! A Austrália já preparou até fogos de artifício na baía!'
      },
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'Só soltamos os fogos de verdade depois de limpar essas quatro esferas sobre a ponte metálica, piloto!'
      }
    ],
    midComm: {
      speaker: 'leo',
      mood: 'happy',
      text: 'Guitarra surf rock no talo e arpão afiado — segura essa onda!'
    }
  },
  {
    levelId: 22,
    actNumber: 4,
    chapterTitle: 'Capítulo 22 · Contagem Regressiva em Honolulu',
    journalSummary:
      'Vesper lançou um ataque desesperado contra Waikiki e Diamond Head para impedir a decolagem do foguete Estrela Polar — mas libertamos o céu da Terra e partimos rumo às estrelas!',
    introMusic: 'story_vesper',
    introLines: [
      {
        speaker: 'heitor',
        mood: 'urgent',
        text: 'Leo! Vesper descobriu nossa base espacial oculta atrás da cratera de Diamond Head, em Honolulu! Ele despejou três gigantes para travar a janela de lançamento!'
      },
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Acham mesmo que permitirei que um piloto da Terra atravesse o céu que governei? Suas asas terminam nas ondas do Havaí!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Minhas asas só estão trocando de motor, Vesper! Maya, aqueça os propulsores do Estrela Polar — eu vou abrir essa janela de lançamento na marra!'
      }
    ],
    midComm: {
      speaker: 'heitor',
      mood: 'urgent',
      text: 'Propulsores em 90%! Limpe o céu do Havaí para autorizarmos a ignição!'
    },
    outroMusic: 'story_space',
    outroLines: [
      {
        speaker: 'maya',
        mood: 'happy',
        text: 'CÉUS DA TERRA 100% LIVRES! Todas as vinte e duas âncoras terrestres foram destruídas!'
      },
      {
        speaker: 'aria',
        mood: 'determined',
        text: 'Saudações, Piloto Leo Vance. Aqui é ARIA-7, inteligência embarcada da nave Estrela Polar. Seu traje pressurizado e capacete esférico já foram selados.'
      },
      {
        speaker: 'heitor',
        mood: 'determined',
        text: 'Ignição principal autorizada! Deus acompanhe seu voo além da gravidade, Falcão. Próxima parada: Mar da Tranquilidade, Lua!'
      }
    ]
  },

  // =========================================================================
  // ATO V (FASES 23 - 24 + EPÍLOGO)
  // =========================================================================
  {
    levelId: 23,
    actNumber: 5,
    chapterTitle: 'Capítulo 23 · Silêncio Prateado na Lua',
    journalSummary:
      'Em baixa gravidade lunar (0.62g), com a Terra azul girando no horizonte, destruímos a antena retransmissora de Vesper no Mar da Tranquilidade.',
    introMusic: 'story_space',
    introLines: [
      {
        speaker: 'leo',
        mood: 'surprised',
        text: 'Uau... Olha a Terra inteira brilhando lá no fundo, Maya! Toda azul e sem nenhuma névoa eletromagnética.'
      },
      {
        speaker: 'aria',
        mood: 'serious',
        text: 'Aviso de física orbital: gravidade local em 62% do padrão terrestre. As Esferas Prisma flutuarão em arcos longos e lentos sobre as crateras.'
      },
      {
        speaker: 'maya',
        mood: 'determined',
        text: 'Destrua o retransmissor lunar, Leo! Assim cortaremos o escudo externo da cidadela de Vesper em Marte!'
      }
    ],
    midComm: {
      speaker: 'aria',
      mood: 'determined',
      text: 'Trajetória balística lunar nominal. Aproveite o tempo extra de suspensão das esferas!'
    }
  },
  {
    levelId: 24,
    actNumber: 5,
    chapterTitle: 'Capítulo Final · Tempestade sob o Monte Olimpo',
    journalSummary:
      'No coração da tempestade carmesim de Marte, Leo enfrentou a Matriz Suprema de Barão Vesper, impedindo o colapso interplanetário e coroando a maior viagem da história.',
    introMusic: 'story_vesper',
    introLines: [
      {
        speaker: 'aria',
        mood: 'urgent',
        text: 'Pouso confirmado em Valles Marineris, Marte! Ventos de óxido de ferro a 140 km/h. Gravidade em 0.75g. O Monte Olimpo está em ignição!'
      },
      {
        speaker: 'vesper',
        mood: 'serious',
        text: 'Inacreditável... Você realmente cruzou continentes, oceanos e o próprio vácuo espacial com esse arpão! Contemple minha Matriz Suprema Prisma!'
      },
      {
        speaker: 'maya',
        mood: 'urgent',
        text: 'Vesper, pare agora! O Núcleo Olímpico está instável — se essas quatro esferas entrarem em fusão, racharão a crosta de Marte e lançarão detritos contra a Terra!'
      },
      {
        speaker: 'vesper',
        mood: 'urgent',
        text: 'Tarde demais para recuar, Dra. Lin! A matriz já assumiu controle autônomo! Nem eu consigo desligá-la!'
      },
      {
        speaker: 'leo',
        mood: 'determined',
        text: 'Então segure firme no seu observatório, Barão, porque o Esquadrão Pang veio salvar DOIS planetas pelo preço de uma passagem! ARPÃO MÁXIMO!'
      }
    ],
    midComm: {
      speaker: 'maya',
      mood: 'urgent',
      text: 'É o confronto final, Leo! Tudo o que aprendemos nos 24 destinos depende deste disparo!'
    },
    outroMusic: 'story_epilogue',
    outroLines: [
      {
        speaker: 'aria',
        mood: 'happy',
        text: 'Fusão contida! Pressão sísmica do Monte Olimpo caindo para níveis seguros. A Matriz Suprema Prisma foi totalmente dissipada!'
      },
      {
        speaker: 'vesper',
        mood: 'surprised',
        text: 'A tempestade... abriu. Olhem a luz dourada refletindo nos cânions de Marte... Eu passei anos tentando forçar um milagre e quase destruí dois mundos.'
      },
      {
        speaker: 'heitor',
        mood: 'happy',
        text: 'E terá muito tempo para ajudar a reconstruir as estações científicas sob custódia da Aegis, Vesper! Falcão, Maya... o planeta inteiro está em festa nas ruas!'
      },
      {
        speaker: 'maya',
        mood: 'happy',
        text: 'Do Monte Fuji até Marte sem perder a pose, hein, Leo? O diário de voo do seu avô acaba de ganhar o capítulo mais lendário da história!'
      },
      {
        speaker: 'leo',
        mood: 'happy',
        text: 'E quem disse que acabou, doutora? Ouvi dizer que as luas de Júpiter têm uma gravidade ótima para testar um Arpão Triplo... Câmbio final, Esquadrão Pang!'
      }
    ]
  }
];

const STORY_SAVE_KEY = 'super_pang_world_tour_story_v1';

export interface StorySaveState {
  unlockedStageIndex: number;
  currentStageIndex: number;
  storyScore: number;
  completed: boolean;
}

export function loadStoryProgress(): StorySaveState {
  try {
    const raw = localStorage.getItem(STORY_SAVE_KEY);
    if (!raw) {
      return { unlockedStageIndex: 0, currentStageIndex: 0, storyScore: 0, completed: false };
    }
    const parsed = JSON.parse(raw) as Partial<StorySaveState>;
    return {
      unlockedStageIndex: Math.max(0, Math.min(23, Number(parsed.unlockedStageIndex) || 0)),
      currentStageIndex: Math.max(0, Math.min(23, Number(parsed.currentStageIndex) || 0)),
      storyScore: Math.max(0, Number(parsed.storyScore) || 0),
      completed: Boolean(parsed.completed)
    };
  } catch {
    return { unlockedStageIndex: 0, currentStageIndex: 0, storyScore: 0, completed: false };
  }
}

export function saveStoryProgress(state: StorySaveState): void {
  try {
    localStorage.setItem(STORY_SAVE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function buildStoryCutscene(
  levelIndex: number,
  kind: 'intro' | 'outro',
  stageName: string,
  stageCountry: string,
  stageFlag: string
): StoryCutsceneDef | null {
  const entry = STAGE_STORY_SCRIPT[levelIndex];
  if (!entry) return null;
  const act = STORY_ACTS.find((a) => a.actNumber === entry.actNumber) || STORY_ACTS[0];
  const lines = kind === 'intro' ? entry.introLines : entry.outroLines;
  if (!lines || lines.length === 0) return null;

  return {
    id: `stage_${entry.levelId}_${kind}`,
    actNumber: act.actNumber,
    actTitle: act.title,
    chapterTitle: kind === 'outro' && levelIndex === 23 ? 'Epílogo · Dois Mundos em Paz' : entry.chapterTitle,
    locationLabel: `${stageFlag} ${stageName} — ${stageCountry}`,
    musicMood: (kind === 'outro' && entry.outroMusic) ? entry.outroMusic : entry.introMusic,
    lines
  };
}

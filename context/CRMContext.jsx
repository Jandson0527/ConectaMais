'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const CRMContext = createContext(null);

const STORAGE_KEY = 'conecta_mais_store_v10';

export const INITIAL_PLANS = [
  {
    id: 'plan-presenca',
    name: 'Plano Presença',
    badge: '⭐',
    tvs: 1,
    monthlyPrice: 99.90,
    quarterlyPrice: 250.00,
    changesPerMonth: 1,
    color: '#00b4d8',
    tagline: 'Presença essencial para pequenos negócios',
    description: '1 TV • 1 alteração de anúncio por mês • R$ 99,90/mês ou R$ 250,00 trimestral'
  },
  {
    id: 'plan-destaque',
    name: 'Plano Destaque',
    badge: '🔥',
    tvs: 2,
    monthlyPrice: 149.90,
    quarterlyPrice: 390.00,
    changesPerMonth: 1,
    color: '#0077b6',
    tagline: 'Dupla visibilidade e maior repetição',
    description: '2 TVs • 1 alteração de anúncio por mês • R$ 149,90/mês ou R$ 390,00 trimestral'
  },
  {
    id: 'plan-alcance',
    name: 'Plano Alcance',
    badge: '🚀',
    tvs: 3,
    monthlyPrice: 199.90,
    quarterlyPrice: 520.00,
    changesPerMonth: 1,
    color: '#2563eb',
    tagline: 'Expansão em múltiplos pontos de alto tráfego',
    description: '3 TVs • 1 alteração de anúncio por mês • R$ 199,90/mês ou R$ 520,00 trimestral'
  },
  {
    id: 'plan-impacto',
    name: 'Plano Impacto',
    badge: '💥',
    tvs: 4,
    monthlyPrice: 249.90,
    quarterlyPrice: 650.00,
    changesPerMonth: 1,
    color: '#f59e0b',
    tagline: 'Forte presença e alto poder de conversão',
    description: '4 TVs • 1 alteração de anúncio por mês • R$ 249,90/mês ou R$ 650,00 trimestral'
  },
  {
    id: 'plan-conecta',
    name: 'Plano Conecta',
    badge: '👑',
    tvs: 5,
    monthlyPrice: 299.90,
    quarterlyPrice: 780.00,
    changesPerMonth: 2,
    isPopular: true,
    color: '#fbbf24',
    tagline: '5 TVs da rede • Maior alcance e 2 trocas mensais',
    description: '5 TVs da nossa rede • 2 alterações de anúncio/mês • Maior alcance na rede • R$ 299,90/mês ou R$ 780,00 trimestral'
  },
  {
    id: 'plan-avulso-15',
    name: 'Avulso — 15 Dias',
    badge: '🎯',
    tvs: 5,
    fixedPrice: 79.90,
    periodDays: 15,
    changesPerMonth: 0,
    isCampaign: true,
    color: '#10b981',
    tagline: 'Promoção, inauguração, evento ou data comemorativa',
    description: 'Campanha de 15 dias sem fidelidade nas 5 TVs • R$ 79,90'
  },
  {
    id: 'plan-avulso-30',
    name: 'Avulso — 30 Dias',
    badge: '🎯',
    tvs: 5,
    fixedPrice: 129.90,
    periodDays: 30,
    changesPerMonth: 1,
    isCampaign: true,
    color: '#10b981',
    tagline: 'Divulgação intensiva por 30 dias',
    description: 'Campanha de 30 dias sem fidelidade nas 5 TVs • 1 alteração • R$ 129,90'
  },
  {
    id: 'plan-custom',
    name: 'Personalizado',
    badge: '⚙️',
    tvs: 1,
    monthlyPrice: 150.00,
    description: 'Valores ou condições customizadas'
  }
];

// Helper: Calcular data de vencimento a partir da data de pagamento e ciclo
export function computeDueDate(paymentDateStr, billingCycle = 'monthly', planId = 'plan-conecta') {
  if (!paymentDateStr) {
    paymentDateStr = new Date().toISOString().split('T')[0];
  }
  const dateParts = paymentDateStr.split('-');
  const baseDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

  if (billingCycle === 'quarterly') {
    baseDate.setMonth(baseDate.getMonth() + 3);
  } else if (billingCycle === 'campaign') {
    if (planId === 'plan-avulso-15') {
      baseDate.setDate(baseDate.getDate() + 15);
    } else {
      baseDate.setDate(baseDate.getDate() + 30);
    }
  } else {
    // monthly default
    baseDate.setMonth(baseDate.getMonth() + 1);
  }

  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, '0');
  const d = String(baseDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Helper: Próxima data de repasse de comissão (Todo dia 10 de cada mês)
export function getNextCommissionPayoutDate(baseDate = new Date()) {
  const currentYear = baseDate.getFullYear();
  const currentMonth = baseDate.getMonth();
  const currentDay = baseDate.getDate();

  let targetYear = currentYear;
  let targetMonth = currentMonth;

  // Se já passou do dia 10 deste mês, o próximo repasse é no dia 10 do mês seguinte
  if (currentDay > 10) {
    targetMonth += 1;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
  }

  const payoutDate = new Date(targetYear, targetMonth, 10);
  payoutDate.setHours(0, 0, 0, 0);

  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);

  const diffTime = payoutDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = `10/${String(targetMonth + 1).padStart(2, '0')}/${targetYear}`;
  const isoDate = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-10`;

  return {
    date: payoutDate,
    isoDate,
    formattedDate,
    diffDays,
    isToday: diffDays === 0,
    text: diffDays === 0
      ? 'Repasse é Hoje (Dia 10)!'
      : (diffDays === 1 ? 'Repasse é Amanhã (Dia 10)!' : `Em ${diffDays} dias (${formattedDate})`)
  };
}

export const INITIAL_SEED_DATA = {
  users: [
    {
      id: 'usr-1',
      name: 'Jandson',
      email: 'jandson@conectamais.com.br',
      password: 'conecta123',
      role: 'admin',
      roleName: 'Sócio Diretor (Acesso Total)',
      phone: '(11) 98111-2233',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      active: true
    },
    {
      id: 'usr-2',
      name: 'Thiago',
      email: 'thiago@conectamais.com.br',
      password: 'conecta123',
      role: 'manager',
      roleName: 'Sócio & Gestor Comercial',
      phone: '(11) 97222-3344',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      active: true
    },
    {
      id: 'usr-3',
      name: 'Daniele',
      email: 'daniele@conectamais.com.br',
      password: 'conecta123',
      role: 'closer',
      roleName: 'Sócia & Executiva de Vendas',
      phone: '(11) 96333-4455',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      active: true
    },
    {
      id: 'usr-4',
      name: 'Damares',
      email: 'damares@conectamais.com.br',
      password: 'conecta123',
      role: 'closer',
      roleName: 'Sócia & SDR Estratégica',
      phone: '(11) 95444-5566',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      active: true
    },
    {
      id: 'usr-5',
      name: 'Luciano Silva',
      email: 'luciano@conectamais.com.br',
      password: 'conecta123',
      role: 'vendedor',
      roleName: 'Vendedor Comercial (Comissão 10% Recorrente)',
      phone: '(11) 94777-8899',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      active: true,
      commissionRate: 0.10
    }
  ],
  screens: [
    {
      id: 'scr-1',
      name: 'Clínica Rey',
      segment: 'Clínica Médica & Saúde',
      address: 'Av. Principal, 450 - Centro',
      neighborhood: 'Centro',
      city: 'São Paulo - SP',
      tvsCount: 1,
      status: 'active',
      audienceEst: '3.800 pessoas/mês',
      notes: 'Ponto de alta atenção na recepção e sala de espera. Público adulto e familiar.',
      installedAt: '2026-01-15'
    },
    {
      id: 'scr-2',
      name: "Barbearia Men's Prime",
      segment: 'Barbearia & Estética Masculina',
      address: 'Rua das Palmeiras, 120 - Jardins',
      neighborhood: 'Jardins',
      city: 'São Paulo - SP',
      tvsCount: 1,
      status: 'active',
      audienceEst: '2.900 pessoas/mês',
      notes: 'Público masculino de alto poder aquisitivo. Tempo médio de visualização: 30 minutos.',
      installedAt: '2026-02-01'
    },
    {
      id: 'scr-3',
      name: 'Academia AC Fitness',
      segment: 'Academia & Saúde',
      address: 'Av. dos Esportes, 890 - Vila Nova',
      neighborhood: 'Vila Nova',
      city: 'São Paulo - SP',
      tvsCount: 1,
      status: 'active',
      audienceEst: '5.400 pessoas/mês',
      notes: 'Posicionada na área principal de cardio e musculação. Tráfego contínuo manhã e noite.',
      installedAt: '2026-02-10'
    },
    {
      id: 'scr-4',
      name: 'Academia Centenário',
      segment: 'Academia & Fitness',
      address: 'Rua do Centenário, 330 - Jardim Centenário',
      neighborhood: 'Jardim Centenário',
      city: 'São Paulo - SP',
      tvsCount: 1,
      status: 'active',
      audienceEst: '4.700 pessoas/mês',
      notes: 'Instalada na recepção e catracas de entrada de alunos. Alta taxa de repetição diária.',
      installedAt: '2026-03-05'
    },
    {
      id: 'scr-5',
      name: 'Academia PowerFit',
      segment: 'Academia & Treinamento',
      address: 'Av. Paulista Sul, 1500 - Jardim América',
      neighborhood: 'Jardim América',
      city: 'São Paulo - SP',
      tvsCount: 1,
      status: 'active',
      audienceEst: '6.200 pessoas/mês',
      notes: 'Tela Full HD de 55 polegadas no salão de musculação. Excelente visibilidade geral.',
      installedAt: '2026-03-20'
    }
  ],
  leads: [
    {
      id: 'lead-101',
      name: 'Marcos Silveira',
      phone: '(11) 98765-4321',
      companyAddress: 'Av. das Nações, 1100 - Vila Mariana, São Paulo - SP',
      company: 'FitLife Centro de Treinamento',
      email: 'contato@fitlifesaude.com.br',
      role: 'Gerente Geral',
      value: 780.00,
      planId: 'plan-conecta',
      billingCycle: 'quarterly',
      mediaFormat: 'video',
      tvsCount: 5,
      selectedScreenIds: ['scr-1', 'scr-2', 'scr-3', 'scr-4', 'scr-5'],
      paymentDate: '2026-06-03',
      dueDate: '2026-09-03',
      priority: 'urgente',
      stage: 'ganho',
      origin: 'WhatsApp Direto',
      assignedTo: 'usr-1',
      tags: ['Academia', '5 TVs', 'Vídeo Motion', 'Trimestral', 'Ativo'],
      notes: 'Fechou o Plano Conecta Trimestral Antecipado para veicular vídeo de 15s nas 5 telas da rede.',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'lead-102',
      name: 'Rodrigo Medeiros',
      phone: '(19) 98888-7766',
      companyAddress: 'Rua do Comércio, 500 - Centro, São Paulo - SP',
      company: 'Rede Bom Preço Alimentos',
      email: 'comercial@bompreco.com.br',
      role: 'Diretor de Marketing',
      value: 299.90,
      planId: 'plan-conecta',
      billingCycle: 'monthly',
      mediaFormat: 'foto',
      tvsCount: 5,
      selectedScreenIds: ['scr-1', 'scr-2', 'scr-3', 'scr-4', 'scr-5'],
      paymentDate: '2026-08-31',
      dueDate: '2026-09-30',
      priority: 'alta',
      stage: 'ganho',
      origin: 'Indicação',
      assignedTo: 'usr-2',
      tags: ['Varejo', 'Supermercado', '5 TVs', 'Foto Encarte', 'Recorrente'],
      notes: 'Assinatura mensal ativa no Plano Conecta com 2 trocas mensais de encarte de ofertas em foto.',
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
    },
    {
      id: 'lead-103',
      name: 'Dra. Juliana Ribeiro',
      phone: '(21) 99555-4433',
      companyAddress: 'Av. Paulista, 2000 - Cj 82 - Bela Vista, São Paulo - SP',
      company: 'OdontoPrime Estética & Implantes',
      email: 'juliana@odontoprime.com.br',
      role: 'Sócia Proprietária',
      value: 390.00,
      planId: 'plan-destaque',
      billingCycle: 'quarterly',
      mediaFormat: 'video',
      tvsCount: 2,
      selectedScreenIds: ['scr-1', 'scr-2'],
      paymentDate: '2026-08-31',
      dueDate: '2026-11-30',
      priority: 'media',
      stage: 'proposta',
      origin: 'Meta Ads (FB/IG)',
      assignedTo: 'usr-3',
      tags: ['Odontologia', '2 TVs', 'Vídeo', 'Trimestral'],
      notes: 'Interessada no Plano Destaque Trimestral (2 TVs na Clínica Rey e Barbearia Men\'s Prime) com vídeo institucional.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
    },
    {
      id: 'lead-104',
      name: 'Marcelo Rossi',
      phone: '(31) 97777-8899',
      companyAddress: 'Rua Augusta, 850 - Consolação, São Paulo - SP',
      company: 'Brasa Burguer Artesanal',
      email: 'brasa@brasaburguer.com.br',
      role: 'Proprietário',
      value: 650.00,
      planId: 'plan-impacto',
      billingCycle: 'quarterly',
      mediaFormat: 'ambos',
      tvsCount: 4,
      selectedScreenIds: ['scr-2', 'scr-3', 'scr-4', 'scr-5'],
      paymentDate: '2026-05-15',
      dueDate: '2026-08-15',
      priority: 'alta',
      stage: 'ganho',
      origin: 'Instagram',
      assignedTo: 'usr-1',
      tags: ['Gastronomia', '4 TVs', 'Foto + Vídeo', 'Trimestral', 'Vencido'],
      notes: 'Fechou o Plano Impacto Trimestral. Contrato venceu em 15/08, precisa renovar!',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
    },
    {
      id: 'lead-105',
      name: 'Camila Guimarães',
      phone: '(41) 99123-4567',
      companyAddress: 'Av. Brigadeiro Faria Lima, 450 - Pinheiros, São Paulo - SP',
      company: 'Farmácia Vida Longa',
      email: 'camila@vidalonga.com.br',
      role: 'Farmacêutica Responsável',
      value: 79.90,
      planId: 'plan-avulso-15',
      billingCycle: 'campaign',
      mediaFormat: 'foto',
      tvsCount: 5,
      selectedScreenIds: ['scr-1', 'scr-2', 'scr-3', 'scr-4', 'scr-5'],
      paymentDate: '2026-08-16',
      dueDate: '2026-08-31',
      priority: 'media',
      stage: 'ganho',
      origin: 'Visita Presencial',
      assignedTo: 'usr-4',
      tags: ['Farmácia', 'Avulso 15d', 'Foto', 'Inauguração', 'Vence Hoje'],
      notes: 'Campanha de 15 dias de inauguração vence hoje. Entrar em contato para oferecer renovação mensal.',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'lead-106',
      name: 'Gabriel Siqueira',
      phone: '(61) 98444-3322',
      companyAddress: 'Rua Domingos de Morais, 1300 - Vila Mariana, São Paulo - SP',
      company: 'CFC Piloto & Treinamento',
      email: 'gabriel@autoescolapiloto.com.br',
      role: 'Diretor Geral',
      value: 199.90,
      planId: 'plan-alcance',
      billingCycle: 'monthly',
      mediaFormat: 'video',
      tvsCount: 3,
      selectedScreenIds: ['scr-1', 'scr-3', 'scr-4'],
      paymentDate: '2026-08-31',
      dueDate: '2026-09-30',
      priority: 'urgente',
      stage: 'negociacao',
      origin: 'WhatsApp Direto',
      assignedTo: 'usr-2',
      tags: ['CFC', '3 TVs', 'Vídeo', 'Mensal'],
      notes: 'Alinhando contrato para o Plano Alcance (3 TVs: Clínica Rey, AC Fitness e Academia Centenário) com vídeo.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'lead-107',
      name: 'Tatiane Miranda',
      phone: '(11) 98333-2211',
      companyAddress: 'Shopping Center Norte, Loja 142 - Vila Guilherme, São Paulo - SP',
      company: 'Boutique Bella Moda',
      email: 'tatiane@bellamoda.com.br',
      role: 'Proprietária',
      value: 99.90,
      planId: 'plan-presenca',
      billingCycle: 'monthly',
      mediaFormat: 'foto',
      tvsCount: 1,
      selectedScreenIds: ['scr-2'],
      paymentDate: '2026-08-31',
      dueDate: '2026-09-30',
      priority: 'baixa',
      stage: 'qualificacao',
      origin: 'Google Ads',
      assignedTo: 'usr-3',
      tags: ['Moda', '1 TV', 'Foto Encarte', 'Mensal'],
      notes: 'Quer iniciar com o Plano Presença (1 TV) focado na Barbearia Men\'s Prime para look masculino e presentes.',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'lead-108',
      name: 'Renan Barreto',
      phone: '(11) 97766-5544',
      companyAddress: 'Rua Pamplona, 740 - Jardim Paulista, São Paulo - SP',
      company: 'Bella Massa Forneria & Pizza',
      email: 'contato@bellamassa.com.br',
      role: 'Sócio Proprietário',
      value: 99.90,
      planId: 'plan-presenca',
      billingCycle: 'monthly',
      mediaFormat: 'foto',
      tvsCount: 1,
      selectedScreenIds: ['scr-2'],
      paymentDate: '2026-08-28',
      dueDate: '2026-09-28',
      priority: 'alta',
      stage: 'ganho',
      approvalStatus: 'approved',
      sellerId: 'usr-5',
      commissionRate: 0.10,
      commissionAmount: 9.99,
      approvedBy: 'usr-1',
      approvedByName: 'Jandson',
      approvedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      origin: 'Prospecção Vendedor',
      assignedTo: 'usr-5',
      tags: ['Vendedor Luciano', 'Pizzaria', '1 TV', 'Aprovada'],
      notes: 'Venda realizada pelo vendedor Luciano no Plano Presença (1 TV).',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      renewalsCount: 0,
      renewalsHistory: []
    },
    {
      id: 'lead-109',
      name: 'Fernanda Rocha',
      phone: '(11) 98822-3344',
      companyAddress: 'Av. Rebouças, 1850 - Pinheiros, São Paulo - SP',
      company: 'Express Clean Lavanderia Self-Service',
      email: 'financeiro@expressclean.com.br',
      role: 'Proprietária',
      value: 149.90,
      planId: 'plan-destaque',
      billingCycle: 'monthly',
      mediaFormat: 'video',
      tvsCount: 2,
      selectedScreenIds: ['scr-3', 'scr-5'],
      paymentDate: '2026-08-31',
      dueDate: '2026-09-30',
      priority: 'alta',
      stage: 'reuniao',
      approvalStatus: 'pending',
      sellerId: 'usr-5',
      commissionRate: 0.10,
      commissionAmount: 14.99,
      origin: 'Prospecção Vendedor',
      assignedTo: 'usr-5',
      tags: ['Vendedor Luciano', 'Lavanderia', '2 TVs', 'Pendente Aprovação'],
      notes: 'Venda cadastrada pelo vendedor Luciano no Plano Destaque (2 TVs nas academias). Aguardando confirmação dos sócios.',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      renewalsCount: 0,
      renewalsHistory: []
    }
  ],
  sellerPayouts: [],
  hotLeads: [
    {
      id: 'hot-1',
      name: 'Roberto Viana',
      company: 'Ótica Visão Elegance',
      companyAddress: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
      phone: '(11) 98877-6655',
      planInterest: 'plan-conecta',
      planName: '👑 Plano Conecta (5 TVs • R$ 299,90)',
      reasonNotClosed: 'O proprietário gostou muito da rede, mas pediu retorno na próxima quinta-feira para definir com o sócio se fecham o trimestral à vista.',
      notes: 'Demonstrou interesse em veicular ofertas de armações solares e lentes premium nas academias.',
      sellerId: 'usr-5',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'hot-2',
      name: 'Patrícia Duarte',
      company: 'Studio Glamour Estética & Cabelo',
      companyAddress: 'Rua Oscar Freire, 320 - Jardins, São Paulo - SP',
      phone: '(11) 97755-4433',
      planInterest: 'plan-destaque',
      planName: '🔥 Plano Destaque (2 TVs • R$ 149,90)',
      reasonNotClosed: 'Está aguardando a finalização da reforma do espaço físico para iniciar a campanha de reinauguração na segunda quinzena.',
      notes: 'Quer focar na tela da Barbearia Men\'s Prime e Clínica Rey.',
      sellerId: 'usr-5',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ],
  transactions: [
    {
      id: 'tx-1',
      type: 'income',
      description: 'Mensalidade FitLife Centro de Treinamento (Plano Conecta Trimestral)',
      amount: 780.00,
      category: 'Planos Recorrentes',
      paymentMethod: 'Pix',
      date: '2026-08-25',
      dueDate: '2026-08-25',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Contrato trimestral quitado antecipado.'
    },
    {
      id: 'tx-2',
      type: 'income',
      description: 'Mensalidade Rede Bom Preço Alimentos (Plano Conecta)',
      amount: 299.90,
      category: 'Planos Recorrentes',
      paymentMethod: 'Boleto Bancário',
      date: '2026-08-20',
      dueDate: '2026-08-20',
      status: 'paid',
      partnerId: 'usr-2',
      notes: 'Mensalidade regular paga.'
    },
    {
      id: 'tx-3',
      type: 'income',
      description: 'Campanha 15 Dias Farmácia Vida Longa (Inauguração)',
      amount: 79.90,
      category: 'Planos Avulsos',
      paymentMethod: 'Pix',
      date: '2026-08-28',
      dueDate: '2026-08-28',
      status: 'paid',
      partnerId: 'usr-4',
      notes: 'Campanha de 15 dias ativada.'
    },
    {
      id: 'tx-4',
      type: 'income',
      description: 'Mensalidade Brasa Burguer Artesanal (Plano Impacto 4 TVs)',
      amount: 650.00,
      category: 'Planos Recorrentes',
      paymentMethod: 'Cartão de Crédito',
      date: '2026-08-10',
      dueDate: '2026-08-10',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Trimestral antecipado.'
    },
    {
      id: 'tx-5',
      type: 'income',
      description: 'Mensalidade Bella Massa Forneria (Plano Presença 1 TV - Venda Luciano)',
      amount: 99.90,
      category: 'Planos Recorrentes',
      paymentMethod: 'Pix',
      date: '2026-08-29',
      dueDate: '2026-08-29',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Venda do vendedor Luciano Silva aprovada por Jandson.'
    },
    {
      id: 'tx-6',
      type: 'expense',
      description: 'Locação & Ponto de TV — Clínica Rey',
      amount: 35.00,
      category: 'Custo Fixo por TV',
      paymentMethod: 'Pix',
      date: '2026-08-05',
      dueDate: '2026-08-05',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Custo fixo da tela R$ 35,00/mês'
    },
    {
      id: 'tx-7',
      type: 'expense',
      description: 'Locação & Ponto de TV — Barbearia Men\'s Prime',
      amount: 35.00,
      category: 'Custo Fixo por TV',
      paymentMethod: 'Pix',
      date: '2026-08-05',
      dueDate: '2026-08-05',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Custo fixo da tela R$ 35,00/mês'
    },
    {
      id: 'tx-8',
      type: 'expense',
      description: 'Locação & Ponto de TV — Academia AC Fitness',
      amount: 35.00,
      category: 'Custo Fixo por TV',
      paymentMethod: 'Pix',
      date: '2026-08-05',
      dueDate: '2026-08-05',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Custo fixo da tela R$ 35,00/mês'
    },
    {
      id: 'tx-9',
      type: 'expense',
      description: 'Locação & Ponto de TV — Academia Centenário',
      amount: 35.00,
      category: 'Custo Fixo por TV',
      paymentMethod: 'Pix',
      date: '2026-08-05',
      dueDate: '2026-08-05',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Custo fixo da tela R$ 35,00/mês'
    },
    {
      id: 'tx-10',
      type: 'expense',
      description: 'Locação & Ponto de TV — Academia PowerFit',
      amount: 35.00,
      category: 'Custo Fixo por TV',
      paymentMethod: 'Pix',
      date: '2026-08-05',
      dueDate: '2026-08-05',
      status: 'paid',
      partnerId: 'usr-1',
      notes: 'Custo fixo da tela R$ 35,00/mês'
    }
  ],
  meetings: [
    {
      id: 'mtg-1',
      title: 'Apresentação Comercial Rede Conecta Mais (5 TVs)',
      companyName: 'Ótica Visão Elegance',
      contactPerson: 'Roberto Viana',
      phone: '(11) 98877-6655',
      leadId: 'lead-103',
      date: new Date().toISOString().split('T')[0],
      time: '15:30',
      duration: '45',
      type: 'presencial',
      address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
      scheduledBy: 'usr-1',
      assignedPartnerId: 'usr-1',
      participantIds: ['usr-1', 'usr-2'],
      meetLink: 'https://meet.google.com/abc-conecta-demo',
      status: 'scheduled',
      notes: 'Levar proposta impressa do Plano Conecta Trimestral e amostra de encarte animado em vídeo.'
    },
    {
      id: 'mtg-2',
      title: 'Alinhamento de Contrato e Mídia Digital',
      companyName: 'CFC Piloto & Treinamento',
      contactPerson: 'Gabriel Siqueira',
      phone: '(61) 98444-3322',
      leadId: 'lead-106',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '10:00',
      duration: '30',
      type: 'online',
      address: '',
      scheduledBy: 'usr-2',
      assignedPartnerId: 'usr-2',
      participantIds: ['usr-2'],
      meetLink: 'https://meet.google.com/cm-piloto-reuniao',
      status: 'scheduled',
      notes: 'Reunião rápida online para confirmar telas escolhidas (3 TVs) e formato de vídeo.'
    }
  ],
  activities: [
    {
      id: 'act-1',
      leadId: 'lead-101',
      type: 'proposal',
      title: 'Proposta Comercial Plano Conecta Aprovada',
      description: 'Cliente optou pelo plano trimestral antecipado com desconto e vídeo nas 5 telas da rede.',
      user: 'Jandson',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
    },
    {
      id: 'act-2',
      leadId: 'lead-108',
      type: 'whatsapp',
      title: 'Primeiro Contato e Apresentação pelo Vendedor Luciano',
      description: 'Vendedor Luciano visitou o estabelecimento e apresentou a tela da Barbearia Men\'s Prime.',
      user: 'Luciano Silva',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      type: 'warning',
      title: 'Alerta de Mensalidade Vencida 🔴',
      message: 'A mensalidade de Brasa Burguer Artesanal venceu em 15/08 e está em atraso.',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif-2',
      type: 'warning',
      title: 'Cliente Vencendo Hoje 🟡',
      message: 'O plano de Farmácia Vida Longa vence hoje (31/08). Faça o contato para renovação!',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif-3',
      type: 'sale_pending',
      title: 'Nova Venda Aguardando Aprovação',
      message: 'Vendedor Luciano cadastrou uma venda para Express Clean Lavanderia (R$ 149,90).',
      read: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
    }
  ]
};

export function CRMProvider({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(INITIAL_SEED_DATA.users[0]);
  const [theme, setTheme] = useState('dark');
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // { type: 'client'|'meeting'|..., data: any }
  const [toasts, setToasts] = useState([]);

  // Data Collections
  const [users, setUsers] = useState(INITIAL_SEED_DATA.users);
  const [screens, setScreens] = useState(INITIAL_SEED_DATA.screens);
  const [leads, setLeads] = useState(INITIAL_SEED_DATA.leads);
  const [hotLeads, setHotLeads] = useState(INITIAL_SEED_DATA.hotLeads);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [transactions, setTransactions] = useState(INITIAL_SEED_DATA.transactions);
  const [sellerPayouts, setSellerPayouts] = useState(INITIAL_SEED_DATA.sellerPayouts || []);
  const [meetings, setMeetings] = useState(INITIAL_SEED_DATA.meetings);
  const [activities, setActivities] = useState(INITIAL_SEED_DATA.activities);
  const [notifications, setNotifications] = useState(INITIAL_SEED_DATA.notifications);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.screens) setScreens(parsed.screens);
        if (parsed.leads) setLeads(parsed.leads);
        if (parsed.hotLeads) setHotLeads(parsed.hotLeads);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.sellerPayouts) setSellerPayouts(parsed.sellerPayouts);
        if (parsed.meetings) setMeetings(parsed.meetings);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.currentUserId) {
          const u = (parsed.users || INITIAL_SEED_DATA.users).find(x => x.id === parsed.currentUserId);
          if (u) {
            setCurrentUser(u);
            if (u.role === 'vendedor') setCurrentView('seller-dashboard');
          }
        }
      }
      const savedTheme = localStorage.getItem('cm_theme') || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (e) {
      console.error('Error loading CRM state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        users,
        screens,
        leads,
        hotLeads,
        transactions,
        sellerPayouts,
        meetings,
        activities,
        notifications,
        currentUserId: currentUser?.id
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving CRM state:', e);
    }
  }, [isLoaded, users, screens, leads, hotLeads, transactions, sellerPayouts, meetings, activities, notifications, currentUser]);

  // Theme Toggle
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cm_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  // Toast notification
  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  // Modal helpers
  const openModal = useCallback((type, data = null) => {
    setActiveModal({ type, data });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // User Helpers & Role Check
  const isSeller = useCallback(() => {
    return currentUser?.role === 'vendedor';
  }, [currentUser]);

  const isPartner = useCallback(() => {
    return currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.role === 'closer';
  }, [currentUser]);

  const switchUser = useCallback((userId) => {
    const u = users.find(x => x.id === userId);
    if (u) {
      setCurrentUser(u);
      if (u.role === 'vendedor') {
        setCurrentView('seller-dashboard');
      } else {
        if (currentView.startsWith('seller-')) setCurrentView('dashboard');
      }
      showToast(`Conectado como ${u.name} (${u.roleName || u.role})`, 'success');
      closeModal();
    }
  }, [users, currentView, showToast, closeModal]);

  const login = useCallback((email, password) => {
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (u) {
      setCurrentUser(u);
      if (u.role === 'vendedor') setCurrentView('seller-dashboard');
      else setCurrentView('dashboard');
      showToast(`Bem-vindo, ${u.name}!`, 'success');
      return true;
    }
    return false;
  }, [users, showToast]);

  const logout = useCallback(() => {
    openModal('login');
    showToast('Você saiu do sistema.', 'info');
  }, [openModal, showToast]);

  // Formatter
  const formatCurrency = useCallback((val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  }, []);

  // ==================== CÁLCULO E STATUS DE VENCIMENTO ====================
  const getLeadDueStatus = useCallback((lead) => {
    if (!lead) return { status: 'unknown', text: '-', diffDays: 0, label: '-', badgeClass: '' };

    const paymentDateStr = lead.paymentDate || lead.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
    const dueDateStr = lead.dueDate || computeDueDate(paymentDateStr, lead.billingCycle, lead.planId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dueDateStr.split('-');
    const dueDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const formattedDueDate = `${String(dueDate.getDate()).padStart(2, '0')}/${String(dueDate.getMonth() + 1).padStart(2, '0')}/${dueDate.getFullYear()}`;
    const formattedPaymentDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    if (diffDays < 0) {
      const daysOverdue = Math.abs(diffDays);
      return {
        status: 'expired',
        label: 'Vencido',
        diffDays,
        daysOverdue,
        text: `Vencido há ${daysOverdue} ${daysOverdue === 1 ? 'dia' : 'dias'}`,
        color: '#ef4444',
        badgeClass: 'badge-expired',
        dueDateStr,
        formattedDueDate,
        formattedPaymentDate
      };
    } else if (diffDays === 0) {
      return {
        status: 'due_today',
        label: 'Vence Hoje',
        diffDays: 0,
        daysOverdue: 0,
        text: 'Vence Hoje!',
        color: '#fbbf24',
        badgeClass: 'badge-due-today',
        dueDateStr,
        formattedDueDate,
        formattedPaymentDate
      };
    } else if (diffDays <= 7) {
      return {
        status: 'due_soon',
        label: 'A Vencer',
        diffDays,
        daysOverdue: 0,
        text: `Vence em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`,
        color: '#f59e0b',
        badgeClass: 'badge-due-soon',
        dueDateStr,
        formattedDueDate,
        formattedPaymentDate
      };
    } else {
      return {
        status: 'ok',
        label: 'Em Dia',
        diffDays,
        daysOverdue: 0,
        text: `Vence em ${diffDays} dias`,
        color: '#10b981',
        badgeClass: 'badge-ok',
        dueDateStr,
        formattedDueDate,
        formattedPaymentDate
      };
    }
  }, []);

  // Alertas agregados de vencimento
  const getDueAlerts = useCallback(() => {
    const activeLeads = leads.filter(l => l.stage === 'ganho' || l.approvalStatus === 'approved');

    const expired = activeLeads.filter(l => getLeadDueStatus(l).status === 'expired');
    const dueToday = activeLeads.filter(l => getLeadDueStatus(l).status === 'due_today');
    const dueSoon = activeLeads.filter(l => getLeadDueStatus(l).status === 'due_soon');
    const ok = activeLeads.filter(l => getLeadDueStatus(l).status === 'ok');

    return {
      expired,
      dueToday,
      dueSoon,
      ok,
      totalAlerts: expired.length + dueToday.length + dueSoon.length
    };
  }, [leads, getLeadDueStatus]);

  // ==================== CRUD: LEADS / CLIENTES ====================
  const addLead = useCallback((leadData) => {
    const isSellerRole = currentUser?.role === 'vendedor';
    const planObj = plans.find(p => p.id === leadData.planId) || plans[0];
    
    let finalValue = Number(leadData.value);
    if (!finalValue || isNaN(finalValue)) {
      if (leadData.billingCycle === 'quarterly') finalValue = planObj.quarterlyPrice || planObj.monthlyPrice * 3;
      else if (leadData.billingCycle === 'campaign') finalValue = planObj.fixedPrice || planObj.monthlyPrice;
      else finalValue = planObj.monthlyPrice || 99.90;
    }

    const commRate = isSellerRole ? 0.10 : 0;
    const commAmount = isSellerRole ? Number((finalValue * commRate).toFixed(2)) : 0;

    const paymentDate = leadData.paymentDate || new Date().toISOString().split('T')[0];
    const dueDate = leadData.dueDate || computeDueDate(paymentDate, leadData.billingCycle, leadData.planId);

    const newLead = {
      id: `lead-${Date.now()}`,
      name: leadData.name?.trim() || 'Cliente Sem Nome',
      phone: leadData.phone?.trim() || '',
      company: leadData.company?.trim() || leadData.name?.trim(),
      companyAddress: leadData.companyAddress?.trim() || 'Endereço não informado',
      email: leadData.email?.trim() || '',
      role: leadData.role?.trim() || 'Proprietário / Decisor',
      value: finalValue,
      planId: leadData.planId || 'plan-conecta',
      billingCycle: leadData.billingCycle || 'monthly',
      paymentMethod: leadData.paymentMethod || 'Pix',
      cardInstallments: leadData.cardInstallments || 1,
      boletoBarcode: leadData.boletoBarcode || '',
      mediaFormat: leadData.mediaFormat || 'foto',
      tvsCount: Number(leadData.tvsCount) || planObj.tvs || 1,
      selectedScreenIds: leadData.selectedScreenIds && leadData.selectedScreenIds.length > 0
        ? leadData.selectedScreenIds
        : [screens[0]?.id || 'scr-1'],
      paymentDate,
      dueDate,
      priority: leadData.priority || 'media',
      stage: isSellerRole ? 'reuniao' : (leadData.stage || 'novo'),
      origin: leadData.origin || (isSellerRole ? 'Prospecção Vendedor' : 'Direto'),
      assignedTo: isSellerRole ? currentUser.id : (leadData.assignedTo || currentUser.id),
      sellerId: isSellerRole ? currentUser.id : (leadData.sellerId || null),
      approvalStatus: isSellerRole ? 'pending' : 'approved',
      commissionRate: commRate,
      commissionAmount: commAmount,
      tags: leadData.tags && Array.isArray(leadData.tags) ? leadData.tags : (leadData.tags ? leadData.tags.split(',').map(s=>s.trim()).filter(Boolean) : [planObj.name]),
      notes: leadData.notes || '',
      createdAt: new Date().toISOString(),
      renewalsCount: 0,
      renewalsHistory: []
    };

    setLeads(prev => [newLead, ...prev]);

    // If registered as Won (Ganho) by partner, register transaction in Finance
    if (!isSellerRole && newLead.stage === 'ganho') {
      const tx = {
        id: `tx-${Date.now()}`,
        type: 'income',
        description: `Mensalidade ${newLead.company} (${planObj.name})`,
        amount: finalValue,
        category: 'Planos Recorrentes',
        paymentMethod: newLead.paymentMethod || 'Pix',
        date: paymentDate,
        dueDate: dueDate,
        status: 'paid',
        partnerId: currentUser.id,
        notes: `Cliente cadastrado diretamente no faturamento por ${currentUser.name}. Vencimento: ${dueDate}. Forma de Pagamento: ${newLead.paymentMethod}`
      };
      setTransactions(prev => [tx, ...prev]);
      try { confetti({ particleCount: 80, spread: 60 }); } catch (_) {}
    }

    // If registered by seller, create notification for partners
    if (isSellerRole) {
      const notif = {
        id: `notif-${Date.now()}`,
        type: 'sale_pending',
        title: 'Nova Venda Aguardando Aprovação',
        message: `${currentUser.name} cadastrou novo cliente: ${newLead.company} (${formatCurrency(finalValue)} - ${newLead.paymentMethod}).`,
        read: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
      showToast(`Venda de ${newLead.company} enviada para aprovação dos sócios! Comissão prevista: ${formatCurrency(commAmount)} (10%).`, 'success', 5000);
    } else {
      showToast(`Cliente ${newLead.company} cadastrado com sucesso! Forma de Pagamento: ${newLead.paymentMethod} • Vencimento: ${newLead.dueDate}`, 'success');
    }

    closeModal();
    return newLead;
  }, [currentUser, plans, screens, formatCurrency, showToast, closeModal]);

  const updateLead = useCallback((leadId, updatedData) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const planObj = plans.find(p => p.id === (updatedData.planId || lead.planId));
        const paymentDate = updatedData.paymentDate || lead.paymentDate || new Date().toISOString().split('T')[0];
        const billingCycle = updatedData.billingCycle || lead.billingCycle || 'monthly';
        const planId = updatedData.planId || lead.planId;
        const dueDate = updatedData.dueDate || computeDueDate(paymentDate, billingCycle, planId);

        return {
          ...lead,
          ...updatedData,
          paymentDate,
          dueDate,
          paymentMethod: updatedData.paymentMethod || lead.paymentMethod || 'Pix',
          cardInstallments: updatedData.cardInstallments || lead.cardInstallments || 1,
          boletoBarcode: updatedData.boletoBarcode !== undefined ? updatedData.boletoBarcode : (lead.boletoBarcode || ''),
          tvsCount: updatedData.tvsCount ? Number(updatedData.tvsCount) : (planObj ? planObj.tvs : lead.tvsCount),
          value: updatedData.value !== undefined ? Number(updatedData.value) : lead.value
        };
      }
      return lead;
    }));
    showToast('Cliente atualizado com sucesso!', 'success');
    closeModal();
  }, [plans, showToast, closeModal]);

  const deleteLead = useCallback((leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    showToast('Cliente excluído com sucesso.', 'info');
    closeModal();
  }, [showToast, closeModal]);

  const updateLeadStage = useCallback((leadId, newStage) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        if (newStage === 'ganho' && l.stage !== 'ganho') {
          try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch (_) {}
        }
        return { ...l, stage: newStage };
      }
      return l;
    }));
    showToast(`Etapa atualizada para "${newStage.toUpperCase()}"`, 'success');
  }, [showToast]);

  // Renovar Mensalidade / Contrato do Cliente (Suporte a Renovação Antecipada, Boleto, Cartão e Comissão Recorrente)
  const renewLeadContract = useCallback((leadId, newPaymentDate = new Date().toISOString().split('T')[0], newPaymentMethod = null, customValue = null) => {
    let renewedLead = null;
    let sellerObj = null;
    let recurringComm = 0;
    let isAdvanceRenewal = false;

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        // Se a data de vencimento atual do cliente for no futuro (cliente antecipando a renovação antes de vencer),
        // somamos o novo ciclo A PARTIR DA DATA DE VENCIMENTO ATUAL, preservando os dias já pagos!
        let baseDateForDue = newPaymentDate;
        if (l.dueDate) {
          const currentDue = new Date(l.dueDate);
          const payDateObj = new Date(newPaymentDate);
          if (currentDue > payDateObj) {
            isAdvanceRenewal = true;
            baseDateForDue = l.dueDate;
          }
        }

        const nextDue = computeDueDate(baseDateForDue, l.billingCycle, l.planId);
        const finalValue = customValue !== null && !isNaN(Number(customValue)) ? Number(customValue) : (Number(l.value) || 0);
        const commRate = l.commissionRate !== undefined ? l.commissionRate : 0.10;
        recurringComm = l.sellerId ? Number((finalValue * commRate).toFixed(2)) : 0;
        const method = newPaymentMethod || l.paymentMethod || 'Pix';

        const newRenewalEntry = {
          id: `ren-${Date.now()}`,
          date: newPaymentDate,
          previousDueDate: l.dueDate,
          dueDate: nextDue,
          amount: finalValue,
          paymentMethod: method,
          commission: recurringComm,
          isAdvance: isAdvanceRenewal,
          sellerId: l.sellerId || null,
          renewedAt: new Date().toISOString()
        };

        const existingRenewals = Array.isArray(l.renewalsHistory) ? l.renewalsHistory : [];

        renewedLead = {
          ...l,
          value: finalValue,
          paymentMethod: method,
          paymentDate: newPaymentDate,
          dueDate: nextDue,
          stage: 'ganho',
          renewalsCount: (l.renewalsCount || 0) + 1,
          renewalsHistory: [...existingRenewals, newRenewalEntry]
        };
        return renewedLead;
      }
      return l;
    }));

    if (renewedLead) {
      const planObj = plans.find(p => p.id === renewedLead.planId);
      const method = renewedLead.paymentMethod || 'Pix';
      
      // 1. Receita da Mensalidade Renovada entra no caixa da empresa
      const txIncome = {
        id: `tx-${Date.now()}`,
        type: 'income',
        description: `${isAdvanceRenewal ? 'Renovação Antecipada' : 'Renovação de Mensalidade'}: ${renewedLead.company} (${planObj?.name || 'Plano'})`,
        amount: Number(renewedLead.value) || 0,
        category: 'Planos Recorrentes',
        paymentMethod: method,
        date: newPaymentDate,
        dueDate: renewedLead.dueDate,
        status: 'paid',
        partnerId: currentUser?.id || 'usr-1',
        notes: `${isAdvanceRenewal ? 'Renovação antecipada' : 'Mensalidade renovada'} via ${method} em ${newPaymentDate}. Próximo vencimento estendido para: ${renewedLead.dueDate}`
      };

      setTransactions(prev => [txIncome, ...prev]);

      // 2. Se o cliente pertence a um vendedor, adiciona comissão recorrente ao saldo dele
      if (renewedLead.sellerId) {
        sellerObj = users.find(u => u.id === renewedLead.sellerId);

        // Notificação de comissão recorrente
        const notif = {
          id: `notif-${Date.now()}`,
          type: 'commission',
          title: `Comissão Recorrente de 10% ${isAdvanceRenewal ? '(Renovação Antecipada)' : ''} 🎉`,
          message: `O cliente ${renewedLead.company} renovou via ${method}! O vendedor ${sellerObj?.name || 'Comercial'} tem ${formatCurrency(recurringComm)} acumulado para repasse no dia 10.`,
          read: false,
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [notif, ...prev]);

        // Atividade no histórico
        const act = {
          id: `act-${Date.now()}`,
          leadId: renewedLead.id,
          type: 'renewal',
          title: isAdvanceRenewal ? 'Renovação Antecipada de Contrato' : 'Mensalidade Renovada',
          description: `Mensalidade no valor de ${formatCurrency(renewedLead.value)} paga via ${method} em ${newPaymentDate}. Vencimento estendido para ${renewedLead.dueDate}. Comissão recorrente de 10% (${formatCurrency(recurringComm)}) acumulada para ${sellerObj?.name || 'Vendedor'}.`,
          user: currentUser?.name || 'Sistema',
          createdAt: new Date().toISOString()
        };
        setActivities(prev => [act, ...prev]);
      }

      try { confetti({ particleCount: 140, spread: 85 }); } catch (_) {}
      
      const formattedNextDue = `${renewedLead.dueDate.split('-')[2]}/${renewedLead.dueDate.split('-')[1]}/${renewedLead.dueDate.split('-')[0]}`;

      if (isAdvanceRenewal) {
        showToast(`🎉 Renovação ANTECIPADA de ${renewedLead.company} (${method}) confirmada! Vencimento estendido para ${formattedNextDue}.`, 'success', 6000);
      } else if (renewedLead.sellerId && sellerObj) {
        showToast(`Mensalidade de ${renewedLead.company} renovada via ${method}! Comissão de ${formatCurrency(recurringComm)} (10%) somada para ${sellerObj.name}.`, 'success', 6000);
      } else {
        showToast(`Mensalidade de ${renewedLead.company} renovada via ${method}! Próximo vencimento: ${formattedNextDue}`, 'success', 5000);
      }
    }
  }, [plans, currentUser, users, formatCurrency, showToast]);

  // ==================== APROVAÇÃO DE VENDAS DO VENDEDOR ====================
  const approveSellerSale = useCallback((leadId) => {
    let approvedLead = null;
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const comm = l.commissionAmount || Number(((l.value || 0) * 0.10).toFixed(2));
        const paymentDate = l.paymentDate || new Date().toISOString().split('T')[0];
        const dueDate = l.dueDate || computeDueDate(paymentDate, l.billingCycle, l.planId);

        approvedLead = {
          ...l,
          stage: 'ganho',
          approvalStatus: 'approved',
          approvedBy: currentUser?.id,
          approvedByName: currentUser?.name || 'Sócio',
          approvedAt: new Date().toISOString(),
          commissionAmount: comm,
          paymentDate,
          dueDate,
          renewalsCount: l.renewalsCount || 0,
          renewalsHistory: l.renewalsHistory || []
        };
        return approvedLead;
      }
      return l;
    }));

    if (approvedLead) {
      // 1. Add Income Transaction to Company Cash
      const incomeTx = {
        id: `tx-${Date.now()}`,
        type: 'income',
        description: `Venda Aprovada: ${approvedLead.company} (${approvedLead.name})`,
        amount: Number(approvedLead.value) || 0,
        category: 'Planos Recorrentes',
        paymentMethod: 'Pix',
        date: approvedLead.paymentDate || new Date().toISOString().split('T')[0],
        dueDate: approvedLead.dueDate || new Date().toISOString().split('T')[0],
        status: 'paid',
        partnerId: currentUser?.id || 'usr-1',
        notes: `Venda aprovada pelo sócio ${currentUser?.name || ''}. Vendedor: ${users.find(u=>u.id===approvedLead.sellerId)?.name || 'Vendedor'}`
      };

      setTransactions(prev => [incomeTx, ...prev]);

      try { confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } }); } catch (_) {}
      showToast(`Venda de ${approvedLead.company} APROVADA! Comissão inicial de ${formatCurrency(approvedLead.commissionAmount)} adicionada ao saldo do vendedor.`, 'success', 5000);
    }
  }, [currentUser, users, formatCurrency, showToast]);

  const denySellerSale = useCallback((leadId, reason) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          approvalStatus: 'denied',
          denialReason: reason,
          deniedBy: currentUser?.id,
          deniedAt: new Date().toISOString()
        };
      }
      return l;
    }));
    showToast('Venda recusada e vendedor notificado.', 'info');
    closeModal();
  }, [currentUser, showToast, closeModal]);

  // ==================== REPASSE / PAGAMENTO DE COMISSÕES DE VENDEDORES ====================
  const paySellerCommission = useCallback(({ sellerId, amount, paymentMethod = 'Pix', date, notes, description }) => {
    const seller = users.find(u => u.id === sellerId);
    if (!seller) {
      showToast('Vendedor não encontrado.', 'danger');
      return;
    }

    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) {
      showToast('Valor de comissão inválido para pagamento.', 'danger');
      return;
    }

    const payDate = date || new Date().toISOString().split('T')[0];

    // 1. Cria o registro de Payout
    const newPayout = {
      id: `payout-${Date.now()}`,
      sellerId,
      sellerName: seller.name,
      amount: payAmount,
      paymentMethod,
      date: payDate,
      paidBy: currentUser?.id || 'usr-1',
      paidByName: currentUser?.name || 'Sócio',
      notes: notes || 'Pagamento de comissões realizado pelos sócios.',
      createdAt: new Date().toISOString()
    };

    setSellerPayouts(prev => [newPayout, ...prev]);

    // 2. Lança a despesa de saída no fluxo de caixa da empresa com identificação do vendedor
    const txExpense = {
      id: `tx-${Date.now()}`,
      type: 'expense',
      description: description || `Pagamento de Comissões (Repasse Dia 10) — ${seller.name}`,
      amount: payAmount,
      category: 'Comissões de Vendedores',
      paymentMethod,
      date: payDate,
      dueDate: payDate,
      status: 'paid',
      partnerId: currentUser?.id || 'usr-1',
      sellerId: seller.id,
      sellerName: seller.name,
      notes: notes || `Repasse de comissão realizado para o vendedor ${seller.name}. Saldo quitado.`
    };

    setTransactions(prev => [txExpense, ...prev]);

    // 3. Notificação no sistema
    const notif = {
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'Comissão Paga ao Vendedor 💸',
      message: `Repasse de ${formatCurrency(payAmount)} realizado para ${seller.name} via ${paymentMethod}. O saldo do vendedor foi zerado.`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    try { confetti({ particleCount: 150, spread: 90 }); } catch (_) {}
    showToast(`Comissão de ${formatCurrency(payAmount)} paga para ${seller.name}! Saldo zerado com sucesso.`, 'success', 6000);
    closeModal();
  }, [users, currentUser, formatCurrency, showToast, closeModal]);

  // ==================== CRUD: CLIENTES QUENTES (HOT LEADS) ====================
  const addHotLead = useCallback((hotData) => {
    const newHot = {
      id: `hot-${Date.now()}`,
      name: hotData.name?.trim() || 'Contato',
      company: hotData.company?.trim() || '',
      companyAddress: hotData.companyAddress?.trim() || '',
      phone: hotData.phone?.trim() || '',
      planInterest: hotData.planInterest || 'plan-conecta',
      planName: plans.find(p=>p.id===hotData.planInterest)?.name || 'Plano Conecta',
      reasonNotClosed: hotData.reasonNotClosed || '',
      notes: hotData.notes || '',
      sellerId: currentUser.id,
      createdAt: new Date().toISOString()
    };
    setHotLeads(prev => [newHot, ...prev]);
    showToast('Cliente quente cadastrado com sucesso!', 'success');
    closeModal();
  }, [currentUser, plans, showToast, closeModal]);

  const updateHotLead = useCallback((hotId, data) => {
    setHotLeads(prev => prev.map(h => h.id === hotId ? { ...h, ...data } : h));
    showToast('Cliente quente atualizado!', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const deleteHotLead = useCallback((hotId) => {
    setHotLeads(prev => prev.filter(h => h.id !== hotId));
    showToast('Cliente quente removido.', 'info');
  }, [showToast]);

  // ==================== CRUD: PONTOS DE TELAS (SCREENS) ====================
  const addScreen = useCallback((screenData) => {
    const newScreen = {
      id: `scr-${Date.now()}`,
      name: screenData.name?.trim(),
      segment: screenData.segment?.trim() || 'Comércio & Serviços',
      address: screenData.address?.trim() || '',
      neighborhood: screenData.neighborhood?.trim() || '',
      city: screenData.city?.trim() || 'São Paulo - SP',
      tvsCount: Number(screenData.tvsCount) || 1,
      status: screenData.status || 'active',
      audienceEst: screenData.audienceEst || '3.500 pessoas/mês',
      notes: screenData.notes || '',
      installedAt: new Date().toISOString().split('T')[0]
    };
    setScreens(prev => [...prev, newScreen]);
    showToast(`Ponto "${newScreen.name}" cadastrado com sucesso!`, 'success');
    closeModal();
  }, [showToast, closeModal]);

  const updateScreen = useCallback((screenId, data) => {
    setScreens(prev => prev.map(s => s.id === screenId ? { ...s, ...data } : s));
    showToast('Ponto atualizado com sucesso!', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const deleteScreen = useCallback((screenId) => {
    setScreens(prev => prev.filter(s => s.id !== screenId));
    showToast('Ponto removido.', 'info');
  }, [showToast]);

  // ==================== CRUD: TRANSAÇÕES FINANCEIRAS ====================
  const addTransaction = useCallback((txData) => {
    const sellerObj = txData.sellerId ? users.find(u => u.id === txData.sellerId) : null;
    const newTx = {
      id: `tx-${Date.now()}`,
      type: txData.type || 'income',
      description: txData.description?.trim(),
      amount: Number(txData.amount) || 0,
      category: txData.category || (txData.type === 'income' ? 'Planos Recorrentes' : 'Despesas Gerais'),
      paymentMethod: txData.paymentMethod || 'Pix',
      date: txData.date || new Date().toISOString().split('T')[0],
      dueDate: txData.dueDate || txData.date || new Date().toISOString().split('T')[0],
      status: txData.status || 'paid',
      partnerId: txData.partnerId || currentUser.id,
      sellerId: txData.sellerId || null,
      sellerName: txData.sellerName || sellerObj?.name || null,
      notes: txData.notes || ''
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Lançamento de ${formatCurrency(newTx.amount)} registrado!`, 'success');
    closeModal();
  }, [currentUser, formatCurrency, showToast, closeModal]);

  const deleteTransaction = useCallback((txId) => {
    setTransactions(prev => prev.filter(t => t.id !== txId));
    showToast('Lançamento excluído com sucesso.', 'info');
  }, [showToast]);

  // ==================== CRUD: REUNIÕES & AGENDA ====================
  const addMeeting = useCallback((mtgData) => {
    const newMtg = {
      id: `mtg-${Date.now()}`,
      title: mtgData.title?.trim() || 'Reunião Comercial',
      companyName: mtgData.companyName?.trim() || '',
      contactPerson: mtgData.contactPerson?.trim() || '',
      phone: mtgData.phone?.trim() || '',
      leadId: mtgData.leadId || '',
      date: mtgData.date || new Date().toISOString().split('T')[0],
      time: mtgData.time || '10:00',
      duration: mtgData.duration || '45',
      type: mtgData.type || 'presencial',
      address: mtgData.address || '',
      scheduledBy: mtgData.scheduledBy || currentUser.id,
      assignedPartnerId: mtgData.assignedPartnerId || currentUser.id,
      participantIds: mtgData.participantIds || [currentUser.id],
      meetLink: mtgData.meetLink || '',
      status: mtgData.status || 'scheduled',
      notes: mtgData.notes || ''
    };
    setMeetings(prev => [newMtg, ...prev]);
    showToast(`Reunião agendada com ${newMtg.companyName || newMtg.contactPerson}!`, 'success');
    closeModal();
  }, [currentUser, showToast, closeModal]);

  const updateMeeting = useCallback((mtgId, mtgData) => {
    setMeetings(prev => prev.map(m => m.id === mtgId ? { ...m, ...mtgData } : m));
    showToast('Reunião atualizada com sucesso!', 'success');
    closeModal();
  }, [showToast, closeModal]);

  const deleteMeeting = useCallback((mtgId) => {
    setMeetings(prev => prev.filter(m => m.id !== mtgId));
    showToast('Reunião cancelada/removida.', 'info');
  }, [showToast]);

  // ==================== CRUD: SÓCIOS & VENDEDORES ====================
  const addUser = useCallback((userData) => {
    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name?.trim(),
      email: userData.email?.trim(),
      password: userData.password || 'conecta123',
      role: userData.role || 'admin',
      roleName: userData.role === 'admin' ? 'Sócio Diretor (Acesso Total)' : (userData.role === 'manager' ? 'Sócio & Gestor Comercial' : 'Sócia & Executiva de Vendas'),
      phone: userData.phone?.trim() || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${userData.name}`,
      active: userData.active !== undefined ? userData.active : true
    };
    setUsers(prev => [...prev, newUser]);
    showToast(`Sócio ${newUser.name} cadastrado com sucesso!`, 'success');
    closeModal();
  }, [showToast, closeModal]);

  const addSeller = useCallback((sellerData) => {
    const newSeller = {
      id: `usr-${Date.now()}`,
      name: sellerData.name?.trim(),
      email: sellerData.email?.trim(),
      password: sellerData.password || 'conecta123',
      role: 'vendedor',
      roleName: 'Vendedor Comercial (Comissão 10% Recorrente)',
      phone: sellerData.phone?.trim() || '',
      avatar: sellerData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${sellerData.name}`,
      active: sellerData.active !== undefined ? sellerData.active : true,
      commissionRate: 0.10
    };
    setUsers(prev => [...prev, newSeller]);
    showToast(`Vendedor ${newSeller.name} cadastrado com sucesso!`, 'success');
    closeModal();
  }, [showToast, closeModal]);

  // ==================== CRUD: ATIVIDADES & TIMELINE ====================
  const addActivity = useCallback((leadId, actData) => {
    const newAct = {
      id: `act-${Date.now()}`,
      leadId,
      type: actData.type || 'note',
      title: actData.title?.trim(),
      description: actData.description?.trim() || '',
      user: currentUser?.name || 'Equipe',
      createdAt: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
    showToast('Atividade registrada na linha do tempo!', 'success');
  }, [currentUser, showToast]);

  // Notifications
  const markNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Export / Backup
  const exportCSV = useCallback(() => {
    const headers = ['ID', 'Cliente/Empresa', 'Nome Contato', 'Telefone', 'Email', 'Endereço', 'Plano', 'Valor', 'Data Pagamento', 'Data Vencimento', 'Status Vencimento', 'Etapa'];
    const rows = leads.map(l => {
      const dueInfo = getLeadDueStatus(l);
      return [
        l.id,
        `"${(l.company || '').replace(/"/g, '""')}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${l.phone || ''}"`,
        `"${l.email || ''}"`,
        `"${(l.companyAddress || '').replace(/"/g, '""')}"`,
        `"${plans.find(p=>p.id===l.planId)?.name || l.planId}"`,
        l.value,
        l.paymentDate || '',
        l.dueDate || '',
        `"${dueInfo.text}"`,
        l.stage
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `conecta_mais_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exportação CSV concluída com sucesso!', 'success');
  }, [leads, plans, getLeadDueStatus, showToast]);

  const exportJSON = useCallback(() => {
    const backup = {
      version: '2.3.0',
      exportedAt: new Date().toISOString(),
      users,
      screens,
      leads,
      hotLeads,
      transactions,
      sellerPayouts,
      meetings,
      activities
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conecta_mais_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON gerado e baixado!', 'success');
  }, [users, screens, leads, hotLeads, transactions, sellerPayouts, meetings, activities, showToast]);

  const importJSON = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.users) setUsers(data.users);
      if (data.screens) setScreens(data.screens);
      if (data.leads) setLeads(data.leads);
      if (data.hotLeads) setHotLeads(data.hotLeads);
      if (data.transactions) setTransactions(data.transactions);
      if (data.sellerPayouts) setSellerPayouts(data.sellerPayouts);
      if (data.meetings) setMeetings(data.meetings);
      if (data.activities) setActivities(data.activities);
      showToast('Backup restaurado com sucesso!', 'success');
    } catch (e) {
      showToast('Erro ao ler arquivo JSON de backup.', 'danger');
    }
  }, [showToast]);

  const resetDemoData = useCallback(() => {
    setUsers(INITIAL_SEED_DATA.users);
    setScreens(INITIAL_SEED_DATA.screens);
    setLeads(INITIAL_SEED_DATA.leads);
    setHotLeads(INITIAL_SEED_DATA.hotLeads);
    setTransactions(INITIAL_SEED_DATA.transactions);
    setSellerPayouts(INITIAL_SEED_DATA.sellerPayouts || []);
    setMeetings(INITIAL_SEED_DATA.meetings);
    setActivities(INITIAL_SEED_DATA.activities);
    setNotifications(INITIAL_SEED_DATA.notifications);
    setCurrentUser(INITIAL_SEED_DATA.users[0]);
    showToast('Dados de demonstração restaurados!', 'info');
  }, [showToast]);

  // Seller commission calculation helper (COM SALDO PENDENTE QUE ZERA APÓS PAGAMENTO E REACUMULA EM NOVAS VENDAS/RENOVAÇÕES)
  const getSellerCommissions = useCallback((sellerId) => {
    const salesList = leads.filter(l => l.sellerId === sellerId);
    const approvedSales = salesList.filter(l => l.approvalStatus === 'approved' || l.stage === 'ganho');
    const pendingSales = salesList.filter(l => l.approvalStatus === 'pending');

    // Vendas Iniciais
    const initialSold = approvedSales.reduce((sum, s) => sum + (Number(s.value) || 0), 0);
    const initialCommission = approvedSales.reduce((sum, s) => sum + (s.commissionAmount || (Number(s.value) * 0.10)), 0);

    // Renovações Recorrentes
    let totalRenewalsSold = 0;
    let totalRecurringCommission = 0;
    let totalRenewalsCount = 0;
    const commissionLedger = [];

    // Adiciona vendas iniciais ao extrato
    approvedSales.forEach(s => {
      const initComm = s.commissionAmount || Number(((s.value || 0) * 0.10).toFixed(2));
      commissionLedger.push({
        id: `init-${s.id}`,
        leadId: s.id,
        company: s.company || s.name,
        companyAddress: s.companyAddress,
        type: 'initial_sale',
        typeLabel: '⭐ Venda Inicial (Ativação)',
        saleValue: Number(s.value) || 0,
        commissionRate: s.commissionRate || 0.10,
        commissionAmount: initComm,
        date: s.paymentDate || s.approvedAt?.split('T')[0] || s.createdAt?.split('T')[0],
        status: 'approved'
      });

      // Renovações registradas no cliente
      const history = Array.isArray(s.renewalsHistory) ? s.renewalsHistory : [];
      history.forEach((ren, idx) => {
        totalRenewalsCount += 1;
        totalRenewalsSold += Number(ren.amount) || Number(s.value) || 0;
        const renComm = ren.commission !== undefined ? Number(ren.commission) : Number(((ren.amount || s.value || 0) * 0.10).toFixed(2));
        totalRecurringCommission += renComm;

        commissionLedger.push({
          id: ren.id || `ren-${s.id}-${idx}`,
          leadId: s.id,
          company: s.company || s.name,
          companyAddress: s.companyAddress,
          type: 'recurring_renewal',
          typeLabel: `🔄 Renovação Recorrente (Ciclo #${idx + 1})`,
          saleValue: Number(ren.amount) || Number(s.value) || 0,
          commissionRate: s.commissionRate || 0.10,
          commissionAmount: renComm,
          date: ren.date || ren.renewedAt?.split('T')[0],
          status: 'approved'
        });
      });
    });

    // Faturamento Total e Comissões Ganhas Totais (Iniciais + Recorrentes)
    const totalSold = initialSold + totalRenewalsSold;
    const totalEarnedCommission = initialCommission + totalRecurringCommission;

    // Total de pagamentos/repasses já feitos pelos sócios
    const myPayouts = sellerPayouts.filter(p => p.sellerId === sellerId);
    const totalPaidOut = myPayouts.reduce((sum, p) => sum + Number(p.amount), 0);

    // Saldo Atual Pendente de Pagamento (zera ao pagar e aumenta a cada nova venda ou renovação)
    const pendingPayoutBalance = Math.max(0, Number((totalEarnedCommission - totalPaidOut).toFixed(2)));

    // Renda Mensal Recorrente Estimada da Carteira (MRR)
    const activeClientsCount = approvedSales.filter(s => s.stage === 'ganho').length;
    const portfolioMonthlyRecurring = approvedSales
      .filter(s => s.stage === 'ganho')
      .reduce((sum, s) => {
        const commRate = s.commissionRate || 0.10;
        if (s.billingCycle === 'quarterly') {
          return sum + (((Number(s.value) || 0) / 3) * commRate);
        }
        return sum + ((Number(s.value) || 0) * commRate);
      }, 0);

    return {
      salesList,
      approvedSales,
      pendingSales,
      totalSold,
      initialSold,
      totalRenewalsSold,
      initialCommission,
      totalRecurringCommission,
      totalEarnedCommission,
      totalPaidOut,
      pendingCommission: pendingPayoutBalance, // Saldo a pagar no momento
      payoutsHistory: myPayouts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)),
      approvedCount: approvedSales.length,
      pendingCount: pendingSales.length,
      totalRenewalsCount,
      activeClientsCount,
      portfolioMonthlyRecurring,
      nextPayoutInfo: getNextCommissionPayoutDate(),
      payoutScheduleDay: 10,
      payoutScheduleText: 'Todo dia 10 de cada mês',
      commissionLedger: commissionLedger.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    };
  }, [leads, sellerPayouts]);

  // General Metrics
  const getMetrics = useCallback(() => {
    const totalLeads = leads.length;
    const wonLeads = leads.filter(l => l.stage === 'ganho');
    const totalRevenue = wonLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
    const activeScreens = screens.filter(s => s.status === 'active').reduce((acc, s) => acc + (Number(s.tvsCount) || 1), 0);
    
    // Financial balance
    const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'paid').reduce((acc, t) => acc + Number(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'paid').reduce((acc, t) => acc + Number(t.amount), 0);
    const cashBalance = totalIncome - totalExpense;

    const pendingApprovals = leads.filter(l => l.approvalStatus === 'pending');

    return {
      totalLeads,
      wonLeadsCount: wonLeads.length,
      totalRevenue,
      activeScreens,
      totalIncome,
      totalExpense,
      cashBalance,
      pendingApprovalsCount: pendingApprovals.length,
      pendingApprovals
    };
  }, [leads, screens, transactions]);

  const value = {
    isLoaded,
    currentUser,
    setCurrentUser,
    theme,
    toggleTheme,
    currentView,
    setCurrentView,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    searchQuery,
    setSearchQuery,
    activeModal,
    openModal,
    closeModal,
    toasts,
    showToast,
    // Data collections
    users,
    screens,
    leads,
    hotLeads,
    plans,
    transactions,
    sellerPayouts,
    meetings,
    activities,
    notifications,
    // Auth & roles
    isSeller,
    isPartner,
    switchUser,
    login,
    logout,
    // CRUD methods
    addLead,
    updateLead,
    deleteLead,
    updateLeadStage,
    renewLeadContract,
    approveSellerSale,
    denySellerSale,
    paySellerCommission,
    addHotLead,
    updateHotLead,
    deleteHotLead,
    addScreen,
    updateScreen,
    deleteScreen,
    addTransaction,
    deleteTransaction,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addUser,
    addSeller,
    addActivity,
    markNotificationsAsRead,
    // Due Date & Alerts Helpers
    getLeadDueStatus,
    getDueAlerts,
    getNextCommissionPayoutDate,
    // Helpers
    formatCurrency,
    exportCSV,
    exportJSON,
    importJSON,
    resetDemoData,
    getSellerCommissions,
    getMetrics
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
}

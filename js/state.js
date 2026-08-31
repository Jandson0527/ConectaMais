/**
 * Conecta Mais - State Management & Data Store
 * Reactive store, localStorage persistence, seed data, Indoor Plans & Financial Flow.
 */

class CRMStore {
  constructor() {
    this.STORAGE_KEY = 'conecta_mais_store_v7';
    this.COST_PER_TV = 35.00; // R$ 35,00 mensal por TV instalada
    this.listeners = [];
    this.state = this.loadState();
  }

  // Official Indoor Marketing Plans
  getPlans() {
    return [
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
        description: 'Valores ou condições customizadas'
      }
    ];
  }

  getPlanById(id) {
    return this.getPlans().find(p => p.id === id) || null;
  }

  // Initial Seed Data
  getDefaultSeedData() {
    const today = new Date();
    const formatDate = (daysOffset, timeStr) => {
      const d = new Date(today);
      d.setDate(d.getDate() + daysOffset);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return { date: `${year}-${month}-${day}`, time: timeStr };
    };

    const users = [
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
        name: 'Luciano',
        email: 'luciano@conectamais.com.br',
        password: 'conecta123',
        role: 'vendedor',
        roleName: 'Vendedor Comercial (Comissão 10%)',
        phone: '(11) 94777-8899',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        active: true,
        commissionRate: 0.10
      }
    ];

    const screens = [
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
    ];

    const leads = [
      {
        id: 'lead-101',
        name: 'Academia FitLife & Saúde',
        company: 'FitLife Centro de Treinamento',
        companyAddress: 'Av. das Nações, 1100 - Vila Mariana, São Paulo - SP',
        email: 'contato@fitlifesaude.com.br',
        phone: '11987654321',
        role: 'Gerente Geral - Marcos',
        value: 780.00,
        planId: 'plan-conecta',
        billingCycle: 'quarterly',
        mediaFormat: 'video', // 'foto', 'video', 'ambos'
        tvsCount: 5,
        selectedScreenIds: ['scr-1', 'scr-2', 'scr-3', 'scr-4', 'scr-5'],
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
        name: 'Supermercado Bom Preço',
        company: 'Rede Bom Preço Alimentos',
        companyAddress: 'Rua do Comércio, 500 - Centro, São Paulo - SP',
        email: 'comercial@bompreco.com.br',
        phone: '19988887766',
        role: 'Diretor de Marketing - Rodrigo',
        value: 299.90,
        planId: 'plan-conecta',
        billingCycle: 'monthly',
        mediaFormat: 'foto',
        tvsCount: 5,
        selectedScreenIds: ['scr-1', 'scr-2', 'scr-3', 'scr-4', 'scr-5'],
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
        name: 'Clínica OdontoPrime',
        company: 'OdontoPrime Estética & Implantes',
        companyAddress: 'Av. Paulista, 2000 - Cj 82 - Bela Vista, São Paulo - SP',
        email: 'juliana@odontoprime.com.br',
        phone: '21995554433',
        role: 'Dra. Juliana - Sócia',
        value: 390.00,
        planId: 'plan-destaque',
        billingCycle: 'quarterly',
        mediaFormat: 'video',
        tvsCount: 2,
        selectedScreenIds: ['scr-1', 'scr-2'],
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
        name: 'Hamburgueria Brasa Burguer',
        company: 'Brasa Burguer Artesanal',
        companyAddress: 'Rua Augusta, 850 - Consolação, São Paulo - SP',
        email: 'brasa@brasaburguer.com.br',
        phone: '31977778899',
        role: 'Proprietário - Marcelo',
        value: 650.00,
        planId: 'plan-impacto',
        billingCycle: 'quarterly',
        mediaFormat: 'ambos',
        tvsCount: 4,
        selectedScreenIds: ['scr-2', 'scr-3', 'scr-4', 'scr-5'],
        priority: 'alta',
        stage: 'ganho',
        origin: 'Instagram',
        assignedTo: 'usr-1',
        tags: ['Gastronomia', '4 TVs', 'Foto + Vídeo', 'Trimestral'],
        notes: 'Fechou o Plano Impacto Trimestral para 4 TVs. Veiculando cardápio animado e fotos de pratos.',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString()
      },
      {
        id: 'lead-105',
        name: 'Drogaria & Farmácia Popular',
        company: 'Farmácia Vida Longa',
        companyAddress: 'Av. Brigadeiro Faria Lima, 450 - Pinheiros, São Paulo - SP',
        email: 'camila@vidalonga.com.br',
        phone: '41991234567',
        role: 'Farmacêutica Responsável',
        value: 79.90,
        planId: 'plan-avulso-15',
        billingCycle: 'campaign',
        mediaFormat: 'foto',
        tvsCount: 5,
        selectedScreenIds: ['scr-1', 'scr-2', 'scr-3', 'scr-4', 'scr-5'],
        priority: 'media',
        stage: 'ganho',
        origin: 'Visita Presencial',
        assignedTo: 'usr-4',
        tags: ['Farmácia', 'Avulso 15d', 'Foto', 'Inauguração'],
        notes: 'Campanha de 15 dias para inauguração da nova unidade com arte estática em todas as 5 TVs.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      },
      {
        id: 'lead-106',
        name: 'Auto Escola Piloto',
        company: 'CFC Piloto & Treinamento',
        companyAddress: 'Rua Domingos de Morais, 1300 - Vila Mariana, São Paulo - SP',
        email: 'gabriel@autoescolapiloto.com.br',
        phone: '61984443322',
        role: 'Diretor Geral - Gabriel',
        value: 199.90,
        planId: 'plan-alcance',
        billingCycle: 'monthly',
        mediaFormat: 'video',
        tvsCount: 3,
        selectedScreenIds: ['scr-1', 'scr-3', 'scr-4'],
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
        name: 'Moda Feminina Bella',
        company: 'Boutique Bella Moda',
        companyAddress: 'Shopping Center Norte, Loja 142 - Vila Guilherme, São Paulo - SP',
        email: 'tatiane@bellamoda.com.br',
        phone: '11983332211',
        role: 'Proprietária - Tatiane',
        value: 99.90,
        planId: 'plan-presenca',
        billingCycle: 'monthly',
        mediaFormat: 'foto',
        tvsCount: 1,
        selectedScreenIds: ['scr-2'],
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
        name: 'Pizzaria Bella Massa',
        company: 'Bella Massa Forneria & Pizza',
        companyAddress: 'Rua Pamplona, 740 - Jardim Paulista, São Paulo - SP',
        email: 'contato@bellamassa.com.br',
        phone: '11977665544',
        role: 'Sócio / Pizzaiolo Chefe - Renan',
        value: 99.90,
        planId: 'plan-presenca',
        billingCycle: 'monthly',
        mediaFormat: 'foto',
        tvsCount: 1,
        selectedScreenIds: ['scr-2'],
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
        notes: 'Venda realizada pelo vendedor Luciano no Plano Presença (1 TV). Sócio Jandson confirmou a venda e a comissão de R$ 9,99 (10%) foi liberada.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'lead-109',
        name: 'Lavanderia Express Clean',
        company: 'Express Clean Lavanderia Self-Service',
        companyAddress: 'Av. Rebouças, 1850 - Pinheiros, São Paulo - SP',
        email: 'financeiro@expressclean.com.br',
        phone: '11988223344',
        role: 'Proprietária - Fernanda',
        value: 149.90,
        planId: 'plan-destaque',
        billingCycle: 'monthly',
        mediaFormat: 'video',
        tvsCount: 2,
        selectedScreenIds: ['scr-1', 'scr-3'],
        priority: 'urgente',
        stage: 'novo',
        approvalStatus: 'pending_approval',
        sellerId: 'usr-5',
        commissionRate: 0.10,
        commissionAmount: 14.99,
        origin: 'Prospecção Vendedor',
        assignedTo: 'usr-5',
        tags: ['Vendedor Luciano', 'Lavanderia', '2 TVs', 'Aguardando Aprovação'],
        notes: 'Venda cadastrada pelo vendedor Luciano no Plano Destaque (2 TVs: Clínica Rey e AC Fitness). Aguardando confirmação do sócio para ativar no caixa.',
        createdAt: new Date().toISOString()
      }
    ];

    const hotLeads = [
      {
        id: 'hot-1',
        name: 'Dr. Roberto Vasconcelos',
        company: 'Clínica Visão & Oftalmologia',
        phone: '11988884433',
        address: 'Av. Brigadeiro Luís Antônio, 2200 - Bela Vista, São Paulo - SP',
        planInterestId: 'plan-destaque',
        reasonNotClosed: 'Está analisando o orçamento com os sócios da clínica. Pediu retorno na próxima terça-feira.',
        sellerId: 'usr-5',
        priority: 'alta',
        notes: 'Gostou muito dos pontos da Clínica Rey e Barbearia Mens Prime.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 'hot-2',
        name: 'Patrícia Alcantara',
        company: 'Studio Glamour Estética Facial',
        phone: '11977772211',
        address: 'Rua Oscar Freire, 850 - Jardins, São Paulo - SP',
        planInterestId: 'plan-alcance',
        reasonNotClosed: 'Está aguardando a inauguração da nova filial no fim do mês para iniciar a campanha em vídeo.',
        sellerId: 'usr-5',
        priority: 'urgente',
        notes: 'Quer veicular vídeo de estética facial nas 3 academias da rede.',
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: 'hot-3',
        name: 'Carlos Alberto Mendonça',
        company: 'Auto Peças & Mecânica Central',
        phone: '11966661122',
        address: 'Av. Ibirapuera, 1300 - Moema, São Paulo - SP',
        planInterestId: 'plan-presenca',
        reasonNotClosed: 'Demonstrou muito interesse no ponto da AC Fitness, mas vai conversar com o gerente financeiro.',
        sellerId: 'usr-5',
        priority: 'media',
        notes: 'Retornar contato dia 05 para fechar contrato.',
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ];

    const mToday1 = formatDate(0, '14:30');
    const mToday2 = formatDate(0, '16:30');
    const mTomorrow1 = formatDate(1, '10:00');
    const mTomorrow2 = formatDate(1, '15:00');

    const meetings = [
      {
        id: 'meet-1',
        title: 'Apresentação Rede Conecta Mais (OdontoPrime)',
        leadId: 'lead-103',
        companyName: 'OdontoPrime Estética & Implantes',
        contactPerson: 'Dra. Juliana (Sócia / Proprietária)',
        phone: '(21) 99555-4433',
        address: 'Av. Paulista, 2000 - Cj 82 - Bela Vista, São Paulo - SP',
        meetingType: 'presencial',
        scheduledBy: 'usr-4', // Damares (SDR que agendou)
        assignedPartnerId: 'usr-1', // Jandson (Sócio que vai conduzir)
        participants: ['usr-1', 'usr-2'], // Jandson e Thiago
        date: mToday1.date,
        time: mToday1.time,
        duration: 45,
        status: 'scheduled',
        link: 'https://meet.google.com/abc-defg-hij',
        notes: 'Demonstrar localização das telas na Clínica Rey e Barbearia Men\'s Prime e estimativa de audiência.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'meet-2',
        title: 'Fechamento de Contrato & Vídeo (CFC Piloto)',
        leadId: 'lead-106',
        companyName: 'CFC Piloto & Treinamento',
        contactPerson: 'Gabriel (Diretor Geral / Dono)',
        phone: '(61) 98444-3322',
        address: 'Rua Domingos de Morais, 1300 - Vila Mariana, São Paulo - SP',
        meetingType: 'presencial',
        scheduledBy: 'usr-2', // Thiago
        assignedPartnerId: 'usr-2', // Thiago
        participants: ['usr-2', 'usr-1'],
        date: mTomorrow1.date,
        time: mTomorrow1.time,
        duration: 60,
        status: 'scheduled',
        link: 'https://meet.google.com/xyz-uvwx-rst',
        notes: 'Levar minuta de contrato e modelos de vídeos publicitários para as 3 telas.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'meet-3',
        title: 'Apresentação Comercial (Bella Massa)',
        leadId: 'lead-108',
        companyName: 'Bella Massa Forneria & Pizza',
        contactPerson: 'Renan (Pizzaiolo Chefe / Sócio)',
        phone: '11977665544',
        address: 'Rua Pamplona, 740 - Jardim Paulista, São Paulo - SP',
        meetingType: 'presencial',
        scheduledBy: 'usr-5', // Luciano (Vendedor)
        assignedPartnerId: 'usr-5', // Luciano
        participants: ['usr-5'],
        date: mToday2.date,
        time: mToday2.time,
        duration: 30,
        status: 'completed',
        notes: 'Reunião realizada com sucesso. Venda fechada e aprovada.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'meet-4',
        title: 'Visita de Prospecção (Studio Glamour)',
        leadId: null,
        companyName: 'Studio Glamour Estética Facial',
        contactPerson: 'Patrícia Alcantara',
        phone: '11977772211',
        address: 'Rua Oscar Freire, 850 - Jardins, São Paulo - SP',
        meetingType: 'presencial',
        scheduledBy: 'usr-5', // Luciano (Vendedor)
        assignedPartnerId: 'usr-5', // Luciano
        participants: ['usr-5'],
        date: mTomorrow2.date,
        time: mTomorrow2.time,
        duration: 45,
        status: 'scheduled',
        notes: 'Apresentar amostras de vídeo nas telas das academias.',
        createdAt: new Date().toISOString()
      }
    ];

    const activities = [
      {
        id: 'act-1',
        leadId: 'lead-101',
        type: 'stage_change',
        title: 'Negócio Fechado 🎉',
        description: 'Academia FitLife fechou Plano Conecta Trimestral Antecipado (R$ 780,00)',
        userId: 'usr-1',
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString()
      },
      {
        id: 'act-2',
        leadId: 'lead-104',
        type: 'stage_change',
        title: 'Negócio Fechado 🎉',
        description: 'Brasa Burguer fechou Plano Impacto Trimestral (R$ 650,00)',
        userId: 'usr-1',
        timestamp: new Date(Date.now() - 20 * 86400000).toISOString()
      },
      {
        id: 'act-3',
        leadId: 'lead-108',
        type: 'won',
        title: 'Venda Confirmada por Sócio 🎉',
        description: 'Venda da Pizzaria Bella Massa cadastrada por Luciano aprovada por Jandson. Comissão 10%: R$ 9,99.',
        userId: 'usr-1',
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ];

    // Transactions: Financial Flow (Faturamento e Despesas)
    const transactions = [
      {
        id: 'tx-1',
        type: 'income',
        description: 'Trimestral Antecipado - FitLife Centro de Treinamento (Plano Conecta 5 TVs)',
        amount: 780.00,
        category: 'Mensalidade / Plano',
        date: formatDate(-5, '10:00').date,
        dueDate: formatDate(-5, '10:00').date,
        status: 'paid',
        paymentMethod: 'Pix',
        partnerId: 'usr-1',
        leadId: 'lead-101',
        notes: 'Pagamento à vista trimestral confirmado via Pix.'
      },
      {
        id: 'tx-2',
        type: 'income',
        description: 'Mensalidade - Rede Bom Preço Alimentos (Plano Conecta 5 TVs)',
        amount: 299.90,
        category: 'Mensalidade / Plano',
        date: formatDate(-12, '14:00').date,
        dueDate: formatDate(-12, '14:00').date,
        status: 'paid',
        paymentMethod: 'Cartão de Crédito',
        partnerId: 'usr-2',
        leadId: 'lead-102',
        notes: 'Recorrência mensal automática.'
      },
      {
        id: 'tx-3',
        type: 'income',
        description: 'Trimestral Antecipado - Brasa Burguer Artesanal (Plano Impacto 4 TVs)',
        amount: 650.00,
        category: 'Mensalidade / Plano',
        date: formatDate(-20, '11:30').date,
        dueDate: formatDate(-20, '11:30').date,
        status: 'paid',
        paymentMethod: 'Pix',
        partnerId: 'usr-1',
        leadId: 'lead-104',
        notes: 'Trimestral antecipado referente aos meses de Set/Out/Nov.'
      },
      {
        id: 'tx-4',
        type: 'income',
        description: 'Campanha Inauguração 15d - Farmácia Vida Longa (5 TVs)',
        amount: 79.90,
        category: 'Campanha Avulsa',
        date: formatDate(-1, '09:00').date,
        dueDate: formatDate(-1, '09:00').date,
        status: 'paid',
        paymentMethod: 'Pix',
        partnerId: 'usr-4',
        leadId: 'lead-105',
        notes: 'Veiculação imediata de 15 dias da promoção.'
      },
      {
        id: 'tx-108',
        type: 'income',
        description: 'Venda Vendedor Luciano: Bella Massa Forneria (Plano Presença 1 TV)',
        amount: 99.90,
        category: 'Venda de Plano',
        date: formatDate(-2, '15:30').date,
        dueDate: formatDate(-2, '15:30').date,
        status: 'paid',
        paymentMethod: 'Pix',
        partnerId: 'usr-1',
        sellerId: 'usr-5',
        leadId: 'lead-108',
        commissionAmount: 9.99,
        netAmount: 89.91,
        notes: 'Venda aprovada pelo sócio Jandson. Comissão de R$ 9,99 (10%) para Luciano. Líquido empresa: R$ 89,91.'
      },
      {
        id: 'tx-108-com',
        type: 'expense',
        description: 'Comissão Vendedor (10%) - Luciano (Ref: Bella Massa R$ 99,90)',
        amount: 9.99,
        category: 'Comissão de Vendedor',
        date: formatDate(-2, '15:30').date,
        dueDate: formatDate(-2, '15:30').date,
        status: 'paid',
        paymentMethod: 'Pix',
        partnerId: 'usr-1',
        sellerId: 'usr-5',
        leadId: 'lead-108',
        notes: 'Comissão de 10% paga/provisionada referente à venda Bella Massa.'
      },
      {
        id: 'tx-5',
        type: 'income',
        description: 'Mensalidade - Auto Escola Piloto (Plano Alcance 3 TVs)',
        amount: 199.90,
        category: 'Mensalidade / Plano',
        date: formatDate(5, '15:00').date,
        dueDate: formatDate(5, '15:00').date,
        status: 'pending',
        paymentMethod: 'Boleto Bancário',
        partnerId: 'usr-2',
        leadId: 'lead-106',
        notes: 'Boleto gerado com vencimento nos próximos dias.'
      },
      // Saídas / Despesas
      {
        id: 'tx-6',
        type: 'expense',
        description: 'Licença Software Player TV Indoor (5 telas)',
        amount: 120.00,
        category: 'Software & Licenças',
        date: formatDate(-10, '08:00').date,
        dueDate: formatDate(-10, '08:00').date,
        status: 'paid',
        paymentMethod: 'Cartão de Crédito',
        partnerId: 'usr-1',
        notes: 'Assinatura mensal do software de gestão das TVs.'
      },
      {
        id: 'tx-7',
        type: 'expense',
        description: 'Internet & Conexão 4G dos Pontos de TV',
        amount: 110.00,
        category: 'Infraestrutura / Internet',
        date: formatDate(-8, '10:00').date,
        dueDate: formatDate(-8, '10:00').date,
        status: 'paid',
        paymentMethod: 'Débito Automático',
        partnerId: 'usr-1',
        notes: 'Chips de dados para os pontos remotos.'
      },
      {
        id: 'tx-8',
        type: 'expense',
        description: 'Tráfego Pago Instagram / Captação de Anunciantes',
        amount: 200.00,
        category: 'Marketing & Anúncios',
        date: formatDate(-15, '14:00').date,
        dueDate: formatDate(-15, '14:00').date,
        status: 'paid',
        paymentMethod: 'Cartão de Crédito',
        partnerId: 'usr-4',
        notes: 'Campanha de atração de comércios locais.'
      },
      {
        id: 'tx-9',
        type: 'expense',
        description: 'Suporte & Manutenção dos Suportes de TV',
        amount: 85.00,
        category: 'Manutenção / Hardware',
        date: formatDate(-3, '16:00').date,
        dueDate: formatDate(-3, '16:00').date,
        status: 'paid',
        paymentMethod: 'Pix',
        partnerId: 'usr-2',
        notes: 'Revisão técnica de cabeamento no ponto 3.'
      },
      {
        id: 'tx-10',
        type: 'expense',
        description: 'Novo Dongle HDMI TV Box (Reserva Operacional)',
        amount: 150.00,
        category: 'Manutenção / Hardware',
        date: formatDate(3, '09:00').date,
        dueDate: formatDate(3, '09:00').date,
        status: 'pending',
        paymentMethod: 'Pix',
        partnerId: 'usr-1',
        notes: 'Aparelho reserva para expansão da rede.'
      }
    ];

    return {
      session: {
        userId: 'usr-1',
        authenticated: true, // Default to true on initial seed so user can immediately navigate, but login screen allows switching/testing
        loginTime: new Date().toISOString()
      },
      currentUserId: 'usr-1',
      users,
      screens,
      leads,
      hotLeads,
      meetings,
      activities,
      transactions,
      notifications: [
        {
          id: 'notif-1',
          type: 'won',
          text: 'Faturamento confirmado: R$ 780,00 da Academia FitLife (Plano Conecta)',
          time: 'Há 5 dias',
          read: false
        },
        {
          id: 'notif-2',
          type: 'meeting',
          text: 'Reunião hoje às 14:30 com Dra. Juliana (OdontoPrime)',
          time: 'Hoje',
          read: false
        },
        {
          id: 'notif-3',
          type: 'pending_sale',
          text: 'Nova venda de Luciano aguardando aprovação: Lavanderia Express Clean (R$ 149,90)',
          time: 'Recente',
          read: false
        }
      ]
    };
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.leads) && Array.isArray(parsed.transactions)) {
          const seed = this.getDefaultSeedData();
          if (!parsed.users || parsed.users.length === 0) {
            parsed.users = seed.users;
          }
          if (!parsed.screens || parsed.screens.length === 0) {
            parsed.screens = seed.screens;
          }
          if (!parsed.hotLeads || parsed.hotLeads.length === 0) {
            parsed.hotLeads = seed.hotLeads || [];
          }
          if (!parsed.session) {
            parsed.session = { userId: 'usr-1', authenticated: true, loginTime: new Date().toISOString() };
          }
          if (!parsed.currentUserId) {
            parsed.currentUserId = parsed.session?.userId || parsed.users[0]?.id || 'usr-1';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar estado do localStorage, usando seed data:', e);
    }
    const seed = this.getDefaultSeedData();
    this.saveStateDirect(seed);
    return seed;
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Erro ao persistir dados no localStorage:', e);
    }
  }

  saveStateDirect(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(l => {
      try { l(this.state); } catch (e) { console.error(e); }
    });
  }

  // ==================== AUTHENTICATION & SESSION ====================
  login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPwd = (password || '').trim();

    const user = (this.state.users || []).find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('E-mail não cadastrado na Conecta Mais.');
    }

    if (user.password && user.password !== cleanPwd) {
      throw new Error('Senha incorreta. Verifique suas credenciais.');
    }

    this.state.session = {
      userId: user.id,
      authenticated: true,
      loginTime: new Date().toISOString()
    };
    this.state.currentUserId = user.id;
    this.saveState();
    return user;
  }

  logout() {
    this.state.session = {
      userId: null,
      authenticated: false,
      loginTime: null
    };
    this.saveState();
  }

  isAuthenticated() {
    return Boolean(this.state.session && this.state.session.authenticated);
  }

  getCurrentUser() {
    if (!this.state.users || this.state.users.length === 0) return null;
    const currentId = this.state.session?.userId || this.state.currentUserId;
    const user = this.state.users.find(u => u.id === currentId);
    return user || this.state.users[0];
  }

  setCurrentUser(userId) {
    this.state.currentUserId = userId;
    if (this.state.session) this.state.session.userId = userId;
    this.saveState();
  }

  // ==================== USERS & SÓCIOS CRUD ====================
  getUsers() {
    return this.state.users || [];
  }

  getUserById(id) {
    return (this.state.users || []).find(u => u.id === id) || null;
  }

  addUser(userData) {
    const id = 'usr-' + Date.now();
    const roleNames = {
      admin: 'Sócio Diretor (Acesso Total)',
      manager: 'Sócio & Gestor Comercial',
      closer: 'Sócia & Executiva de Vendas'
    };

    const newUser = {
      id,
      name: userData.name ? userData.name.trim() : 'Novo Sócio',
      email: userData.email ? userData.email.trim() : 'socio@conectamais.com.br',
      role: userData.role || 'closer',
      roleName: userData.roleName || roleNames[userData.role] || 'Sócio / Parceiro',
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'Socio')}`,
      active: true,
      createdAt: new Date().toISOString()
    };

    if (!this.state.users) this.state.users = [];
    this.state.users.push(newUser);
    this.saveState();
    return newUser;
  }

  updateUser(id, updates) {
    const idx = (this.state.users || []).findIndex(u => u.id === id);
    if (idx === -1) return null;

    const roleNames = {
      admin: 'Sócio Diretor (Acesso Total)',
      manager: 'Sócio & Gestor Comercial',
      closer: 'Sócia & Executiva de Vendas'
    };

    if (updates.role && !updates.roleName) {
      updates.roleName = roleNames[updates.role] || 'Sócio / Parceiro';
    }

    this.state.users[idx] = { ...this.state.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveState();
    return this.state.users[idx];
  }

  deleteUser(id) {
    if ((this.state.users || []).length <= 1) {
      throw new Error('Não é possível excluir o único sócio/usuário do sistema.');
    }
    const user = this.getUserById(id);
    this.state.users = (this.state.users || []).filter(u => u.id !== id);
    if (this.state.currentUserId === id) {
      this.state.currentUserId = this.state.users[0].id;
    }
    this.saveState();
    return user;
  }

  // ==================== SCREENS (PONTOS DE TELAS INDOOR) ====================
  getScreens() {
    return this.state.screens || [];
  }

  getScreenById(id) {
    return (this.state.screens || []).find(s => s.id === id);
  }

  addScreen(screenData) {
    const id = 'scr-' + Date.now();
    const newScreen = {
      id,
      name: screenData.name.trim(),
      segment: screenData.segment || 'Geral / Comercial',
      address: screenData.address.trim(),
      neighborhood: screenData.neighborhood || '',
      city: screenData.city || 'São Paulo - SP',
      tvsCount: Number(screenData.tvsCount) || 1,
      status: screenData.status || 'active', // 'active', 'maintenance', 'planned'
      audienceEst: screenData.audienceEst || '3.000 pessoas/mês',
      notes: screenData.notes || '',
      installedAt: screenData.installedAt || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    if (!this.state.screens) this.state.screens = [];
    this.state.screens.push(newScreen);
    this.saveState();
    return newScreen;
  }

  updateScreen(id, updates) {
    const idx = (this.state.screens || []).findIndex(s => s.id === id);
    if (idx === -1) return null;

    if (updates.tvsCount !== undefined) updates.tvsCount = Number(updates.tvsCount) || 1;
    this.state.screens[idx] = { ...this.state.screens[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveState();
    return this.state.screens[idx];
  }

  deleteScreen(id) {
    const screen = this.getScreenById(id);
    this.state.screens = (this.state.screens || []).filter(s => s.id !== id);

    // Remove this screen from any lead's selectedScreenIds
    (this.state.leads || []).forEach(lead => {
      if (lead.selectedScreenIds && lead.selectedScreenIds.includes(id)) {
        lead.selectedScreenIds = lead.selectedScreenIds.filter(sid => sid !== id);
      }
    });

    this.saveState();
    return screen;
  }

  getLeadsForScreen(screenId) {
    return (this.state.leads || []).filter(lead => {
      return Array.isArray(lead.selectedScreenIds) && lead.selectedScreenIds.includes(screenId);
    });
  }

  getScreenStats() {
    const screens = this.getScreens();
    const activeScreens = screens.filter(s => s.status === 'active');
    const totalTvs = screens.reduce((sum, s) => sum + (s.tvsCount || 1), 0);
    
    // Count active paying advertisers across all screens
    const wonLeads = (this.state.leads || []).filter(l => l.stage === 'ganho');

    return {
      totalScreens: screens.length,
      activeScreensCount: activeScreens.length,
      totalTvs,
      activeAdvertisersCount: wonLeads.length
    };
  }

  // ==================== ROLE & PERMISSION HELPERS ====================
  isSeller(userId = null) {
    const id = userId || this.getCurrentUser()?.id;
    const user = this.getUserById(id);
    return user?.role === 'vendedor';
  }

  isPartner(userId = null) {
    const id = userId || this.getCurrentUser()?.id;
    const user = this.getUserById(id);
    return user?.role === 'admin' || user?.role === 'manager' || user?.role === 'closer';
  }

  // ==================== LEADS & SALES CRUD ====================
  getLeads() {
    return this.state.leads || [];
  }

  getLeadById(id) {
    return (this.state.leads || []).find(l => l.id === id);
  }

  addLead(leadData) {
    const id = 'lead-' + Date.now();
    const plan = this.getPlanById(leadData.planId || 'plan-conecta');
    
    // Auto calculate value based on plan and cycle if not manually overridden or zero
    let computedValue = Number(leadData.value) || 0;
    if (plan && computedValue === 0) {
      if (leadData.billingCycle === 'quarterly') computedValue = plan.quarterlyPrice || 0;
      else if (leadData.billingCycle === 'campaign') computedValue = plan.fixedPrice || 0;
      else computedValue = plan.monthlyPrice || 0;
    }

    let selectedScreens = [];
    if (Array.isArray(leadData.selectedScreenIds)) {
      selectedScreens = leadData.selectedScreenIds;
    } else if (typeof leadData.selectedScreenIds === 'string') {
      selectedScreens = leadData.selectedScreenIds.split(',').map(s => s.trim()).filter(Boolean);
    }

    const assignedUser = this.getUserById(leadData.assignedTo || this.state.currentUserId);
    const isSellerCreation = assignedUser?.role === 'vendedor';
    const commRate = 0.10; // 10% padrão de comissão para vendedores
    const commAmount = Number((computedValue * commRate).toFixed(2));

    const newLead = {
      id,
      name: (leadData.name || 'Novo Cliente').trim(),
      company: (leadData.company || leadData.name || 'Nova Empresa').trim(),
      companyAddress: leadData.companyAddress ? leadData.companyAddress.trim() : '',
      email: (leadData.email || '').trim(),
      phone: (leadData.phone || '').replace(/\D/g, ''),
      role: leadData.role || '',
      value: computedValue,
      planId: leadData.planId || 'plan-presenca',
      billingCycle: leadData.billingCycle || 'monthly',
      mediaFormat: leadData.mediaFormat || 'foto', // 'foto', 'video', 'ambos'
      tvsCount: Number(leadData.tvsCount) || (plan ? plan.tvs : 1),
      selectedScreenIds: selectedScreens,
      priority: leadData.priority || 'alta',
      stage: isSellerCreation ? (leadData.stage || 'novo') : (leadData.stage || 'ganho'),
      approvalStatus: isSellerCreation ? (leadData.approvalStatus || 'pending_approval') : 'approved',
      sellerId: isSellerCreation ? assignedUser.id : null,
      commissionRate: isSellerCreation ? commRate : 0,
      commissionAmount: isSellerCreation ? commAmount : 0,
      commissionStatus: isSellerCreation ? 'pending' : 'none',
      origin: leadData.origin || (isSellerCreation ? 'Prospecção Vendedor' : 'WhatsApp Direto'),
      assignedTo: assignedUser ? assignedUser.id : this.state.currentUserId,
      tags: Array.isArray(leadData.tags) ? leadData.tags : (leadData.tags ? leadData.tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      notes: leadData.notes || '',
      createdAt: new Date().toISOString()
    };

    if (!this.state.leads) this.state.leads = [];
    this.state.leads.unshift(newLead);

    // Record activity
    const mediaLabel = newLead.mediaFormat === 'video' ? 'Vídeo Comercial' : (newLead.mediaFormat === 'ambos' ? 'Foto + Vídeo' : 'Foto / Encarte');
    if (isSellerCreation) {
      this.addActivity({
        leadId: id,
        type: 'note',
        title: 'Venda Cadastrada por Vendedor (Aguardando Aprovação ⏳)',
        description: `Vendedor ${assignedUser.name} cadastrou a venda de ${newLead.company} (${plan ? plan.name : 'Plano'} • ${this.formatCurrency(newLead.value)}). Comissão de 10%: ${this.formatCurrency(commAmount)}. Aguardando confirmação dos sócios.`,
        userId: assignedUser.id
      });
    } else {
      this.addActivity({
        leadId: id,
        type: 'note',
        title: 'Cliente Cadastrado no Sistema',
        description: `Cliente cadastrado no ${plan ? plan.name : 'Plano'} (${mediaLabel} • ${this.formatCurrency(newLead.value)}) na etapa "${this.getStageLabel(newLead.stage)}"`
      });

      // If added directly as won by partner, record revenue in cash flow
      if (newLead.stage === 'ganho') {
        this.recordLeadClosedIncome(newLead);
      }
    }

    this.saveState();
    return newLead;
  }

  updateLead(id, updates) {
    const idx = (this.state.leads || []).findIndex(l => l.id === id);
    if (idx === -1) return null;

    const oldLead = this.state.leads[idx];
    const prevStage = oldLead.stage;

    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (updates.selectedScreenIds && typeof updates.selectedScreenIds === 'string') {
      updates.selectedScreenIds = updates.selectedScreenIds.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (updates.value !== undefined) {
      updates.value = Number(updates.value) || 0;
      if (oldLead.sellerId) {
        updates.commissionAmount = Number((updates.value * (oldLead.commissionRate || 0.10)).toFixed(2));
      }
    }
    if (updates.tvsCount !== undefined) {
      updates.tvsCount = Number(updates.tvsCount) || 1;
    }
    if (updates.phone) {
      updates.phone = updates.phone.replace(/\D/g, '');
    }

    this.state.leads[idx] = { ...oldLead, ...updates, updatedAt: new Date().toISOString() };

    // If stage changed to 'ganho', trigger income registration in Cash Flow if not already recorded
    if (updates.stage && updates.stage !== prevStage) {
      this.addActivity({
        leadId: id,
        type: 'stage_change',
        title: `Etapa alterada para: ${this.getStageLabel(updates.stage)}`,
        description: `Lead avançou de "${this.getStageLabel(prevStage)}" para "${this.getStageLabel(updates.stage)}"`
      });

      if (updates.stage === 'ganho' && prevStage !== 'ganho' && !oldLead.sellerId) {
        this.recordLeadClosedIncome(this.state.leads[idx]);
      }
    }

    this.saveState();
    return this.state.leads[idx];
  }

  deleteLead(id) {
    const lead = this.getLeadById(id);
    this.state.leads = (this.state.leads || []).filter(l => l.id !== id);
    this.state.meetings = (this.state.meetings || []).filter(m => m.leadId !== id);
    this.state.activities = (this.state.activities || []).filter(a => a.leadId !== id);
    this.saveState();
    return lead;
  }

  updateLeadStage(id, newStage) {
    return this.updateLead(id, { stage: newStage });
  }

  // ==================== FLUXO DE APROVAÇÃO DE VENDAS DOS VENDEDORES ====================
  approveSale(leadId, partnerId = null) {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    const partner = this.getUserById(partnerId) || this.getCurrentUser();
    const seller = this.getUserById(lead.sellerId || lead.assignedTo);
    const commAmount = Number((lead.value * (lead.commissionRate || 0.10)).toFixed(2));
    const netAmount = Number((lead.value - commAmount).toFixed(2));

    lead.approvalStatus = 'approved';
    lead.stage = 'ganho';
    lead.approvedBy = partner?.id;
    lead.approvedByName = partner?.name || 'Sócio';
    lead.approvedAt = new Date().toISOString();
    lead.commissionAmount = commAmount;
    lead.commissionStatus = 'approved';

    const plan = this.getPlanById(lead.planId);
    const planName = plan ? plan.name : 'Plano de TVs';
    const mediaLabel = lead.mediaFormat === 'video' ? 'Vídeo Comercial' : (lead.mediaFormat === 'ambos' ? 'Foto + Vídeo' : 'Foto / Encarte');

    // 1. Lança faturamento bruto no Financeiro
    const txIncome = {
      type: 'income',
      description: `Venda Aprovada [${seller?.name || 'Vendedor'}]: ${lead.company || lead.name} (${planName} • ${mediaLabel})`,
      amount: lead.value,
      category: 'Venda de Plano',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      paymentMethod: 'Pix',
      partnerId: partner?.id,
      sellerId: seller?.id,
      leadId: lead.id,
      commissionAmount: commAmount,
      netAmount: netAmount,
      notes: `Venda aprovada por ${partner?.name} em ${new Date().toLocaleDateString('pt-BR')}. Comissão Vendedor: ${this.formatCurrency(commAmount)} (10%). Líquido Empresa: ${this.formatCurrency(netAmount)}.`
    };
    this.addTransaction(txIncome);

    // 2. Lança comissão do vendedor como despesa provisionada/paga
    const txCommission = {
      type: 'expense',
      description: `Comissão Vendedor (10%) - ${seller?.name || 'Vendedor'} (Ref: ${lead.company || lead.name})`,
      amount: commAmount,
      category: 'Comissão de Vendedor',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      paymentMethod: 'Pix',
      partnerId: partner?.id,
      sellerId: seller?.id,
      leadId: lead.id,
      notes: `Comissão de 10% referente à venda de ${this.formatCurrency(lead.value)} para ${lead.company || lead.name}.`
    };
    this.addTransaction(txCommission);

    // 3. Registra na timeline histórica
    this.addActivity({
      leadId: lead.id,
      type: 'won',
      title: 'Venda Confirmada & Aprovada 🎉',
      description: `Venda confirmada pelo sócio ${partner?.name}. Faturamento: ${this.formatCurrency(lead.value)} | Comissão ${seller?.name}: ${this.formatCurrency(commAmount)} (10%) | Líquido Empresa: ${this.formatCurrency(netAmount)}.`,
      userId: partner?.id
    });

    this.saveState();
    return lead;
  }

  denySale(leadId, partnerId = null, reason = 'Não informado') {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    const partner = this.getUserById(partnerId) || this.getCurrentUser();
    const seller = this.getUserById(lead.sellerId || lead.assignedTo);

    lead.approvalStatus = 'denied';
    lead.stage = 'perdido';
    lead.deniedBy = partner?.id;
    lead.deniedByName = partner?.name || 'Sócio';
    lead.deniedAt = new Date().toISOString();
    lead.denialReason = reason;
    lead.commissionStatus = 'denied';

    this.addActivity({
      leadId: lead.id,
      type: 'note',
      title: 'Venda Negada / Recusada ❌',
      description: `Venda negada pelo sócio ${partner?.name}. Motivo: ${reason}`,
      userId: partner?.id
    });

    this.saveState();
    return lead;
  }

  getPendingApprovalSales() {
    return (this.state.leads || []).filter(l => l.approvalStatus === 'pending_approval');
  }

  getSellerSales(sellerId) {
    return (this.state.leads || []).filter(l => l.sellerId === sellerId || (l.assignedTo === sellerId && this.isSeller(l.assignedTo)));
  }

  getSellerCommissions(sellerId) {
    const sales = this.getSellerSales(sellerId);
    const approvedSales = sales.filter(s => s.approvalStatus === 'approved' || (s.stage === 'ganho' && s.approvalStatus !== 'denied'));
    const pendingSales = sales.filter(s => s.approvalStatus === 'pending_approval');
    const deniedSales = sales.filter(s => s.approvalStatus === 'denied');

    const totalSold = approvedSales.reduce((sum, s) => sum + (s.value || 0), 0);
    const approvedCommission = approvedSales.reduce((sum, s) => sum + (s.commissionAmount || Number(((s.value || 0) * 0.10).toFixed(2))), 0);
    const pendingCommission = pendingSales.reduce((sum, s) => sum + (s.commissionAmount || Number(((s.value || 0) * 0.10).toFixed(2))), 0);

    return {
      totalSalesCount: sales.length,
      approvedCount: approvedSales.length,
      pendingCount: pendingSales.length,
      deniedCount: deniedSales.length,
      totalSold,
      approvedCommission,
      pendingCommission,
      salesList: sales
    };
  }

  getSellerDossier(sellerId) {
    const seller = this.getUserById(sellerId);
    const commissions = this.getSellerCommissions(sellerId);
    const hotLeads = this.getHotLeads(sellerId);
    const meetings = (this.state.meetings || []).filter(m => m.scheduledBy === sellerId || m.assignedPartnerId === sellerId);

    return {
      seller,
      commissions,
      hotLeads,
      meetings
    };
  }

  // ==================== CLIENTES EM POTENCIAL / QUENTES (HOT LEADS) ====================
  getHotLeads(sellerId = null) {
    let list = this.state.hotLeads || [];
    if (sellerId && sellerId !== 'all') {
      list = list.filter(h => h.sellerId === sellerId);
    }
    return list;
  }

  getHotLeadById(id) {
    return (this.state.hotLeads || []).find(h => h.id === id);
  }

  addHotLead(data) {
    const id = 'hot-' + Date.now();
    const newHot = {
      id,
      name: (data.name || 'Contato').trim(),
      company: (data.company || data.name || 'Empresa').trim(),
      phone: (data.phone || '').replace(/\D/g, ''),
      address: (data.address || '').trim(),
      planInterestId: data.planInterestId || 'plan-presenca',
      reasonNotClosed: (data.reasonNotClosed || 'Em análise de proposta').trim(),
      sellerId: data.sellerId || this.getCurrentUser()?.id,
      priority: data.priority || 'alta',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    if (!this.state.hotLeads) this.state.hotLeads = [];
    this.state.hotLeads.unshift(newHot);
    this.saveState();
    return newHot;
  }

  updateHotLead(id, updates) {
    if (!this.state.hotLeads) return null;
    const idx = this.state.hotLeads.findIndex(h => h.id === id);
    if (idx === -1) return null;
    this.state.hotLeads[idx] = { ...this.state.hotLeads[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveState();
    return this.state.hotLeads[idx];
  }

  deleteHotLead(id) {
    if (!this.state.hotLeads) return;
    this.state.hotLeads = this.state.hotLeads.filter(h => h.id !== id);
    this.saveState();
  }

  convertHotLeadToSale(hotLeadId, saleData = {}) {
    const hot = this.getHotLeadById(hotLeadId);
    if (!hot) return null;

    const lead = this.addLead({
      name: hot.name,
      company: hot.company || hot.name,
      companyAddress: hot.address,
      phone: hot.phone,
      email: saleData.email || '',
      role: saleData.role || 'Proprietário',
      planId: saleData.planId || hot.planInterestId || 'plan-presenca',
      billingCycle: saleData.billingCycle || 'monthly',
      mediaFormat: saleData.mediaFormat || 'foto',
      tvsCount: saleData.tvsCount || 1,
      selectedScreenIds: saleData.selectedScreenIds || [],
      value: saleData.value || 0,
      priority: 'urgente',
      stage: 'novo',
      origin: 'Cliente Quente (Convertido)',
      assignedTo: hot.sellerId || this.getCurrentUser()?.id,
      tags: ['Convertido de Quente', 'Vendedor'],
      notes: `Convertido de Cliente em Potencial. Motivo anterior de não fechamento: "${hot.reasonNotClosed}". ${saleData.notes || ''}`
    });

    this.deleteHotLead(hotLeadId);
    return lead;
  }

  // ==================== VENDEDORES CRUD (SÓCIOS) ====================
  getSellers() {
    return (this.state.users || []).filter(u => u.role === 'vendedor');
  }

  addSeller(sellerData) {
    const id = 'usr-' + Date.now();
    const newSeller = {
      id,
      name: (sellerData.name || 'Novo Vendedor').trim(),
      email: (sellerData.email || '').trim(),
      password: sellerData.password || 'conecta123',
      role: 'vendedor',
      roleName: 'Vendedor Comercial (Comissão 10%)',
      phone: sellerData.phone || '',
      avatar: sellerData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sellerData.name || 'Vendedor')}`,
      active: sellerData.active !== undefined ? sellerData.active : true,
      commissionRate: 0.10,
      createdAt: new Date().toISOString()
    };

    if (!this.state.users) this.state.users = [];
    this.state.users.push(newSeller);
    this.saveState();
    return newSeller;
  }

  toggleSellerStatus(sellerId) {
    const seller = this.getUserById(sellerId);
    if (!seller) return null;
    return this.updateUser(sellerId, { active: !seller.active });
  }

  // Automatic Income Registration when a Lead is Activated / Won by Partners
  recordLeadClosedIncome(lead) {
    const plan = this.getPlanById(lead.planId);
    const planName = plan ? plan.name : 'Plano de TVs';
    const cycleLabel = lead.billingCycle === 'quarterly' ? '3 Meses Antecipados' : (lead.billingCycle === 'campaign' ? 'Campanha Avulsa' : 'Mensalidade');
    const mediaLabel = lead.mediaFormat === 'video' ? 'Vídeo Comercial' : (lead.mediaFormat === 'ambos' ? 'Foto + Vídeo' : 'Foto / Encarte');
    
    const screenNames = (lead.selectedScreenIds || [])
      .map(sid => this.getScreenById(sid)?.name)
      .filter(Boolean)
      .join(', ');

    const tx = {
      type: 'income',
      description: `Mensalidade: ${lead.company || lead.name} (${planName} • ${mediaLabel})`,
      amount: Number(lead.value) || 0,
      category: 'Mensalidade / Plano',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      status: 'paid',
      partnerId: lead.assignedTo || this.state.currentUserId,
      leadId: lead.id,
      paymentMethod: 'Pix',
      notes: `Ativação de cliente. Locais de exibição: ${screenNames || 'Todas as TVs'}. Endereço: ${lead.companyAddress || 'Não informado'}.`
    };

  }

  // Financial Transactions CRUD
  getTransactions() {
    return this.state.transactions || [];
  }

  getTransactionById(id) {
    return (this.state.transactions || []).find(t => t.id === id);
  }

  addTransaction(txData) {
    const id = 'tx-' + Date.now();
    const newTx = {
      id,
      type: txData.type || 'income', // 'income' or 'expense'
      description: txData.description ? txData.description.trim() : 'Movimentação sem descrição',
      amount: Number(txData.amount) || 0,
      category: txData.category || (txData.type === 'expense' ? 'Outras Despesas' : 'Mensalidade / Plano'),
      date: txData.date || new Date().toISOString().split('T')[0],
      dueDate: txData.dueDate || txData.date || new Date().toISOString().split('T')[0],
      status: txData.status || 'paid', // 'paid' or 'pending'
      paymentMethod: txData.paymentMethod || 'Pix',
      partnerId: txData.partnerId || this.state.currentUserId,
      leadId: txData.leadId || null,
      notes: txData.notes || '',
      createdAt: new Date().toISOString()
    };

    if (!this.state.transactions) this.state.transactions = [];
    this.state.transactions.unshift(newTx);
    this.saveState();
    return newTx;
  }

  updateTransaction(id, updates) {
    if (!this.state.transactions) return null;
    const idx = this.state.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;

    if (updates.amount !== undefined) {
      updates.amount = Number(updates.amount) || 0;
    }

    this.state.transactions[idx] = { ...this.state.transactions[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveState();
    return this.state.transactions[idx];
  }

  deleteTransaction(id) {
    if (!this.state.transactions) return;
    this.state.transactions = this.state.transactions.filter(t => t.id !== id);
    this.saveState();
  }

  // Financial Aggregator & Summary (Filtered by Partner or All)
  getFinancialSummary(filterPartnerId = null) {
    let txs = this.getTransactions();
    if (filterPartnerId && filterPartnerId !== 'all') {
      txs = txs.filter(t => t.partnerId === filterPartnerId);
    }

    const paidIncomes = txs.filter(t => t.type === 'income' && t.status === 'paid').reduce((s, t) => s + (t.amount || 0), 0);
    const pendingIncomes = txs.filter(t => t.type === 'income' && t.status === 'pending').reduce((s, t) => s + (t.amount || 0), 0);

    const paidExpenses = txs.filter(t => t.type === 'expense' && t.status === 'paid').reduce((s, t) => s + (t.amount || 0), 0);
    const pendingExpenses = txs.filter(t => t.type === 'expense' && t.status === 'pending').reduce((s, t) => s + (t.amount || 0), 0);

    // Dynamic Network TV Fixed Operational Costs (R$ 35,00/mês por TV instalada)
    const screens = this.getScreens();
    const activeScreens = screens.filter(s => s.status === 'active');
    const totalNetworkTvs = activeScreens.reduce((sum, s) => sum + (s.tvsCount || 1), 0);
    const costPerTv = this.COST_PER_TV || 35.00;
    const tvFixedMonthlyCost = totalNetworkTvs * costPerTv; // ex: 5 TVs * R$ 35 = R$ 175,00

    const isGlobal = !filterPartnerId || filterPartnerId === 'all';
    const totalOperationalExpenses = paidExpenses + (isGlobal ? tvFixedMonthlyCost : 0);
    const netBalance = paidIncomes - totalOperationalExpenses;
    const projectedBalance = (paidIncomes + pendingIncomes) - (totalOperationalExpenses + pendingExpenses);

    // Calculate MRR (Monthly Recurring Revenue) from active clients
    const activeLeads = this.getLeads().filter(l => l.stage === 'ganho');
    let mrr = 0;
    let totalActiveTVs = 0;

    activeLeads.forEach(l => {
      const plan = this.getPlanById(l.planId);
      totalActiveTVs += (l.tvsCount || (plan ? plan.tvs : 1));
      if (l.billingCycle === 'quarterly') {
        mrr += (l.value ? l.value / 3 : (plan ? plan.quarterlyPrice / 3 : 0));
      } else if (l.billingCycle === 'campaign') {
        // Campanha avulsa
      } else {
        mrr += (l.value || (plan ? plan.monthlyPrice : 0));
      }
    });

    return {
      totalIncomePaid: paidIncomes,
      totalIncomePending: pendingIncomes,
      totalExpensePaid: totalOperationalExpenses,
      manualExpensesPaid: paidExpenses,
      tvFixedMonthlyCost,
      costPerTv,
      totalNetworkTvs,
      totalExpensePending: pendingExpenses,
      netBalance,
      projectedBalance,
      mrr,
      totalActiveTVs,
      activeClientsCount: activeLeads.length
    };
  }

  // Meetings CRUD & Queries
  getMeetings() {
    return this.state.meetings || [];
  }

  getMeetingById(id) {
    return (this.state.meetings || []).find(m => m.id === id);
  }

  getMeetingsForLead(leadId) {
    return (this.state.meetings || []).filter(m => m.leadId === leadId);
  }

  getTodayMeetings(partnerId = null) {
    const todayStr = new Date().toISOString().split('T')[0];
    let list = (this.state.meetings || []).filter(m => m.date === todayStr && m.status === 'scheduled');
    if (partnerId && partnerId !== 'all') {
      list = list.filter(m => m.assignedPartnerId === partnerId || (Array.isArray(m.participants) && m.participants.includes(partnerId)) || m.scheduledBy === partnerId);
    }
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }

  getTomorrowMeetings(partnerId = null) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    let list = (this.state.meetings || []).filter(m => m.date === tomorrowStr && m.status === 'scheduled');
    if (partnerId && partnerId !== 'all') {
      list = list.filter(m => m.assignedPartnerId === partnerId || (Array.isArray(m.participants) && m.participants.includes(partnerId)) || m.scheduledBy === partnerId);
    }
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }

  addMeeting(meetingData) {
    const id = 'meet-' + Date.now();
    const lead = meetingData.leadId ? this.getLeadById(meetingData.leadId) : null;

    let participants = [];
    if (Array.isArray(meetingData.participants)) {
      participants = meetingData.participants;
    } else if (typeof meetingData.participants === 'string') {
      participants = meetingData.participants.split(',').map(p => p.trim()).filter(Boolean);
    }
    if (participants.length === 0 && meetingData.assignedPartnerId) {
      participants = [meetingData.assignedPartnerId];
    }

    const newMeeting = {
      id,
      title: meetingData.title.trim(),
      leadId: meetingData.leadId || null,
      companyName: meetingData.companyName || (lead ? lead.company : 'Empresa'),
      contactPerson: meetingData.contactPerson || (lead ? lead.name : 'Responsável'),
      phone: meetingData.phone || (lead ? lead.phone : ''),
      address: meetingData.address || (lead ? lead.companyAddress : ''),
      meetingType: meetingData.meetingType || 'presencial', // 'presencial' or 'online'
      link: meetingData.link ? meetingData.link.trim() : '',
      scheduledBy: meetingData.scheduledBy || this.state.currentUserId,
      assignedPartnerId: meetingData.assignedPartnerId || this.state.currentUserId,
      participants,
      date: meetingData.date,
      time: meetingData.time,
      duration: Number(meetingData.duration) || 60,
      status: meetingData.status || 'scheduled',
      notes: meetingData.notes || '',
      createdAt: new Date().toISOString()
    };

    if (!this.state.meetings) this.state.meetings = [];
    this.state.meetings.unshift(newMeeting);

    // Record activity in lead timeline if associated
    if (newMeeting.leadId) {
      const scheduledUser = this.getUserById(newMeeting.scheduledBy);
      const assignedUser = this.getUserById(newMeeting.assignedPartnerId);
      this.addActivity({
        leadId: newMeeting.leadId,
        type: 'call',
        title: `Reunião Agendada: ${newMeeting.title}`,
        description: `Agendada por ${scheduledUser?.name || 'Sócio'} para ${assignedUser?.name || 'Sócio'}. Contato: ${newMeeting.contactPerson}. Data: ${this.formatDisplayDate(newMeeting.date)} às ${newMeeting.time}.`
      });

      if (lead && (lead.stage === 'novo' || lead.stage === 'qualificacao')) {
        this.updateLeadStage(lead.id, 'reuniao');
      }
    }

    this.saveState();
    return newMeeting;
  }

  updateMeeting(id, updates) {
    const idx = (this.state.meetings || []).findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.state.meetings[idx] = { ...this.state.meetings[idx], ...updates, updatedAt: new Date().toISOString() };
    this.saveState();
    return this.state.meetings[idx];
  }

  deleteMeeting(id) {
    this.state.meetings = (this.state.meetings || []).filter(m => m.id !== id);
    this.saveState();
  }

  // Timeline Activities
  getActivitiesForLead(leadId) {
    return this.state.activities.filter(a => a.leadId === leadId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getAllActivities() {
    return this.state.activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addActivity(activityData) {
    const newAct = {
      id: 'act-' + Date.now() + Math.random().toString(36).substring(2, 5),
      leadId: activityData.leadId,
      type: activityData.type || 'note',
      title: activityData.title.trim(),
      description: activityData.description || '',
      userId: this.state.currentUserId,
      timestamp: new Date().toISOString()
    };
    this.state.activities.unshift(newAct);
    this.saveState();
    return newAct;
  }

  // Users & Access Management
  getUsers() {
    return this.state.users || [];
  }

  getUserById(id) {
    return this.state.users.find(u => u.id === id);
  }

  addUser(userData) {
    const id = 'usr-' + Date.now();
    const roleLabels = {
      admin: 'Sócio Diretor (Acesso Total)',
      manager: 'Sócio Gestor Comercial',
      closer: 'Sócia Executiva de Vendas'
    };

    const newUser = {
      id,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: userData.role || 'closer',
      roleName: roleLabels[userData.role] || 'Sócio(a)',
      phone: userData.phone || '',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      active: true,
      createdAt: new Date().toISOString()
    };

    this.state.users.push(newUser);
    this.saveState();
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.state.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.state.users[idx] = { ...this.state.users[idx], ...updates };
    this.saveState();
    return this.state.users[idx];
  }

  deleteUser(id) {
    if (this.state.users.length <= 1) {
      throw new Error('Não é possível remover o único usuário do sistema.');
    }
    this.state.users = this.state.users.filter(u => u.id !== id);
    if (this.state.currentUserId === id) {
      this.state.currentUserId = this.state.users[0].id;
    }
    this.saveState();
  }

  // Utility helpers
  getStageLabel(stageKey) {
    const labels = {
      novo: 'Novo Lead',
      qualificacao: 'Qualificação',
      reuniao: 'Reunião Agendada',
      proposta: 'Proposta Apresentada',
      negociacao: 'Em Negociação',
      ganho: 'Ganho (Fechado)',
      perdido: 'Perdido'
    };
    return labels[stageKey] || stageKey;
  }

  formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val) || 0);
  }

  formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  // Backup & Export
  exportToCSV() {
    const leads = this.getLeads();
    const headers = ['ID', 'Cliente/Empresa', 'E-mail', 'Telefone', 'Contato', 'Plano', 'TVs', 'Ciclo', 'Valor (R$)', 'Prioridade', 'Etapa', 'Origem', 'Sócio Responsável', 'Data Cadastro'];
    
    const rows = leads.map(l => {
      const user = this.getUserById(l.assignedTo);
      const plan = this.getPlanById(l.planId);
      return [
        l.id,
        `"${l.name.replace(/"/g, '""')}"`,
        l.email,
        l.phone,
        `"${(l.role || '').replace(/"/g, '""')}"`,
        `"${plan ? plan.name : 'N/A'}"`,
        l.tvsCount || (plan ? plan.tvs : 1),
        l.billingCycle || 'monthly',
        l.value,
        l.priority,
        this.getStageLabel(l.stage),
        l.origin,
        user ? user.name : 'Não atribuído',
        l.createdAt
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_conecta_mais_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportTransactionsCSV() {
    const txs = this.getTransactions();
    const headers = ['ID', 'Tipo', 'Descrição', 'Valor (R$)', 'Categoria', 'Data', 'Vencimento', 'Status', 'Forma Pagamento', 'Sócio Responsável'];
    
    const rows = txs.map(t => {
      const user = this.getUserById(t.partnerId);
      return [
        t.id,
        t.type === 'income' ? 'Entrada' : 'Saída',
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount,
        `"${t.category}"`,
        t.date,
        t.dueDate,
        t.status === 'paid' ? 'Pago/Recebido' : 'Pendente',
        t.paymentMethod || 'Pix',
        user ? user.name : 'Geral'
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fluxo_caixa_conecta_mais_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportToJSON() {
    const dataStr = JSON.stringify(this.state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `conecta_mais_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.leads || !parsed.users) {
        throw new Error('Arquivo de backup inválido.');
      }
      this.state = parsed;
      this.saveState();
      return true;
    } catch (e) {
      console.error('Erro ao importar JSON:', e);
      throw e;
    }
  }

  resetDemoData() {
    const seed = this.getDefaultSeedData();
    this.state = seed;
    this.saveState();
  }
}

// Global state instance
window.crmStore = new CRMStore();

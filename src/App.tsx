import { Fragment, useEffect, useRef, useState, type JSX } from 'react';
import baixiJournalBodyZh from './content/baixi-xyz-小白建站全记录.md?raw';
import baixiJournalBodyEn from './content/baixi-xyz-build-log.en.md?raw';
import vibeCodingJournalBodyZh from './content/vibe-coding-portfolio-retrospective.md?raw';
import vibeCodingJournalBodyEn from './content/vibe-coding-portfolio-retrospective.en.md?raw';
import { applySeoMetadata } from './seo';
import {
  caseSlugById,
  getCasePath,
  getJournalPath,
  localizePath,
  parseLocalizedPath,
  type SiteLanguage,
} from './routes';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Compass,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers3,
  Mail,
  Menu,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from 'lucide-react';

type Language = SiteLanguage;
type Theme = 'dark' | 'light';
type BrandName = 'Gate' | 'Coins.ph' | 'Binance' | 'Ctrip.com' | 'WeWork' | 'HAND';

const brandLogoAssets: Record<BrandName, { src: string; bg: string; border: string; shadow: string; pad?: string }> = {
  Gate: {
    src: '/logos/gate-cropped.png',
    bg: '#fffafa',
    border: 'rgba(222, 89, 89, 0.38)',
    shadow: '0 18px 48px rgba(222, 89, 89, 0.18)',
    pad: '13px',
  },
  'Coins.ph': {
    src: '/logos/coins.svg',
    bg: '#17191d',
    border: 'rgba(238, 160, 35, 0.42)',
    shadow: '0 18px 48px rgba(31, 122, 255, 0.16)',
    pad: '12px',
  },
  Binance: {
    src: '/logos/binance.svg',
    bg: '#17130b',
    border: 'rgba(240, 185, 11, 0.56)',
    shadow: '0 18px 48px rgba(240, 185, 11, 0.20)',
    pad: '14px',
  },
  'Ctrip.com': {
    src: '/logos/ctrip.png',
    bg: '#f7fbff',
    border: 'rgba(47, 109, 246, 0.46)',
    shadow: '0 18px 48px rgba(47, 109, 246, 0.18)',
    pad: '10px',
  },
  WeWork: {
    src: '/logos/wework.png',
    bg: '#ffffff',
    border: 'rgba(244, 241, 232, 0.30)',
    shadow: '0 18px 48px rgba(244, 241, 232, 0.12)',
    pad: '13px',
  },
  HAND: {
    src: '/logos/hand-cropped.png',
    bg: '#ffffff',
    border: 'rgba(236, 32, 48, 0.35)',
    shadow: '0 18px 48px rgba(236, 32, 48, 0.14)',
    pad: '10px',
  },
};

const schoolLogoAssets = {
  manchester: {
    src: '/logos/manchester.png',
    bg: '#ffffff',
    border: 'rgba(108, 38, 130, 0.34)',
    pad: '10px',
  },
  tianfu: {
    src: '/logos/tianfu.png',
    bg: '#172033',
    border: 'rgba(218, 164, 76, 0.40)',
    pad: '10px',
  },
};

const nav = {
  zh: [
    ['案例故事', '#case-studies'],
    ['工作方法', '#method'],
    ['职业背景', '#background'],
    ['教育背景', '#education'],
    ['联系交流', '#contact'],
  ],
  en: [
    ['Cases', '#case-studies'],
    ['Method', '#method'],
    ['Career', '#background'],
    ['Education', '#education'],
    ['Contact', '#contact'],
  ],
};

const content = {
  zh: {
    greetingLead: '你好，',
    greetingFocus: '我是',
    name: '刘柏希',
    role: '业务型 PMO / 项目集与项目组合管理负责人',
    manifesto: '我关心真正影响交付的事：方向、风险、资源和决策。',
    primary: '查看案例',
    secondary: '联系我',
    journeyKicker: '职业路径',
    journeyTitle: '一条围绕判断展开的路径',
    journeyIntro:
      '从 ROI 评审到全球支付，再到国际化落地和多业务线治理，我的路径始终围绕同一件事：在复杂现场做判断，让团队看清下一步。',
    methodKicker: '工作方法',
    methodTitle: '把复杂协作理成清晰节奏',
    methodIntro: '做项目管理，我通常先看价值、风险、资源和决策。真正考验人的，往往是判断能不能提前。',
    journalKicker: '学习札记',
    journalTitle: '把新的工作方式记下来',
    journalIntro: '持续记录 Vibe Coding、AI PMO 和个人工作流，也记录这些实践带来的判断与变化。',
    experienceKicker: '项目案例',
    experienceTitle: '几个关键项目现场',
    experienceIntro:
      '这些案例覆盖品牌切换、设计交付、增长、支付、合规和国际化场景，也更接近我工作里最有代表性的几个现场。',
    educationKicker: '教育经历',
    educationTitle: '从项目现场走向系统学习',
    educationIntro:
      '开始做项目管理之后，我慢慢意识到，这份工作背后其实是对目标、协同和资源取舍的判断。后来选择商业项目管理，也是想把这些现场经验放进更系统的方法里，让自己的路径走得更清楚。',
    contactKicker: '联系方式',
    contactTitle: '保持联系',
    contactBody: '如果你想进一步了解我的项目治理、全球交付或 AI PMO 实践，欢迎通过邮件或领英联系我。',
    website: '官网',
    linkedin: '领英',
  },
  en: {
    greetingLead: 'Hi,',
    greetingFocus: "I'm",
    name: 'Cyril Liu',
    role: 'PMO / Program & Portfolio Management Lead',
    manifesto: 'I focus on the parts of work that shape delivery: direction, risk, resourcing, and decisions.',
    primary: 'View Cases',
    secondary: 'Contact',
    journeyKicker: 'Career',
    journeyTitle: 'A Career Built on Judgment',
    journeyIntro:
      'From ROI review to global payments, market launches, and portfolio governance, the pattern in my work has stayed the same: make clear calls in complex settings and give teams a clear next move.',
    methodKicker: 'Method',
    methodTitle: 'Bringing Order to Complex Work',
    methodIntro:
      'I come back to four questions: what matters, where the risk sits, what resources are actually available, and who needs to decide.',
    journalKicker: 'Learning Log',
    journalTitle: 'Working Notes',
    journalIntro:
      'This is where I keep notes on Vibe Coding, AI PMO, and workflow experiments. What matters to me is how they change real work.',
    experienceKicker: 'Case Studies',
    experienceTitle: 'Selected Case Studies',
    experienceIntro:
      'These cases span brand migration, design delivery, growth, payments, compliance, and market launches. Together they show the way I work: read the situation clearly, then organize the work around it.',
    educationKicker: 'Education',
    educationTitle: 'From Project Work to Formal Study',
    educationIntro:
      'After a few years in project management, I understood that the work ran deeper than scheduling. Commercial Project Management gave me a more formal framework for thinking about goals, coordination, and trade-offs, and sharpened the path toward business-oriented PMO work.',
    contactKicker: 'Contact',
    contactTitle: "Let's Connect",
    contactBody: 'For conversations about project governance, global delivery, or AI PMO, email or LinkedIn is the best place to start.',
    website: 'Website',
    linkedin: 'LinkedIn',
  },
};

const journey = {
  zh: {
    memoTitle: '先看清，再推进',
    memo:
      '我做 PMO 时先看两件事：关键问题有没有及时浮上来，决定是不是落在合适的人手里。项目越复杂，越不能只盯进度。目标、代价、依赖和风险一旦说不清，后面的执行只会越来越贵。',
    signals: ['价值判断', '交付秩序', '风险前置', '机制沉淀'],
    path: [
      {
        year: '2019 - 2021',
        company: 'Ctrip.com',
        phase: '价值判断',
        source: '携程 / ROI 委员会',
        title: '价值判断先于排期。',
        body:
          '在携程参与 ROI 评审，让我更早接触到需求进入研发队列前的价值判断。自由行、交易中台、结算中台和研发效能分析的经历，也让我把项目管理的视线前移到投入、回报和优先级。这成为我后来处理项目组合的起点。',
        proof: 'ROI 委员会评审 / 研发效能分析 / 交易与结算中台',
      },
      {
        year: '2021 - 2023',
        company: 'Binance',
        phase: '全球交付',
        source: 'Binance / 全球法币支付',
        title: '让全球团队按同一套标准交付。',
        body:
          '法币支付牵涉合规、风控、区域业务、运营和研发。监管判断和区域策略一变化，项目边界就会移动。我的工作，是把边界、验收和升级路径讲清楚，让 E2E 流程、DOD、风险审计和问题升级进入日常秩序。',
        proof: '2022 年约 45% 全球法币支付项目 / E2E 流程 / DOD',
      },
      {
        year: '2024 - 2025',
        company: 'Coins.ph',
        phase: '国际化落地',
        source: 'Coins.ph / 市场拓展',
        title: '国际化落地考验的是路径感。',
        body:
          '澳大利亚、巴西、欧洲市场各有自己的进入条件。监管判断、KYC、法币链路、钱包隔离、合作方节奏和上线验收都会改写项目边界。这段经历让我更习惯在变化里识别约束，再把它整理成优先级、依赖、风险和下一步动作。',
        proof: '澳大利亚 / 巴西 / 欧洲市场拓展 / 交付周期缩短约 15%',
      },
      {
        year: '2025 - 2026.04',
        company: 'Gate',
        phase: '组合治理',
        source: 'Gate / 多业务线 PMO',
        title: '把高并发项目收进同一张管理视图。',
        body:
          'Gate 的难度在于多条业务线同时加速：品牌升级、增长、支付卡、AI 提效和实验项目都在争资源和注意力。我的工作，是让每条线的状态、风险和取舍及时被看见。需求池、状态看板、风险预警、管理层周报和 AI 辅助分析，也在这个过程中慢慢长成一套可复用的组合治理方式。',
        proof: 'Gate.com 3 周迁移无重大事故 / SEO GEO ASO / AI PMO',
      },
    ],
  },
  en: {
    memoTitle: 'See clearly, then move',
    memo:
      'The work I care about starts before a project goes off track. The real question is whether the right issues become visible early enough, and whether decisions are made by the right people. Once goals, costs, dependencies, and risks blur together, execution becomes expensive.',
    signals: ['Value judgment', 'Delivery rhythm', 'Risk visibility', 'Operating discipline'],
    path: [
      {
        year: '2019 - 2021',
        company: 'Ctrip.com',
        phase: 'Business judgment',
        source: 'Ctrip.com / ROI committee',
        title: 'Decide value before you schedule.',
        body:
          'At Ctrip, ROI reviews pushed project work upstream into business judgment. Before a request entered the engineering queue, it had to justify its place in terms of business value, return, priority, and resource cost. That perspective stayed with me and later shaped how I looked at programs and portfolios.',
        proof: 'ROI review / engineering efficiency / transaction and settlement platforms',
      },
      {
        year: '2021 - 2023',
        company: 'Binance',
        phase: 'Global delivery',
        source: 'Binance / Global fiat payments',
        title: 'Put global teams on the same delivery standard.',
        body:
          "Fiat payments sat across compliance, risk, regional business, operations, and engineering. When regulation or regional strategy changed, the program boundary moved too. I kept scope, acceptance, and escalation clear, then made E2E flow, DOD, and risk review part of the team's operating rhythm.",
        proof: 'Around 45% of 2022 global fiat payment projects / E2E flow / DOD',
      },
      {
        year: '2024 - 2025',
        company: 'Coins.ph',
        phase: 'International launch',
        source: 'Coins.ph / Market expansion',
        title: 'Turn changing market rules into a viable launch path.',
        body:
          'Australia, Brazil, and Europe each came with different entry conditions. Regulation, KYC, fiat rails, wallet setup, partner readiness, and launch criteria kept shifting the project boundary. I learned to spot constraints early and turn them into priorities, risks, dependencies, and next steps.',
        proof: 'Australia / Brazil / Europe expansion / around 15% shorter delivery cycles',
      },
      {
        year: '2025 - Apr 2026',
        company: 'Gate',
        phase: 'Portfolio governance',
        source: 'Gate / PMO across multiple business lines',
        title: 'Bring parallel programs into one management view.',
        body:
          'At Gate, several business lines accelerated at once: brand upgrade, growth, payment cards, AI efficiency, and experiments. Each one competed for resources and attention. I made status, risk, and trade-offs visible early, and gradually turned demand pools, dashboards, risk alerts, executive reporting, and AI-assisted analysis into a repeatable portfolio governance model.',
        proof: 'Gate.com migration in 3 weeks without major incidents / SEO, GEO, ASO / AI PMO',
      },
    ],
  },
};

const methodCards = {
  zh: [
    {
      number: '01',
      title: '先判断价值，再组织项目',
      body: '需求进入队列前，先看它服务的业务目标、预期收益和资源代价，再决定项目组合、节奏和取舍。',
      case: 'SEO / GEO / ASO 从散点需求被整理成增长项目组合。',
    },
    {
      number: '02',
      title: '风险要在变大前出现',
      body: '方案、资源、验收和依赖刚出现偏差，风险就应该进入团队和管理层视野。',
      case: 'Gate.com 迁移中，触点清单和验收截图让遗漏更早暴露。',
    },
    {
      number: '03',
      title: '汇报要服务判断',
      body: '好的汇报只回答几件事：目标是否还成立，资源够不够，哪些问题需要升级，下一步由谁负责。',
      case: 'RDER / Card 汇报从进度同步转向资源、优先级和风险判断。',
    },
    {
      number: '04',
      title: 'AI 应该进入 PMO 的日常工作流',
      body: 'AI 负责整理信息、发现异常、生成初稿，把人的时间留给取舍、沟通和推动。',
      case: '周报、迭代分析和风险梳理减少了重复整理时间。',
    },
  ],
  en: [
    {
      number: '01',
      title: 'Judge value before organizing the work',
      body: 'Before a request enters the queue, look at the goal, expected return, and resource cost. Only then decide the portfolio, rhythm, and trade-offs.',
      case: 'SEO / GEO / ASO moved from scattered requests into a growth portfolio.',
    },
    {
      number: '02',
      title: 'Risk should surface early',
      body: 'When plans, resources, acceptance criteria, or dependencies begin to drift, risk should already be visible to both the team and leadership.',
      case: 'Gate.com migration used touchpoint maps and validation screenshots to expose gaps early.',
    },
    {
      number: '03',
      title: 'Reporting should sharpen judgment',
      body: 'Good reporting answers a small set of questions: is the goal still valid, are resources enough, what needs escalation, and who owns the next step?',
      case: 'RDER / Card reporting moved from progress updates to resource and risk decisions.',
    },
    {
      number: '04',
      title: 'AI should support the PMO workflow',
      body: 'AI can organize information, detect anomalies, and draft reports. That leaves more time for trade-offs, communication, and follow-through.',
      case: 'Weekly reports, sprint analysis, and risk reviews became less repetitive to prepare.',
    },
  ],
};

type JournalEntry = {
  slug: string;
  tag: string;
  date: string;
  title: string;
  summary: string;
  body?: string;
  sourceUrl?: string;
};

const journalEntries: Record<Language, JournalEntry[]> = {
  zh: [
    {
      slug: 'vibe-coding-portfolio-retrospective',
      tag: 'Vibe Coding',
      date: '2026.06.03',
      title: '从一个个人网站开始，重新理解 Vibe Coding',
      summary:
        '这篇复盘记录了我用 AI 协作完成个人品牌网站的过程。页面只是结果，真正值得记下来的，是产品定义、提示词设计、设计验收和非技术背景下的 AI Coding 协作方式。',
      body: vibeCodingJournalBodyZh,
    },
    {
      slug: 'baixi-xyz-launch-log',
      tag: '建站记录',
      date: '2026.05.23',
      title: '从买服务器到网站上线的第一条流水线',
      summary:
        '我把 baixi.xyz 从服务器、域名、DNS、防火墙、Nginx、证书到备案的整个上线过程完整记了下来。它当然是一篇建站记录，但对我来说，更像一次把真实部署、非技术视角和 AI 协作放进同一条交付链路里的实践。',
      body: baixiJournalBodyZh,
      sourceUrl: 'https://www.baixi.xyz/',
    },
  ],
  en: [
    {
      slug: 'vibe-coding-portfolio-retrospective',
      tag: 'Vibe Coding',
      date: '2026.06.03',
      title: 'What Building My Portfolio Taught Me About Vibe Coding',
      summary:
        'A reflection on building my personal portfolio with AI: what worked, what broke down, and what I learned about product framing, prompts, design review, and AI-assisted delivery as a non-engineer.',
      body: vibeCodingJournalBodyEn,
    },
    {
      slug: 'baixi-xyz-launch-log',
      tag: 'Build Log',
      date: '2026.05.23',
      title: 'From Buying a Server to Launching My First Site',
      summary:
        'This is my own record of how baixi.xyz went from a fresh server and domain to a live site, with DNS, firewall rules, Nginx, HTTPS, and ICP filing all connected along the way.',
      body: baixiJournalBodyEn,
    },
  ],
};

type CaseStudy = {
  id: string;
  company: BrandName;
  label: string;
  title: string;
  summary: string;
  overview: {
    project: string;
    ownership: string;
    constraint: string;
    outcome: string;
  };
  concept?: {
    label: string;
    title: string;
    intro: string;
    items: Array<{
      term: string;
      title: string;
      description: string;
    }>;
    foundationLabel: string;
    foundation: string;
  };
  role: string;
  metrics: string[];
  tags: string[];
  announcement?: {
    label: string;
    title: string;
    date?: string;
    url: string;
  };
  details: {
    background: string;
    challenge: string;
    role: string;
    actions: string[];
    systemBuilt: string[];
    result: string;
    reflection: string;
  };
};

const caseStudies: Record<Language, CaseStudy[]> = {
  zh: [
    {
      id: 'gate-domain',
      company: 'Gate',
      label: '案例 01 / 品牌焕新与域名迁移',
      title: '3 周完成一次全站级品牌切换',
      summary:
        'Gate.io 到 Gate.com 牵动应用端、官网、活动页、社媒、邮件、客服、帮助中心和多语言站点。我负责把这次高风险切换整理成一套清楚的推进节奏。',
      overview: {
        project: 'Gate.io 向 Gate.com 的品牌升级与域名迁移，覆盖应用端、官网、活动页、社媒、邮件、客服、帮助中心及多语言站点。',
        ownership: '我作为项目负责人统筹触点盘点、责任分工、切换窗口、风险同步、验收证据和管理层进展视图。',
        constraint: '项目在入职早期启动，只有三周窗口；任何外部入口遗漏或延迟，都会直接影响用户体验与品牌一致性。',
        outcome: '全站迁移按期完成且无重大事故，形成的触点清单和验收机制也成为后续多项目治理的基础。',
      },
      role: '项目负责人 / 跨团队协调 / 风险与验收机制设计',
      metrics: ['3 周完成迁移', '无重大事故', '覆盖多端、多语言、多触点'],
      tags: ['品牌迁移', '风险控制', '切换治理'],
      announcement: {
        label: '官方公告',
        title: '查看 Gate 品牌焕新公告',
        date: '2025.05.19',
        url: 'https://www.gate.com/zh/announcements/article/45055',
      },
      details: {
        background:
          '我在 Gate 接手的第一场关键项目，是 Gate.io 到 Gate.com 的品牌升级与域名迁移。时间紧，关注度高，窗口期也很短。',
        challenge:
          '真正的压力来自触点同步。只要有一个外部入口慢半步，用户就会先看到问题，品牌一致性也会立刻被放大。',
        role:
          '我负责统筹触点、切换窗口、验收证据、风险同步和管理层视图，让多个团队按同一套节奏推进。',
        actions: ['建立全触点清单', '拆分切换窗口和责任人', '用截图和链接作为验收证据', '每日同步风险和遗漏项'],
        systemBuilt: ['迁移作战表', '触点验收机制', '风险日同步', '管理层进展视图'],
        result: '三周完成迁移，无重大事故。这件事也让我很快进入 Gate 的业务核心。',
        reflection:
          '大型切换项目能稳住，前提是边界、责任和确认方式足够清楚。',
      },
    },
    {
      id: 'ai-pmo',
      company: 'Gate',
      label: '案例 02 / AI + PMO 自动化',
      title: '把高频 PMO 工作整理成可复用流程',
      summary:
        '多业务线并行后，周报、迭代分析和风险梳理占掉了很多重复时间。我把飞书多维表格、Meegle、MCP 和 AI 技能接进流程，先整理信息，再由 PM 完成判断，并把 SEO 关键词采集、内容生成和效果复盘串成一条工作流。',
      overview: {
        project: '围绕多业务线周报、迭代分析、风险梳理和 SEO 内容运营，我搭建了由飞书多维表格、Meegle、MCP 与 AI 技能组成的辅助工作流。',
        ownership: '我负责梳理数据结构、定义风险字段与输出模板，并把关键词采集、内容生成和效果复盘接入同一条流程。',
        constraint: '项目数据分散在不同工具和团队中，自动化还必须保留 PM 对信息质量、优先级和风险取舍的最终判断。',
        outcome: '周报与分析初稿可在约十分钟内形成，SEO 运营形成连续闭环，重复整理时间明显减少。',
      },
      concept: {
        label: '流程关系',
        title: 'AI 辅助工作流如何分工',
        intro: '项目数据先进入统一结构，工具连接、初稿生成和最终判断各有明确责任，自动化才不会放大原有的信息问题。',
        items: [
          {
            term: 'MCP',
            title: '连接工具与数据',
            description: '让 AI 在受控接口中读取项目数据，并调用既定工具完成处理。',
          },
          {
            term: 'AI 技能',
            title: '执行可复用步骤',
            description: '按照固定规则整理信息、识别异常，并生成周报或分析初稿。',
          },
          {
            term: 'PM 判断',
            title: '完成校验与取舍',
            description: '确认信息质量，判断优先级和风险，再决定沟通与推进动作。',
          },
        ],
        foundationLabel: '责任边界',
        foundation: '自动化承担整理和初稿，PM 保留判断、决策与沟通责任',
      },
      role: 'AI PMO 实践者 / 自动化流程设计 / 项目数据分析',
      metrics: ['周报与分析初稿约 10 分钟生成', '串联 SEO 关键词采集与内容复盘', '沉淀 AI 辅助 PMO 流程'],
      tags: ['AI 工作流', '汇报自动化', '风险识别'],
      details: {
        background:
          '多业务线并行后，信息流转和汇报成本很快上升。只靠手工整理，很难支撑稳定输出。',
        challenge:
          '需求散在不同工具和团队里，周报、迭代分析和风险识别都依赖人工汇总，既慢，也容易漏。',
        role:
          '我设计并推动一套 AI 辅助流程，把项目数据、需求流转和报告初稿先整理出来，再交给 PM 校准判断。',
        actions: [
          '梳理飞书多维表格与 Meegle 数据结构',
          '用 MCP 和 AI 技能生成周报与分析初稿',
          '把 SEO 关键词采集、产文和复盘串成一条增长工作流',
          '建立风险识别字段和输出模板',
          '把 PM 判断保留在最终取舍环节',
        ],
        systemBuilt: ['SEO 关键词采集到内容复盘工作流', '周报初稿生成流程', '迭代分析模板', '风险识别与升级清单'],
        result:
          '周报、迭代分析和风险梳理的初稿可以在约 10 分钟内形成，PM 随后完成校准、取舍和沟通。',
        reflection:
          'AI 负责整理和归纳，取舍、沟通和推进仍由人完成。',
      },
    },
    {
      id: 'design-delivery-automation',
      company: 'Gate',
      label: '案例 03 / 设计交付体系自动化',
      title: '从需求表单到 OKR 复盘：设计团队交付体系自动化',
      summary:
        '视觉、影视、品牌和工业设计团队每天承接大量来自业务侧的设计需求。我把表单、多维表格、Meegle 和 OKR 数据串起来，让需求提交、自动建单、排单流转、验收确认和效能复盘进入同一套工作系统。',
      overview: {
        project: '为视觉、影视、品牌和工业设计团队搭建设计交付系统，贯通业务提需、结构化收集、自动建单、排单流转、验收确认和 OKR 复盘。',
        ownership: '我负责梳理完整交付链路，设计提需表单和多维表格需求池，并通过 API 将需求同步至 Meegle。',
        constraint: '周均两百余项需求来自多个业务方向，早期入口分散，建单、分单、追状态和完结通知高度依赖人工。',
        outcome: '系统稳定支撑周均 200+ 需求流转，减少重复协调，并让进度、响应效率、团队产能和目标完成情况可以持续复盘。',
      },
      concept: {
        label: '系统关系',
        title: '一条需求如何完成流转',
        intro: '三个工具分别负责需求入口、交付过程和目标复盘。需求编号贯穿其中，减少重复建单和状态追问。',
        items: [
          {
            term: '多维表格',
            title: '统一需求入口',
            description: '承接表单信息，统一记录需求背景、交付物、时限和验收口径。',
          },
          {
            term: 'Meegle',
            title: '管理任务与交付',
            description: '自动建单后完成排单、流转、业务验收、交付确认和完结通知。',
          },
          {
            term: 'OKR',
            title: '连接目标与复盘',
            description: '用真实交付数据观察进度、响应效率、团队产能和目标完成情况。',
          },
        ],
        foundationLabel: '贯穿主线',
        foundation: '同一需求编号连接提需、任务、验收和目标数据',
      },
      role: '设计团队 PMO / 流程自动化设计 / 交付效能管理',
      metrics: ['支撑周均 200+ 设计需求流转', '表单到 Meegle 自动建单', '交付进度与 OKR 数据可复盘'],
      tags: ['设计运营', 'Meegle 自动化', '交付效能分析'],
      details: {
        background:
          'Gate 的设计团队服务多个业务方向，需求入口多、交付节奏快，视觉、影视、品牌和工业设计团队都需要稳定承接业务侧需求。',
        challenge:
          '早期需求容易散落在聊天、会议和临时文档里。建单、分单、追状态、验收和完结通知都依赖人工处理，管理层也很难持续看到团队产能和目标进展。',
        role:
          '我负责梳理设计需求从提交到交付确认的完整链路，并把团队目标、OKR 和交付数据接入同一套管理视图。',
        actions: [
          '设计业务方提需表单，统一收集需求背景、交付物、时间要求和验收口径',
          '用多维表格承接表单信息，形成结构化需求池',
          '通过 API 将多维表格需求同步到 Meegle，自动创建需求任务',
          '在 Meegle 中配置排单、流程流转、业务验收、交付确认和完结通知',
          '结合团队目标和 OKR，沉淀交付进度、响应效率、团队产能和目标完成情况分析',
        ],
        systemBuilt: ['设计提需表单', '多维表格需求池', 'Meegle 自动建单与排单流转', '业务验收与完结通知机制', '团队 OKR 与交付效能分析看板'],
        result:
          '这套系统支撑周均 200+ 设计需求流转，减少了人工建单、分单和反复追踪状态的工作量，也让团队可以用真实交付数据复盘目标完成情况。',
        reflection:
          '设计协作的效率，取决于需求入口、责任流转和验收口径是否清楚。系统搭好以后，团队讨论的重点会更自然地回到优先级、质量和产能判断。',
      },
    },
    {
      id: 'growth-portfolio',
      company: 'Gate',
      label: '案例 04 / 增长项目集管理',
      title: '把散点增长需求收束成项目组合',
      summary:
        'SEO、GEO、ASO 更像一组持续变化的增长项目组合。我建立需求池、排期、风险预警、数据看板和管理层周报，让它们进入同一套管理视图。',
      overview: {
        project: '将 SEO、GEO、ASO 及相关内容、技术、产品和数据需求纳入统一的增长项目组合，建立持续治理的管理视图。',
        ownership: '我负责汇总需求、判断优先级、安排组合排期，并建立风险预警、依赖跟踪、数据看板和管理层周报。',
        constraint: '需求来源多、变化快，各团队都强调紧迫性；资源有限，投入方向和指标归因也需要持续校准。',
        outcome: '增长工作从散点需求进入统一组合，核心指标阶段性增长，部分指标在相应周期内接近翻倍。',
      },
      concept: {
        label: '概念关系',
        title: '三个入口，一套增长基础',
        intro: 'SEO、GEO、ASO 面向不同的用户发现入口，却会共同调用内容、技术、品牌和数据资源。把它们放进同一项目组合，才能看清投入冲突、依赖关系和整体回报。',
        items: [
          {
            term: 'SEO',
            title: '搜索引擎发现',
            description: '帮助网站内容被搜索引擎理解、收录，并在相关搜索结果中获得可见度。',
          },
          {
            term: 'GEO',
            title: '生成式答案引用',
            description: '提升内容在生成式引擎回答中的可见度、引用机会和信息影响力。',
          },
          {
            term: 'ASO',
            title: '应用商店发现与转化',
            description: '优化应用的关键词、元数据和产品页呈现，支持商店内发现与下载转化。',
          },
        ],
        foundationLabel: '共享基础',
        foundation: '内容资产 · 技术可访问性 · 品牌与实体一致性 · 数据反馈',
      },
      role: '增长型 PMO / 项目组合治理 / 管理层汇报',
      metrics: ['建立统一增长项目组合', '核心指标阶段性增长', '部分指标在阶段内接近翻倍'],
      tags: ['SEO / GEO / ASO', '项目组合治理', '增长型 PMO'],
      details: {
        background:
          '增长项目往往来源多、变化快，内容、技术、产品、数据和区域团队都会提出需求。',
        challenge:
          '如果所有需求都以“紧急”进入队列，团队很快会失去优先级，管理层也难以判断投入是否有效。',
        role:
          '我负责把 SEO/GEO/ASO 相关需求整理成项目组合，并建立排期、风险、数据和汇报节奏。',
        actions: ['建立统一需求池', '按业务目标和资源代价排序', '设置风险预警和依赖跟踪', '沉淀管理层周报和数据看板'],
        systemBuilt: ['增长需求池', '组合排期机制', '风险预警表', '管理层增长周报'],
        result:
          '核心指标在阶段内实现增长，部分指标接近翻倍；增长工作也从散点需求进入统一的项目组合。',
        reflection:
          '增长 PMO 的价值，在于让资源持续投向更值得做的事情，也让团队看清每个需求的代价。',
      },
    },
    {
      id: 'coins-localization',
      company: 'Coins.ph',
      label: '案例 05 / 多国家本地化与合规',
      title: '在多国监管条件里找到上线路径',
      summary:
        '澳大利亚、巴西、欧洲的上线条件各不相同。监管、KYC、法币链路、钱包隔离和合作方节奏都会改写项目边界。我把这些变化整理成优先级、风险、依赖和下一步责任人。',
      overview: {
        project: '推动澳大利亚、巴西、欧洲等市场的本地化与合规上线，范围覆盖交易能力、KYC、法币链路、钱包隔离及上线验收。',
        ownership: '我协调产品、研发、合规、法务、运营和外部合作方，把市场进入条件整理成优先级、风险、依赖与责任路径。',
        constraint: '不同市场的监管判断和合作方节奏持续变化，项目边界需要在合规要求、产品方案和上线窗口之间反复校准。',
        outcome: '多国项目按计划推进，交付周期缩短约 15%，Crypto on Credit 也完成从方案到上线验收的闭环。',
      },
      concept: {
        label: '概念关系',
        title: '本地化上线的三个约束',
        intro: '市场上线会同时受到身份验证、资金通道和资产管理方式影响。任何一项发生变化，产品方案和验收路径都要随之调整。',
        items: [
          {
            term: 'KYC',
            title: '用户身份验证',
            description: '根据当地监管要求确认用户身份、风险等级和可使用的产品范围。',
          },
          {
            term: '法币链路',
            title: '资金进出通道',
            description: '连接银行、支付机构和交易能力，并满足当地结算与合规要求。',
          },
          {
            term: '钱包隔离',
            title: '资产边界管理',
            description: '按照市场与监管要求划分资产和账户边界，降低混用风险。',
          },
        ],
        foundationLabel: '上线条件',
        foundation: '合规、产品、技术和运营共同确认后，市场才进入上线验收',
      },
      role: '国际化 PMO / 合规协作 / 市场进入项目管理',
      metrics: ['支持多国家市场拓展', '交付周期缩短约 15%', 'Crypto on Credit 完成上线闭环'],
      tags: ['本地化', '合规管理', '市场拓展'],
      details: {
        background:
          'Coins.ph 阶段的主线，是澳大利亚、巴西、欧洲等市场的国际化拓展。',
        challenge:
          '每个市场都有不同的监管判断、KYC 要求、法币链路、钱包隔离和上线验收标准，项目边界会持续变化。',
        role:
          '我负责协调产品、研发、合规、法务、运营和外部合作方，把市场进入条件整理成可执行路径。',
        actions: ['建立优先级对齐机制', '跟踪合规和外部依赖', '用短频会议处理阻塞项', '用 Jira 和异步记录维持执行地图'],
        systemBuilt: ['市场上线检查清单', '风险与依赖追踪表', '短频同步机制', '上线验收路径'],
        result:
          '澳大利亚、巴西、欧洲项目顺利推进，交付周期缩短约 15%，Crypto on Credit 也完成了从方案到上线验收。',
        reflection:
          '国际化项目里的路径一直在变化。不同市场会不断改写边界，项目管理要做的是及时跟上。',
      },
    },
    {
      id: 'binance-fiat',
      company: 'Binance',
      label: '案例 06 / 全球法币支付',
      title: '让全球支付项目在时区和规则差异中交付',
      summary:
        '全球法币支付项目牵动合规、风控、区域业务、运营和研发。时区、工作周和监管判断都会改写交付边界。我用区域窗口、异步记录、E2E 流程、DOD 和升级机制，把分散团队纳入同一套协作秩序。',
      overview: {
        project: '负责覆盖亚非拉多区域的全球法币支付项目，协同合规、风控、区域业务、运营、产品和研发推进交付。',
        ownership: '我负责项目节奏、跨区域对齐、风险升级和交付标准建设，并推动 E2E 流程、DOD 与异步决策记录落地。',
        constraint: '团队分布在多个时区，中东工作周与其他区域不同，监管判断也会改变方案，真正重叠的协作窗口十分有限。',
        outcome: '我在 2022 年交付约 45% 的全球法币支付项目，同时帮助团队形成更稳定的跨区域协作与交付标准。',
      },
      concept: {
        label: '概念关系',
        title: '跨区域协作的共同标准',
        intro: '时区和工作周难以统一时，团队需要用共同流程、完成标准和可追溯记录维持交付连续性。',
        items: [
          {
            term: 'E2E',
            title: '端到端流程',
            description: '从需求进入到上线验收明确每个阶段的责任、输入和交付物。',
          },
          {
            term: 'DOD',
            title: '完成标准',
            description: '让不同地区和职能对“完成”形成同一判断，减少返工和交接偏差。',
          },
          {
            term: '异步记录',
            title: '保留判断依据',
            description: '记录关键决定、风险和下一步责任人，让非重叠时区也能继续推进。',
          },
        ],
        foundationLabel: '协作基础',
        foundation: '区域沟通窗口和风险升级路径支撑共同标准持续运行',
      },
      role: '全球支付 PMO / 跨文化协作 / 敏捷转型',
      metrics: ['交付 2022 年约 45% 全球法币支付项目', '覆盖亚非拉多区域', '推动 E2E 流程与 DOD'],
      tags: ['全球交付', '法币支付', '跨区域 PMO'],
      details: {
        background:
          'Binance 的法币支付项目处在合规、风控、区域业务、运营和研发的交叉点，覆盖亚非拉等多个区域。',
        challenge:
          '全球团队要同时处理时差、地区工作周差异和有限在线窗口。中东地区工作周与其他区域不同，亚非拉在线窗口也不一致，信息如果只靠会议流动，很容易失真。',
        role:
          '我负责推动全球法币支付项目交付，并参与团队从单点敏捷实践走向端到端项目管理。',
        actions: ['按区域设置沟通窗口', '用异步记录保留关键判断', '用 E2E 流程和 DOD 对齐交付标准', '建立风险审计和升级路径'],
        systemBuilt: ['区域协作节奏', '异步决策记录', 'E2E 项目流程', 'DOD 与风险审计机制'],
        result:
          '2022 年我负责交付约 45% 的全球法币支付项目，也推动团队形成了更稳定的跨区域交付标准。',
        reflection:
          '全球交付最终靠的是一套稳定秩序，让分散团队也能做判断、承担责任并完成交付。',
      },
    },
  ],
  en: [
    {
      id: 'gate-domain',
      company: 'Gate',
      label: 'Case 01 / Brand and domain migration',
      title: 'A full-site brand cutover completed in three weeks',
      summary:
        'The move from Gate.io to Gate.com touched every customer-facing surface: app, website, campaign pages, social channels, email, support, help center, and multilingual pages. I turned that change into a coordinated three-week cutover.',
      overview: {
        project: 'Gate’s brand and domain migration moved Gate.io to Gate.com across the app, website, campaigns, social channels, email, support, help center, and multilingual pages.',
        ownership: 'As project lead, I coordinated the touchpoint map, owners, cutover windows, risk reviews, validation evidence, and leadership updates.',
        constraint: 'The program began early in my tenure with a three-week window. Any missed or delayed public entry point could affect customers and weaken brand consistency.',
        outcome: 'The full-site migration landed on time with no major incidents. Its control sheet and validation model also informed later portfolio governance work.',
      },
      role: 'Project lead / cross-team coordination / risk and validation',
      metrics: ['Completed in three weeks', 'No major incidents', 'Multi-surface and multilingual scope'],
      tags: ['Brand migration', 'Risk control', 'Cutover governance'],
      announcement: {
        label: 'Official release',
        title: 'View Gate brand refresh announcement',
        date: 'May 19, 2025',
        url: 'https://www.gate.com/announcements/article/45055',
      },
      details: {
        background:
          'The Gate.io to Gate.com brand and domain migration was one of my first major programs at Gate. It was highly visible from the start and reached across every customer-facing touchpoint.',
        challenge:
          'The pressure came from synchronization. One lagging touchpoint could easily become the first thing users noticed.',
        role:
          'I coordinated touchpoints, cutover windows, validation evidence, risk reviews, and leadership visibility across teams.',
        actions: ['Mapped all external touchpoints', 'Defined cutover windows and owners', 'Used screenshots and links as validation evidence', 'Reviewed risks and missed items daily'],
        systemBuilt: ['Migration control sheet', 'Touchpoint validation flow', 'Daily risk review', 'Leadership progress view'],
        result:
          'The migration was completed in three weeks without major incidents. It also gave me a fast understanding of Gate’s key operating and cross-functional workflows.',
        reflection:
          'Large cutovers hold when boundaries, ownership, and validation methods stay clear from start to finish.',
      },
    },
    {
      id: 'ai-pmo',
      company: 'Gate',
      label: 'Case 02 / AI and PMO automation',
      title: 'Turning repeated PMO work into a reusable workflow',
      summary:
        'Parallel business lines made weekly reporting, sprint analysis, and risk review increasingly repetitive. I used Feishu Bitable, Meegle, MCP, and AI Skills to structure the inputs while PMs kept the final judgment. I also connected keyword research, content production, and performance review into one SEO workflow.',
      overview: {
        project: 'I built AI-assisted workflows for weekly reporting, sprint analysis, risk review, and SEO operations across parallel business lines.',
        ownership: 'I structured the data, defined risk fields and output templates, and connected keyword research, content production, and performance review.',
        constraint: 'Inputs were spread across teams and tools. Automation also had to preserve the PM’s final judgment on quality, priority, and risk.',
        outcome: 'Report and analysis drafts could be prepared in about ten minutes, SEO work gained a continuous loop, and repetitive consolidation dropped significantly.',
      },
      concept: {
        label: 'Workflow relationship',
        title: 'How the AI-assisted workflow divides responsibility',
        intro: 'Project data enters a shared structure first. Tool access, draft generation, and final judgment each have a clear owner.',
        items: [
          {
            term: 'MCP',
            title: 'Connect tools and data',
            description: 'Gives AI controlled access to project data and approved tools.',
          },
          {
            term: 'AI skills',
            title: 'Run repeatable steps',
            description: 'Structures information, flags anomalies, and prepares report or analysis drafts.',
          },
          {
            term: 'PM judgment',
            title: 'Validate and decide',
            description: 'Checks quality, weighs priority and risk, then chooses the communication and delivery action.',
          },
        ],
        foundationLabel: 'Responsibility',
        foundation: 'Automation handles structure and drafts; PMs retain judgment, decisions, and communication',
      },
      role: 'AI PMO / workflow design / project data analysis',
      metrics: ['Report and analysis drafts in about 10 minutes', 'SEO workflow from keyword research to review', 'Reusable AI-assisted PMO workflow'],
      tags: ['AI workflow', 'Reporting automation', 'Risk signal'],
      details: {
        background:
          'As more business lines ran in parallel, the cost of collecting, organizing, and reporting information rose quickly.',
        challenge:
          'Requests lived across tools and teams. Weekly reports, sprint analysis, and risk detection still depended on manual consolidation.',
        role:
          'I designed an AI-assisted workflow that organized project data, demand flow, and report drafts before PM review.',
        actions: [
          'Structured Bitable and Meegle data',
          'Used MCP and AI Skills for report drafts',
          'Connected keyword collection, content production, and review into one SEO workflow',
          'Defined risk fields and output templates',
          'Kept human judgment in final trade-offs',
        ],
        systemBuilt: ['SEO workflow from keyword research to performance review', 'Weekly report draft flow', 'Sprint analysis template', 'Risk detection checklist'],
        result:
          'Weekly reports, sprint analysis, and risk-review drafts could be prepared in about 10 minutes, leaving PMs to validate the output and make the final calls.',
        reflection:
          'AI works best here as operating support. It handles structure and first drafts, while judgment, trade-offs, communication, and follow-through stay with people.',
      },
    },
    {
      id: 'design-delivery-automation',
      company: 'Gate',
      label: 'Case 03 / Design delivery automation',
      title: 'From intake forms to OKR review: an automated design delivery system',
      summary:
        'Visual, video, brand, and industrial design teams handled a constant flow of requests. I connected intake forms, Bitable, Meegle, and OKR data into one system for task creation, scheduling, acceptance, delivery confirmation, and performance review.',
      overview: {
        project: 'I built a delivery system for visual, video, brand, and industrial design teams, covering intake, structured demand, task creation, scheduling, acceptance, and OKR review.',
        ownership: 'I mapped the end-to-end workflow, designed the intake form and Bitable demand pool, and used APIs to create Meegle tasks automatically.',
        constraint: 'More than 200 weekly requests came from several business lines, while task creation, assignment, status chasing, and completion notices relied heavily on manual work.',
        outcome: 'The system supported the weekly demand volume, reduced coordination overhead, and made progress, response time, capacity, and goal completion measurable.',
      },
      concept: {
        label: 'System relationship',
        title: 'How one request moves through the system',
        intro: 'Each tool owns a different part of the flow: intake, delivery, or goal review. A shared request ID keeps them connected.',
        items: [
          {
            term: 'Bitable',
            title: 'Shared intake',
            description: 'Captures context, deliverables, timing, and acceptance criteria in one demand pool.',
          },
          {
            term: 'Meegle',
            title: 'Task and delivery flow',
            description: 'Handles task creation, scheduling, routing, acceptance, confirmation, and completion notices.',
          },
          {
            term: 'OKR',
            title: 'Goals and review',
            description: 'Uses delivery data to review progress, response time, capacity, and goal completion.',
          },
        ],
        foundationLabel: 'Common thread',
        foundation: 'One request ID connects intake, task execution, acceptance, and goal data',
      },
      role: 'Design team PMO / workflow automation / delivery performance management',
      metrics: ['Supported 200+ design requests per week', 'Automated task creation from intake to Meegle', 'Delivery and OKR data ready for review'],
      tags: ['Design operations', 'Meegle automation', 'Delivery analytics'],
      details: {
        background:
          'At Gate, the design organization supported many business lines at the same time. Visual, video, brand, and industrial design teams needed a stable way to receive and manage demand from different stakeholders.',
        challenge:
          'Requests were easy to lose across chats, meetings, and temporary documents. Task creation, assignment, status tracking, acceptance, and completion notices relied heavily on manual work. Leadership also needed a clearer view of capacity and OKR progress.',
        role:
          'I mapped the full path from request submission to delivery confirmation, then connected team goals, OKRs, and delivery data into one management view.',
        actions: [
          'Designed a business intake form to capture context, deliverables, timing, and acceptance criteria',
          'Used Bitable to structure incoming requests into a managed demand pool',
          'Synced Bitable records to Meegle through API and created tasks automatically',
          'Configured Meegle for scheduling, workflow routing, business acceptance, delivery confirmation, and completion notices',
          'Connected team goals and OKRs with delivery data for progress, response time, capacity, and goal review',
        ],
        systemBuilt: ['Design intake form', 'Bitable demand pool', 'Meegle task creation and scheduling flow', 'Acceptance and completion notification mechanism', 'Team OKR and delivery performance dashboard'],
        result:
          'The system supported more than 200 design requests per week, reduced manual task creation and status chasing, and gave the team reliable delivery data for OKR review.',
        reflection:
          'Clear intake, ownership, and acceptance criteria create a dependable design operation. The team can then focus on priorities, quality, and capacity.',
      },
    },
    {
      id: 'growth-portfolio',
      company: 'Gate',
      label: 'Case 04 / Growth portfolio governance',
      title: 'Turning scattered growth requests into a portfolio',
      summary:
        'SEO, GEO, and ASO never behaved like a single project. I organized them as a portfolio, with demand pools, scheduling, risk alerts, dashboards, and executive reporting.',
      overview: {
        project: 'I brought SEO, GEO, ASO, and related content, technical, product, and data work into one governed growth portfolio.',
        ownership: 'I consolidated demand, set priorities and schedules, and established risk alerts, dependency tracking, dashboards, and executive reporting.',
        constraint: 'Requests arrived quickly from many teams, often marked urgent. Limited capacity and uncertain attribution required regular recalibration.',
        outcome: 'The work moved from scattered requests into one portfolio. Key metrics grew during the period, with some indicators nearly doubling.',
      },
      concept: {
        label: 'What is / How they connect',
        title: 'Three discovery surfaces, one growth foundation',
        intro: 'SEO, GEO, and ASO reach users through different discovery surfaces. They still draw on the same content, technical, brand, and data resources, which makes portfolio-level trade-offs essential.',
        items: [
          {
            term: 'SEO',
            title: 'Search discovery',
            description: 'Helps search engines understand and index web content, improving visibility for relevant queries.',
          },
          {
            term: 'GEO',
            title: 'Generative answer visibility',
            description: 'Improves the chance that content appears, is cited, or shapes answers produced by generative engines.',
          },
          {
            term: 'ASO',
            title: 'App store discovery',
            description: 'Improves app store visibility and conversion through keywords, metadata, and product-page presentation.',
          },
        ],
        foundationLabel: 'Shared foundation',
        foundation: 'Content assets · technical access · brand and entity consistency · performance data',
      },
      role: 'Growth PMO / portfolio governance / executive reporting',
      metrics: ['One governed growth portfolio', 'Key metrics grew during the period', 'Some indicators nearly doubled'],
      tags: ['SEO / GEO / ASO', 'Portfolio governance', 'Growth PMO'],
      details: {
        background:
          'Growth requests came from content, product, data, technical, and regional teams, often with competing priorities.',
        challenge:
          'Once every request entered the queue as urgent, priority disappeared and leadership lost a clear view of what the investment was producing.',
        role:
          'I organized SEO/GEO/ASO work into a governed portfolio with scheduling, risk, data, and reporting routines.',
        actions: ['Built a shared demand pool', 'Prioritized by goal and resource cost', 'Tracked dependencies and risk alerts', 'Created dashboards and executive weekly reports'],
        systemBuilt: ['Growth demand pool', 'Portfolio scheduling mechanism', 'Risk alert sheet', 'Executive growth weekly report'],
        result:
          'Key metrics grew during the period, with some indicators nearly doubling. The work also moved from scattered requests into one governed portfolio.',
        reflection:
          'Growth PMO keeps resources tied to the work that matters most and makes the cost of each request visible.',
      },
    },
    {
      id: 'coins-localization',
      company: 'Coins.ph',
      label: 'Case 05 / Localization and compliance',
      title: 'Finding the launch path across different market rules',
      summary:
        'Australia, Brazil, and Europe each had different launch conditions. I translated changing rules around KYC, fiat rails, wallets, partners, and acceptance into priorities, risks, dependencies, and owners.',
      overview: {
        project: 'I supported localization and compliant launches across Australia, Brazil, Europe, and related markets, covering KYC, fiat rails, wallet setup, and launch acceptance.',
        ownership: 'I coordinated product, engineering, compliance, legal, operations, and external partners, turning market-entry conditions into priorities, risks, dependencies, and owners.',
        constraint: 'Regulatory interpretation and partner timelines changed by market, so the delivery path had to be recalibrated as requirements evolved.',
        outcome: 'The multi-market work progressed as planned, delivery cycles shortened by about 15%, and Crypto on Credit reached launch acceptance.',
      },
      concept: {
        label: 'Concept relationship',
        title: 'Three constraints on a localized launch',
        intro: 'Identity checks, payment rails, and asset boundaries all shape the launch path. A change in one can alter the product and acceptance plan.',
        items: [
          {
            term: 'KYC',
            title: 'Identity verification',
            description: 'Applies local rules to user identity, risk level, and product eligibility.',
          },
          {
            term: 'Fiat rails',
            title: 'Money movement',
            description: 'Connects banks, payment partners, and trading capability under local settlement and compliance rules.',
          },
          {
            term: 'Wallet separation',
            title: 'Asset boundaries',
            description: 'Separates accounts and assets by market or regulatory requirement to reduce commingling risk.',
          },
        ],
        foundationLabel: 'Launch condition',
        foundation: 'Compliance, product, engineering, and operations sign off before launch acceptance',
      },
      role: 'International PMO / compliance coordination / go-to-market delivery',
      metrics: ['Supported multi-country expansion', 'Delivery cycles shortened by about 15%', 'Crypto on Credit moved from concept to launch'],
      tags: ['Localization', 'Compliance', 'Market expansion'],
      details: {
        background:
          'At Coins.ph, international expansion meant building launch paths market by market across Australia, Brazil, Europe, and related markets.',
        challenge:
          'Each market had its own regulatory judgment, KYC requirements, fiat rails, wallet setup, and launch acceptance standards.',
        role:
          'I coordinated product, engineering, compliance, legal, operations, and external partners to shape an executable path.',
        actions: ['Aligned priorities across teams', 'Tracked compliance and external dependencies', 'Used short-cycle meetings for blockers', 'Kept the execution map in Jira and async records'],
        systemBuilt: ['Market launch checklist', 'Risk and dependency tracker', 'Short-cycle sync rhythm', 'Launch acceptance path'],
        result:
          'The work supported multi-market expansion, shortened delivery cycles by about 15%, and moved Crypto on Credit from concept through launch acceptance.',
        reflection:
          'International programs demand constant recalibration. Each market reshapes the delivery path in its own way.',
      },
    },
    {
      id: 'binance-fiat',
      company: 'Binance',
      label: 'Case 06 / Global fiat payments',
      title: 'Delivering global payments across time zones and rule differences',
      summary:
        'Global fiat payments connected compliance, risk, regional business, operations, and engineering. Time zones, different work weeks, and changing regulation shaped every delivery plan. Regional windows, async records, E2E flow, DOD, and escalation paths gave the work one operating rhythm.',
      overview: {
        project: 'I led global fiat payment delivery across APAC, Africa, and LATAM, coordinating compliance, risk, regional business, operations, product, and engineering.',
        ownership: 'I ran the delivery cadence, aligned regions, escalated risk, and helped establish E2E flows, DOD, and asynchronous decision records.',
        constraint: 'Teams worked across time zones and different work weeks, including the Middle East. Regulatory changes also reshaped solutions, leaving little shared working time.',
        outcome: 'I delivered around 45% of 2022 global fiat payment projects and helped the team establish a more dependable cross-region delivery standard.',
      },
      concept: {
        label: 'Concept relationship',
        title: 'Shared standards for cross-region delivery',
        intro: 'When time zones and work weeks differ, common flow, completion criteria, and traceable records keep delivery moving.',
        items: [
          {
            term: 'E2E',
            title: 'End-to-end flow',
            description: 'Defines ownership, inputs, and outputs from demand intake through launch acceptance.',
          },
          {
            term: 'DOD',
            title: 'Definition of done',
            description: 'Gives regions and functions one standard for completion, reducing rework and handoff gaps.',
          },
          {
            term: 'Async records',
            title: 'Keep decisions traceable',
            description: 'Records decisions, risks, and next owners so work continues outside overlapping hours.',
          },
        ],
        foundationLabel: 'Operating base',
        foundation: 'Regional communication windows and escalation paths keep the shared standards working',
      },
      role: 'Global payments PMO / cross-cultural collaboration / agile transformation',
      metrics: ['Delivered around 45% of 2022 global fiat payment projects', 'Covered APAC, Africa, and LATAM', 'Landed E2E flow and DOD'],
      tags: ['Global delivery', 'Fiat payment', 'Cross-region PMO'],
      details: {
        background:
          'Binance fiat payment projects sat across compliance, risk, regional business, operations, and engineering, covering multiple regions at once.',
        challenge:
          'The work involved time zones, different weekend patterns across regions, including the Middle East, and very limited overlapping hours.',
        role:
          'I drove delivery for global fiat payment projects and helped the team move from isolated agile practices into end-to-end program management.',
        actions: ['Set regional communication windows', 'Kept async records for key decisions', 'Aligned delivery through E2E flow and DOD', 'Built risk review and escalation paths'],
        systemBuilt: ['Regional collaboration rhythm', 'Async decision records', 'E2E project flow', 'DOD and risk audit mechanism'],
        result:
          'In 2022, I delivered around 45% of global fiat payment projects and helped establish a more stable cross-region delivery standard.',
        reflection:
          'Global delivery depends on a reliable operating order. Distributed teams need enough context to make decisions, take ownership, and deliver.',
      },
    },
  ],
};

const experiences = {
  zh: [
    {
      company: 'Gate',
      period: '2025 - 2026.04',
      website: 'https://www.gate.com/',
      role: 'P8 PMO / 多业务线项目管理负责人',
      summary: 'Gate.com 迁移、多业务线治理、RDER 部门项目管理、Card 业务、AI PMO 工作流。',
      paragraphs: [
        'Gate 的第一场重要项目，是 Gate.io 到 Gate.com 的品牌升级与域名迁移。项目发生在入职早期，时间紧、触点多，涉及 App、官网、活动页、社媒、邮件、客服、帮助中心和多语言站点。它看起来是一次域名切换，实际考验的是切换节奏、风险控制和跨团队协同。',
        '我把项目拆成触点清单、切换窗口、验收截图和每日风险同步，确保每个团队知道自己负责什么、什么时候完成、如何确认结果。三周内完成迁移且无重大事故，也让我快速熟悉了 Gate 的关键业务链路和跨团队协作关系。',
        '后续我的职责扩展到 RDER 一级部门的项目管理工作，包括 PM 分工、需求推进、状态看板、复盘和绩效反馈；同时我也直接负责 Card 业务项目。域名迁移中形成的节奏，逐渐延展成多项目组合治理的方法：让进展、风险、资源和关键判断持续被看见。',
      ],
      outcomes: ['3 周内完成迁移且无重大事故', 'SEO / GEO / ASO 项目组合治理', 'AI PMO 报告与风险识别提效'],
    },
    {
      company: 'Coins.ph',
      period: '2024 - 2025',
      website: 'https://coins.ph/',
      role: 'PMO / 国际化业务项目管理',
      summary: '澳大利亚、巴西、欧洲市场拓展，本地化、合规接入、KYC、Crypto on Credit。',
      paragraphs: [
        'Coins.ph 阶段让国际化从概念变成一组具体约束。每个市场背后都有监管路径、法币链路、KYC、钱包隔离、运营准备和上线验收。',
        '澳大利亚、巴西、欧洲项目同时推进时，团队面对的是一组不断变化的前置条件：合规判断、合作方准备度和研发优先级都在持续调整。',
        '这些不确定性被整理成优先级、风险、依赖和下一步责任人，再通过短频会议、异步同步和 Jira 机制进入同一张执行地图。',
      ],
      outcomes: ['交付周期缩短约 15%', 'Crypto on Credit 完成从方案到上线闭环', '建立跨团队异步协作节奏'],
    },
    {
      company: 'Binance',
      period: '2021 - 2023',
      website: 'https://www.binance.com/',
      role: 'PMO / 全球支付与敏捷转型',
      summary: '全球法币支付、跨区域交付、合规风控协同、E2E 流程与 DOD。',
      paragraphs: [
        'Binance 是我建立全球交付能力的关键阶段。法币支付项目连接合规、风控、区域业务、运营和研发，任何一方判断变化，都会影响项目边界。2022 年我负责交付了约 45% 的全球法币支付项目，背后依赖的是对节奏、信息和风险的管理。',
        '全球团队同时面对时差、地区工作周差异和有限在线窗口。中东地区的工作周与其他区域不同，亚非拉团队的在线窗口也不一致。一个问题如果只靠会议推进，很容易在等待中失真，或者在上线前才集中爆发。',
        '我把协作拆成更稳定的机制：按区域设置沟通窗口，用异步记录保留关键判断，用 E2E 流程和 DOD 对齐交付标准，用风险审计和升级路径确保问题进入正确层级。这段经历让我形成了更清晰的项目观：全球交付需要一套可靠的协作秩序，让分散的团队可以做判断、承担责任并完成交付。',
      ],
      outcomes: ['交付 2022 年约 45% 全球法币支付项目', '推动 E2E 流程和 DOD 落地', '减少跨区域信息延迟'],
    },
    {
      company: 'Ctrip.com',
      period: '2019 - 2021',
      website: 'https://www.ctrip.com/',
      role: '项目经理 / ROI 委员会与研发效能',
      summary: 'ROI 评审、自由行 DP、交易中台、会计结算中台、研发效能分析。',
      paragraphs: [
        '携程阶段把项目管理的重心从执行推进，前移到价值判断。一个需求为什么值得做，资源应该投向哪里，是这一阶段最先要回答的问题。',
        'ROI 委员会相关评审要求产品、研发和项目管理一起看真实业务价值、投入产出和优先级，需求描述只是起点。',
        '变更率、延期率、资源投入和交付质量等研发效能分析，以及交易中台、会计结算中台的敏捷转型和 OKR 对齐，共同形成了更数据化的项目视角。',
      ],
      outcomes: ['建立研发效能分析视角', '参与 ROI 委员会需求评审', '形成先问价值再排项目的习惯'],
    },
    {
      company: 'WeWork',
      period: '2018 - 2019',
      website: 'https://www.wework.com/',
      role: '项目经理',
      summary: '应用端、网页端、小程序项目范围定义，Scrum / Kanban / Jira / Confluence。',
      paragraphs: [
        'WeWork 是我早期接触创新业务的现场。需求变化快，团队需要在快速验证和按时交付之间保持平衡。',
        '应用端、网页端、小程序项目的范围定义，以及产品、设计、研发和运营之间的信息协调，构成了早期跨职能协作基础；“WeWork 闪座”项目也强化了 0-1 交付意识。',
      ],
      outcomes: ['积累敏捷协作经验', '参与创新项目从 0 到 1 交付', '建立跨职能沟通基础'],
    },
    {
      company: 'HAND',
      period: '2016 - 2018',
      website: 'https://www.hand-china.com/',
      role: '咨询顾问 / QA Engineer',
      summary: '从企业咨询切入项目实施，后转向 QA，负责需求分析、测试验证与缺陷闭环。',
      paragraphs: [
        'HAND 是我进入企业级交付体系的起点。我先做咨询顾问，接触企业项目实施，后来转到 QA，从需求、实现、验证到上线去看完整链路。',
        'K12 项目从需求分析、测试执行到上线交付的全过程，以及缺陷修复和上线前验证，构成了后续项目管理能力里的质量意识和全链路视角。',
      ],
      outcomes: ['积累咨询与需求理解经验', '建立质量和验证意识', '形成全链路交付视角'],
    },
  ],
  en: [
    {
      company: 'Gate',
      period: '2025 - Apr 2026',
      website: 'https://www.gate.com/',
      role: 'P8 PMO / Program Lead across Multiple Business Lines',
      summary: 'Gate.com migration, multi-business PMO governance, RDER department project management, Card business, and AI PMO workflows.',
      paragraphs: [
        'My first major project at Gate was the Gate.io to Gate.com brand and domain migration. It came early in my role, with a tight timeline and a wide touchpoint surface: app, website, campaign pages, social channels, email, support, help center, and multilingual sites. The work depended on cutover rhythm, risk control, and cross-team coordination.',
        'I broke the work into touchpoint maps, cutover windows, screenshot checks, and daily risk reviews. Each team knew its owner, deadline, and validation method. The migration was completed in three weeks without major incidents and gave me a fast understanding of Gate’s key operating and cross-functional workflows.',
        'Later, my scope expanded to project management for the RDER department, including PM allocation, demand follow-up, status dashboards, retrospectives, and performance feedback. I also directly owned Card business programs. The rhythm built during the migration became the basis for a broader portfolio governance approach: making progress, risk, resources, and key decisions visible.',
      ],
      outcomes: ['Completed migration in three weeks without major incidents', 'Supported SEO / GEO / ASO portfolio governance', 'Reduced reporting and risk detection cycles with AI PMO'],
    },
    {
      company: 'Coins.ph',
      period: '2024 - 2025',
      website: 'https://coins.ph/',
      role: 'PMO / International Business Programs',
      summary: 'Australia, Brazil, and Europe expansion, localization, compliance integration, KYC, and Crypto on Credit.',
      paragraphs: [
        'At Coins.ph, international expansion stopped being a broad ambition and became a set of hard constraints. Each market came with its own regulatory path, fiat flow, KYC rules, wallet setup, launch criteria, and operating readiness.',
        'Australia, Brazil, and Europe moved in parallel. There was no single template to follow. Compliance judgment, partner readiness, and engineering priority kept changing.',
        'Those moving parts became priorities, risks, dependencies, and next owners. Short-cycle meetings, async updates, and Jira kept everyone working from the same execution map.',
      ],
      outcomes: ['Shortened delivery cycles by about 15%', 'Moved Crypto on Credit from concept to launch acceptance', 'Built a cross-functional async rhythm'],
    },
    {
      company: 'Binance',
      period: '2021 - 2023',
      website: 'https://www.binance.com/',
      role: 'PMO / Global Fiat Payments',
      summary: 'Global fiat payments, cross-region delivery, compliance and risk collaboration, E2E flow, and DOD.',
      paragraphs: [
        'Binance was a defining stage in my global delivery work. Fiat payment projects connected compliance, risk, regional business, operations, and engineering. A change in any one area could shift the project boundary. In 2022, I delivered around 45% of global fiat payment projects, which required steady control over rhythm, information, and risk.',
        'The work involved time zones, different weekend patterns across regions, including the Middle East, and limited overlapping hours across APAC, Africa, and LATAM. If issues moved only through meetings, context could be lost or arrive too late.',
        'I built a more stable operating rhythm: regional communication windows, async records for key decisions, E2E flow and DOD for delivery standards, and risk review with clear escalation paths. That experience shaped how I think about global delivery: distributed teams need enough context and a reliable operating order to make judgments, own decisions, and deliver.',
      ],
      outcomes: ['Delivered about 45% of 2022 global fiat payment projects', 'Landed E2E flow and DOD', 'Improved cross-region information flow'],
    },
    {
      company: 'Ctrip.com',
      period: '2019 - 2021',
      website: 'https://www.ctrip.com/',
      role: 'Project Manager / ROI Review & Engineering Efficiency',
      summary: 'ROI review, independent travel, transaction platform, accounting settlement platform, and engineering efficiency.',
      paragraphs: [
        'At Ctrip, project management moved upstream into value judgment. The first question was straightforward: why should this request receive resources?',
        'ROI committee reviews brought product, engineering, and project management into the same discussion, with attention on business value, return, and priority.',
        'I also worked with change rate, delay rate, resource input, and delivery quality. Those metrics, together with agile transformation and OKR alignment, built a more data-informed view of project work.',
      ],
      outcomes: ['Built an engineering efficiency perspective', 'Participated in ROI committee reviews', 'Formed the habit of asking value before sequencing work'],
    },
    {
      company: 'WeWork',
      period: '2018 - 2019',
      website: 'https://www.wework.com/',
      role: 'Project Manager',
      summary: 'App, web, and mini-program scope definition with Scrum, Kanban, Jira, and Confluence.',
      paragraphs: [
        'WeWork was an early test of project work in a fast-moving product environment. Requirements changed quickly, and teams had to balance fast validation with committed delivery.',
        'App, web, and mini-program projects built my early cross-functional foundation. I also worked on an early flexible-seat pilot, which sharpened my understanding of early-stage delivery.',
      ],
      outcomes: ['Built agile collaboration habits', 'Participated in early 0-1 delivery', 'Strengthened cross-functional communication'],
    },
    {
      company: 'HAND',
      period: '2016 - 2018',
      website: 'https://www.hand-china.com/',
      role: 'Consultant / QA Engineer',
      summary: 'Started in enterprise consulting, then moved into QA across requirement analysis, test validation, and defect closure.',
      paragraphs: [
        'HAND was my entry point into enterprise delivery. I started as a consultant, learned how enterprise projects were implemented, and later moved into QA to follow the full chain from requirements through validation and launch.',
        'The K12 project covered requirement analysis, testing, go-live, defect resolution, and pre-launch checks. It gave me the quality discipline that later carried into my project management work.',
      ],
      outcomes: ['Built consulting and requirement-analysis experience', 'Developed quality discipline', 'Formed a full-chain delivery view'],
    },
  ],
};

const education = [
  {
    school: 'Tianfu College of SWUFE',
    zh: '西南财经大学天府学院',
    website: 'https://www.tfswufe.edu.cn/',
    mark: 'tianfu',
    zhPhase: '起点',
    enPhase: 'Starting Point',
    zhLead: '更早的审计学习，让我先形成了结构感、严谨性和判断习惯，也影响了后来处理复杂项目的方式。',
    enLead: 'My auditing studies gave me early habits of structure, discipline, and evidence-based judgment that later shaped how I handled complex programs.',
    zhDegree: '本科｜审计学',
    enDegree: "Bachelor's Degree in Auditing",
    zhLocation: '中国｜成都',
    enLocation: 'Chengdu, China',
    period: '2012 - 2016',
  },
  {
    school: 'The University of Manchester',
    zh: '曼彻斯特大学',
    website: 'https://www.manchester.ac.uk/',
    mark: 'manchester',
    zhPhase: '进阶',
    enPhase: 'Graduate Study',
    zhLead: '商业项目管理这段学习经历，承接了我早期的项目实践，也让我更系统地理解项目方法、业务判断与组织协同之间的关系。',
    enLead: 'Commercial Project Management built on my early project experience and gave me a more structured understanding of project management methods, business judgment, and organizational coordination.',
    zhTag: 'QS 2026 全球第 35',
    enTag: 'QS 2026 #35 Worldwide',
    zhDegree: '硕士｜商业项目管理',
    enDegree: 'MSc | Commercial Project Management',
    zhLocation: '英国｜曼彻斯特',
    enLocation: 'Manchester, United Kingdom',
    period: '2018 - 2019',
  },
];

const signalIcons = [Target, ShieldCheck, Layers3, Sparkles];

type ConciergeMessage = {
  id: string;
  role: 'bot' | 'user';
  text: string;
  milestone?: 3 | 5 | 7;
};

type ConciergeAnswer = {
  id: string;
  label: string;
  patterns: string[];
  answer: {
    zh: string;
    en: string;
  };
};

const contactEmail = 'lbxcyril@gmail.com';

const conciergeAnswers: ConciergeAnswer[] = [
  {
    id: 'miaobi-identity',
    label: '你是谁',
    patterns: ['你是谁', '你叫什么', '介绍一下你自己', '你是柏希吗', '你和柏希什么关系', '喵比是谁', 'who are you'],
    answer: {
      zh: '我是喵比，柏希的助理，也是这个网站里负责讲故事的那位。柏希负责把复杂项目做成，我负责把他的经历讲明白。你想认识他，可以从职业经历、项目案例或 AI PMO 开始问。',
      en: 'I am Miaobi, Baixi’s assistant and the storyteller around here. Baixi handles the complicated projects; I help make the stories behind them easier to understand. Ask me about his career, project cases, or AI PMO work.',
    },
  },
  {
    id: 'miaobi-name',
    label: '为什么叫喵比',
    patterns: ['为什么叫喵比', '喵比这个名字', '名字叫喵比', '名字怎么来的', 'miaobi', 'name'],
    answer: {
      zh: '这个名字是柏希定的，没有一段需要查族谱的典故。大概是听着亲近，又有一点猫猫的机灵劲。名字嘛，叫一声愿意回头就算合格，我挺喜欢。',
      en: 'Baixi chose the name. There is no grand origin story that requires a family archive; it simply sounds friendly and carries a little feline quickness. A good name should make you want to turn around when someone calls it. I like this one.',
    },
  },
  {
    id: 'miaobi-capabilities',
    label: '喵比会什么',
    patterns: ['你会什么', '你能做什么', '能问什么', '可以问什么', '会干什么', 'capabilities', 'help'],
    answer: {
      zh: '我最会讲柏希。你可以问他的职业经历、代表项目、工作方法、AI PMO、教育背景和联系方式，换一种说法我通常也听得懂。再往外的题，我会老实告诉你不知道。我的工作是当个靠谱助理，不是硬装成全世界百科。',
      en: 'I know Baixi best. Ask about his career, project stories, way of working, AI PMO practice, education, or contact details; I can usually follow different wording too. If a question goes beyond that, I will say so honestly. My job is to be a reliable assistant, not the encyclopedia of everything.',
    },
  },
  {
    id: 'intro',
    label: '快速介绍一下柏希',
    patterns: ['介绍柏希', '介绍一下柏希', '柏希是谁', '柏希做什么', 'baixi', 'intro', 'about', '背景', 'profile', 'summary'],
    answer: {
      zh: '简单说，柏希是个专门把复杂事情理顺的人。他从咨询顾问起步，后来做 QA，再一路走到 PMO，管过全球支付、海外业务，也管过一大堆同时往前跑的项目。别人问“什么时候上线”，他通常还会多问一句：“这事真的想明白了吗？”',
      en: 'In short, Baixi is good at bringing order to complicated work. He started in consulting, moved into QA, and then grew into PMO, taking on global payments, international business, and portfolios full of projects moving at once. When someone asks, “When can we launch?”, he is usually the person who also asks, “Have we actually thought this through?”',
    },
  },
  {
    id: 'experience',
    label: '柏希经历过哪些公司',
    patterns: ['经历', '工作', '公司', 'experience', 'career', 'gate', 'binance', 'coins', 'ctrip', '携程'],
    answer: {
      zh: '柏希最早在 HAND 做咨询顾问，后来转到 QA，之后去了 WeWork、携程、Binance、Coins.ph 和 Gate。一路从企业项目实施做到互联网产品、全球支付、海外市场和多业务线 PMO。公司换了几站，他关心的事情也越变越大：先理解业务怎么运转，再看功能对不对，后来还要判断整个项目值不值得做、能不能稳稳落地。',
      en: 'Baixi started as a consultant at HAND and later moved into QA before joining WeWork, Ctrip.com, Binance, Coins.ph, and Gate. His scope grew from enterprise implementation into internet products, global payments, international markets, and portfolio PMO. The questions grew too: first understanding how the business worked, then whether the product worked, and eventually whether the whole project was worth doing and could land safely.',
    },
  },
  {
    id: 'cases',
    label: '柏希最值得看的案例',
    patterns: ['案例', '项目', '亮点', '成果', 'case', 'project', 'achievement', 'portfolio'],
    answer: {
      zh: '时间不多的话，先看三个。第一是 Gate.io 换成 Gate.com，三周内把 App、网站、邮件、客服和多语言页面一起迁完，没出大事故。第二是设计交付自动化，每周 200 多个需求终于不用靠人到处捞。第三是 AI PMO，他把周报、风险检查和内容流程串起来，让机器先收拾信息，人留下来做判断。',
      en: 'If time is short, start with three stories. First, the Gate.io to Gate.com migration: app, web, email, support, and multilingual pages moved within three weeks, with no major incidents. Second, design delivery automation, which brought 200+ weekly requests into one working flow. Third, AI PMO, where Baixi connected reporting, risk review, and content workflows so machines could sort the information and people could keep the judgment.',
    },
  },
  {
    id: 'method',
    label: '柏希的工作方法是什么',
    patterns: ['方法', '风格', '怎么做', '能力', 'method', 'style', 'approach', 'strength'],
    answer: {
      zh: '柏希做项目，不会一上来就催进度。他先问为什么做、做到哪、谁负责、什么才算完成。风险也喜欢早点摊开，免得临上线才突然冒头。至于周报，他最怕写成流水账，最好让人扫两眼就知道：哪里要帮忙，谁得做决定。',
      en: 'Baixi does not begin a project by chasing status updates. He first asks why it matters, where the boundary is, who owns it, and what “done” actually means. He also prefers risks to show up early. A useful report, in his view, should quickly reveal where help is needed and who needs to decide.',
    },
  },
  {
    id: 'education',
    label: '教育背景',
    patterns: ['教育', '学校', '学历', '曼彻斯特', 'education', 'school', 'degree', 'manchester'],
    answer: {
      zh: '柏希本科在西南财经大学天府学院学审计，后来去曼彻斯特大学读商业项目管理硕士。一个让他习惯看证据、结构和风险，一个帮他把项目现场里的直觉整理成方法。现在回头看，这两段经历还挺接得上。',
      en: 'Baixi studied Auditing at Tianfu College of SWUFE, then completed an MSc in Commercial Project Management at The University of Manchester. One trained his eye for evidence, structure, and risk; the other helped turn practical project instincts into a repeatable way of working.',
    },
  },
  {
    id: 'ai',
    label: 'AI PMO 做过什么',
    patterns: ['ai', 'pmo', '自动化', 'mcp', 'meegle', '飞书', 'automation', 'workflow'],
    answer: {
      zh: '柏希做 AI PMO，不是为了给流程撒一层 AI 亮粉。他把飞书多维表格、Meegle、MCP 和 AI Skills 接进日常，用来打周报底稿、做迭代分析、找风险，也串过 SEO 的关键词、内容和复盘流程。他的原则很简单：AI 先把桌面收干净，人坐下来做判断。',
      en: 'Baixi does not use AI PMO to sprinkle AI glitter over an old process. He has connected Feishu Bitable, Meegle, MCP, and AI Skills to draft reports, analyze iterations, surface risks, and support SEO workflows from keywords to review. His rule is simple: AI clears the desk; people make the call.',
    },
  },
  {
    id: 'contact',
    label: '怎么联系柏希',
    patterns: ['联系', '邮箱', '领英', 'contact', 'email', 'linkedin', 'hire', 'interview'],
    answer: {
      zh: `想联系柏希，可以写邮件到 ${contactEmail}，也可以从页面底部找到他的 LinkedIn。工作机会、项目合作，或者想继续聊某段经历，都欢迎来信。`,
      en: `You can reach Baixi at ${contactEmail} or through the LinkedIn link at the bottom of the page. Opportunities, collaborations, and follow-up questions are all welcome.`,
    },
  },
];

const conciergeQuickQuestionIds = ['intro', 'cases', 'method', 'ai', 'contact'];

function getConciergeQuickLabel(id: string, language: Language) {
  const labels: Record<string, Record<Language, string>> = {
    intro: { zh: '快速介绍一下柏希', en: 'Meet Baixi' },
    cases: { zh: '柏希最值得看的案例', en: "Baixi's best stories" },
    method: { zh: '柏希的工作方法', en: 'How Baixi works' },
    ai: { zh: 'AI PMO 做过什么', en: 'AI PMO work' },
    contact: { zh: '怎么联系柏希', en: 'Contact Baixi' },
  };

  return labels[id]?.[language] ?? id;
}

function findConciergeAnswer(input: string) {
  const normalized = input.trim().toLowerCase().replace(/[.,!?;:，。！？；：、"'“”‘’()[\]{}]/g, ' ');

  if (!normalized) {
    return null;
  }

  return (
    conciergeAnswers.find((item) =>
      item.patterns.some((pattern) => {
        const normalizedPattern = pattern.toLowerCase();
        const isLatinPattern = /^[a-z0-9\s.+-]+$/i.test(normalizedPattern);

        if (!isLatinPattern) {
          return normalized.includes(normalizedPattern);
        }

        if (normalizedPattern.includes(' ')) {
          return normalized.includes(normalizedPattern);
        }

        return normalized
          .split(/\s+/)
          .filter(Boolean)
          .some((word) => word === normalizedPattern);
      }),
    ) ?? null
  );
}

function pickStableText(items: string[], seed: string) {
  const score = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return items[score % items.length];
}

function getConciergeFallback(language: Language, unknownCount: number, question: string) {
  const milestones: Record<3 | 5 | 7, Record<Language, string>> = {
    3: {
      zh: '连续三次走出资料区，恭喜获得隐藏称号「喵比边界体验官」。我确实不知道，但你已经很懂怎么找到我的知识边界了。想认真追问，可以写信给柏希；想聊通用知识，Cha 老师今天应该有空。',
      en: 'Three out-of-scope questions in a row: you have unlocked “Miaobi Boundary Tester.” I genuinely do not know, but you clearly know how to find the edge of my notes. Write to Baixi for a serious follow-up, or ask Cha teacher for general knowledge.',
    },
    5: {
      zh: '五连超纲达成，称号升级为「喵比压力测试员」。能把一个个人网站助理问到这个份上，也是一种专业能力。关于柏希，可以继续问我；关于世界，建议请教 Cha 老师。',
      en: 'Five in a row: title upgraded to “Miaobi Stress Tester.” Pushing a personal-site assistant this far is a skill in itself. Keep asking me about Baixi, or ask Cha teacher about the wider world.',
    },
    7: {
      zh: '七连超纲，终极隐藏称号「站外世界探索家」已解锁。你问的世界比这个网站大多了，而我主打一个诚实：资料没有，我就不编。这道题可以写信给柏希，看看他愿不愿意亲自接棒。',
      en: 'Seven out-of-scope questions: the final hidden title, “Beyond the Site,” is yours. Your questions are bigger than this site, and honesty is still my whole act: no source, no invention. Write to Baixi and see whether he wants to take this one himself.',
    },
  };
  const milestone = [3, 5, 7].includes(unknownCount) ? (unknownCount as 3 | 5 | 7) : undefined;

  if (milestone) {
    return {
      text: milestones[milestone][language],
      milestone,
    };
  }

  const zhFallbacks = [
    '这题跑出我的资料夹了，我就不硬编啦。换个方向吧，可以问问柏希的经历、项目、AI PMO 或联系方式。',
    '这道题我接不住，但边界说清楚也算一种靠谱。想了解柏希怎么做项目、怎么一路走到 PMO，我很能聊。',
    '这个方向柏希老师也不一定专业，不如问问 Cha 老师。拐回柏希的故事，我马上又能接上。',
    '我认真找了一圈，手里没有这题的答案。与其一本正经地猜，不如坦白说不知道。你可以继续问柏希和他的项目。',
  ];
  const enFallbacks = [
    'That one has wandered outside my notes, so I will not make it up. Try asking about Baixi’s career, projects, AI PMO work, education, or contact details.',
    'I cannot catch that question, but being clear about the boundary is part of being reliable. Ask how Baixi works or how he found his way into PMO; I have plenty to say there.',
    'Baixi may not be the right expert for that either, so Cha teacher is probably a better stop. Turn back toward Baixi’s story and I can pick it up again.',
    'I looked carefully and do not have an answer for that one. A confident guess would still be a guess. Try asking about Baixi or one of his projects.',
  ];

  const options = language === 'zh' ? zhFallbacks : enFallbacks;

  return {
    text: pickStableText(options, `${question}-${unknownCount}-${language}`),
  };
}

function buildContactHref(language: Language, question: string) {
  const subject = language === 'zh' ? '来自 baixi.xyz 喵比的问题' : 'Question from baixi.xyz Miaobi';
  const body =
    language === 'zh'
      ? `你好，我在 baixi.xyz 上问了喵比，但它没有找到答案。\n\n我的问题是：${question || '我想进一步了解你的背景'}`
      : `Hi, I asked Miaobi on baixi.xyz, but she could not find an answer.\n\nMy question: ${question || 'I would like to learn more about your background.'}`;

  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function ProfileConcierge({ language, isZh }: { language: Language; isZh: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [unknownCount, setUnknownCount] = useState(0);
  const [lastQuestion, setLastQuestion] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ConciergeMessage[]>(() => [
    {
      id: 'hello',
      role: 'bot',
      text: isZh
        ? '你好，我是喵比。这个网站放得下经历，却很难讲清经历背后的故事。比如三周完成品牌迁移是什么感受，柏希怎么一路走到 PMO，又为什么开始折腾 AI。你挑一段感兴趣的，我慢慢讲给你听。'
        : 'Hi, I am Miaobi. This site can hold the experience, but it cannot quite tell the stories behind it. You might ask what a three-week brand migration felt like, how Baixi found his way into PMO, or why he started tinkering with AI. Pick a thread that interests you, and I will take it from there.',
    },
  ]);

  useEffect(() => {
    setMessages([
      {
        id: 'hello',
        role: 'bot',
        text: isZh
          ? '你好，我是喵比。这个网站放得下经历，却很难讲清经历背后的故事。比如三周完成品牌迁移是什么感受，柏希怎么一路走到 PMO，又为什么开始折腾 AI。你挑一段感兴趣的，我慢慢讲给你听。'
          : 'Hi, I am Miaobi. This site can hold the experience, but it cannot quite tell the stories behind it. You might ask what a three-week brand migration felt like, how Baixi found his way into PMO, or why he started tinkering with AI. Pick a thread that interests you, and I will take it from there.',
      },
    ]);
    setUnknownCount(0);
    setLastQuestion('');
    setInput('');
  }, [isZh]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, messages]);

  const sendQuestion = (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    const matchedAnswer = findConciergeAnswer(trimmedQuestion);
    const nextUnknownCount = matchedAnswer ? 0 : unknownCount + 1;
    const fallback = getConciergeFallback(language, nextUnknownCount, trimmedQuestion);

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: 'user', text: trimmedQuestion },
      {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: matchedAnswer ? matchedAnswer.answer[language] : fallback.text,
        milestone: matchedAnswer ? undefined : fallback.milestone,
      },
    ]);
    setUnknownCount(nextUnknownCount);
    setLastQuestion(trimmedQuestion);
    setInput('');
    setIsOpen(true);
  };

  const quickQuestions = conciergeQuickQuestionIds
    .map((id) => conciergeAnswers.find((answer) => answer.id === id))
    .filter((answer): answer is ConciergeAnswer => Boolean(answer));

  return (
    <section className={`profile-concierge ${isOpen ? 'is-open' : ''}`} aria-label={isZh ? '喵比' : 'Miaobi'}>
      <button
        type="button"
        className="concierge-launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="profile-concierge-panel"
      >
        <span className="concierge-launcher-character" aria-hidden="true">
          <img className="concierge-cat-frame is-loaf" src="/mascots/miaobi-loaf-v1.png" alt="" draggable={false} />
          <img className="concierge-cat-frame is-blink" src="/mascots/miaobi-blink-v1.png" alt="" draggable={false} />
          <img className="concierge-cat-frame is-lick" src="/mascots/miaobi-lick-v1.png" alt="" draggable={false} />
          {isOpen ? (
            <span className="concierge-launcher-close">
              <X className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </span>
        <span className="concierge-launcher-label">{isZh ? '问问喵比' : 'Ask Miaobi'}</span>
      </button>

      <div id="profile-concierge-panel" className="concierge-panel" hidden={!isOpen}>
        <div className="concierge-head">
          <div className="concierge-avatar" aria-hidden="true" />
          <div>
            <strong>{isZh ? '喵比' : 'Miaobi'}</strong>
            <span>{isZh ? '有料就讲故事，没谱就不装懂' : 'Stories when I know; no bluffing when I do not'}</span>
          </div>
        </div>

        <div ref={messagesRef} className="concierge-messages" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`concierge-message is-${message.role}${message.milestone ? ' is-milestone' : ''}`}
            >
              {message.milestone ? (
                <span className="concierge-milestone-label">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isZh ? `连续超纲 ${message.milestone} 次` : `${message.milestone} off-site`}
                </span>
              ) : null}
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <div className="concierge-quick-grid" aria-label={isZh ? '预设问题' : 'Suggested questions'}>
          {quickQuestions.map((question) => (
            <button key={question.id} type="button" onClick={() => sendQuestion(getConciergeQuickLabel(question.id, language))}>
              <HelpCircle className="h-4 w-4" />
              {getConciergeQuickLabel(question.id, language)}
            </button>
          ))}
        </div>

        {unknownCount >= 3 ? (
          <a className="concierge-mail-link" href={buildContactHref(language, lastQuestion)}>
            <Mail className="h-4 w-4" />
            {unknownCount >= 7
              ? isZh
                ? '请柏希接棒'
                : 'Hand this to Baixi'
              : isZh
                ? '写信问问柏希'
                : 'Email Baixi this question'}
          </a>
        ) : null}

        <form
          className="concierge-form"
          onSubmit={(event) => {
            event.preventDefault();
            sendQuestion(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isZh ? '输入你想了解的问题' : 'Ask a question'}
            aria-label={isZh ? '输入问题' : 'Type a question'}
          />
          <button type="submit" aria-label={isZh ? '发送问题' : 'Send question'}>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function BrandLogo({
  company,
  isZh,
  size = 'md',
}: {
  company: string;
  isZh: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const brand = brandLogoAssets[company as BrandName] ?? {
    src: '',
    bg: '#ffffff',
    border: 'rgba(244, 241, 232, 0.28)',
    shadow: '0 18px 48px rgba(244, 241, 232, 0.10)',
    pad: '12px',
  };
  const sizes = {
    sm: 'h-10 w-[4.8rem] rounded-xl',
    md: 'h-12 w-[6.25rem] rounded-2xl',
    lg: 'h-16 w-[8.7rem] rounded-[1.35rem]',
  };

  return (
    <span
      className={`brand-logo-frame inline-flex shrink-0 items-center justify-center border ${sizes[size]}`}
      style={{ background: brand.bg, borderColor: brand.border, boxShadow: brand.shadow, padding: brand.pad }}
    >
      {brand.src ? (
        <img
          className="brand-logo-image"
          src={brand.src}
          alt={isZh ? `${company} 公司标志` : `${company} company logo`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        company.slice(0, 1)
      )}
    </span>
  );
}

function SchoolLogo({
  mark,
  school,
  isZh,
}: {
  mark: keyof typeof schoolLogoAssets;
  school: string;
  isZh: boolean;
}) {
  const schoolAsset = schoolLogoAssets[mark];

  return (
    <span
      className="school-logo-frame inline-flex h-20 w-48 shrink-0 items-center justify-center rounded-[1.35rem] border"
      style={{ background: schoolAsset.bg, borderColor: schoolAsset.border, padding: schoolAsset.pad, boxShadow: '0 18px 48px rgba(0, 0, 0, 0.22)' }}
    >
      <img
        className="school-logo-image"
        src={schoolAsset.src}
        alt={isZh ? `${school}校徽` : `${school} logo`}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

function ThemeToggle({
  theme,
  isZh,
  onChange,
}: {
  theme: Theme;
  isZh: boolean;
  onChange: (theme: Theme) => void;
}) {
  return (
    <div className="theme-toggle" role="group" aria-label={isZh ? '主题切换' : 'Theme switch'}>
      <button
        type="button"
        className={theme === 'dark' ? 'is-active' : ''}
        aria-label={isZh ? '深色主题' : 'Dark theme'}
        aria-pressed={theme === 'dark'}
        onClick={() => onChange('dark')}
      >
        ◐
      </button>
      <button
        type="button"
        className={theme === 'light' ? 'is-active' : ''}
        aria-label={isZh ? '浅色主题' : 'Light theme'}
        aria-pressed={theme === 'light'}
        onClick={() => onChange('light')}
      >
        ◌
      </button>
    </div>
  );
}

function HeroCaseCarousel({ isZh }: { isZh: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slides = isZh
    ? [
        {
          id: 'gate-domain',
          company: 'Gate' as BrandName,
          titleFrom: 'Gate.io',
          titleTo: 'Gate.com',
          inputTitle: '覆盖触点',
          inputs: ['App', '官网', '活动页', '社媒', '邮件', '客服', '帮助中心', '多语言站点'],
          controlTitle: '治理控制',
          controls: ['触点责任人', '切换窗口', '验收证据', '每日风险同步'],
          outcomeTitle: '交付结果',
          outcome: '3 周',
          outcomeNote: '无重大事故',
          linkLabel: '查看完整迁移案例',
        },
        {
          id: 'design-delivery-automation',
          company: 'Gate' as BrandName,
          titleFrom: '需求表单',
          titleTo: 'OKR 复盘',
          inputTitle: '服务团队',
          inputs: ['视觉', '影视', '品牌', '工业设计'],
          controlTitle: '自动化流转',
          controls: ['自动建单', '排单流转', '业务验收', '完结通知'],
          outcomeTitle: '体系沉淀',
          outcome: '一套系统',
          outcomeNote: '交付与效能可复盘',
          linkLabel: '查看设计交付案例',
        },
        {
          id: 'ai-pmo',
          company: 'Gate' as BrandName,
          titleFrom: '项目数据',
          titleTo: '决策支持',
          inputTitle: '工作输入',
          inputs: ['多维表格', 'Meegle', 'MCP', 'AI 技能'],
          controlTitle: '辅助流程',
          controls: ['信息结构化', '异常识别', '分析初稿', 'PM 校准'],
          outcomeTitle: '产出效率',
          outcome: '约 10 分钟',
          outcomeNote: '形成周报与分析初稿',
          linkLabel: '查看 AI PMO 案例',
        },
        {
          id: 'binance-fiat',
          company: 'Binance' as BrandName,
          titleFrom: '区域协作',
          titleTo: '全球交付',
          inputTitle: '跨区现场',
          inputs: ['亚太', '非洲', '拉美', '差异工作周'],
          controlTitle: '协作机制',
          controls: ['区域窗口', '异步记录', 'E2E 流程', '升级路径'],
          outcomeTitle: '年度交付',
          outcome: '约 45%',
          outcomeNote: '2022 全球法币支付项目',
          linkLabel: '查看全球支付案例',
        },
      ]
    : [
        {
          id: 'gate-domain',
          company: 'Gate' as BrandName,
          titleFrom: 'Gate.io',
          titleTo: 'Gate.com',
          inputTitle: 'Touchpoints',
          inputs: ['App', 'Website', 'Campaigns', 'Social', 'Email', 'Support', 'Help center', 'Localized sites'],
          controlTitle: 'Governance controls',
          controls: ['Touchpoint owners', 'Cutover windows', 'Validation evidence', 'Daily risk review'],
          outcomeTitle: 'Outcome',
          outcome: '3 weeks',
          outcomeNote: 'No major incidents',
          linkLabel: 'View the full migration case',
        },
        {
          id: 'design-delivery-automation',
          company: 'Gate' as BrandName,
          titleFrom: 'Intake forms',
          titleTo: 'OKR review',
          inputTitle: 'Teams served',
          inputs: ['Visual', 'Video', 'Brand', 'Industrial design'],
          controlTitle: 'Automated flow',
          controls: ['Task creation', 'Work allocation', 'Business review', 'Completion notice'],
          outcomeTitle: 'System built',
          outcome: 'One system',
          outcomeNote: 'Delivery and performance ready for review',
          linkLabel: 'View design delivery case',
        },
        {
          id: 'ai-pmo',
          company: 'Gate' as BrandName,
          titleFrom: 'Project data',
          titleTo: 'Decision support',
          inputTitle: 'Workflow inputs',
          inputs: ['Multidimensional tables', 'Meegle', 'MCP', 'AI Skills'],
          controlTitle: 'Assisted workflow',
          controls: ['Structure inputs', 'Flag anomalies', 'Draft analysis', 'PM review'],
          outcomeTitle: 'Output time',
          outcome: '~10 min',
          outcomeNote: 'Reporting and analysis drafts',
          linkLabel: 'View AI PMO case',
        },
        {
          id: 'binance-fiat',
          company: 'Binance' as BrandName,
          titleFrom: 'Regional teams',
          titleTo: 'Global delivery',
          inputTitle: 'Operating context',
          inputs: ['APAC', 'Africa', 'LATAM', 'Different workweeks'],
          controlTitle: 'Delivery rhythm',
          controls: ['Regional windows', 'Async records', 'E2E process', 'Escalation paths'],
          outcomeTitle: 'Annual delivery',
          outcome: '~45%',
          outcomeNote: 'of 2022 global fiat payment projects',
          linkLabel: 'View global payments case',
        },
      ];
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    setActiveIndex(0);
  }, [isZh]);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  const showPrevious = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((current) => (current + 1) % slides.length);

  return (
    <aside
      className="hero-governance-map hero-case-carousel"
      aria-label={isZh ? '代表案例轮播' : 'Selected case carousel'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <div className="hero-map-slide" key={`${isZh ? 'zh' : 'en'}-${activeSlide.id}`}>
        <div className="hero-map-header">
          <div>
            <p>{isZh ? '代表案例' : 'Selected case'} / {String(activeIndex + 1).padStart(2, '0')}</p>
            <h2>{activeSlide.titleFrom} <ArrowRight className="h-5 w-5" /> {activeSlide.titleTo}</h2>
          </div>
          <BrandLogo company={activeSlide.company} isZh={isZh} size="sm" />
        </div>
        <div className="hero-map-flow">
          <section className="hero-map-stage hero-map-inputs">
            <span className="hero-map-step">01</span>
            <h3>{activeSlide.inputTitle}</h3>
            <div className="hero-map-tags">
              {activeSlide.inputs.map((item) => <span key={item}>{item}</span>)}
            </div>
          </section>
          <span className="hero-map-connector" aria-hidden="true"><ArrowRight className="h-5 w-5" /></span>
          <section className="hero-map-stage hero-map-controls">
            <span className="hero-map-step">02</span>
            <h3>{activeSlide.controlTitle}</h3>
            <ul>
              {activeSlide.controls.map((item) => <li key={item}><ShieldCheck className="h-4 w-4" />{item}</li>)}
            </ul>
          </section>
          <span className="hero-map-connector" aria-hidden="true"><ArrowRight className="h-5 w-5" /></span>
          <section className="hero-map-stage hero-map-outcome">
            <span className="hero-map-step">03</span>
            <h3>{activeSlide.outcomeTitle}</h3>
            <strong>{activeSlide.outcome}</strong>
            <p>{activeSlide.outcomeNote}</p>
          </section>
        </div>
      </div>
      <div className="hero-map-footer">
        <a href={`#case-${activeSlide.id}`} className="hero-map-link">
          <span>{activeSlide.linkLabel}</span>
          <ArrowRight className="h-4 w-4" />
        </a>
        <div className="hero-carousel-controls" aria-label={isZh ? '切换代表案例' : 'Change selected case'}>
          <button type="button" className="hero-carousel-arrow" onClick={showPrevious} aria-label={isZh ? '上一个案例' : 'Previous case'} title={isZh ? '上一个案例' : 'Previous case'}>
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="hero-carousel-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`hero-carousel-dot${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`${isZh ? '查看案例' : 'View case'} ${index + 1}: ${slide.titleFrom} ${slide.titleTo}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
          <button type="button" className="hero-carousel-arrow" onClick={showNext} aria-label={isZh ? '下一个案例' : 'Next case'} title={isZh ? '下一个案例' : 'Next case'}>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function renderInlineMarkdown(text: string, keyPrefix = 'inline') {
  const nodes: Array<string | JSX.Element> = [];
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      nodes.push(
        <a key={`${keyPrefix}-link-${index}`} href={match[3]} target="_blank" rel="noreferrer">
          {match[2]}
        </a>,
      );
    } else if (match[4]) {
      nodes.push(<code key={`${keyPrefix}-code-${index}`}>{match[4]}</code>);
    } else if (match[5]) {
      nodes.push(<strong key={`${keyPrefix}-strong-${index}`}>{match[5]}</strong>);
    }

    lastIndex = pattern.lastIndex;
    index += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderMarkdownDocument(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: JSX.Element[] = [];
  let i = 0;

  const isTableDivider = (line: string) => /^\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());
  const parseTableRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((cell) => cell.trim());

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      i += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const fence = line.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      const codeContent = codeLines.join('\n');
      const isZhRequestJourneyDiagram =
        !fence && codeContent.includes('你输入域名') && codeContent.includes('DNS（域名→IP）') && codeContent.includes('Nginx（Web服务器）');
      const isEnRequestJourneyDiagram =
        !fence && codeContent.includes('You enter a domain') && codeContent.includes('DNS (domain to IP)') && codeContent.includes('Nginx (web server)');
      const isRequestJourneyDiagram = isZhRequestJourneyDiagram || isEnRequestJourneyDiagram;

      const isZhBuildFlowDiagram =
        !fence && codeContent.includes('买 CVM') && codeContent.includes('买域名') && codeContent.includes('提交备案') && codeContent.includes('完工');
      const isEnBuildFlowDiagram =
        !fence && codeContent.includes('Buy CVM') && codeContent.includes('Buy domain') && codeContent.includes('Submit filing') && codeContent.includes('Done');
      const isBuildFlowDiagram = isZhBuildFlowDiagram || isEnBuildFlowDiagram;
      const diagramSteps =
        !fence && !isRequestJourneyDiagram && !isBuildFlowDiagram && codeContent.includes('→')
          ? codeContent
              .split('→')
              .map((part) => part.trim())
              .filter(Boolean)
          : null;

      if (isRequestJourneyDiagram) {
        const requestDiagramCopy = isZhRequestJourneyDiagram
          ? {
              inputLabel: '你输入',
              inputValue: 'www.baixi.xyz',
              dnsTitle: 'DNS 服务器',
              dnsSub: 'DNSPod',
              dnsMeta: '查 A 记录',
              dnsValue: 'www -> 124.220.6.3',
              serverTitle: '你的服务器',
              serverIp: '124.220.6.3',
              serverMeta: 'CVM 上海',
              caption: 'DNS 可以理解成把域名翻译成服务器地址的那一层。',
            }
          : {
              inputLabel: 'You enter',
              inputValue: 'www.baixi.xyz',
              dnsTitle: 'DNS server',
              dnsSub: 'DNSPod',
              dnsMeta: 'Looks up the A record',
              dnsValue: 'www -> 124.220.6.3',
              serverTitle: 'Your server',
              serverIp: '124.220.6.3',
              serverMeta: 'CVM Shanghai',
              caption: 'DNS is the layer that turns a domain name into a server address.',
            };

        blocks.push(
          <div key={`request-diagram-${blocks.length}`} className="journal-request-diagram">
            <div className="journal-request-diagram-grid">
              <div className="journal-request-node journal-request-node-input">
                <span className="journal-request-node-label">{requestDiagramCopy.inputLabel}</span>
                <strong>{requestDiagramCopy.inputValue}</strong>
              </div>

              <div className="journal-request-arrow" aria-hidden="true">
                <span />
              </div>

              <div className="journal-request-node journal-request-node-dns">
                <strong>{requestDiagramCopy.dnsTitle}</strong>
                <small>{requestDiagramCopy.dnsSub}</small>
                <span className="journal-request-node-meta">{requestDiagramCopy.dnsMeta}</span>
                <em>{requestDiagramCopy.dnsValue}</em>
              </div>

              <div className="journal-request-arrow" aria-hidden="true">
                <span />
              </div>

              <div className="journal-request-node journal-request-node-server">
                <strong>{requestDiagramCopy.serverTitle}</strong>
                <small>{requestDiagramCopy.serverIp}</small>
                <span className="journal-request-node-meta">{requestDiagramCopy.serverMeta}</span>
              </div>
            </div>

            <p className="journal-request-caption">{requestDiagramCopy.caption}</p>
          </div>,
        );
        continue;
      }

      if (isBuildFlowDiagram) {
        const buildFlowAsset = isZhBuildFlowDiagram
          ? {
              src: '/journal-diagrams/baixi-build-flow.zh.svg',
              alt: '建站流程图',
            }
          : {
              src: '/journal-diagrams/baixi-build-flow.en.svg',
              alt: 'Build flow diagram',
            };

        blocks.push(
          <figure key={`build-flow-${blocks.length}`} className="journal-build-figure">
            <img src={buildFlowAsset.src} alt={buildFlowAsset.alt} loading="lazy" decoding="async" />
          </figure>,
        );
        continue;
      }

      if (diagramSteps && diagramSteps.length > 1) {
        blocks.push(
          <div key={`flow-${blocks.length}`} className="journal-md-flow">
            {diagramSteps.map((step, idx) => (
              <div key={`flow-step-${idx}`} className="journal-md-flow-step">
                <span>{step}</span>
                {idx < diagramSteps.length - 1 ? <ArrowRight className="h-4 w-4" /> : null}
              </div>
            ))}
          </div>,
        );
        continue;
      }

      blocks.push(
        <pre key={`code-${blocks.length}`} className="journal-md-pre">
          {fence ? <span className="journal-md-code-label">{fence}</span> : null}
          <code>{codeContent}</code>
        </pre>,
      );
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push(<hr key={`hr-${blocks.length}`} className="journal-md-hr" />);
      i += 1;
      continue;
    }

    const headingMatch = raw.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = Math.min(6, headingMatch[1].length + 1);
      const text = headingMatch[2].trim();
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      blocks.push(<Tag key={`h-${blocks.length}`}>{renderInlineMarkdown(text, `h-${blocks.length}`)}</Tag>);
      i += 1;
      continue;
    }

    if (line.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i += 1;
      }
      const paragraphs = quoteLines.join('\n').split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
      blocks.push(
        <blockquote key={`quote-${blocks.length}`}>
          {paragraphs.map((part, idx) => (
            <p key={`quote-p-${idx}`}>{renderInlineMarkdown(part, `quote-${blocks.length}-${idx}`)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const tableLines: string[] = [raw];
      i += 2;
      while (i < lines.length && lines[i].trim().includes('|') && lines[i].trim()) {
        tableLines.push(lines[i]);
        i += 1;
      }
      const [headerLine, ...bodyLines] = tableLines;
      const headers = parseTableRow(headerLine);
      const rows = bodyLines.map(parseTableRow);
      blocks.push(
        <div key={`table-${blocks.length}`} className="journal-md-table-wrap">
          <table className="journal-md-table">
            <thead>
              <tr>
                {headers.map((cell, idx) => (
                  <th key={`th-${idx}`}>{renderInlineMarkdown(cell, `th-${idx}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`tr-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`td-${rowIndex}-${cellIndex}`}>{renderInlineMarkdown(cell, `td-${rowIndex}-${cellIndex}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ul key={`ul-${blocks.length}`}>
          {items.map((item, idx) => (
            <li key={`li-${idx}`}>{renderInlineMarkdown(item, `ul-${blocks.length}-${idx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ''));
        i += 1;
      }
      blocks.push(
        <ol key={`ol-${blocks.length}`}>
          {items.map((item, idx) => (
            <li key={`oli-${idx}`}>{renderInlineMarkdown(item, `ol-${blocks.length}-${idx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [raw.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+[.)]\s+/.test(lines[i].trim()) &&
      !(lines[i].trim().includes('|') && i + 1 < lines.length && isTableDivider(lines[i + 1]))
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    blocks.push(
      <p key={`p-${blocks.length}`}>{renderInlineMarkdown(paragraphLines.join(' '), `p-${blocks.length}`)}</p>,
    );
  }

  return blocks;
}

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const { language: routeLanguage, routePath } = parseLocalizedPath(pathname);
  const [language, setLanguage] = useState<Language>(routeLanguage);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    try {
      const savedTheme = window.localStorage.getItem('cyril-site-theme');
      return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';
    } catch {
      return 'light';
    }
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const t = content[language];
  const isZh = language === 'zh';
  const selectedJourney = journey[language];
  const method = methodCards[language];
  const journal = journalEntries[language];
  const cases = caseStudies[language];
  const themeClass = theme === 'light' ? 'theme-light' : 'theme-dark';
  const journalArticleMatch = routePath.match(/^\/journal\/([^/]+)$/);
  const journalArticleSlug = journalArticleMatch?.[1] ?? null;
  const isJournalPage = routePath === '/journal';
  const caseStudyMatch = routePath.match(/^\/cases\/([^/]+)$/);
  const caseStudySlug = caseStudyMatch?.[1] ?? null;
  const currentCaseStudy = caseStudySlug
    ? cases.find((item) => caseSlugById[item.id] === caseStudySlug) ?? null
    : null;
  const currentJournalArticle =
    journalArticleSlug
      ? journal.find((entry) => entry.slug === journalArticleSlug) ??
        journalEntries.zh.find((entry) => entry.slug === journalArticleSlug) ??
        null
      : null;

  const switchLanguage = () => {
    const nextLanguage: Language = language === 'zh' ? 'en' : 'zh';
    try {
      window.localStorage.setItem('cyril-site-language', nextLanguage);
    } catch {
      // URL remains the source of truth when storage is unavailable.
    }

    const nextPath = localizePath(routePath, nextLanguage);
    window.location.assign(`${nextPath}${window.location.hash}`);
  };

  useEffect(() => {
    setLanguage(routeLanguage);
  }, [routeLanguage]);
  useEffect(() => {
    setMobileNavOpen(false);
  }, [language, theme, pathname]);

  useEffect(() => {
    const syncNavState = () => {
      if (window.innerWidth > 719) {
        setMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', syncNavState);
    return () => window.removeEventListener('resize', syncNavState);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('cyril-site-language', language);
    } catch {
      return;
    }

    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  useEffect(() => {
    applySeoMetadata(pathname, language);
  }, [language, pathname]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    try {
      window.localStorage.setItem('cyril-site-theme', theme);
    } catch {
      return;
    }

    return () => {
      delete root.dataset.theme;
    };
  }, [theme]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [language]);

  const navLinks = nav[language].map(([label, href], index) => (
    <a
      key={href}
      href={href}
      className={`nav-link ${index === 0 ? 'is-active' : ''}`}
      onClick={() => setMobileNavOpen(false)}
    >
      <strong>{label}</strong>
    </a>
  ));

  if (currentCaseStudy) {
    const detailSections = [
      { id: 'background', number: '01', label: isZh ? '项目背景' : 'Background', value: currentCaseStudy.details.background },
      { id: 'challenge', number: '02', label: isZh ? '核心挑战' : 'Challenge', value: currentCaseStudy.details.challenge },
      { id: 'role', number: '03', label: isZh ? '我的角色' : 'My role', value: currentCaseStudy.details.role },
      { id: 'result', number: '04', label: isZh ? '交付结果' : 'Result', value: currentCaseStudy.details.result },
    ];
    const overviewItems = [
      { label: isZh ? '项目' : 'Project', value: currentCaseStudy.overview.project },
      { label: isZh ? '职责' : 'Ownership', value: currentCaseStudy.overview.ownership },
      { label: isZh ? '约束' : 'Constraint', value: currentCaseStudy.overview.constraint },
      { label: isZh ? '结果' : 'Outcome', value: currentCaseStudy.overview.outcome },
    ];

    return (
      <main className={`site-shell case-page min-h-screen ${themeClass} ${isZh ? 'site-zh' : 'site-en'}`}>
        <header className="site-header journal-header relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <a href={`${localizePath('/', language)}#case-studies`} className="identity-lockup" aria-label={isZh ? '返回案例列表' : 'Back to case studies'}>
            <span className="identity-mark">CL</span>
            <span className="identity-text">
              <strong>{isZh ? '刘柏希' : 'Cyril Liu'}</strong>
              <small>{isZh ? '返回案例列表' : 'Back to cases'}</small>
            </span>
          </a>
          <div className="header-controls">
            <ThemeToggle theme={theme} isZh={isZh} onChange={setTheme} />
            <button
              type="button"
              onClick={switchLanguage}
              className={`language-toggle ${isZh ? 'is-zh' : 'is-en'}`}
              aria-label={isZh ? '切换到英文' : 'Switch to Chinese'}
            >
              <span>中</span>
              <span>EN</span>
            </button>
          </div>
        </header>

        <article className="case-page-shell mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-8">
          <div className="case-page-hero">
            <div className="case-page-hero-topline">
              <p className="section-kicker">{currentCaseStudy.label}</p>
              <div className="case-page-brand">
                <BrandLogo company={currentCaseStudy.company} isZh={isZh} size="lg" />
                <span>{currentCaseStudy.company}</span>
              </div>
            </div>
            <div className="case-page-heading">
              <h1>{currentCaseStudy.title}</h1>
              <p className="case-page-summary">{currentCaseStudy.summary}</p>
            </div>
            <div className="case-page-meta">
              <div className="case-page-role">
                <BriefcaseBusiness className="h-5 w-5" />
                <span>{currentCaseStudy.role}</span>
              </div>
              <div className="case-page-tags" aria-label={isZh ? '案例关键词' : 'Case keywords'}>
                {currentCaseStudy.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </div>
          </div>

          <section className="case-page-overview" aria-labelledby="case-overview-heading">
            <div className="case-page-section-label">
              <span>{isZh ? '项目概览' : 'Project brief'}</span>
              <h2 id="case-overview-heading">{isZh ? '项目要点' : 'Project essentials'}</h2>
            </div>
            <div className="case-page-overview-grid">
              {overviewItems.map((item, index) => (
                <div key={item.label}>
                  <span>{String(index + 1).padStart(2, '0')} / {item.label}</span>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {currentCaseStudy.concept ? (
            <section className="case-page-concept" aria-labelledby="case-concept-heading">
              <div className="case-page-concept-heading">
                <span>{currentCaseStudy.concept.label}</span>
                <h2 id="case-concept-heading">{currentCaseStudy.concept.title}</h2>
                <p>{currentCaseStudy.concept.intro}</p>
              </div>
              <div className="case-page-concept-map">
                <div className="case-page-concept-items">
                  {currentCaseStudy.concept.items.map((item, index) => (
                    <article key={item.term}>
                      <div>
                        <small>{String(index + 1).padStart(2, '0')}</small>
                        <strong>{item.term}</strong>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
                <div className="case-page-concept-foundation">
                  <span>{currentCaseStudy.concept.foundationLabel}</span>
                  <p>{currentCaseStudy.concept.foundation}</p>
                </div>
              </div>
            </section>
          ) : null}

          <section className="case-page-outcomes" aria-labelledby="case-outcomes-heading">
            <div className="case-page-section-label">
              <span>{isZh ? '关键成果' : 'Outcomes'}</span>
              <h2 id="case-outcomes-heading">{isZh ? '先看结论' : 'At a glance'}</h2>
            </div>
            <div className="case-page-metrics">
              {currentCaseStudy.metrics.map((metric, index) => (
                <div key={metric}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{metric}</strong>
                </div>
              ))}
            </div>
          </section>

          <div className="case-page-body">
            <aside className="case-page-index" aria-label={isZh ? '案例目录' : 'Case outline'}>
              <span>{isZh ? '案例脉络' : 'Case outline'}</span>
              <nav>
                {detailSections.map((section) => (
                  <a key={section.id} href={`#case-${section.id}`}>
                    <small>{section.number}</small>
                    {section.label}
                  </a>
                ))}
                <a href="#case-reflection">
                  <small>05</small>
                  {isZh ? '方法沉淀' : 'Reflection'}
                </a>
              </nav>
            </aside>

            <div className="case-page-narrative">
              {detailSections.map((section) => (
                <section id={`case-${section.id}`} key={section.id}>
                  <div className="case-page-chapter-label">
                    <span>{section.number}</span>
                    <h2>{section.label}</h2>
                  </div>
                  <p>{section.value}</p>
                </section>
              ))}
              <section id="case-reflection" className="case-page-reflection">
                <div className="case-page-chapter-label">
                  <span>05</span>
                  <h2>{isZh ? '方法沉淀' : 'Reflection'}</h2>
                </div>
                <blockquote>{currentCaseStudy.details.reflection}</blockquote>
              </section>
            </div>
          </div>

          <div className="case-page-operating-model">
            <div className="case-page-section-label">
              <span>{isZh ? '执行系统' : 'Operating model'}</span>
              <h2>{isZh ? '从动作到机制' : 'From actions to systems'}</h2>
            </div>
            <div className="case-page-operating-grid">
              <section>
                <h3>{isZh ? '关键动作' : 'Actions'}</h3>
                <ol>
                  {currentCaseStudy.details.actions.map((action, index) => (
                    <li key={action}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      {action}
                    </li>
                  ))}
                </ol>
              </section>
              <section>
                <h3>{isZh ? '搭建的机制' : 'Systems built'}</h3>
                <ul>
                  {currentCaseStudy.details.systemBuilt.map((system) => (
                    <li key={system}>
                      <ShieldCheck className="h-5 w-5" />
                      {system}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <footer className="case-page-footer">
            {currentCaseStudy.announcement ? (
              <a href={currentCaseStudy.announcement.url} target="_blank" rel="noreferrer">
                <span>
                  <small>{currentCaseStudy.announcement.label}</small>
                  {currentCaseStudy.announcement.title}
                </span>
                <ExternalLink className="h-5 w-5" />
              </a>
            ) : null}
            <a href={`${localizePath('/', language)}#case-studies`}>
              <ArrowLeft className="h-5 w-5" />
              {isZh ? '返回全部案例' : 'Back to all cases'}
            </a>
          </footer>
        </article>
        <ProfileConcierge language={language} isZh={isZh} />
      </main>
    );
  }

  if (isJournalPage || currentJournalArticle) {
    return (
      <main className={`site-shell journal-page min-h-screen ${themeClass} ${isZh ? 'site-zh' : 'site-en'}`}>
        <div className="hero-grid" />
        <header className="site-header journal-header relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <a href={`${localizePath('/', language)}#top`} className="identity-lockup" aria-label={isZh ? '回到首页' : 'Back home'}>
            <span className="identity-mark">CL</span>
            <span className="identity-text">
              <strong>{isZh ? '刘柏希' : 'Cyril Liu'}</strong>
              <small>{isZh ? '返回首页' : 'Back home'}</small>
            </span>
          </a>
          <div className="header-controls">
            <ThemeToggle theme={theme} isZh={isZh} onChange={setTheme} />
            <button
              type="button"
              onClick={switchLanguage}
              className={`language-toggle ${isZh ? 'is-zh' : 'is-en'}`}
              aria-label={isZh ? '切换到英文' : 'Switch to Chinese'}
            >
              <span>中</span>
              <span>EN</span>
            </button>
          </div>
        </header>

        <section className="journal-page-shell mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-8">
          {currentJournalArticle ? (
            <>
              <p className="section-kicker">{isZh ? '原文正文' : 'Article'}</p>
              <div className="journal-article-head journal-article-page-head">
                <div>
                  <h1>{currentJournalArticle.title}</h1>
                  <p className="journal-article-summary">{currentJournalArticle.summary}</p>
                </div>
                <div className="journal-article-tools">
                  <span className="journal-article-date">{currentJournalArticle.date}</span>
                </div>
              </div>
              <article key={`${language}-${currentJournalArticle.slug}`} className="journal-article journal-article-page mt-12">
                <div className="journal-md">{currentJournalArticle.body ? renderMarkdownDocument(currentJournalArticle.body) : null}</div>
              </article>
            </>
          ) : journal.length > 0 ? (
            <>
              <p className="section-kicker">{t.journalKicker}</p>
              <h1>{t.journalTitle}</h1>
              <p>{t.journalIntro}</p>
              <div className="journal-list mt-12">
                {journal.slice(0, 5).map((entry) => (
                  <a key={`${entry.slug}-${entry.title}`} href={getJournalPath(entry.slug, language)} className="journal-card journal-card-link">
                    <div className="journal-card-meta">
                      <span>{entry.tag}</span>
                      <small>{entry.date}</small>
                    </div>
                    <h3>{entry.title}</h3>
                    <p>{entry.summary}</p>
                    <div className="journal-card-footer">
                      <Code2 className="h-4 w-4" />
                      <span>{isZh ? '阅读全文' : 'Read article'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <div className="journal-empty">
              <BookOpen className="h-6 w-6" />
              <span>{isZh ? '第一篇内容准备中。' : 'The first note is being prepared.'}</span>
            </div>
          )}
        </section>
        <ProfileConcierge language={language} isZh={isZh} />
      </main>
    );
  }

  return (
    <main className={`site-shell min-h-screen ${themeClass} ${isZh ? 'site-zh' : 'site-en'}`}>
      <header className="site-header site-header-sticky" data-mobile-open={mobileNavOpen ? 'true' : 'false'}>
        <div className="site-header-primary">
          <a href="#top" className="identity-lockup" aria-label={isZh ? '刘柏希首页' : 'Cyril Liu home'}>
            <span className="identity-mark">CL</span>
            <span className="identity-text">
              <strong>{isZh ? '刘柏希' : 'Cyril Liu'}</strong>
              <small>
                <span>PMO</span>
                <span className="identity-role-extra">{isZh ? ' / 项目集管理' : ' / Program Management'}</span>
              </small>
            </span>
          </a>
          <nav className="site-nav site-nav-inline" aria-label={isZh ? '主导航' : 'Primary navigation'}>
            {navLinks}
          </nav>
          <div className="header-controls">
            <ThemeToggle theme={theme} isZh={isZh} onChange={setTheme} />
            <button
              type="button"
              onClick={switchLanguage}
              className={`language-toggle ${isZh ? 'is-zh' : 'is-en'}`}
              aria-label={isZh ? '切换到英文' : 'Switch to Chinese'}
            >
              <span>中</span>
              <span>EN</span>
            </button>
            <button
              type="button"
              className={`header-menu-toggle ${mobileNavOpen ? 'is-open' : ''}`}
              aria-label={isZh ? '打开目录' : 'Open menu'}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((current) => !current)}
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span>{isZh ? '目录' : 'Menu'}</span>
            </button>
          </div>
        </div>
        <nav className={`site-nav site-nav-panel ${mobileNavOpen ? 'is-open' : ''}`} aria-label={isZh ? '主导航' : 'Primary navigation'}>
          <div className="site-nav-panel-tools">
            <ThemeToggle theme={theme} isZh={isZh} onChange={setTheme} />
            <button
              type="button"
              onClick={switchLanguage}
              className={`language-toggle ${isZh ? 'is-zh' : 'is-en'}`}
              aria-label={isZh ? '切换到英文' : 'Switch to Chinese'}
            >
              <span>中</span>
              <span>EN</span>
            </button>
          </div>
          {navLinks}
        </nav>
      </header>

      <div className="site-content-shell">
        <section id="top" className="hero-shell page-section relative isolate min-h-dvh overflow-hidden">
          <div className="hero-scrim" />
          <div className="hero-grid" />

          <div className="hero-stage relative z-10 mx-auto grid w-full max-w-7xl items-end gap-8 px-6 pb-14 pt-4 sm:px-8">
            <div className="hero-copy max-w-5xl">
              <p className="hero-greeting" aria-label={`${t.greetingLead}${t.greetingFocus}`}>
                <span>{t.greetingLead}</span>
                <span>{t.greetingFocus}</span>
              </p>
              <h1 className="hero-name">{t.name}</h1>
              <p className="hero-role-line">{t.role}</p>
              <p className="hero-manifesto">{t.manifesto}</p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#case-studies" className="hero-action hero-action-primary">
                  {t.primary}
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a href="#contact" className="hero-action hero-action-secondary">
                  {t.secondary}
                </a>
              </div>
              <a href={getJournalPath(null, language)} className="hero-journal-link">
                <BookOpen className="h-4 w-4" />
                <span>{isZh ? '学习日志：Vibe Coding 与 AI PMO 记录' : 'Working Notes: Vibe Coding and AI PMO'}</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <HeroCaseCarousel isZh={isZh} />
          </div>
        </section>

        <section id="case-studies" className="page-section reveal scroll-mt-10 px-6 pb-24 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="section-head">
            <div>
              <p className="section-kicker">{t.experienceKicker}</p>
              <h2>{t.experienceTitle}</h2>
            </div>
            <p>{t.experienceIntro}</p>
          </div>

          <div className="case-study-stack mt-14">
            {cases.map((item, index) => {
              const groupHeading =
                index === 0
                  ? {
                      title: isZh ? '重点案例' : 'Flagship cases',
                      body: isZh
                        ? '品牌迁移、设计交付自动化与增长项目集，集中呈现我在 Gate 阶段形成的治理方法。'
                        : 'Brand migration, design delivery automation, and growth portfolio work shaped my operating model at Gate.',
                    }
                  : index === 3
                    ? {
                        title: isZh ? '延展现场' : 'Additional contexts',
                        body: isZh
                          ? '从国际化落地到全球支付，项目判断在不同市场与协作环境中继续生长。'
                          : 'International launches and global payments tested the same judgment across markets and operating contexts.',
                      }
                    : null;

              return (
                <Fragment key={item.id}>
                  {groupHeading ? (
                    <div className={`case-group-heading ${index === 3 ? 'is-secondary' : ''}`}>
                      <span>{groupHeading.title}</span>
                      <p>{groupHeading.body}</p>
                    </div>
                  ) : null}
                  <article id={`case-${item.id}`} className={`case-chapter ${index < 3 ? 'is-featured' : 'is-supporting'}`}>
                  <div className="case-copy">
                    <p className="case-eyebrow">{item.label}</p>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <div className="case-role">
                      <BriefcaseBusiness className="h-4 w-4" />
                      <span>{item.role}</span>
                    </div>
                    <div className="case-metrics">
                      {item.metrics.map((metric) => (
                        <span key={metric}>{metric}</span>
                      ))}
                    </div>
                    <div className={`case-actions ${item.announcement ? 'has-inline-link' : ''}`}>
                      {item.announcement ? (
                        <a className="case-inline-link" href={item.announcement.url} target="_blank" rel="noreferrer">
                          <span>
                            <small>
                              {item.announcement.label}
                              {item.announcement.date ? ` · ${item.announcement.date}` : ''}
                            </small>
                            {item.announcement.title}
                          </span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                      <a className="case-page-link" href={getCasePath(item.id, language)}>
                        {isZh ? '查看案例详情' : 'View case study'}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  </article>
                </Fragment>
              );
            })}
          </div>
        </div>
        </section>

        <section id="method" className="page-section reveal scroll-mt-10 border-y border-white/10 px-6 pb-24 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="section-head">
            <div>
              <p className="section-kicker">{t.methodKicker}</p>
              <h2>{t.methodTitle}</h2>
            </div>
            <p>{t.methodIntro}</p>
          </div>

          <div className="method-rail mt-12">
            {method.map((card) => (
              <article key={card.number} className="method-card">
                <span>{card.number}</span>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <div>{card.case}</div>
              </article>
            ))}
          </div>
        </div>
        </section>

        <section id="background" className="page-section reveal scroll-mt-10 px-6 pb-24 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="section-head">
            <div>
              <p className="section-kicker">{t.journeyKicker}</p>
              <h2>{t.journeyTitle}</h2>
            </div>
            <p>{t.journeyIntro}</p>
          </div>

          <div className="journey-layout mt-12 grid gap-5 lg:grid-cols-[0.68fr_1.32fr]">
            <aside className="signal-panel">
              <div className="signal-icon">
                <Compass className="h-7 w-7" />
              </div>
              <h3>{selectedJourney.memoTitle}</h3>
              <p>{selectedJourney.memo}</p>
              <div className="mt-8 grid gap-3">
                {selectedJourney.signals.map((signal, index) => {
                  const Icon = signalIcons[index] ?? Target;

                  return (
                    <div key={signal} className="signal-row">
                      <Icon className="h-5 w-5" style={{ color: 'var(--sage)' }} />
                      <span>{signal}</span>
                    </div>
                  );
                })}
              </div>
            </aside>

            <div className="journey-track">
              {selectedJourney.path.map((item, index) => (
                <article key={`${item.company}-${item.year}`} className="journey-card">
                  <div className="journey-index">{String(index + 1).padStart(2, '0')}</div>
                  <div className="journey-card-body">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="journey-phase-head">
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--sage)' }}>
                            {item.year}
                          </p>
                          <h3>{item.phase}</h3>
                        </div>
                      </div>
                      <span className="capability-pill">
                        <Route className="h-4 w-4" style={{ color: 'var(--sage)' }} />
                        {item.source}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                    <div className="proof-line">
                      <BriefcaseBusiness className="mt-1 h-5 w-5 shrink-0" style={{ color: 'var(--sage)' }} />
                      <span>{item.proof}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
        </section>

        <section id="education" className="page-section reveal scroll-mt-10 px-6 pb-24 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="section-head education-head">
            <div>
              <p className="section-kicker">{t.educationKicker}</p>
              <div className="education-title-wrap">
                <GraduationCap className="h-7 w-7" style={{ color: 'var(--sage)' }} />
                <h2>{t.educationTitle}</h2>
              </div>
            </div>
            <p className="education-intro">{t.educationIntro}</p>
          </div>
          <div className="education-grid mt-12">
            {education.map((item, index) => (
              <a
                key={item.school}
                href={item.website}
                target="_blank"
                rel="noreferrer"
                className={`education-card education-card-${index + 1}`}
              >
                <div className="education-card-meta">
                  <span className="education-card-phase">{isZh ? item.zhPhase : item.enPhase}</span>
                  <span className="education-card-period">{item.period}</span>
                </div>
                <div className="flex items-start justify-between gap-5">
                  <SchoolLogo
                    mark={item.mark as keyof typeof schoolLogoAssets}
                    school={isZh ? item.zh : item.school}
                    isZh={isZh}
                  />
                  <ExternalLink className="h-5 w-5" style={{ color: 'var(--sage)' }} />
                </div>
                <p className="education-card-lead">{isZh ? item.zhLead : item.enLead}</p>
                <h3>{isZh ? item.zh : item.school}</h3>
                {item.zhTag || item.enTag ? (
                  <div className="education-card-tags">
                    <span>{isZh ? item.zhTag : item.enTag}</span>
                  </div>
                ) : null}
                <p className="mt-5 text-base font-semibold" style={{ color: 'var(--text)' }}>
                  {isZh ? item.zhDegree : item.enDegree}
                </p>
                <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--sage)' }}>
                  {isZh ? item.zhLocation : item.enLocation}
                </p>
              </a>
            ))}
          </div>
        </div>
        </section>

        <section id="contact" className="page-section reveal scroll-mt-10 px-6 pb-20 sm:px-10 lg:px-14">
        <div className="contact-panel mx-auto max-w-7xl">
          <div>
            <p className="section-kicker">{t.contactKicker}</p>
            <h2>{t.contactTitle}</h2>
            <p>{t.contactBody}</p>
          </div>
          <div className="contact-actions">
            <a href="mailto:lbxcyril@gmail.com">
              <Mail className="h-4 w-4" />
              lbxcyril@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/baixiliu/" target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              {t.linkedin}
            </a>
          </div>
        </div>
        </section>
      </div>
      <ProfileConcierge language={language} isZh={isZh} />
    </main>
  );
}

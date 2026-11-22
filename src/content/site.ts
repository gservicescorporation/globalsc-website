import type { SiteContent } from "@/types/content"

/**
 * Estrutura fixa do site + conteúdo PREDEFINIDO.
 * O conteúdo real é editado no painel (/admin/content) e guardado na base de dados;
 * estes valores só são usados enquanto não houver nada guardado.
 */

export const NAV_LINKS = [
	{ name: "Início", href: "/" },
	{ name: "Seguros", href: "/seguros" },
	{ name: "Sinistros", href: "/sinistros" },
	{ name: "Sobre nós", href: "/sobre-nos" },
	{ name: "Eventos", href: "/events" },
	{ name: "Contactos", href: "/contact-us" },
] as { name: string; href: string; external?: boolean }[]

/** Link principal de conversão do site. */
export const QUOTE_HREF = "/seguros/pedido"
export const CLAIM_HREF = "/sinistros"

export const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`
export const mailto = (email: string) => `mailto:${email.trim()}`

/** Ícones disponíveis para as áreas de atuação (em /public/icons). */
export const SERVICE_ICONS = ["/icons/seguros.svg", "/icons/academia.svg", "/icons/eventos.svg", "/icons/marketing.svg"]

export const DEFAULT_CONTENT: SiteContent = {
	contacts: {
		phones: ["+244 222 731 031", "+244 941 064 919"],
		emails: ["geral@gservicescorporation.com", "comercial@gservicescorporation.com"],
		address: "Rua Dr. Aleixo de Abreu, Luanda — Angola",
		hours: "Segunda a sexta, 08h00 – 17h00",
	},
	socials: [
		{ name: "Facebook", href: "https://www.facebook.com/p/Global-Services-Corporation-100094301594638/" },
		{ name: "Instagram", href: "https://www.instagram.com/globalservicescorporation/" },
		{ name: "LinkedIn", href: "https://ao.linkedin.com/company/global-service-corporations" },
	],
	home: {
		manifesto:
			"Há mais de dez anos que ajudamos empresas e famílias em Angola a escolher o seguro certo e a resolver sinistros sem perder tempo. Também formamos equipas, organizamos eventos e cuidamos da comunicação de quem confia em nós.",
		stats: [
			{ value: 10, suffix: "+", label: "Anos no mercado" },
			{ value: 500, suffix: "+", label: "Clientes protegidos" },
			{ value: 98, suffix: "%", label: "Taxa de renovação" },
			{ value: 200, suffix: "+", label: "Empresas apoiadas" },
		],
	},
	insurance: {
		intro:
			"Somos mediadores: não vendemos em nome de uma seguradora. Comparamos propostas de várias, recomendamos a que melhor protege o que é seu e acompanhamos cada sinistro até ao fim.",
		benefits: [
			"Trabalhamos com várias seguradoras — escolhe entre propostas, não fica preso a uma.",
			"Um gestor dedicado que conhece a sua apólice.",
			"Apoio completo na participação e gestão de sinistros.",
			"Revisão das apólices na renovação, para não pagar a mais nem ficar a descoberto.",
		],
		lines: [
			{ title: "Automóvel", text: "Viaturas particulares e frotas de empresa, com assistência em viagem." },
			{ title: "Saúde", text: "Planos individuais, familiares e de grupo para colaboradores." },
			{ title: "Acidentes de Trabalho", text: "Seguro obrigatório para quem tem trabalhadores a seu cargo." },
			{ title: "Multirriscos", text: "Habitação, escritórios, lojas e armazéns contra incêndio, roubo e danos." },
			{ title: "Responsabilidade Civil", text: "Proteção perante danos causados a terceiros na sua atividade." },
			{ title: "Vida e Poupança", text: "Proteção da família e planos de poupança a médio e longo prazo." },
			{ title: "Viagem", text: "Assistência médica e bagagem em deslocações dentro e fora de Angola." },
			{ title: "Transportes e Engenharia", text: "Mercadorias em trânsito, obras e equipamentos." },
		],
		steps: [
			{ title: "Análise", text: "Ouvimos o que precisa de proteger e identificamos os riscos reais." },
			{ title: "Comparação", text: "Pedimos propostas a várias seguradoras e comparamos coberturas e preços." },
			{ title: "Contratação", text: "Explicamos a apólice ponto a ponto e tratamos de toda a papelada." },
			{ title: "Acompanhamento", text: "Em caso de sinistro, somos nós que tratamos do processo com a seguradora." },
		],
		// Preencher no painel (Conteúdo do site → Seguros). Vazio = secção escondida.
		partners: { title: "Seguradoras com que trabalhamos", logos: [] },
	},
	services: [
		{
			id: "seguros",
			title: "Mediação de Seguros",
			description:
				"Comparamos propostas de várias seguradoras e escolhemos consigo a cobertura certa para a família, a frota ou a empresa. Depois, acompanhamos cada sinistro até ao fim.",
			icon: "/icons/seguros.svg",
			image: "/images/consulting-clients.jpg",
			tags: ["Empresas", "Particulares", "Gestão de sinistros"],
			href: "/seguros",
		},
		{
			id: "formacao",
			title: "Formação & Consultoria",
			description:
				"Cursos práticos da Academia GSC em liderança, gestão e seguros, com formadores que trabalham no mercado angolano.",
			icon: "/icons/academia.svg",
			image: "/images/plenaria.jpg",
			tags: ["Academia GSC", "Liderança", "Capital humano"],
			href: "https://academy.globalsc.ao",
		},
		{
			id: "eventos",
			title: "Gestão de Eventos Corporativos",
			description:
				"Organizamos fóruns, mesas redondas e encontros de networking — da escolha do espaço e oradores à logística no dia.",
			icon: "/icons/eventos.svg",
			image: "/images/conference.jpg",
			tags: ["Fóruns", "Conferências", "Networking"],
			href: "/events",
		},
		{
			id: "marketing",
			title: "Marketing & Comunicação",
			description:
				"Planeamento de comunicação, produção de conteúdo e relação com a imprensa para marcas que querem ser conhecidas em Angola.",
			icon: "/icons/marketing.svg",
			image: "/images/epic-sana.jpg",
			tags: ["Branding", "Conteúdo", "Media"],
			href: "/contact-us",
		},
	],
	about: {
		story:
			"A Global Services Corporation começou na mediação de seguros, a ajudar empresas a perceber o que as suas apólices cobriam de facto. Esse trabalho próximo com os clientes levou-nos à formação de equipas, à organização de eventos empresariais e à comunicação — sempre com o mesmo princípio: aconselhar com independência e estar presente quando é preciso.",
		advantages: [
			{
				title: "Do seu lado, não do da seguradora",
				text: "Como mediadores, representamos o cliente. A nossa recomendação depende da sua necessidade, não de uma marca.",
			},
			{
				title: "Mais de uma década no mercado angolano",
				text: "Conhecemos as seguradoras, os prazos e os procedimentos — e isso acelera cada processo.",
			},
			{
				title: "Um só parceiro para várias áreas",
				text: "Seguros, formação de equipas, eventos e comunicação, com o mesmo interlocutor.",
			},
		],
		values: [
			{
				title: "Missão",
				text: "Garantir que empresas e famílias em Angola têm a proteção adequada aos riscos que correm, com aconselhamento independente e acompanhamento próximo.",
			},
			{
				title: "Visão",
				text: "Ser a mediadora de seguros de referência em Angola e o parceiro de confiança das empresas também na formação, nos eventos e na comunicação.",
			},
			{
				title: "Valores",
				text: "Ética, transparência nas recomendações, rigor nos prazos e disponibilidade quando o cliente mais precisa: no sinistro.",
			},
		],
	},
	academy: {
		enabled: true,
		text: "Cursos de curta duração em liderança, gestão e seguros, para profissionais e equipas de empresa. Inscrições e calendário na plataforma da academia.",
		url: "https://academy.globalsc.ao",
		pillars: [
			{ title: "Aprendizagem prática", text: "Conteúdos aplicados ao dia a dia profissional em Angola, com casos reais." },
			{ title: "Formadores do mercado", text: "Profissionais no ativo, que ensinam o que aplicam nas suas empresas." },
			{ title: "Rede de contactos", text: "Turmas com profissionais de vários sectores, que continuam ligados depois do curso." },
		],
	},
	events: {
		stats: [
			{ value: 17, suffix: "+", label: "Eventos realizados" },
			{ value: 1000, suffix: "+", label: "Participantes" },
			{ value: 50, suffix: "+", label: "Oradores" },
			{ value: 100, suffix: "+", label: "Patrocinadores" },
		],
		brands: [
			{
				image: "/images/events/baw-logo.png",
				title: "Business After Work",
				description: "Encontros de networking ao fim do dia entre empresários de diferentes sectores.",
			},
			{
				image: "/images/events/mr-logo.png",
				title: "Mesa Redonda com CEO's",
				description: "Líderes nacionais e internacionais à mesma mesa, a debater temas da economia angolana.",
			},
			{
				image: "/images/events/fsisfcl.png",
				title: "Fórum sobre Conteúdo Local",
				description: "O impacto dos grandes sectores industriais de Angola no conteúdo local, com quem os lidera.",
			},
		],
	},
	partners: {
		title: "Parceiros que confiam em nós",
		logos: [
			"/partners/aec.png",
			"/partners/aes.png",
			"/partners/aecipa.png",
			"/partners/english-academy.png",
			"/partners/sistec.png",
			"/partners/epic-sana.png",
			"/partners/gda.png",
			"/partners/nouble-group.png",
			"/partners/sta-seguros.png",
			"/partners/td-hotels.png",
			"/partners/tda.png",
			"/partners/teleservice.png",
			"/partners/zee.png",
		],
	},
}

/** Converte os contactos editáveis em pares rótulo/link. */
export function contactLinks(c: SiteContent["contacts"]) {
	return {
		phones: c.phones.map((p) => ({ label: p, href: tel(p) })),
		emails: c.emails.map((e) => ({ label: e, href: mailto(e) })),
		address: c.address,
		hours: c.hours,
	}
}

export type SiteChrome = Pick<SiteContent, "contacts" | "socials">

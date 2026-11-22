/**
 * Catálogo de ramos de seguro e perguntas de cada pedido de cotação.
 * A GSC trabalha sobretudo com empresas; os particulares vêm normalmente delas.
 */

export type Audience = "empresa" | "particular"

export type FieldKind = "text" | "number" | "select" | "date" | "textarea"

export interface QuoteField {
	key: string
	label: string
	kind: FieldKind
	options?: string[]
	placeholder?: string
	required?: boolean
	hint?: string
}

export interface InsuranceType {
	id: string
	label: string
	short: string
	audiences: Audience[]
	fields: QuoteField[]
}

export const INSURANCE_TYPES: InsuranceType[] = [
	{
		id: "saude_grupo",
		label: "Saúde de grupo",
		short: "Plano de saúde para os colaboradores",
		audiences: ["empresa"],
		fields: [
			{ key: "colaboradores", label: "Número de colaboradores a cobrir", kind: "number", required: true },
			{ key: "dependentes", label: "Incluir dependentes (cônjuges e filhos)?", kind: "select", options: ["Sim", "Não", "A decidir"] },
			{ key: "nivel", label: "Nível de cobertura pretendido", kind: "select", options: ["Básico", "Intermédio", "Premium", "Não sei — aconselhem-me"] },
			{ key: "seguro_atual", label: "Já têm seguro de saúde? Com que seguradora?", kind: "text", placeholder: "ex.: Sim, com a seguradora X até dezembro" },
		],
	},
	{
		id: "acidentes_trabalho",
		label: "Acidentes de trabalho",
		short: "Obrigatório para quem tem trabalhadores",
		audiences: ["empresa"],
		fields: [
			{ key: "colaboradores", label: "Número de trabalhadores", kind: "number", required: true },
			{ key: "massa_salarial", label: "Massa salarial anual (AOA)", kind: "number", hint: "Valor aproximado é suficiente." },
			{ key: "funcoes", label: "Principais funções / riscos", kind: "textarea", placeholder: "ex.: escritório, motoristas, trabalho em altura…" },
		],
	},
	{
		id: "frota",
		label: "Frota automóvel",
		short: "Viaturas da empresa",
		audiences: ["empresa"],
		fields: [
			{ key: "viaturas", label: "Número de viaturas", kind: "number", required: true },
			{ key: "tipos", label: "Tipos de viatura", kind: "text", placeholder: "ex.: 5 ligeiros, 2 pesados de mercadorias" },
			{ key: "cobertura", label: "Cobertura pretendida", kind: "select", options: ["Responsabilidade civil obrigatória", "Danos próprios (todos os riscos)", "Não sei — aconselhem-me"] },
			{ key: "valor_frota", label: "Valor aproximado da frota (AOA)", kind: "number" },
		],
	},
	{
		id: "multirriscos_empresa",
		label: "Multirriscos empresarial",
		short: "Instalações, equipamento e mercadoria",
		audiences: ["empresa"],
		fields: [
			{ key: "tipo_instalacao", label: "Tipo de instalação", kind: "select", options: ["Escritório", "Loja", "Armazém", "Fábrica", "Outro"] },
			{ key: "localizacao", label: "Localização", kind: "text", required: true },
			{ key: "valor_edificio", label: "Valor do edifício (AOA)", kind: "number" },
			{ key: "valor_recheio", label: "Valor de equipamentos e mercadorias (AOA)", kind: "number" },
		],
	},
	{
		id: "responsabilidade_civil",
		label: "Responsabilidade civil",
		short: "Danos causados a terceiros na atividade",
		audiences: ["empresa"],
		fields: [
			{ key: "atividade", label: "Atividade da empresa", kind: "text", required: true },
			{ key: "faturacao", label: "Faturação anual (AOA)", kind: "number" },
			{ key: "capital", label: "Capital pretendido (AOA)", kind: "number" },
		],
	},
	{
		id: "transportes",
		label: "Transportes e mercadorias",
		short: "Carga em trânsito, importação e exportação",
		audiences: ["empresa"],
		fields: [
			{ key: "mercadoria", label: "Tipo de mercadoria", kind: "text", required: true },
			{ key: "valor", label: "Valor por viagem ou anual (AOA)", kind: "number" },
			{ key: "rotas", label: "Origem e destino habituais", kind: "text" },
		],
	},
	{
		id: "engenharia",
		label: "Engenharia e obras",
		short: "Obras, máquinas e equipamentos",
		audiences: ["empresa"],
		fields: [
			{ key: "obra", label: "Descrição da obra ou equipamento", kind: "textarea", required: true },
			{ key: "valor", label: "Valor da obra / equipamento (AOA)", kind: "number" },
			{ key: "prazo", label: "Prazo previsto", kind: "text" },
		],
	},
	{
		id: "automovel",
		label: "Automóvel",
		short: "A sua viatura particular",
		audiences: ["particular"],
		fields: [
			{ key: "viatura", label: "Marca, modelo e ano", kind: "text", required: true },
			{ key: "matricula", label: "Matrícula", kind: "text" },
			{ key: "valor", label: "Valor aproximado da viatura (AOA)", kind: "number" },
			{ key: "cobertura", label: "Cobertura pretendida", kind: "select", options: ["Responsabilidade civil obrigatória", "Danos próprios (todos os riscos)", "Não sei — aconselhem-me"] },
		],
	},
	{
		id: "saude",
		label: "Saúde",
		short: "Individual ou familiar",
		audiences: ["particular"],
		fields: [
			{ key: "pessoas", label: "Número de pessoas a cobrir", kind: "number", required: true },
			{ key: "idades", label: "Idades", kind: "text", placeholder: "ex.: 38, 35, 8" },
			{ key: "nivel", label: "Nível de cobertura", kind: "select", options: ["Básico", "Intermédio", "Premium", "Não sei — aconselhem-me"] },
		],
	},
	{
		id: "vida",
		label: "Vida e poupança",
		short: "Proteção da família",
		audiences: ["particular"],
		fields: [
			{ key: "idade", label: "Idade", kind: "number", required: true },
			{ key: "capital", label: "Capital pretendido (AOA)", kind: "number" },
			{ key: "objetivo", label: "Objetivo", kind: "select", options: ["Proteção da família", "Crédito à habitação", "Poupança", "Outro"] },
		],
	},
	{
		id: "habitacao",
		label: "Habitação",
		short: "Casa e recheio",
		audiences: ["particular"],
		fields: [
			{ key: "localizacao", label: "Localização", kind: "text", required: true },
			{ key: "valor_imovel", label: "Valor do imóvel (AOA)", kind: "number" },
			{ key: "valor_recheio", label: "Valor do recheio (AOA)", kind: "number" },
		],
	},
	{
		id: "viagem",
		label: "Viagem",
		short: "Assistência em deslocações",
		audiences: ["empresa", "particular"],
		fields: [
			{ key: "destino", label: "Destino", kind: "text", required: true },
			{ key: "datas", label: "Datas da viagem", kind: "text" },
			{ key: "viajantes", label: "Número de viajantes", kind: "number" },
		],
	},
]

export const typeLabel = (id: string) => INSURANCE_TYPES.find((t) => t.id === id)?.label ?? id

/* ------------------------------ Sinistros ------------------------------ */

export const CLAIM_TYPES = [
	{ id: "acidente_viacao", label: "Acidente de viação", icon: "car" },
	{ id: "acidente_trabalho", label: "Acidente de trabalho", icon: "hardhat" },
	{ id: "roubo", label: "Roubo ou furto", icon: "lock" },
	{ id: "incendio", label: "Incêndio", icon: "flame" },
	{ id: "agua", label: "Danos por água", icon: "droplets" },
	{ id: "saude", label: "Despesas de saúde", icon: "stethoscope" },
	{ id: "mercadoria", label: "Mercadoria danificada", icon: "package" },
	{ id: "outro", label: "Outra ocorrência", icon: "help" },
] as const

export const claimLabel = (id: string) => CLAIM_TYPES.find((t) => t.id === id)?.label ?? id

/* ------------------------------- Estados ------------------------------- */

export const QUOTE_STATUS = {
	novo: { label: "Novo", tone: "bg-royal/10 text-royal" },
	em_analise: { label: "Em análise", tone: "bg-amber-50 text-amber-700" },
	proposta_enviada: { label: "Proposta enviada", tone: "bg-violet-50 text-violet-700" },
	aceite: { label: "Aceite", tone: "bg-emerald-50 text-emerald-700" },
	recusado: { label: "Recusado", tone: "bg-red-50 text-red-700" },
	arquivado: { label: "Arquivado", tone: "bg-background text-tertiary" },
} as const

export const CLAIM_STATUS = {
	recebido: { label: "Recebido", tone: "bg-royal/10 text-royal" },
	em_analise: { label: "Em análise", tone: "bg-amber-50 text-amber-700" },
	participado: { label: "Participado à seguradora", tone: "bg-violet-50 text-violet-700" },
	resolvido: { label: "Resolvido", tone: "bg-emerald-50 text-emerald-700" },
	recusado: { label: "Recusado", tone: "bg-red-50 text-red-700" },
	arquivado: { label: "Arquivado", tone: "bg-background text-tertiary" },
} as const

export type QuoteStatus = keyof typeof QUOTE_STATUS
export type ClaimStatus = keyof typeof CLAIM_STATUS

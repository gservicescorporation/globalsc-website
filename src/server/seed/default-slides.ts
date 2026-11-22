import type { HeroSlideRecord } from "@/types/event"

/**
 * Destaques usados enquanto a base de dados não tiver nenhum registado.
 * Só imagens locais (/public) — o resto é gerido no painel.
 * O primeiro destaque é sempre a mediação de seguros (produto principal).
 */
export const DEFAULT_SLIDES: HeroSlideRecord[] = [
	{
		id: "default-1",
		title: "O seguro certo, escolhido do seu lado",
		description:
			"Comparamos propostas de várias seguradoras para a sua empresa, frota ou família — e tratamos dos sinistros consigo.",
		imageUrl: "/images/consulting-clients.jpg",
		link: "/seguros",
		buttonText: "Ver seguros",
		placement: "home",
		order: 0,
		active: true,
	},
	{
		id: "default-2",
		title: "Mesa Redonda com CEO's — 5ª Edição",
		description:
			"O Papel da Banca e de Outros Agentes do Sistema Financeiro na Mobilização de Financiamento.",
		imageUrl: "/second-banner.png",
		link: "/events/mesa-redonda-com-ceos-5a-edicao",
		buttonText: "Ver o evento",
		placement: "both",
		order: 1,
		active: true,
	},
	{
		id: "default-3",
		title: "BAW — Welcome To 5th Edition",
		description:
			"Business After Work: encontro de networking entre líderes empresariais, com a NOBLE GROUP SA e a ZEE Luanda-Bengo.",
		imageUrl: "/images/events/baw-banner.jpeg",
		link: "/events/baw-welcome-to-5th-edition-of-mesa-redonda-com-ceos",
		buttonText: "Ver o evento",
		placement: "both",
		order: 2,
		active: true,
	},
	{
		id: "default-4",
		title: "Seguros para empresas",
		description:
			"Acidentes de trabalho, frota automóvel, saúde de grupo, multirriscos e responsabilidade civil, com um gestor dedicado.",
		imageUrl: "/main-banner.png",
		link: "/seguros/pedido",
		buttonText: "Pedir cotação",
		placement: "both",
		order: 3,
		active: true,
	},
]

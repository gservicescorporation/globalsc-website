import type { MetadataRoute } from "next"

/**
 * Manifest da app de gestão (PWA). Só o painel é instalável:
 * abre diretamente em /admin, em ecrã inteiro, sem barra do navegador.
 */
const manifest: MetadataRoute.Manifest = {
	id: "/admin",
	name: "GSC Gestão — Global Services Corporation",
	short_name: "GSC Gestão",
	description: "Pedidos de seguro, sinistros, clientes e conteúdos da Global Services Corporation.",
	start_url: "/admin",
	scope: "/admin",
	display: "standalone",
	orientation: "portrait",
	background_color: "#070b16",
	theme_color: "#070b16",
	lang: "pt-PT",
	categories: ["business", "productivity"],
	icons: [
		{ src: "/icons/app-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
		{ src: "/icons/app-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
		{ src: "/icons/app-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
	],
	shortcuts: [
		{ name: "Sinistros", url: "/admin/sinistros", icons: [{ src: "/icons/app-192.png", sizes: "192x192" }] },
		{ name: "Pedidos de seguro", url: "/admin/pedidos", icons: [{ src: "/icons/app-192.png", sizes: "192x192" }] },
	],
}

export function GET() {
	return new Response(JSON.stringify(manifest), {
		headers: {
			"Content-Type": "application/manifest+json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	})
}

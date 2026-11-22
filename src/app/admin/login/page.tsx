import Image from "next/image"
import { redirect } from "next/navigation"
import { getSession } from "@/server/auth"
import LoginForm from "./LoginForm"

export const metadata = { title: "Entrar" }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
	if (await getSession().catch(() => null)) redirect("/admin")
	const { next } = await searchParams

	return (
		<main className="relative grid min-h-[100svh] lg:grid-cols-2">
			<div className="relative hidden overflow-hidden bg-ink lg:block">
				<Image src="/images/conference.jpg" alt="" fill priority sizes="50vw" className="object-cover opacity-40" />
				<div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/70 to-royal/60" />
				<div aria-hidden className="grid-lines absolute inset-0" />
				<div className="relative flex h-full flex-col justify-between p-12 text-white">
					<Image src="/logo/white.png" alt="Global Services Corporation" width={1000} height={912} className="h-auto w-28" />
					<div>
						<p className="eyebrow text-accent">Painel de gestão</p>
						<h1 className="display-md mt-5 max-w-md">Eventos, destaques e conteúdos num só lugar.</h1>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-center bg-background px-6 py-16">
				<div className="w-full max-w-sm">
					<Image src="/logo/black.png" alt="Global Services Corporation" width={1000} height={912} className="mb-10 h-auto w-24 lg:hidden" />
					<h2 className="text-2xl font-semibold tracking-tight text-ink">Entrar no painel</h2>
					<p className="mt-2 text-sm text-tertiary">Acesso reservado à equipa da Global Services Corporation.</p>
					<LoginForm next={next ?? "/admin"} />
				</div>
			</div>
		</main>
	)
}

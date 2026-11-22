import type { ReactNode } from "react"

/** Página compacta para os assistentes: faixa escura curta (o header é claro) + área de trabalho clara. */
export default function WizardPage({
	eyebrow,
	title,
	text,
	children,
	aside,
}: {
	eyebrow: string
	title: string
	text: string
	children: ReactNode
	aside?: ReactNode
}) {
	return (
		<>
			<section className="relative overflow-hidden bg-ink pt-32 pb-12 text-white sm:pt-40 sm:pb-16">
				<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
				<div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-royal/40 blur-[120px]" />
				<div className="container-x relative">
					<span className="eyebrow text-accent">{eyebrow}</span>
					<h1 className="display-md mt-5 max-w-3xl text-balance">{title}</h1>
					<p className="mt-4 max-w-2xl text-lg text-white/70">{text}</p>
				</div>
			</section>
			<section className="bg-background pt-10 pb-20 sm:pt-14">
				<div className="container-x grid gap-10 lg:grid-cols-12">
					<div id="assistente" className="scroll-mt-24 lg:col-span-8">
						{children}
					</div>
					{aside && <aside className="lg:col-span-4">{aside}</aside>}
				</div>
			</section>
		</>
	)
}

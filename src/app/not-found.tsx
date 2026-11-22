import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function NotFoundPage() {
	return (
		<section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-ink text-white">
			<div aria-hidden className="grid-lines pointer-events-none absolute inset-0" />
			<div
				aria-hidden
				className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-royal/30 blur-[160px]"
			/>
			<div className="container-x relative">
				<Link href="/" aria-label="Início">
					<Image src="/logo/white.png" alt="Global Services Corporation" width={1000} height={912} className="h-auto w-24" />
				</Link>
				<p className="mt-16 text-[28vw] leading-[0.8] font-extrabold tracking-[-0.06em] text-white/10 sm:text-[16rem]">
					404
				</p>
				<h1 className="display-md -mt-6 max-w-2xl sm:-mt-12">
					Esta página saiu da agenda.{" "}
					<span className="serif-accent text-white/60">Vamos levá-lo de volta.</span>
				</h1>
				<div className="mt-10 flex flex-wrap gap-3">
					<Link href="/" className="btn btn-light">
						<ArrowLeft className="h-4 w-4" /> Página inicial
					</Link>
					<Link href="/events" className="btn btn-outline-light">
						Ver eventos
					</Link>
				</div>
			</div>
		</section>
	)
}

"use client"

import { Download, PlusSquare, Share, X } from "lucide-react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

/** Evento não normalizado do Chrome/Android (ainda não existe nos tipos do DOM). */
interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const KEY = "gsc-admin-install-dismissed"

const readDismissed = () => {
	try {
		return localStorage.getItem(KEY) === "1"
	} catch {
		return false
	}
}
const saveDismissed = () => {
	try {
		localStorage.setItem(KEY, "1")
	} catch {
		/* modo privado: ignora */
	}
}

/**
 * Convida os gestores a instalar o painel como app.
 * Android/Chrome: usa o pedido nativo. iPhone/iPad: mostra instruções (o iOS não permite automatizar).
 */
export default function InstallAppBanner() {
	const pathname = usePathname()
	const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
	const [ios, setIos] = useState(false)
	const [visible, setVisible] = useState(false)
	const [showSteps, setShowSteps] = useState(false)

	useEffect(() => {
		const standalone =
			window.matchMedia("(display-mode: standalone)").matches ||
			(navigator as Navigator & { standalone?: boolean }).standalone === true
		if (standalone || readDismissed()) return

		const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
		if (isIos) {
			setIos(true)
			setVisible(true)
		}

		const onPrompt = (e: Event) => {
			e.preventDefault()
			setDeferred(e as BeforeInstallPromptEvent)
			setVisible(true)
		}
		const onInstalled = () => {
			setVisible(false)
			setDeferred(null)
		}
		window.addEventListener("beforeinstallprompt", onPrompt)
		window.addEventListener("appinstalled", onInstalled)
		return () => {
			window.removeEventListener("beforeinstallprompt", onPrompt)
			window.removeEventListener("appinstalled", onInstalled)
		}
	}, [])

	// Só na visão geral, para não ocupar espaço em todas as páginas.
	if (!visible || pathname !== "/admin") return null

	const install = async () => {
		if (ios) return setShowSteps(true)
		if (!deferred) return
		await deferred.prompt()
		const { outcome } = await deferred.userChoice
		if (outcome === "accepted") setVisible(false)
		setDeferred(null)
	}

	const dismiss = () => {
		saveDismissed()
		setVisible(false)
	}

	return (
		<>
			<div className="relative mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-3xl bg-ink p-4 pr-12 text-white sm:flex-nowrap sm:p-5 sm:pr-5" role="region" aria-label="Instalar a app">
				<Image src="/icons/app-192.png" alt="" width={48} height={48} className="h-12 w-12 shrink-0 rounded-2xl" />
				<div className="min-w-0 flex-1 basis-48">
					<p className="font-semibold">Instale a app GSC Gestão</p>
					<p className="text-sm text-white/65">Acesso direto aos pedidos e sinistros no ecrã inicial, em ecrã inteiro.</p>
				</div>
				<button type="button" onClick={install} className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-ink sm:w-auto">
					<Download className="h-4 w-4" /> Instalar
				</button>
				<button type="button" onClick={dismiss} aria-label="Dispensar" className="absolute top-3 right-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white sm:static">
					<X className="h-5 w-5" />
				</button>
			</div>

			{showSteps && (
				<div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="ios-install-title">
					<button aria-label="Fechar" className="absolute inset-0 bg-ink/60" onClick={() => setShowSteps(false)} />
					<div className="relative w-full max-w-md rounded-t-[2rem] bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-[2rem]">
						<div className="flex items-start justify-between gap-4">
							<h2 id="ios-install-title" className="text-xl font-semibold text-ink">
								Instalar no iPhone / iPad
							</h2>
							<button onClick={() => setShowSteps(false)} aria-label="Fechar" className="rounded-full p-1 text-muted hover:text-ink">
								<X className="h-5 w-5" />
							</button>
						</div>
						<p className="mt-1 text-sm text-tertiary">No Safari, faça assim:</p>
						<ol className="mt-6 grid gap-4">
							{[
								{ icon: Share, text: "Toque no botão Partilhar, na barra do Safari." },
								{ icon: PlusSquare, text: "Escolha “Adicionar ao ecrã principal”." },
								{ icon: Download, text: "Toque em “Adicionar”. A app aparece no ecrã inicial." },
							].map(({ icon: Icon, text }, i) => (
								<li key={i} className="flex items-center gap-4">
									<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-royal/10 text-royal">
										<Icon className="h-5 w-5" />
									</span>
									<span className="text-base text-ink">
										<strong>{i + 1}.</strong> {text}
									</span>
								</li>
							))}
						</ol>
						<button type="button" onClick={() => setShowSteps(false)} className="mt-8 h-12 w-full rounded-2xl bg-ink font-semibold text-white">
							Percebi
						</button>
					</div>
				</div>
			)}
		</>
	)
}

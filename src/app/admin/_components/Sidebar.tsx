"use client"

import {
	Building,
	CalendarDays,
	CarFront,
	ClipboardList,
	Contact,
	CreditCard,
	ExternalLink,
	FileText,
	GalleryHorizontalEnd,
	LayoutDashboard,
	LogOut,
	Menu,
	Users,
	X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { logoutAction } from "../actions"

const GROUPS = [
	{
		label: "",
		links: [{ href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true }],
	},
	{
		label: "Mediação",
		links: [
			{ href: "/admin/pedidos", label: "Pedidos de seguro", icon: ClipboardList },
			{ href: "/admin/sinistros", label: "Sinistros", icon: CarFront },
			{ href: "/admin/clientes", label: "Clientes", icon: Contact },
			{ href: "/admin/seguradoras", label: "Seguradoras", icon: Building },
		],
	},
	{
		label: "Site",
		links: [
			{ href: "/admin/events", label: "Eventos", icon: CalendarDays },
			{ href: "/admin/slides", label: "Destaques", icon: GalleryHorizontalEnd },
			{ href: "/admin/content", label: "Conteúdo do site", icon: FileText },
		],
	},
	{
		label: "Gestão",
		links: [
			{ href: "/admin/payments", label: "Pagamentos", icon: CreditCard },
			{ href: "/admin/users", label: "Utilizadores", icon: Users },
		],
	},
] as { label: string; links: { href: string; label: string; icon: React.ElementType; exact?: boolean }[] }[]

export default function Sidebar({ name, email }: { name: string; email: string }) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)
	useEffect(() => {
		setOpen(false)
	}, [pathname])

	const nav = (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between px-6 py-6">
				<Link href="/admin">
					<Image src="/logo/white.png" alt="GSC" width={1000} height={912} className="h-auto w-20" />
				</Link>
				<button onClick={() => setOpen(false)} aria-label="Fechar menu" className="lg:hidden">
					<X className="h-5 w-5" />
				</button>
			</div>
			<nav className="flex-1 overflow-y-auto px-3" aria-label="Painel">
				{GROUPS.map((g) => (
					<div key={g.label || "main"} className="mb-4">
						{g.label && <p className="mb-1 px-3 text-[11px] font-semibold tracking-widest text-white/35 uppercase">{g.label}</p>}
						<ul className="grid gap-1">
							{g.links.map(({ href, label, icon: Icon, exact }) => {
								const active = exact ? pathname === href : pathname.startsWith(href)
								return (
									<li key={href}>
										<Link
											href={href}
											aria-current={active ? "page" : undefined}
											className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
												active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
											}`}>
											<Icon className="h-4 w-4" /> {label}
										</Link>
									</li>
								)
							})}
						</ul>
					</div>
				))}
				<a href="/" target="_blank" className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white">
					<ExternalLink className="h-4 w-4" /> Abrir o site
				</a>
			</nav>
			<div className="border-t border-white/10 p-4">
				<p className="truncate text-sm font-medium text-white">{name}</p>
				<p className="truncate text-xs text-white/50">{email}</p>
				<form action={logoutAction}>
					<button type="submit" className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
						<LogOut className="h-4 w-4" /> Terminar sessão
					</button>
				</form>
			</div>
		</div>
	)

	return (
		<>
			<header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-ink px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 text-white lg:hidden">
				<Image src="/logo/white.png" alt="GSC" width={1000} height={912} className="h-auto w-16" />
				<button onClick={() => setOpen(true)} aria-label="Abrir menu" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
					<Menu className="h-5 w-5" />
				</button>
			</header>
			<aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink text-white lg:block">{nav}</aside>
			{open && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<button aria-label="Fechar" className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
					<aside className="absolute inset-y-0 left-0 w-72 bg-ink text-white shadow-2xl">{nav}</aside>
				</div>
			)}
		</>
	)
}

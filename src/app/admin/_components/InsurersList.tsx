"use client"

import { Building, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { saveInsurerAction } from "../mediation-actions"
import { inputCls } from "./fields"
import { Empty, useAction } from "./ui"

export default function InsurersList({
	insurers,
}: {
	insurers: { id: string; name: string; logoUrl: string | null; active: boolean; docs: number; templates: number }[]
}) {
	const router = useRouter()
	const { pending, call } = useAction()
	const [name, setName] = useState("")

	return (
		<div className="grid gap-4">
			<form
				className="flex gap-2"
				onSubmit={(e) => {
					e.preventDefault()
					call(() => saveInsurerAction({ name }), "Seguradora criada.", (id) => {
						setName("")
						if (id) router.push(`/admin/seguradoras/${id}`)
					})
				}}>
				<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da nova seguradora" className={inputCls} />
				<button disabled={pending || !name.trim()} className="flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white hover:bg-royal disabled:opacity-40">
					<Plus className="h-4 w-4" /> Adicionar
				</button>
			</form>

			{insurers.length === 0 ? (
				<Empty>Sem seguradoras. Adicione as seguradoras com que a GSC trabalha.</Empty>
			) : (
				<ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{insurers.map((i) => (
						<li key={i.id}>
							<Link href={`/admin/seguradoras/${i.id}`} className="flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-4 hover:border-royal">
								<span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background">
									{i.logoUrl ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={i.logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
									) : (
										<Building className="h-6 w-6 text-muted" />
									)}
								</span>
								<span className="min-w-0">
									<span className="block truncate font-semibold text-ink">{i.name}</span>
									<span className="text-xs text-muted">
										{i.docs} documento(s) · {i.templates} modelo(s){!i.active && " · inativa"}
									</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

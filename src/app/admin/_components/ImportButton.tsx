"use client"

import { Download, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "react-toastify"
import { importLegacyAction } from "../actions"

export default function ImportButton() {
	const [pending, start] = useTransition()
	const router = useRouter()
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					const res = await importLegacyAction()
					if (res.ok) {
						toast.success(res.message)
						router.refresh()
					} else toast.error(res.error)
				})
			}
			className="flex shrink-0 items-center gap-2 rounded-xl bg-royal px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60">
			{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
			Importar dados do site antigo
		</button>
	)
}

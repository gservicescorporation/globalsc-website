"use client"

import { Loader2, LogIn } from "lucide-react"
import { useActionState } from "react"
import { loginAction } from "../actions"
import { inputCls } from "../_components/fields"

export default function LoginForm({ next }: { next: string }) {
	const [state, action, pending] = useActionState(loginAction, undefined)

	return (
		<form action={action} className="mt-8 grid gap-4">
			<input type="hidden" name="next" value={next} />
			<label className="grid gap-1.5 text-sm font-medium text-ink">
				Email
				<input name="email" type="email" required autoComplete="username" className={inputCls} />
			</label>
			<label className="grid gap-1.5 text-sm font-medium text-ink">
				Palavra-passe
				<input name="password" type="password" required autoComplete="current-password" className={inputCls} />
			</label>
			{state && !state.ok && (
				<p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
					{state.error}
				</p>
			)}
			<button type="submit" disabled={pending} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white hover:bg-royal disabled:opacity-60">
				{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
				Entrar
			</button>
		</form>
	)
}

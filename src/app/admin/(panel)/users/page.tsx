import { getSession, listAdmins } from "@/server/auth"
import UsersManager from "../../_components/UsersManager"

export const dynamic = "force-dynamic"
export const metadata = { title: "Utilizadores" }

export default async function UsersPage() {
	const [admins, session] = await Promise.all([listAdmins().catch(() => []), getSession()])
	return (
		<div className="grid gap-6">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Utilizadores</h1>
				<p className="mt-1 text-sm text-tertiary">Quem tem acesso ao painel.</p>
			</div>
			<UsersManager admins={admins} currentId={session?.sub ?? ""} />
		</div>
	)
}

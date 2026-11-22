import { requireAdmin } from "@/server/auth"
import InstallAppBanner from "../_components/InstallAppBanner"
import Sidebar from "../_components/Sidebar"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
	const session = await requireAdmin()
	return (
		<div className="min-h-[100svh] bg-background lg:pl-64">
			<Sidebar name={session.name} email={session.email} />
			<main className="px-4 pt-[calc(5rem+env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-8 lg:pt-8">
				{/* min-w-0 nos filhos das grelhas: impede que textos longos (truncate) alarguem colunas no telemóvel */}
				<div className="mx-auto max-w-6xl min-w-0 [&_.grid>*]:min-w-0">
					<InstallAppBanner />
					{children}
				</div>
			</main>
		</div>
	)
}

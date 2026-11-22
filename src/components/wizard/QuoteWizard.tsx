"use client"

import {
	Building2,
	Car,
	CheckCircle2,
	Construction,
	HardHat,
	HeartPulse,
	Home,
	Plane,
	Scale,
	Shield,
	ShieldCheck,
	Truck,
	User,
	Users,
	Warehouse,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState, useRef } from "react"
import { INSURANCE_TYPES, type Audience } from "@/content/insurance-catalog"
import DeclaredPolicy, { emptyDeclared, type Declared } from "./DeclaredPolicy"
import { BigField, ChoiceCard, StepTitle, WizardShell, bigInput, isEmail, lookupEmail, scrollToWizard } from "./Wizard"

const ICONS: Record<string, React.ElementType> = {
	saude_grupo: Users,
	acidentes_trabalho: HardHat,
	frota: Truck,
	multirriscos_empresa: Warehouse,
	responsabilidade_civil: Scale,
	transportes: Truck,
	engenharia: Construction,
	automovel: Car,
	saude: HeartPulse,
	vida: Shield,
	habitacao: Home,
	viagem: Plane,
}

const STEPS = ["Para quem", "Seguro", "Detalhes", "Contacto", "Confirmar"]

export default function QuoteWizard({ initialType }: { initialType?: string }) {
	const preset = INSURANCE_TYPES.find((t) => t.id === initialType)
	const [step, setStep] = useState(preset ? 2 : 0)
	const [audience, setAudience] = useState<Audience>(preset?.audiences[0] ?? "empresa")
	const [typeId, setTypeId] = useState(preset?.id ?? "")
	const [answers, setAnswers] = useState<Record<string, string>>({})
	const [declared, setDeclared] = useState<Declared>(emptyDeclared)
	const [email, setEmail] = useState("")
	const [known, setKnown] = useState<boolean | null>(null)
	const [contact, setContact] = useState({ name: "", phone: "", company: "", nif: "", message: "" })
	const [honeypot, setHoneypot] = useState("")
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState("")
	const [done, setDone] = useState<string | null>(null)

	const type = INSURANCE_TYPES.find((t) => t.id === typeId)
	const types = useMemo(() => INSURANCE_TYPES.filter((t) => t.audiences.includes(audience)), [audience])

	// Verifica o email (com pequena espera) para não pedir dados que já temos.
	useEffect(() => {
		if (!isEmail(email)) {
			setKnown(null)
			return
		}
		const t = setTimeout(async () => setKnown(await lookupEmail(email.trim())), 500)
		return () => clearTimeout(t)
	}, [email])

	// Ao mudar de passo, leva o ecrã ao início do assistente (não ao topo da página).
	const firstRender = useRef(true)
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false
			return
		}
		scrollToWizard()
	}, [step, done])

	const go = (n: number) => {
		setError("")
		setStep(n)
	}

	const contactOk =
		isEmail(email) &&
		known !== null &&
		(known || (contact.name.trim() && contact.phone.trim() && (audience === "particular" || contact.company.trim())))

	const submit = async () => {
		setBusy(true)
		setError("")
		try {
			const res = await fetch("/api/public/quotes", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ audience, insuranceType: typeId, answers, email: email.trim(), ...contact, declared, website: honeypot }),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data.message || "Não foi possível enviar o pedido.")
			setDone(data.ref)
		} catch (err) {
			setError((err as Error).message)
		} finally {
			setBusy(false)
		}
	}

	if (done) {
		return (
			<div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 text-center ring-1 ring-line sm:p-12">
				<CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
				<h2 className="mt-6 text-3xl font-bold tracking-tight text-ink">Pedido recebido!</h2>
				<p className="mt-3 text-lg text-tertiary">
					Vamos comparar as seguradoras e enviar a melhor solução para <strong className="text-ink">{email}</strong>.
				</p>
				<p className="mt-8 text-sm text-tertiary">A sua referência</p>
				<p className="mt-1 font-mono text-3xl font-bold tracking-wider text-royal">{done}</p>
				<div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Link href="/" className="btn btn-dark">
						Voltar ao início
					</Link>
					<button
						type="button"
						onClick={() => {
							setDone(null)
							setTypeId("")
							setAnswers({})
							setDeclared(emptyDeclared)
							go(1)
						}}
						className="btn btn-outline-dark">
						Pedir outro seguro
					</button>
				</div>
			</div>
		)
	}

	return (
		<>
			{step === 0 && (
				<WizardShell steps={STEPS} current={0} onNext={() => go(1)}>
					<StepTitle title="Para quem é o seguro?" text="Escolha uma opção. Demora menos de 2 minutos." />
					<div className="grid gap-4">
						<ChoiceCard
							selected={audience === "empresa"}
							onClick={() => {
								setAudience("empresa")
								setTypeId("")
							}}
							icon={<Building2 className="h-7 w-7" />}
							title="Para a minha empresa"
							text="Saúde de grupo, acidentes de trabalho, frota, instalações…"
							badge="Mais pedido"
						/>
						<ChoiceCard
							selected={audience === "particular"}
							onClick={() => {
								setAudience("particular")
								setTypeId("")
							}}
							icon={<User className="h-7 w-7" />}
							title="Para mim ou para a família"
							text="Automóvel, saúde, vida, casa e viagem."
						/>
					</div>
				</WizardShell>
			)}

			{step === 1 && (
				<WizardShell steps={STEPS} current={1} onBack={() => go(0)} onNext={() => go(2)} nextDisabled={!typeId}>
					<StepTitle title="Que seguro procura?" />
					<div className="grid gap-3 sm:grid-cols-2">
						{types.map((t) => {
							const Icon = ICONS[t.id] ?? ShieldCheck
							return (
								<ChoiceCard
									key={t.id}
									selected={typeId === t.id}
									onClick={() => {
										setTypeId(t.id)
										setAnswers({})
									}}
									icon={<Icon className="h-7 w-7" />}
									title={t.label}
									text={t.short}
								/>
							)
						})}
					</div>
				</WizardShell>
			)}

			{step === 2 && type && (
				<WizardShell steps={STEPS} current={2} onBack={() => go(preset ? 0 : 1)} onNext={() => go(3)} nextLabel="Continuar">
					<StepTitle title={type.label} text="Preencha só o que souber. O resto tratamos consigo." />
					<div className="grid gap-6">
						{type.fields.map((f) => (
							<BigField key={f.key} label={f.label} hint={f.hint} optional>
								{f.kind === "select" ? (
									<div className="flex flex-wrap gap-2">
										{f.options!.map((o) => (
											<button
												key={o}
												type="button"
												onClick={() => setAnswers((a) => ({ ...a, [f.key]: a[f.key] === o ? "" : o }))}
												aria-pressed={answers[f.key] === o}
												className={`min-h-12 rounded-2xl px-4 text-base font-medium ring-2 transition ${
													answers[f.key] === o ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-line hover:ring-royal"
												}`}>
												{o}
											</button>
										))}
									</div>
								) : f.kind === "textarea" ? (
									<textarea
										rows={3}
										className={`${bigInput} h-auto py-3`}
										value={answers[f.key] ?? ""}
										placeholder={f.placeholder}
										onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
									/>
								) : (
									<input
										type={f.kind === "number" ? "number" : f.kind === "date" ? "date" : "text"}
										inputMode={f.kind === "number" ? "numeric" : undefined}
										min={f.kind === "number" ? 0 : undefined}
										className={bigInput}
										value={answers[f.key] ?? ""}
										placeholder={f.placeholder}
										onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
									/>
								)}
							</BigField>
						))}
						<DeclaredPolicy value={declared} onChange={setDeclared} />
					</div>
				</WizardShell>
			)}

			{step === 3 && (
				<WizardShell
					steps={STEPS}
					current={3}
					onBack={() => go(2)}
					onNext={() => go(4)}
					nextDisabled={!contactOk}
					hint={known === null && isEmail(email) ? "A verificar…" : undefined}>
					<StepTitle title="Para onde enviamos a proposta?" text="Escreva o seu email. Se já for nosso cliente, não precisa de mais nada." />
					<div className="grid gap-6">
						<BigField label="Email">
							<input
								type="email"
								inputMode="email"
								autoComplete="email"
								className={bigInput}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="nome@empresa.ao"
								autoFocus
							/>
						</BigField>

						{known === true && (
							<p data-stagger className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-base text-emerald-800">
								<CheckCircle2 className="h-6 w-6 shrink-0" /> Bem-vindo de volta! Já temos os seus dados.
							</p>
						)}

						{known === false && (
							<>
								{audience === "empresa" && (
									<div className="grid gap-6 sm:grid-cols-2">
										<BigField label="Nome da empresa">
											<input className={bigInput} autoComplete="organization" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} />
										</BigField>
										<BigField label="NIF" optional>
											<input className={bigInput} inputMode="numeric" value={contact.nif} onChange={(e) => setContact({ ...contact, nif: e.target.value })} />
										</BigField>
									</div>
								)}
								<div className="grid gap-6 sm:grid-cols-2">
									<BigField label={audience === "empresa" ? "O seu nome" : "Nome completo"}>
										<input className={bigInput} autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
									</BigField>
									<BigField label="Telefone / WhatsApp">
										<input className={bigInput} type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+244 9XX XXX XXX" />
									</BigField>
								</div>
							</>
						)}

						{known !== null && (
							<BigField label="Quer acrescentar alguma coisa?" optional>
								<textarea rows={3} className={`${bigInput} h-auto py-3`} value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />
							</BigField>
						)}
						{/* Armadilha para robôs (invisível para pessoas) */}
						<input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden />
					</div>
				</WizardShell>
			)}

			{step === 4 && type && (
				<WizardShell steps={STEPS} current={4} onBack={() => go(3)} onNext={submit} nextLabel="Enviar pedido" busy={busy}>
					<StepTitle title="Está tudo certo?" text="Confirme e envie. Respondemos por email." />
					<dl className="divide-y divide-line overflow-hidden rounded-3xl bg-white ring-1 ring-line" data-stagger>
						{[
							["Para", audience === "empresa" ? "Empresa" : "Particular"],
							["Seguro", type.label],
							...type.fields.filter((f) => answers[f.key]).map((f) => [f.label, answers[f.key]]),
							...(declared.insurer || declared.policyNumber ? [["Seguro atual", [declared.insurer, declared.policyNumber].filter(Boolean).join(" · ")]] : []),
							["Email", email],
							...(contact.company ? [["Empresa", contact.company]] : []),
							...(contact.name ? [["Nome", contact.name]] : []),
							...(contact.phone ? [["Telefone", contact.phone]] : []),
						].map(([k, v]) => (
							<div key={k} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:justify-between sm:gap-6">
								<dt className="text-sm text-tertiary">{k}</dt>
								<dd className="font-medium text-ink sm:text-right">{v}</dd>
							</div>
						))}
					</dl>
					{error && (
						<p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-base text-red-700">
							{error}
						</p>
					)}
					<p className="mt-6 text-sm text-tertiary" data-stagger>
						Ao enviar, aceita que a GSC use estes dados para lhe apresentar propostas de seguro.
					</p>
				</WizardShell>
			)}
		</>
	)
}

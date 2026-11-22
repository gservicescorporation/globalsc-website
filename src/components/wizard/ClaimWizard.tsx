"use client"

import {
	AlertCircle,
	Camera,
	Car,
	CheckCircle2,
	Droplets,
	Flame,
	HardHat,
	HelpCircle,
	ImagePlus,
	Loader2,
	Lock,
	MapPin,
	Package,
	RotateCcw,
	Stethoscope,
	X,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useUploadThing } from "@/app/admin/_components/upload"
import { CLAIM_TYPES } from "@/content/insurance-catalog"
import DeclaredPolicy, { emptyDeclared, type Declared } from "./DeclaredPolicy"
import { BigField, StepTitle, WizardShell, bigInput, compressImage, isEmail, lookupEmail, scrollToWizard } from "./Wizard"

const ICONS: Record<string, React.ElementType> = {
	car: Car,
	hardhat: HardHat,
	lock: Lock,
	flame: Flame,
	droplets: Droplets,
	stethoscope: Stethoscope,
	package: Package,
	help: HelpCircle,
}

type Photo = { id: string; preview: string; url?: string; status: "a_enviar" | "ok" | "erro"; file: File }

const STEPS = ["Quem é", "O que aconteceu", "Fotografias", "Quando e onde", "Enviar"]

const nowLocal = () => {
	const d = new Date()
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
	return d.toISOString().slice(0, 16)
}

export default function ClaimWizard() {
	const [step, setStep] = useState(0)
	// Numa urgência a pessoa identifica-se com o que se lembrar: telefone OU email.
	const [contact, setContact] = useState("")
	const [known, setKnown] = useState<boolean | null>(null)
	const [person, setPerson] = useState({ name: "", other: "", company: "" })
	const [declared, setDeclared] = useState<Declared>(emptyDeclared)
	const [claimType, setClaimType] = useState("")
	const [photos, setPhotos] = useState<Photo[]>([])
	const [when, setWhen] = useState(nowLocal())
	const [where, setWhere] = useState("")
	const [locating, setLocating] = useState(false)
	const [description, setDescription] = useState("")
	const [honeypot, setHoneypot] = useState("")
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState("")
	const [done, setDone] = useState<string | null>(null)
	const camera = useRef<HTMLInputElement>(null)
	const gallery = useRef<HTMLInputElement>(null)
	const { startUpload } = useUploadThing("publicUpload")

	const contactIsEmail = isEmail(contact)
	const contactOk = contactIsEmail || contact.replace(/D/g, "").length >= 9
	// O que não foi usado para identificar fica como contacto extra (opcional).
	const email = contactIsEmail ? contact.trim() : person.other.trim()
	const phone = contactIsEmail ? person.other.trim() : contact.trim()

	useEffect(() => {
		if (!contactOk) {
			setKnown(null)
			return
		}
		const t = setTimeout(async () => setKnown(await lookupEmail(contact.trim())), 500)
		return () => clearTimeout(t)
	}, [contact, contactOk])

	// Ao mudar de passo, leva o ecrã ao início do assistente (não ao topo da página).
	const firstRender = useRef(true)
	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false
			return
		}
		scrollToWizard()
	}, [step, done])

	// Liberta as pré-visualizações ao sair.
	useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.preview)), []) // eslint-disable-line react-hooks/exhaustive-deps

	const go = (n: number) => {
		setError("")
		setStep(n)
	}

	const uploadOne = async (photo: Photo) => {
		setPhotos((list) => list.map((p) => (p.id === photo.id ? { ...p, status: "a_enviar" } : p)))
		try {
			const res = await startUpload([photo.file])
			const url = res?.[0]?.ufsUrl
			setPhotos((list) => list.map((p) => (p.id === photo.id ? { ...p, url, status: url ? "ok" : "erro" } : p)))
		} catch {
			setPhotos((list) => list.map((p) => (p.id === photo.id ? { ...p, status: "erro" } : p)))
		}
	}

	const addFiles = async (files: FileList | null) => {
		if (!files?.length) return
		const room = 12 - photos.length
		const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room)
		for (const raw of picked) {
			const file = await compressImage(raw)
			const photo: Photo = { id: crypto.randomUUID(), preview: URL.createObjectURL(file), status: "a_enviar", file }
			setPhotos((list) => [...list, photo])
			// Envia logo em segundo plano, enquanto a pessoa continua.
			void uploadOne(photo)
		}
	}

	const removePhoto = (id: string) =>
		setPhotos((list) => {
			const p = list.find((x) => x.id === id)
			if (p) URL.revokeObjectURL(p.preview)
			return list.filter((x) => x.id !== id)
		})

	const locate = () => {
		if (!navigator.geolocation) return
		setLocating(true)
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords
				setWhere(`${latitude.toFixed(5)}, ${longitude.toFixed(5)} (localização do telemóvel)`)
				setLocating(false)
			},
			() => {
				setError("Não foi possível obter a localização. Escreva o local, por favor.")
				setLocating(false)
			},
			{ enableHighAccuracy: true, timeout: 10_000 }
		)
	}

	const uploading = photos.some((p) => p.status === "a_enviar")
	const okPhotos = photos.filter((p) => p.status === "ok" && p.url)
	// Basta um contacto válido: o gestor liga depois, mesmo sem registo na base de dados.
	const whoOk = contactOk && (!person.other.trim() || contactIsEmail || isEmail(person.other))

	const submit = async () => {
		setBusy(true)
		setError("")
		try {
			const res = await fetch("/api/public/claims", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email,
					phone,
					name: person.name,
					company: person.company,
					declared,
					claimType,
					occurredAt: when,
					location: where,
					description,
					photos: okPhotos.map((p) => p.url),
					website: honeypot,
				}),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data.message || "Não foi possível enviar a participação.")
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
				<h2 className="mt-6 text-3xl font-bold tracking-tight text-ink">Participação enviada</h2>
				<p className="mt-3 text-lg text-tertiary">
					Um gestor de sinistros vai analisar e contactá-lo{phone ? <> pelo <strong className="text-ink">{phone}</strong></> : null}.{email ? <> Enviámos a confirmação para <strong className="text-ink">{email}</strong>.</> : null}
				</p>
				<p className="mt-8 text-sm text-tertiary">A sua referência</p>
				<p className="mt-1 font-mono text-3xl font-bold tracking-wider text-royal">{done}</p>
				<ul className="mx-auto mt-8 max-w-md space-y-2 text-left text-base text-tertiary">
					<li>• Guarde as fotografias originais e todos os documentos.</li>
					<li>• Se houve polícia, peça o auto de ocorrência.</li>
					<li>• Não faça reparações antes de falar connosco.</li>
				</ul>
				<Link href="/" className="btn btn-dark mt-10">
					Voltar ao início
				</Link>
			</div>
		)
	}

	return (
		<>
			{step === 0 && (
				<WizardShell steps={STEPS} current={0} onNext={() => go(1)} nextDisabled={!whoOk} hint={known === false ? "Não encontrámos registo — pode continuar, um gestor liga-lhe." : undefined}>
					<StepTitle title="Lamentamos o sucedido. Vamos ajudar." text="Escreva o seu telefone ou email — o que se lembrar." />
					<div className="grid gap-6">
						<BigField label="Telefone ou email">
							<input
								type="text"
								inputMode={contact.includes("@") || /[a-z]/i.test(contact) ? "email" : "tel"}
								autoComplete="tel email"
								className={bigInput}
								value={contact}
								onChange={(e) => setContact(e.target.value)}
								placeholder="923 456 789 ou nome@email.com"
								autoFocus
							/>
						</BigField>
						{known === true && (
							<p data-stagger className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-4 text-base text-emerald-800">
								<CheckCircle2 className="h-6 w-6 shrink-0" /> Encontrámos o seu registo. Já temos os dados da sua apólice.
							</p>
						)}
						{known === false && (
							<>
								<div className="grid gap-6 sm:grid-cols-2">
									<BigField label="Nome" optional>
										<input className={bigInput} autoComplete="name" value={person.name} onChange={(e) => setPerson({ ...person, name: e.target.value })} />
									</BigField>
									<BigField label={contactIsEmail ? "Telefone / WhatsApp" : "Email"} optional hint={contactIsEmail ? "Para lhe ligarmos mais depressa." : "Para receber a confirmação."}>
										<input
											type={contactIsEmail ? "tel" : "email"}
											inputMode={contactIsEmail ? "tel" : "email"}
											autoComplete={contactIsEmail ? "tel" : "email"}
											className={bigInput}
											value={person.other}
											onChange={(e) => setPerson({ ...person, other: e.target.value })}
										/>
									</BigField>
								</div>
								<BigField label="Empresa onde trabalha" optional hint="Se o seguro é da sua empresa.">
									<input className={bigInput} autoComplete="organization" value={person.company} onChange={(e) => setPerson({ ...person, company: e.target.value })} />
								</BigField>
								<DeclaredPolicy value={declared} onChange={setDeclared} question="Sabe os dados da sua apólice?" />
							</>
						)}
					</div>
				</WizardShell>
			)}

			{step === 1 && (
				<WizardShell steps={STEPS} current={1} onBack={() => go(0)} onNext={() => go(2)} nextDisabled={!claimType}>
					<StepTitle title="O que aconteceu?" text="Toque na opção mais próxima." />
					<div className="grid grid-cols-2 gap-3">
						{CLAIM_TYPES.map((t) => {
							const Icon = ICONS[t.icon] ?? HelpCircle
							const selected = claimType === t.id
							return (
								<button
									key={t.id}
									type="button"
									data-stagger
									onClick={() => setClaimType(t.id)}
									aria-pressed={selected}
									className={`flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl p-4 text-center ring-2 transition active:scale-[0.98] ${
										selected ? "bg-ink text-white ring-ink" : "bg-white text-ink ring-line hover:ring-royal"
									}`}>
									<span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${selected ? "bg-accent text-ink" : "bg-royal/10 text-royal"}`}>
										<Icon className="h-7 w-7" />
									</span>
									<span className="text-base leading-tight font-semibold">{t.label}</span>
								</button>
							)
						})}
					</div>
				</WizardShell>
			)}

			{step === 2 && (
				<WizardShell
					steps={STEPS}
					current={2}
					onBack={() => go(1)}
					onNext={() => go(3)}
					nextLabel={photos.length ? (uploading ? "A enviar fotografias…" : "Continuar") : "Continuar sem fotografias"}
					nextDisabled={uploading}>
					<StepTitle title="Fotografe a ocorrência" text="Danos, matrícula, local e documentos. Até 12 fotografias." />
					<div className="grid gap-3 sm:grid-cols-2">
						<button
							type="button"
							data-stagger
							onClick={() => camera.current?.click()}
							disabled={photos.length >= 12}
							className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-3xl bg-royal px-6 text-white shadow-lg shadow-royal/30 transition active:scale-[0.98] disabled:opacity-40">
							<Camera className="h-12 w-12" />
							<span className="text-xl font-bold">Tirar fotografia</span>
						</button>
						<button
							type="button"
							data-stagger
							onClick={() => gallery.current?.click()}
							disabled={photos.length >= 12}
							className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-3xl bg-white px-6 text-ink ring-2 ring-line transition hover:ring-royal active:scale-[0.98] disabled:opacity-40">
							<ImagePlus className="h-12 w-12 text-royal" />
							<span className="text-xl font-bold">Escolher da galeria</span>
						</button>
					</div>
					{/* capture="environment" abre diretamente a câmara traseira no telemóvel */}
					<input ref={camera} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { addFiles(e.target.files); e.target.value = "" }} />
					<input ref={gallery} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = "" }} />

					{photos.length > 0 && (
						<ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
							{photos.map((p, i) => (
								<li key={p.id} className="relative aspect-square overflow-hidden rounded-2xl bg-line">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={p.preview} alt={`Fotografia ${i + 1}`} className="h-full w-full object-cover" />
									{p.status === "a_enviar" && (
										<span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-white">
											<Loader2 className="h-7 w-7 animate-spin" />
										</span>
									)}
									{p.status === "erro" && (
										<button type="button" onClick={() => uploadOne(p)} className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-600/80 text-xs font-semibold text-white">
											<RotateCcw className="h-6 w-6" /> Tentar de novo
										</button>
									)}
									{p.status === "ok" && (
										<span className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
											<CheckCircle2 className="h-4 w-4" />
										</span>
									)}
									<button
										type="button"
										onClick={() => removePhoto(p.id)}
										aria-label={`Remover fotografia ${i + 1}`}
										className="absolute top-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-white">
										<X className="h-5 w-5" />
									</button>
								</li>
							))}
						</ul>
					)}
				</WizardShell>
			)}

			{step === 3 && (
				<WizardShell
					steps={STEPS}
					current={3}
					onBack={() => go(2)}
					onNext={() => go(4)}
					nextDisabled={!okPhotos.length && !description.trim()}
					hint={!okPhotos.length && !description.trim() ? "Sem fotografias, descreva o que aconteceu." : undefined}>
					<StepTitle title="Quando e onde?" />
					<div className="grid gap-6">
						<BigField label="Data e hora">
							<input type="datetime-local" className={bigInput} value={when} max={nowLocal()} onChange={(e) => setWhen(e.target.value)} />
						</BigField>
						<BigField label="Local" optional>
							<div className="flex flex-col gap-3">
								<input className={bigInput} value={where} onChange={(e) => setWhere(e.target.value)} placeholder="ex.: Av. 21 de Janeiro, Luanda" />
								<button type="button" onClick={locate} disabled={locating} className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-white text-base font-semibold text-ink ring-2 ring-line hover:ring-royal">
									{locating ? <Loader2 className="h-5 w-5 animate-spin" /> : <MapPin className="h-5 w-5 text-royal" />}
									Usar a minha localização
								</button>
							</div>
						</BigField>
						<BigField label="O que aconteceu?" optional={okPhotos.length > 0} hint="Conte por palavras suas. Não precisa de ser formal.">
							<textarea rows={5} className={`${bigInput} h-auto py-3`} value={description} onChange={(e) => setDescription(e.target.value)} />
						</BigField>
						<input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" aria-hidden />
						{error && <p className="flex items-center gap-2 text-sm text-red-600"><AlertCircle className="h-4 w-4" /> {error}</p>}
					</div>
				</WizardShell>
			)}

			{step === 4 && (
				<WizardShell steps={STEPS} current={4} onBack={() => go(3)} onNext={submit} nextLabel="Enviar participação" busy={busy}>
					<StepTitle title="Confirme e envie" />
					<div className="grid gap-4" data-stagger>
						<div className="rounded-3xl bg-white p-5 ring-1 ring-line">
							<p className="text-sm text-tertiary">Ocorrência</p>
							<p className="mt-1 text-xl font-semibold text-ink">{CLAIM_TYPES.find((t) => t.id === claimType)?.label}</p>
							<p className="mt-2 text-base text-tertiary">
								{when.replace("T", " às ")}
								{where && ` · ${where}`}
							</p>
							{description && <p className="mt-3 text-base text-ink">{description}</p>}
						</div>
						{okPhotos.length > 0 && (
							<div className="flex gap-2 overflow-x-auto rounded-3xl bg-white p-3 ring-1 ring-line">
								{okPhotos.map((p) => (
									// eslint-disable-next-line @next/next/no-img-element
									<img key={p.id} src={p.preview} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
								))}
							</div>
						)}
						<div className="rounded-3xl bg-white p-5 text-base ring-1 ring-line">
							<p className="text-sm text-tertiary">Contacto</p>
							<p className="mt-1 font-medium text-ink">{[known ? null : person.name, phone, email].filter(Boolean).join(" · ")}</p>
						</div>
					</div>
					{error && (
						<p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-base text-red-700">
							{error}
						</p>
					)}
				</WizardShell>
			)}
		</>
	)
}

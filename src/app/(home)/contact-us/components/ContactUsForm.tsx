"use client"

import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

interface InputFields {
	fullname: string
	email: string
	phoneNumber: string
	enterprise?: string
	subject: string
	message: string
}

const SUBJECTS = [
	{ value: "seguro", label: "Cotação de seguro" },
	{ value: "sinistro", label: "Apoio num sinistro" },
	{ value: "formacao", label: "Formação / Academia" },
	{ value: "eventos", label: "Eventos e patrocínios" },
	{ value: "outro", label: "Outro assunto" },
]

export default function ContactUsForm() {
	const initialSubject = useSearchParams().get("assunto") ?? "seguro"
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<InputFields>({ defaultValues: { subject: SUBJECTS.some((s) => s.value === initialSubject) ? initialSubject : "seguro" } })
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)

	const onSubmit: SubmitHandler<InputFields> = async (data) => {
		setLoading(true)
		setStatus(null)
		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: data.fullname,
					email: data.email,
					phone: data.phoneNumber,
					enterprise: data.enterprise,
					subject: SUBJECTS.find((s) => s.value === data.subject)?.label,
					message: data.message,
				}),
			})
			const result = await res.json().catch(() => ({}))
			if (res.ok) {
				setStatus({ ok: true, text: "Mensagem enviada! Enviámos uma confirmação para o seu email." })
				reset()
			} else {
				setStatus({
					ok: false,
					text: result.message || "Não foi possível enviar a mensagem. Tente novamente mais tarde.",
				})
			}
		} catch {
			setStatus({ ok: false, text: "Não foi possível enviar a mensagem. Verifique a ligação e tente novamente." })
		} finally {
			setLoading(false)
		}
	}

	const err = (msg?: string) =>
		msg ? (
			<span role="alert" className="text-xs font-medium text-red-600">
				{msg}
			</span>
		) : null

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			className="grid gap-5 rounded-[2rem] bg-paper p-6 ring-1 ring-line sm:grid-cols-2 sm:p-10">
			<div className="sm:col-span-2">
				<h2 className="text-2xl font-semibold tracking-tight text-ink">Envie-nos uma mensagem</h2>
				<p className="mt-1 text-sm text-tertiary">Todos os campos marcados com * são obrigatórios.</p>
			</div>

			<fieldset className="sm:col-span-2">
				<legend className="mb-2 text-sm font-medium">Assunto *</legend>
				<div className="flex flex-wrap gap-2">
					{SUBJECTS.map((s) => (
						<label key={s.value} className="cursor-pointer">
							<input type="radio" value={s.value} {...register("subject")} className="peer sr-only" />
							<span className="block rounded-full px-4 py-2 text-sm ring-1 ring-line transition-colors peer-checked:bg-ink peer-checked:text-white peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-royal hover:ring-ink">
								{s.label}
							</span>
						</label>
					))}
				</div>
			</fieldset>

			<label className="input-label">
				Nome completo *
				<input
					{...register("fullname", {
						required: "Insira o seu nome completo",
						minLength: { value: 3, message: "O nome deve ter pelo menos 3 caracteres" },
					})}
					autoComplete="name"
					placeholder="ex.: Ana Silva"
					aria-invalid={!!errors.fullname}
					className="input-form"
				/>
				{err(errors.fullname?.message)}
			</label>

			<label className="input-label">
				Email *
				<input
					{...register("email", {
						required: "Insira o seu endereço de email",
						pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Insira um email válido" },
					})}
					type="email"
					autoComplete="email"
					placeholder="ex.: ana@empresa.ao"
					aria-invalid={!!errors.email}
					className="input-form"
				/>
				{err(errors.email?.message)}
			</label>

			<div className="input-label">
				<span>Telefone *</span>
				<Controller
					name="phoneNumber"
					control={control}
					rules={{
						required: "Insira o seu número de telefone",
						validate: (v) => v.replace(/\D/g, "").length >= 12 || "Número de telefone inválido",
					}}
					render={({ field }) => (
						<PhoneInput {...field} country="ao" placeholder="923 456 789" inputProps={{ "aria-label": "Telefone" }} />
					)}
				/>
				{err(errors.phoneNumber?.message)}
			</div>

			<label className="input-label">
				Empresa
				<input
					{...register("enterprise", { maxLength: { value: 100, message: "Nome demasiado longo" } })}
					autoComplete="organization"
					placeholder="ex.: Empresa X"
					className="input-form"
				/>
				{err(errors.enterprise?.message)}
			</label>

			<label className="input-label sm:col-span-2">
				Mensagem *
				<textarea
					{...register("message", {
						required: "Escreva a sua mensagem",
						minLength: { value: 10, message: "A mensagem deve ter pelo menos 10 caracteres" },
					})}
					rows={5}
					placeholder="Conte-nos como podemos ajudar…"
					aria-invalid={!!errors.message}
					className="input-form resize-none"
				/>
				{err(errors.message?.message)}
			</label>

			{status && (
				<p
					role="status"
					className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm sm:col-span-2 ${
						status.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
					}`}>
					{status.ok && <CheckCircle2 className="h-4 w-4" />}
					{status.text}
				</p>
			)}

			<button type="submit" disabled={loading} className="btn btn-dark sm:col-span-2 disabled:opacity-60">
				{loading ? (
					<span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
				) : (
					<>
						Enviar mensagem <ArrowUpRight className="h-4 w-4" />
					</>
				)}
			</button>
		</form>
	)
}

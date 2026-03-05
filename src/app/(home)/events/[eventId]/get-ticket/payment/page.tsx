"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { EventDataInterface } from "@/app/interfaces/event-data"
import { toast, ToastContainer } from "react-toastify"
import event from "@/app/data/events.json"
import { formatPrice } from "@/app/utils/formatPrice"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { formatDateExtenso } from "@/app/utils/formatDate"
import { usePaymentStatus } from "@/app/api/hook/usePaymentStatus"

interface Ticket {
	id: string
	price: number
	ticketName: string
	benefits: string[]
}

type CartDataInterface = {
	ticket: Ticket
	qty: number
}[]

interface PaymentFormInputs {
	fullname: string
	email: string
	phoneNumber: string
	mcxPhoneNumber?: string
	enterprise?: string
	position?: string
	paymentMethod: "mcx" | "referencia"
	terms: boolean
}

const generateDescription = () => `Payment_${Math.floor(Math.random() * 10000)}`

export default function Payment({
	params,
}: {
	params: Promise<{ eventId: string }>
}) {
	const { eventId } = use(params)
	const router = useRouter()

	const [eventData, setEventData] = useState<EventDataInterface>()
	const [cartData, setCartData] = useState<CartDataInterface>([])
	const [cartTotal, setCartTotal] = useState(0)

	const [chargeId, setChargeId] = useState<string | null>(null)

	const [referenceData, setReferenceData] = useState<{
		entity?: string
		referenceNumber?: string
		dueDate?: string
	} | null>(null)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<PaymentFormInputs>()

	const paymentMethod = watch("paymentMethod")

	useEffect(() => {
		const storedChargeId = localStorage.getItem("chargeId")
		const storedPaymentMethod = localStorage.getItem("paymentMethod") as
			| "mcx"
			| "referencia"
			| null

		if (!storedChargeId || !storedPaymentMethod) return

		setChargeId(storedChargeId)
		setValue("paymentMethod", storedPaymentMethod)

		const storedReference = localStorage.getItem("referenceData")
		if (storedReference) {
			setReferenceData(JSON.parse(storedReference))
		}
	}, [setValue])

	const { status, loading: statusLoading } = usePaymentStatus({
		chargeId: chargeId ?? "",
		enabled: !!chargeId,
	})

	useEffect(() => {
		if (!status || !chargeId) return

		if (status === "Success") {
			axios.post("/api/payments/confirm", {
				chargeId,
				fullname: watch("fullname"),
				email: watch("email"),
				eventName: eventData?.event.title,
				eventDate: eventData?.event.startDate,
				ticketCode: `TCK-${chargeId.slice(0, 8).toUpperCase()}`,
			})

			setIsModalOpen(true)
		}

		if (status === "Failed") {
			toast.error("Pagamento falhou")
			clearStorage()
			setIsModalOpen(false)
		}
	}, [status, chargeId, eventData, watch])

	const clearStorage = () => {
		setChargeId(null)
		localStorage.removeItem("chargeId")
		localStorage.removeItem("paymentMethod")
		localStorage.removeItem("merchantTransactionId")
	}

	const handleCloseModal = () => {
		clearStorage()
		setIsModalOpen(false)
	}

	useEffect(() => {
		const data = localStorage.getItem("cart-data")
		const total = localStorage.getItem("cart-total")

		if (data) setCartData(JSON.parse(data))
		if (total) setCartTotal(JSON.parse(total))
	}, [])

	useEffect(() => {
		const ev = event.events.find((e) => e.id === eventId)

		if (!ev) {
			toast.error("Evento não encontrado")
			return
		}
		setEventData(ev as EventDataInterface)
	}, [eventId])

	const onSubmit: SubmitHandler<PaymentFormInputs> = async (data) => {
		try {
			setLoading(true)

			const response = await axios.post("/api/e-mais/create-charge", {
				amount: cartTotal,
				currency: "AOA",
				description: generateDescription(),
				paymentMethod: data.paymentMethod,
				phoneNumber:
					data.paymentMethod === "mcx" ? data.mcxPhoneNumber : data.phoneNumber,
				customer: {
					fullname: data.fullname,
					email: data.email,
				},
				eventId,
			})

			const { id, merchantTransactionId, reference } = response.data

			setChargeId(id)
			setIsModalOpen(true)

			localStorage.setItem("chargeId", id)
			localStorage.setItem("merchantTransactionId", merchantTransactionId)
			localStorage.setItem("paymentMethod", data.paymentMethod)

			if (reference) {
				setReferenceData(reference)
				localStorage.setItem("referenceData", JSON.stringify(reference))
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toast.error(err.response?.data?.message || "Erro no pagamento")
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<ToastContainer />
			<div
				className="min-h-screen flex w-full justify-center py-32 text-secondary max-lg:px-4"
				style={{
					backgroundImage: `linear-gradient(to right, ${eventData?.theme.primary}, ${eventData?.theme.secondary}), url(${eventData?.theme.imgUrl})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="w-full max-w-7xl flex gap-12 max-lg:flex-col-reverse max-lg:gap-8">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="w-1/2 px-8 py-12 rounded-xl backdrop-blur-sm shadow-md grid grid-cols-2 gap-8 max-lg:w-full max-lg:p-6"
					>
						<div className="col-span-2 max-lg:text-center">
							<h1 className="text-2xl font-semibold text-white max-lg:text-xl">
								Informações de contacto e pagamento
							</h1>
							<p className="text-white/70 max-lg:text-sm">
								Usaremos esses dados para atualizá-lo sobre o seu pedido.
							</p>
						</div>

						<label className="input-label col-span-2">
							Nome completo
							<input
								{...register("fullname", {
									required: "Insira o seu nome completo",
									minLength: {
										value: 3,
										message: "O nome deve ter pelo menos 3 caracteres",
									},
								})}
								type="text"
								className="input-blur"
								placeholder="Insira o seu nome completo"
							/>
							{errors.fullname && (
								<span className="text-red-500 text-sm">
									{errors.fullname.message}
								</span>
							)}
						</label>

						<label className="input-label col-span-2">
							Email
							<input
								{...register("email", {
									required: "Insira o seu email",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Insira um email válido",
									},
								})}
								type="text"
								className="input-blur"
								placeholder="Insira o seu email"
							/>
							{errors.email && (
								<span className="text-red-500 text-sm">
									{errors.email.message}
								</span>
							)}
						</label>

						<label className="input-label col-span-2">
							Contacto telefónico
							<input
								{...register("phoneNumber", {
									required: "Insira o seu contacto telefónico",
									pattern: {
										value: /^\+?\d{9,15}$/,
										message:
											"Insira um número de telefone válido (ex.: +244 923 456 789)",
									},
								})}
								type="tel"
								className="input-blur"
								placeholder="ex.: +244 923 456 789"
							/>
							{errors.phoneNumber && (
								<span className="text-red-500 text-sm">
									{errors.phoneNumber.message}
								</span>
							)}
						</label>

						<label className="input-label max-lg:col-span-2">
							Nome da empresa (opcional)
							<input
								{...register("enterprise", {
									maxLength: {
										value: 100,
										message: "O nome da empresa é demasiado longo",
									},
								})}
								type="text"
								className="input-blur"
								placeholder="Insira o nome da empresa"
							/>
							{errors.enterprise && (
								<span className="text-red-500 text-sm">
									{errors.enterprise.message}
								</span>
							)}
						</label>

						<label className="input-label max-lg:col-span-2">
							Cargo (opcional)
							<input
								{...register("position", {
									maxLength: {
										value: 100,
										message: "O cargo é demasiado longo",
									},
								})}
								type="text"
								className="input-blur"
								placeholder="Insira o seu cargo"
							/>
							{errors.position && (
								<span className="text-red-500 text-sm">
									{errors.position.message}
								</span>
							)}
						</label>

						<div className="flex flex-col gap-2 col-span-2">
							<span className="text-white font-medium">
								Método de pagamento
							</span>
							{errors.paymentMethod && (
								<span className="text-red-500 text-sm">
									{errors.paymentMethod.message}
								</span>
							)}

							<ul className="flex lg:flex-wrap max-lg:flex-row gap-4 w-full justify-start max-lg:justify-center">
								<li className="hover:scale-105 transition-all duration-300 text-center">
									<label className="flex flex-col items-center w-40 max-lg:w-36 gap-2 cursor-pointer">
										<Image
											src="/images/express.png"
											alt="MCX Express"
											width={1920}
											height={1040}
											className="w-full object-contain rounded-2xl"
										/>
										<span className="flex flex-col text-xs text-white">
											MCX Express
											<input
												type="radio"
												value="mcx"
												{...register("paymentMethod", {
													required: "Selecione um método de pagamento",
												})}
												className="hidden"
											/>
										</span>
									</label>
								</li>

								<li className="hover:scale-105 transition-all duration-300 text-center">
									<label className="flex flex-col items-center w-40 max-lg:w-36 gap-2 cursor-pointer">
										<Image
											src="/images/referencia.png"
											alt="referencia"
											width={1920}
											height={1040}
											className="w-full object-contain rounded-2xl"
										/>
										<span className="flex flex-col text-xs text-white">
											Pagamento por referência
											<input
												type="radio"
												value="referencia"
												{...register("paymentMethod", {
													required: "Selecione um método de pagamento",
												})}
												className="hidden"
											/>
										</span>
									</label>
								</li>
							</ul>
						</div>

						{paymentMethod === "mcx" && (
							<label className="input-label col-span-2">
								<input
									{...register("mcxPhoneNumber", {
										required: "Insira o seu contacto do MCX Express",
										pattern: {
											value: /^\+?\d{9,15}$/,
											message: "Número inválido",
										},
									})}
									type="tel"
									className="input-blur"
									placeholder="Insira o seu contacto do MCX Express"
								/>
								{errors.mcxPhoneNumber && (
									<span className="text-red-500 text-sm">
										{errors.mcxPhoneNumber.message}
									</span>
								)}
							</label>
						)}

						{paymentMethod === "referencia" && (
							<div className="input-label col-span-2 p-5 rounded-2xl bg-white/30 w-fit text-sm">
								<p className="mb-2">
									Após finalizar a compra, será gerada uma referência de
									pagamento que poderá ser utilizada para efetuar o pagamento em
									qualquer agência bancária ou através do serviço de
									homebanking.
								</p>
								<p>
									Por favor, certifique-se de guardar a referência de pagamento
									e efetuar o pagamento dentro do prazo estipulado para evitar o
									cancelamento do seu pedido.
								</p>
							</div>
						)}

						<label className="flex items-center gap-2 col-span-2 text-sm max-lg:text-xs text-white">
							<input
								type="checkbox"
								{...register("terms", {
									required: "Você deve concordar com os termos e condições",
								})}
								className="w-4 h-4 rounded-md"
							/>
							Concordo com os Termos e Condições e a Política de Privacidade.
						</label>
						{errors.terms && (
							<span className="text-red-500 text-sm col-span-2">
								{errors.terms.message}
							</span>
						)}

						<div className="col-span-2 flex items-center w-full justify-between max-lg:flex-col-reverse max-lg:gap-4">
							<button
								type="button"
								className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-300 text-white"
								onClick={() => router.push(`/events/${eventId}/get-ticket`)}
							>
								<ArrowLeft className="w-4 h-4" />
								Voltar
							</button>

							<button
								type="submit"
								style={{
									background: `${eventData?.theme.primary}`,
								}}
								className="px-4 py-3 text-lg w-1/2 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 rounded-md max-lg:w-full text-white font-semibold"
							>
								{loading ? (
									<div className="border border-t-2 rounded-full w-5 h-5 animate-spin border-white"></div>
								) : (
									"Finalizar"
								)}
							</button>
						</div>
					</form>

					<div
						style={{
							background: `${eventData?.theme.secondary}`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
						className="w-1/2 flex flex-col gap-8 px-8 py-12 rounded-xl backdrop-blur-sm shadow-md h-fit text-white max-lg:w-full max-lg:p-6"
					>
						<h2 className="text-xl font-semibold max-lg:text-lg text-center">
							Resumo do pedido
						</h2>

						<ul className="flex flex-col gap-4">
							{cartData?.map((item, index) => (
								<li key={index} className="w-full flex justify-between">
									<span>
										<p className="text-lg font-semibold">
											{item.ticket.ticketName}
										</p>
										<p className="text-white/80">
											{formatPrice(item.ticket.price)}
										</p>
									</span>

									<span className="flex flex-col items-center">
										<p className="text-lg font-semibold">Qtd.</p>
										<p>{item.qty}</p>
									</span>
								</li>
							))}
						</ul>

						<div className="flex w-full items-center font-semibold justify-between border-t border-white/20 pt-4 mt-4">
							<p className="text-lg">Total</p>
							<p className="text-lg">{formatPrice(cartTotal)}</p>
						</div>
					</div>
				</div>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center z-50">
					<div className="bg-black/80 text-white p-8 rounded-xl max-w-md w-full flex flex-col gap-4">
						{status === "Pending" &&
							paymentMethod === "referencia" &&
							referenceData && (
								<>
									<h2 className="text-2xl font-semibold mb-4 text-center ">
										Referência de Pagamento
									</h2>
									<p>
										Entidade:{" "}
										<span className="text-xl">{referenceData.entity}</span>
									</p>
									<p>
										Referência:{" "}
										<span className="text-xl">
											{referenceData.referenceNumber}
										</span>
									</p>
									<p className="text-2xl">Total: {formatPrice(cartTotal)} Kz</p>
									<p>
										Vencimento:{" "}
										{referenceData.dueDate &&
											formatDateExtenso(referenceData.dueDate)}
									</p>
								</>
							)}

						{status === "Success" && (
							<div className="flex items-center flex-col gap-4 justify-center">
								{statusLoading ? (
									<div className="border border-t-2 rounded-full w-10 h-10 animate-spin border-white"></div>
								) : (
									<>
										<Image
											alt="Success"
											src="/icons/success.png"
											width={125}
											height={100}
											className="w-24 h-24 object-contain"
										/>

										<h2 className="text-2xl font-semibold text-center">
											Pagamento confirmado!
										</h2>

										<p className="text-center">
											Obrigado por adquirir seu ingresso. Enviaremos um email de
											confirmação em breve.
										</p>
									</>
								)}
							</div>
						)}

						<button
							onClick={handleCloseModal}
							className="mt-6 w-full btn-secondary text-center items-center justify-center hover:cursor-pointer"
						>
							Fechar
						</button>
					</div>
				</div>
			)}
		</>
	)
}

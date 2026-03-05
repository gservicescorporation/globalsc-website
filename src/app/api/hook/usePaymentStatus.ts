// usePaymentStatus.ts
import { useEffect, useState } from "react"
import axios from "axios"

export type PaymentStatus = "Pending" | "Success" | "Failed"

interface UsePaymentStatusProps {
	chargeId: string
	enabled: boolean
}

export const usePaymentStatus = ({
	chargeId,
	enabled,
}: UsePaymentStatusProps) => {
	const [status, setStatus] = useState<PaymentStatus>("Pending")
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		if (!enabled || !chargeId) return

		setLoading(true)

		const interval = setInterval(async () => {
			try {
				const response = await axios.get(`/api/e-mais/charges/${chargeId}`)

				const paymentStatus = response.data?.payment?.status

				if (paymentStatus) {
					setStatus(paymentStatus)
					setLoading(false)

					console.log("Status do pagamento atualizado:", paymentStatus)

					if (paymentStatus === "Success") {
						clearInterval(interval)
					}
				}
			} catch (err) {
				setLoading(false)
				console.error("Erro ao verificar pagamento", err)
			}
		}, 5000)

		return () => clearInterval(interval)
	}, [chargeId, enabled])

	return { status, loading }
}

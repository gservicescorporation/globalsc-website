// services/payment.service.ts
import { Payment, PaymentStatus } from "@/entities/Payment"
import { initDataSource } from "@/lib"
import { appypayClient } from "@/lib/appypay"
import { AppypayCallbackPayload } from "@/types/appypay"

const generateMerchantTransactionId = () => {
	const randomId = Math.floor(Math.random() * 1e8)
	return `TX${randomId}`.substring(0, 15)
}

interface CreateChargeResult {
	ok: boolean
	id: string
	merchantTransactionId: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	reference?: any
	message?: string
	providerCode?: string
	sourceDetails: {
		attempt: number
		type: string
		code: string
		message: string
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createCharge(payload: any): Promise<CreateChargeResult> {
	const ds = await initDataSource()
	const repo = ds.getRepository(Payment)

	const merchantTransactionId = generateMerchantTransactionId()

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const gatewayPayload: any = {
		amount: payload.amount,
		currency: payload.currency,
		description: payload.description,
		merchantTransactionId,
		paymentMethod:
			payload.paymentMethod === "mcx"
				? process.env.APPYPAY_GPO_ID
				: process.env.APPYPAY_REF_ID,
		options: {
			MerchantIdentifier: process.env.APPYPAY_MERCHANT_IDENTIFIER,
			ApiKey: process.env.APPYPAY_API_KEY,
		},
	}

	if (payload.paymentMethod !== "referencia") {
		gatewayPayload.paymentInfo = { phoneNumber: payload.phoneNumber }
		gatewayPayload.notify = {
			name: payload.fullName,
			telephone: payload.phoneNumber,
			email: payload.email,
			smsNotification: true,
			emailNotification: true,
		}
	}

	const response = await appypayClient.post("/charges", gatewayPayload)
	const rs = response.data?.responseStatus

	console.log("[APPYPAY CREATE CHARGE RESPONSE]", response.data)

	if (!rs || rs.successful !== true) {
		const failedPayment = repo.create({
			merchantTransactionId,
			amount: payload.amount,
			currency: payload.currency,
			paymentMethod: payload.paymentMethod,
			status: PaymentStatus.FAILED,
			eventId: payload.eventId,
			failureReason: rs?.message,
			providerCode: rs?.sourceDetails?.code,
		})

		await repo.save(failedPayment)

		return {
			ok: false,
			merchantTransactionId,
			id: response.data.id,
			message: rs?.message,
			providerCode: rs?.sourceDetails?.code,
			sourceDetails: rs?.sourceDetails,
		}
	}

	const payment = repo.create({
		merchantTransactionId,
		amount: payload.amount,
		currency: payload.currency,
		paymentMethod: payload.paymentMethod,
		status: PaymentStatus.PENDING,
		eventId: payload.eventId,
		referenceNumber: rs.reference?.referenceNumber,
		entity: rs.reference?.entity,
		dueDate: rs.reference?.dueDate,
	})

	await repo.save(payment)

	return {
		ok: true,
		id: response.data.id,
		merchantTransactionId,
		reference: rs.reference,
		sourceDetails: rs?.sourceDetails,
	}
}

export async function processAppypayCallback(data: AppypayCallbackPayload) {
	const ds = await initDataSource()
	const repo = ds.getRepository(Payment)

	const payment = await repo.findOneBy({
		merchantTransactionId: data.merchantTransactionId,
	})

	if (!payment || payment.status === PaymentStatus.SUCCESS) return

	switch (data.operationStatus) {
		case 1:
			payment.status = PaymentStatus.SUCCESS
			payment.ekwanzaTransactionId = String(data.ekwanzaTransactionId)
			payment.paidAmount = data.operationData.amount
			payment.referenceType = data.operationData.referenceType
			break
		case 3:
			payment.status = PaymentStatus.CANCELLED
			break
		case 4:
			payment.status = PaymentStatus.FAILED
			break
		default:
			payment.status = PaymentStatus.ERROR
	}

	await repo.save(payment)
}

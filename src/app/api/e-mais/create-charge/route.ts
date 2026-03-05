import { NextRequest, NextResponse } from "next/server"
import { createCharge } from "@/services/payment.service"
import axios from "axios"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const result = await createCharge(body)

		if (!result.ok) {
			return NextResponse.json(
				{
					message: result.message,
					code: result.providerCode,
					sourceDetails: result.sourceDetails,
				},
				{ status: 400 },
			)
		}

		return NextResponse.json(
			{
				id: result.id,
				merchantTransactionId: result.merchantTransactionId,
				reference: result.reference,
			},
			{ status: 202 },
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (axios.isAxiosError(error)) {
			console.error("[CREATE CHARGE ERROR - E-MAIS]", error.response?.data)

			return NextResponse.json(
				{
					message:
						error.response?.data?.responseStatus?.message ||
						"Erro ao criar cobrança",
					emaisError: error.response?.data,
				},
				{ status: error.response?.status || 500 },
			)
		}

		return NextResponse.json(
			{ message: "Erro interno inesperado" },
			{ status: 500 },
		)
	}
}

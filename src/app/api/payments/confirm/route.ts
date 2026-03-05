import { NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { TicketEmail } from "@/emails/TicketEmails"

const sentEmails = new Set<string>()

interface ConfirmRequest {
	chargeId: string
	fullname: string
	email: string
	eventName: string
	eventDate: string
	ticketCode?: string
}

export async function POST(req: Request) {
	const data: ConfirmRequest = await req.json()
	const { chargeId, fullname, email, eventName, eventDate } = data

	if (!chargeId || !fullname || !email) {
		return NextResponse.json({ message: "Dados incompletos" }, { status: 400 })
	}

	if (sentEmails.has(chargeId)) {
		return NextResponse.json({ message: "Email já enviado" })
	}

	const ticketCode =
		data.ticketCode || `TCK-${chargeId.slice(0, 8).toUpperCase()}`

	try {
		const response = await resend.emails.send({
			from: "Global Services Corporation <comercial@globalsc.ao>",
			to: email,
			subject: `Seu Ticket – ${eventName}`,
			react: TicketEmail({
				fullname,
				eventName,
				eventDate,
				ticketCode,
			}),
		})

		console.log("[EMAIL SENT]", response)
	} catch (error) {
		console.error("[EMAIL ERROR]", error)
		return NextResponse.json(
			{ message: "Erro ao enviar email" },
			{ status: 500 },
		)
	}

	sentEmails.add(chargeId)

	return NextResponse.json({ success: true })
}

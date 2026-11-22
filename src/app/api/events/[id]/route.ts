import { NextResponse } from "next/server"
import { getEventBySlugOrId } from "@/server/events"

/** Dados públicos de um evento (usado no fluxo de compra de bilhetes). */
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	const event = await getEventBySlugOrId(id)
	if (!event) {
		return NextResponse.json({ message: "Evento não encontrado" }, { status: 404 })
	}
	return NextResponse.json(event)
}

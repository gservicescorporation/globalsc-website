import { getSlidesFor } from "@/server/slides"
import { json } from "@/server/http"

/** GET /api/slides?page=home|events — destaques ativos de uma página. */
export async function GET(req: Request) {
	const page = new URL(req.url).searchParams.get("page") === "events" ? "events" : "home"
	return json({ data: await getSlidesFor(page) })
}

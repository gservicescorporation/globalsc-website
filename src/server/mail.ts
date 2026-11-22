import { Resend } from "resend"

const FROM = process.env.MAIL_FROM || "Global Services Corporation <comercial@gservicescorporation.com>"
export const TEAM_INBOX = process.env.MEDIATION_INBOX || "comercial@gservicescorporation.com"

const esc = (s: string) =>
	s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Converte texto simples (parágrafos e listas com "-") num email HTML sóbrio. */
function render(title: string, body: string) {
	const html = esc(body)
		.split(/\n{2,}/)
		.map((block) =>
			/^\s*[-•]/m.test(block)
				? `<ul style="margin:0 0 16px;padding-left:20px">${block
						.split("\n")
						.map((l) => `<li style="margin:4px 0">${l.replace(/^\s*[-•]\s*/, "")}</li>`)
						.join("")}</ul>`
				: `<p style="margin:0 0 16px;line-height:1.6">${block.replace(/\n/g, "<br/>")}</p>`
		)
		.join("")
	return `<div style="font-family:Arial,Helvetica,sans-serif;background:#f6f7fb;padding:32px 12px">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">
    <div style="background:#070b16;color:#fff;padding:24px 28px">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#51b7ff">Global Services Corporation</p>
      <h1 style="margin:8px 0 0;font-size:20px">${esc(title)}</h1>
    </div>
    <div style="padding:28px;color:#0e1628;font-size:15px">${html}</div>
    <div style="background:#f3f4f6;padding:16px 28px;font-size:12px;color:#6b7280">Global Services Corporation · Mediação de Seguros · Luanda, Angola</div>
  </div>
</div>`
}

export async function sendMail(to: string | string[], subject: string, body: string, title = subject) {
	if (!process.env.RESEND_API_KEY) throw new Error("Email não configurado (RESEND_API_KEY).")
	const resend = new Resend(process.env.RESEND_API_KEY)
	const { error } = await resend.emails.send({ from: FROM, to, subject, html: render(title, body), text: body })
	if (error) throw new Error(`Falha no envio do email: ${error.message}`)
}

/** Envio que nunca falha o pedido do cliente (notificações). */
export async function notify(to: string | string[], subject: string, body: string) {
	try {
		await sendMail(to, subject, body)
	} catch (err) {
		console.error("[mail]", err)
	}
}

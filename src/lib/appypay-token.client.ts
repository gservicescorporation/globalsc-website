import axios from "axios"

let cachedToken: string | null = null
let tokenExpiresAt = 0

export async function getAppyPayToken() {
	const now = Date.now()

	if (cachedToken && now < tokenExpiresAt) {
		console.log("[TOKEN CACHE] Usando token em cache")
		return cachedToken
	}

	console.log("[TOKEN] Nenhum token válido em cache. Solicitando novo...")

	const url =
		"https://login.microsoftonline.com/auth.appypay.co.ao/oauth2/token"

	const body = new URLSearchParams({
		grant_type: "client_credentials",
		client_id: process.env.APPY_CLIENT_ID!,
		client_secret: process.env.APPY_CLIENT_SECRET!,
		resource: process.env.APPY_RESOURCE!,
	})

	try {
		const response = await axios.post(url, body.toString(), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		})

		const { access_token, expires_in } = response.data

		console.log(
			"[TOKEN GERADO] access_token:",
			access_token.slice(0, 20) + "...",
		)
		console.log("[TOKEN] expira em segundos:", expires_in)

		cachedToken = access_token
		tokenExpiresAt = now + (Number(expires_in) - 60) * 1000

		return cachedToken
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error(
			"[TOKEN] Falha ao gerar token:",
			error.response?.data || error.message,
		)
		throw error
	}
}

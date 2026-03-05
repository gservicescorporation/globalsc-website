import axios, { AxiosHeaders } from "axios"
import { getAppyPayToken } from "./appypay-token.client"

export const appypayClient = axios.create({
	baseURL: process.env.GATEWAY_API_URL,
	timeout: 50000,
	headers: {
		"Content-Type": "application/json",
	},
})

// Interceptor para adicionar token dinâmico
appypayClient.interceptors.request.use(async (config) => {
	const token = await getAppyPayToken()
	console.log(
		"[INTERCEPTOR] Usando token no header:",
		token?.slice(0, 20) + "...",
	)

	config.headers = new AxiosHeaders(config.headers)
	config.headers.set("Authorization", `Bearer ${token}`)

	return config
})

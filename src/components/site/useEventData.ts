"use client"

import { useEffect, useState } from "react"
import type { EventRecord } from "@/types/event"

/** Carrega os dados públicos de um evento (por slug ou id) no cliente. */
export function useEventData(key: string) {
	const [event, setEvent] = useState<EventRecord>()
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let alive = true
		fetch(`/api/events/${encodeURIComponent(key)}`)
			.then(async (res) => {
				if (!res.ok) throw new Error("Evento não encontrado")
				return (await res.json()) as EventRecord
			})
			.then((data) => alive && setEvent(data))
			.catch((err: Error) => alive && setError(err.message))
		return () => {
			alive = false
		}
	}, [key])

	return { event, error }
}

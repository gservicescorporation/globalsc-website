/** Interpreta "YYYY-MM-DD" como data local (evita desvios de fuso horário). */
export function parseDay(value: string | Date) {
	if (value instanceof Date) return value
	const [y, m, d] = value.split("-").map(Number)
	return new Date(y, (m || 1) - 1, d || 1)
}

export function getDateCalendar(data: Date | string) {
	const date = parseDay(data)
	const mes = new Intl.DateTimeFormat("pt-PT", { month: "short" })
		.format(date)
		.replace(".", "")
		.toUpperCase()
	const dia = new Intl.DateTimeFormat("pt-PT", { day: "2-digit" }).format(date)
	const ano = String(date.getFullYear())
	return { mes, dia, ano }
}

export function formatLongDate(value: string | Date) {
	return new Intl.DateTimeFormat("pt-PT", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(parseDay(value))
}

export const formatDateExtenso = (isoDate: string) => {
	return new Intl.DateTimeFormat("pt-PT", {
		dateStyle: "full",
		timeStyle: "short",
		timeZone: "Africa/Luanda",
	}).format(new Date(isoDate))
}

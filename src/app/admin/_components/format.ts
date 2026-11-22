/** Formatação partilhada (servidor e cliente): não pode viver num ficheiro "use client". */
export const fmtDate = (d: string | Date) =>
	new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Luanda" }).format(new Date(d))

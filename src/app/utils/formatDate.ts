export function getDateCalendar(data: Date) {
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(data)
    .replace(".", "")
    .toUpperCase();

  const dia = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(data);

  return { mes, dia };
}

export const formatDateExtenso = (isoDate: string) => {
  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Luanda",
  }).format(new Date(isoDate))
}

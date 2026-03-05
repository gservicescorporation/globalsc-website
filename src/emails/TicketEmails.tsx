import React from "react"

interface TicketEmailProps {
	fullname: string
	eventName: string
	eventDate: string
	ticketCode: string
}

export const TicketEmail = ({
	fullname,
	eventName,
	eventDate,
	ticketCode,
}: TicketEmailProps) => {
	return (
		<div
			style={{
				fontFamily: "Arial, sans-serif",
				color: "#333",
				padding: "20px",
				lineHeight: "1.5",
			}}
		>
			<h1 style={{ color: "#0D6EFD" }}>Obrigado pela sua compra!</h1>
			<p>Olá {fullname},</p>
			<p>
				O seu ingresso para <strong>{eventName}</strong> foi confirmado.
			</p>
			<p>
				<strong>Data do Evento:</strong> {eventDate}
			</p>
			<p>
				<strong>Código do Ticket:</strong> {ticketCode}
			</p>
			<p>Por favor, apresente este código no dia do evento para entrada.</p>
			<p>Até breve!</p>
			<hr />
			<p style={{ fontSize: "12px", color: "#999" }}>
				{eventName} – Todos os direitos reservados
			</p>
		</div>
	)
}

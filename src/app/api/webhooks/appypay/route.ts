import { processAppypayCallback } from "@/services/payment.service"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    await processAppypayCallback(payload)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[APPYPAY CALLBACK]", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

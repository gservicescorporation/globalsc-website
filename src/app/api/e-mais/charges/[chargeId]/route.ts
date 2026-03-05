import { NextResponse } from "next/server"
import axios from "axios"
import { getAppyPayToken } from "@/lib/appypay-token.client"

export async function GET(
  req: Request,
  context: { params: { chargeId: string } | Promise<{ chargeId: string }> }
) {
  const { chargeId } = await context.params

  try {
    const token = await getAppyPayToken()

    const response = await axios.get(
      `https://gwy-api.appypay.co.ao/v2.0/charges/${chargeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return NextResponse.json(response.data)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: "Erro ao consultar pagamento" },
      { status: error.response?.status || 500 },
    )
  }
}

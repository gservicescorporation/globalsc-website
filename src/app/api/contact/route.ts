import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, enterprise, message } = body;

    // Validação básica (backend nunca confia no frontend)
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { message: "Campos obrigatórios em falta." },
        { status: 400 },
      );
    }

    // 📩 Email para a empresa
    await resend.emails.send({
      from: "Contacto <comercial@globalsc.ao>", // depois troca pelo teu domínio
      to: ["comercial@globalsc.ao"], // <- IMPORTANTE
      subject: `Novo contacto de ${name}`,
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
      
      <div style="background: #111827; color: #ffffff; padding: 20px;">
        <h2 style="margin: 0; font-size: 20px;">Novo Pedido de Contacto</h2>
      </div>

      <div style="padding: 24px; color: #111827;">
        <p style="margin-bottom: 20px;">
          Foi submetido um novo pedido de contacto através do website.
        </p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Nome:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Telefone:</td>
            <td style="padding: 8px 0;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Empresa:</td>
            <td style="padding: 8px 0;">${enterprise || "Não informado"}</td>
          </tr>
        </table>

        <div style="margin-top: 24px;">
          <p style="font-weight: bold; margin-bottom: 8px;">Mensagem:</p>
          <div style="background: #f9fafb; padding: 16px; border-radius: 6px; line-height: 1.5;">
            ${message}
          </div>
        </div>
      </div>

      <div style="background: #f3f4f6; padding: 16px; font-size: 12px; color: #6b7280; text-align: center;">
        Este email foi gerado automaticamente através do formulário de contacto do website.
      </div>

    </div>
  </div>

      `,
    });

    // 📩 Email de confirmação para o utilizador
    await resend.emails.send({
      from: "Global Services <comercial@globalsc.ao>",
      to: [email],
      subject: "Recebemos a sua mensagem",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
      
      <div style="background: #111827; color: #ffffff; padding: 20px;">
        <h2 style="margin: 0; font-size: 20px;">Confirmação de Contacto</h2>
      </div>

      <div style="padding: 24px; color: #111827;">
        <p style="margin-bottom: 16px;">
          Caro(a) ${name},
        </p>

        <p style="margin-bottom: 16px;">
          Confirmamos a receção da sua mensagem. A nossa equipa irá analisar o seu pedido e responder com a maior brevidade possível.
        </p>

        <div style="margin-top: 24px;">
          <p style="font-weight: bold; margin-bottom: 8px;">Resumo da sua submissão:</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Telefone:</td>
              <td style="padding: 8px 0;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Empresa:</td>
              <td style="padding: 8px 0;">${enterprise || "Não informado"}</td>
            </tr>
          </table>

          <div style="margin-top: 16px;">
            <p style="font-weight: bold; margin-bottom: 8px;">Mensagem:</p>
            <div style="background: #f9fafb; padding: 16px; border-radius: 6px; line-height: 1.5;">
              ${message}
            </div>
          </div>
        </div>

        <p style="margin-top: 24px;">
          Com os melhores cumprimentos,<br/>
          <strong>Global Services Corporation</strong>
        </p>
      </div>

      <div style="background: #f3f4f6; padding: 16px; font-size: 12px; color: #6b7280; text-align: center;">
        Caso não tenha solicitado este contacto, por favor ignore esta mensagem.
      </div>

    </div>
  </div>
`,
    });

    return NextResponse.json(
      { message: "Email enviado com sucesso!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao enviar email:", error);

    return NextResponse.json(
      {
        message: "Ocorreu um erro ao enviar a sua mensagem. Tente novamente.",
      },
      { status: 500 },
    );
  }
}

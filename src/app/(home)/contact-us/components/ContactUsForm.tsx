import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { api } from "@/app/api/config";
import { toast } from "react-toastify";
import { useState } from "react";

interface InputFields {
  fullname: string;
  email: string;
  phoneNumber: string;
  enterprise?: string;
  message: string;
}

export default function ContactUsForm() {
  const socialMedias = [
    {
      link: "https://www.facebook.com/p/Global-Services-Corporation-100094301594638/",
      icon: <Facebook />,
    },
    {
      link: "https://www.instagram.com/globalservicescorporation/",
      icon: <Instagram />,
    },
    {
      link: "https://ao.linkedin.com/company/global-service-corporations",
      icon: <Linkedin />,
    },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<InputFields>();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<InputFields> = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/contact", {
        name: data.fullname,
        email: data.email,
        phone: data.phoneNumber,
        enterprise: data.enterprise,
        message: data.message,
      });

      if (response.status === 201) {
        toast.success(
          "Obrigado por entrar em contacto, verifique a sua caixa de e-mail!",
        );
        reset();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 500) {
        toast.error(
          "Ocorreu um erro ao enviar a sua mensagem. Por favor, tente novamente mais tarde.",
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Ocorreu um erro ao enviar a sua mensagem. Por favor, tente novamente mais tarde.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-secondary p-16 max-lg:px-4 max-lg:py-8 lg:grid grid-cols-2 max-lg:flex flex-col  gap-6 z-10 text-main">
        <h1 className="text-main text-2xl font-semibold text-center max-lg:text-xl col-span-2">
          Formulário de contacto
        </h1>
        <div className="w-full">
          <label className="input-label">
            Nome completo
            <input
              {...register("fullname", {
                required: "Insira o seu nome completo",
                minLength: {
                  value: 3,
                  message: "O nome deve ter pelo menos 3 caracteres",
                },
              })}
              type="text"
              placeholder="ex.: Joel Silva"
              className="input-form"
            />
          </label>
          {errors.fullname && (
            <span className="text-red-500 text-sm">
              {errors.fullname.message}
            </span>
          )}
        </div>

        <div className="w-full">
          <label className="input-label">
            Email
            <input
              {...register("email", {
                required: "Insira o seu endereço de email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Insira um email válido",
                },
              })}
              type="email"
              placeholder="ex.: exemplo@email.com"
              className="input-form"
            />
          </label>
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="w-full">
          <label className="input-label">
            Contacto telefónico
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: "Insira o seu número de telefone",
                validate: (value) =>
                  value.replace(/\D/g, "").length >= 12 ||
                  "Número de telefone inválido",
              }}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  country={"ao"}
                  inputClass="!w-full !text-main !border-none !rounded-md !h-full !pl-14 !bg-white focus:!outline-none transition-all !placeholder:font-medium !bg-white !px-4 !py-5"
                  buttonClass="!border-none !bg-transparent !p-0 absolute left-3 top-[10px]"
                  dropdownClass="!bg-white !text-main !shadow-lg !rounded-lg"
                  placeholder="ex.: 923 456 789"
                />
              )}
            />
          </label>
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">
              {errors.phoneNumber.message}
            </span>
          )}
        </div>

        <div className="w-full">
          <label className="input-label">
            Empresa (opcional)
            <input
              {...register("enterprise", {
                maxLength: {
                  value: 100,
                  message: "O nome da empresa é demasiado longo",
                },
              })}
              type="text"
              placeholder="ex.: Empresa X"
              className="input-form"
            />
          </label>
          {errors.enterprise && (
            <span className="text-red-500 text-sm">
              {errors.enterprise.message}
            </span>
          )}
        </div>

        <div className="col-span-2">
          <label className="input-label">
            Mensagem
            <textarea
              {...register("message", {
                required: "Escreva a sua mensagem",
                minLength: {
                  value: 10,
                  message: "A mensagem deve ter pelo menos 10 caracteres",
                },
              })}
              rows={4}
              placeholder="Escreva a sua mensagem aqui..."
              className="input-form resize-none"
            />
          </label>
          {errors.message && (
            <span className="text-red-500 text-sm">
              {errors.message.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary cursor-pointer flex items-center justify-center gap-2">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Enviar mensagem"
          )}
        </button>

        <span className="flex items-center justify-end max-lg:justify-center gap-4 text-2xl max-lg:text-xl">
          {socialMedias.map((item, index) => (
            <Link
              key={index}
              target="_blank"
              href={item.link}>
              {item.icon}
            </Link>
          ))}
        </span>
      </form>
    </>
  );
}

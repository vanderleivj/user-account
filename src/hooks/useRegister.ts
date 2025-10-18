import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import { geocodeAddress, formatAddressForGeocoding } from "../lib/geocoding";

function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (parseInt(cpf.charAt(9)) !== digit1) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;

  return parseInt(cpf.charAt(10)) === digit2;
}

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Nome é obrigatório"),
    lastName: z.string().min(1, "Sobrenome é obrigatório"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        "Telefone deve ter pelo menos 10 dígitos"
      ),
    cpf: z
      .string()
      .min(1, "CPF é obrigatório")
      .min(11, "CPF deve ter 11 dígitos")
      .max(14, "CPF inválido")
      .refine((val) => {
        const cpf = val.replace(/\D/g, "");
        return cpf.length === 11 && isValidCPF(cpf);
      }, "CPF inválido"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Formato de email inválido"),
    age: z
      .string()
      .min(1, "Idade é obrigatória")
      .refine((val) => {
        const age = parseInt(val);
        return age >= 18 && age <= 120;
      }, "Idade deve ser entre 18 e 120 anos"),
    temFilhos: z.string().min(1, "Esta informação é obrigatória"),
    senha: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirmação de senha é obrigatória"),
    address: z.string().min(1, "Endereço é obrigatório"),
    complement: z.string().optional(),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
    zip_code: z.string().optional(),
    jaCasado: z.string().min(1, "Esta informação é obrigatória"),
    nulidadeMatrimonial: z.string().optional(),
    viveCastidade: z.string().min(1, "Esta informação é obrigatória"),
    is_catholic: z.string().min(1, "Esta informação é obrigatória"),
    gender: z.string().min(1, "Sexo é obrigatório"),
    concordaRegras: z.boolean().refine((val) => val === true, {
      message: "Você deve concordar com as regras para continuar",
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })
  .refine(
    (data) => {
      if (data.jaCasado === "Sim") {
        return (
          data.nulidadeMatrimonial !== undefined &&
          data.nulidadeMatrimonial !== ""
        );
      }
      return true;
    },
    {
      message: "Esta informação é obrigatória para quem já foi casado",
      path: ["nulidadeMatrimonial"],
    }
  );

type RegisterFormData = z.infer<typeof registerSchema>;

export function useRegister() {
  const [isSenhaVisible, setIsSenhaVisible] = useState(false);
  const [isConfirmarSenhaVisible, setIsConfirmarSenhaVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [showInactiveScreen, setShowInactiveScreen] = useState(false);
  const [inactiveReason, setInactiveReason] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      cpf: "",
      email: "",
      age: "",
      temFilhos: "",
      senha: "",
      confirmarSenha: "",
      address: "",
      complement: "",
      city: "",
      state: "",
      zip_code: "",
      jaCasado: "",
      nulidadeMatrimonial: "",
      viveCastidade: "",
      is_catholic: "",
      gender: "",
      concordaRegras: false,
    },
  });

  const jaCasado = watch("jaCasado");

  const registerInactiveUser = async (
    data: RegisterFormData,
    reason: string
  ) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          emailRedirectTo: undefined,
        },
      });

      if (authError) {
        console.error("❌ Erro no Supabase Auth:", authError);
        throw new Error(authError.message);
      }
      if (!authData.user) {
        console.error("❌ Usuário não criado no Auth");
        throw new Error("Erro ao criar usuário");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        email: data.email,
      });

      if (userError) {
        console.error("❌ Erro ao criar usuário na tabela users:", userError);
        throw new Error("Erro ao criar usuário: " + userError.message);
      }

      let geocodingResult = null;

      const hasAddressInfo = data.address && data.city && data.state;

      if (hasAddressInfo) {
        try {
          const fullAddress = formatAddressForGeocoding({
            street: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zip_code,
          });

          geocodingResult = await geocodeAddress(fullAddress);
        } catch (geocodingError: any) {
          console.warn(
            "⚠️ Erro no geocoding, continuando sem coordenadas:",
            geocodingError.message
          );
        }
      } else {
      }

      const profileData: any = {
        id: authData.user.id,
        address: data.address || null,
        complement: data.complement || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
        married_in_church: data.jaCasado === "Sim",
        marital_status:
          data.jaCasado === "Sim" ? data.nulidadeMatrimonial : null,
        lives_chastity: data.viveCastidade === "Sim",
        is_catholic: data.is_catholic === "Sim" || false,
        gender: data.gender,
        age: parseInt(data.age),
        has_children: data.temFilhos === "Sim",
      };

      if (geocodingResult?.latitude && geocodingResult?.longitude) {
        profileData.latitude = geocodingResult.latitude;
        profileData.longitude = geocodingResult.longitude;
      }

      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert(profileData);

      if (profileError) {
        console.error("❌ Erro ao criar perfil:", profileError);
        throw new Error("Erro ao criar perfil: " + profileError.message);
      }

      const { error } = await supabase.from("inactive_users").insert({
        email: data.email,
        cpf: data.cpf,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        reason: reason,
      });

      if (error) {
        console.error("❌ Erro ao registrar usuário inativo:", error);
        throw new Error("Erro ao registrar usuário inativo");
      }

      setInactiveReason(reason);
      setShowInactiveScreen(true);
    } catch (error) {
      console.error("❌ Erro ao registrar usuário inativo:", error);
      throw error;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setMessage("");

    try {
      if (data.jaCasado === "Sim" && data.nulidadeMatrimonial === "Não") {
        await registerInactiveUser(data, "Nulidade matrimonial não possui");
        setIsSubmitting(false);
        return;
      }

      if (data.is_catholic === "Não" || data.viveCastidade === "Não") {
        let reason = "";
        if (data.is_catholic === "Não" && data.viveCastidade === "Não") {
          reason =
            "Não é católico apostólico romano e não busca viver castidade";
        } else if (data.is_catholic === "Não") {
          reason = "Não é católico apostólico romano";
        } else if (data.viveCastidade === "Não") {
          reason = "Não busca viver a castidade";
        }

        await registerInactiveUser(data, reason);
        setIsSubmitting(false);
        return;
      }

      const { data: inactiveUser, error: inactiveUserError } = await supabase
        .from("inactive_users")
        .select("email, cpf")
        .or(`email.eq.${data.email},cpf.eq.${data.cpf}`)
        .single();

      if (inactiveUser && !inactiveUserError) {
        throw new Error(
          "Este email ou CPF já foi registrado anteriormente e não pode ser usado para novo cadastro."
        );
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: {
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
          emailRedirectTo: undefined,
        },
      });

      if (authError) {
        console.error("❌ Erro no Supabase Auth:", authError);
        throw new Error(authError.message);
      }
      if (!authData.user) {
        console.error("❌ Usuário não criado no Auth");
        throw new Error("Erro ao criar usuário");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (!user || getUserError) {
        console.error("❌ Erro ao verificar usuário:", getUserError);
        throw new Error("Por favor, confirme seu email antes de continuar");
      }

      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        email: data.email,
      });

      if (userError) {
        console.error("❌ Erro ao inserir na tabela users:", userError);
        throw new Error("Erro ao criar usuário: " + userError.message);
      }

      let geocodingResult = null;

      const hasAddressInfo = data.address && data.city && data.state;

      if (hasAddressInfo) {
        try {
          const fullAddress = formatAddressForGeocoding({
            street: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zip_code,
          });

          geocodingResult = await geocodeAddress(fullAddress);
        } catch (geocodingError: any) {
          console.warn(
            "⚠️ Erro no geocoding, continuando sem coordenadas:",
            geocodingError.message
          );
        }
      }

      const profileData: any = {
        id: authData.user.id,
        address: data.address || null,
        complement: data.complement || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
        married_in_church: data.jaCasado === "Sim",
        marital_status:
          data.jaCasado === "Sim" ? data.nulidadeMatrimonial : null,
        lives_chastity: data.viveCastidade === "Sim",
        is_catholic: data.is_catholic === "Sim" || false,
        gender: data.gender,
        age: parseInt(data.age),
        has_children: data.temFilhos === "Sim",
      };

      if (geocodingResult?.latitude && geocodingResult?.longitude) {
        profileData.latitude = geocodingResult.latitude;
        profileData.longitude = geocodingResult.longitude;
      }

      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert(profileData);

      if (profileError) {
        console.error(
          "❌ Erro ao inserir na tabela user_profiles:",
          profileError
        );
        throw new Error("Erro ao criar perfil: " + profileError.message);
      }

      setMessage(
        "Cadastro realizado com sucesso! Redirecionando para escolha de planos..."
      );
      setMessageType("success");

      setTimeout(() => {
        window.location.href = "/plans";
      }, 2000);
    } catch (error: any) {
      console.error("❌ Erro no cadastro:", error);
      setMessage(
        error?.message ||
          "Ocorreu um erro ao realizar seu cadastro. Por favor, tente novamente."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchAddressFromCEP = async (cep: string) => {
    if (cep && cep.replace(/\D/g, "").length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          setValue("address", data.logradouro || "");
          setValue("city", data.localidade || "");
          setValue("state", data.estado || "");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleBackToLogin = () => {
    setShowInactiveScreen(false);
    setInactiveReason("");
  };

  return {
    onSubmit,
    fetchAddressFromCEP,
    jaCasado,
    errors,
    control,
    handleSubmit,
    setIsConfirmarSenhaVisible,
    isConfirmarSenhaVisible,
    setIsSenhaVisible,
    isSenhaVisible,
    isLoadingCep,
    isSubmitting,
    message,
    messageType,
    showInactiveScreen,
    inactiveReason,
    handleBackToLogin,
  };
}

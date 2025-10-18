import React, { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import ScreenLayout from "./ScreenLayout";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const navigate = useNavigate();
  const search = useSearch({ strict: false });

  useEffect(() => {
    const checkHashParams = () => {
      const hashParams = new URLSearchParams(
        globalThis.location.hash.substring(1)
      );
      const typeFromHash = hashParams.get("type");
      const accessToken = hashParams.get("access_token");

      if (typeFromHash === "recovery" || accessToken) {
        setIsPasswordResetMode(true);
        verifyUserAuthentication();
      } else {
        setIsPasswordResetMode(false);
      }
    };

    checkHashParams();

    const handleHashChange = () => {
      checkHashParams();
    };

    globalThis.addEventListener("hashchange", handleHashChange);

    return () => {
      globalThis.removeEventListener("hashchange", handleHashChange);
    };
  }, [search]);

  const verifyUserAuthentication = async () => {
    setIsLoading(true);
    try {
      const hashParams = new URLSearchParams(
        globalThis.location.hash.substring(1)
      );
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");

      if (type === "recovery" && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        setMessage("Defina sua nova senha abaixo.");
        setMessageType("success");
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        setMessage("Defina sua nova senha abaixo.");
        setMessageType("success");
      } else {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          setMessage("Sessão expirada. Solicite um novo reset de senha.");
          setMessageType("error");
          setIsPasswordResetMode(false);
        } else {
          setMessage("Defina sua nova senha abaixo.");
          setMessageType("success");
        }
      }
    } catch (error) {
      setMessage("Erro ao verificar sessão. Tente novamente.");
      setMessageType("error");
      setIsPasswordResetMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (isPasswordResetMode) {
        await handlePasswordUpdate();
      } else {
        await handlePasswordResetRequest();
      }
    } catch (error: any) {
      setMessage(error.message || "Ocorreu um erro. Tente novamente.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${globalThis.location.origin}/#type=recovery`,
    });

    if (error) {
      throw error;
    }

    setMessage(
      "Instruções de redefinição de senha foram enviadas para seu email. Verifique sua caixa de entrada e spam."
    );
    setMessageType("success");
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      throw new Error("As senhas não coincidem.");
    }

    if (newPassword.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw error;
    }

    setMessage("Senha atualizada com sucesso! Volte para o aplicativo");
    setMessageType("success");

    setTimeout(() => {
      navigate({ to: "/" });
    }, 2000);
  };

  if (isLoading) {
    return (
      <ScreenLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 text-lg">Verificando sessão...</p>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Santo Encontro
        </h1>
        <p className="text-slate-600 text-lg font-light mb-6">
          Juntos na fé, unidos pelo amor
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-medium shadow-lg">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>
            {isPasswordResetMode ? "🔐 Nova Senha" : "🔑 Redefinir Senha"}
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{isPasswordResetMode ? "🔑" : "🔐"}</div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl mt-6 shadow-sm border ${
            messageType === "error"
              ? "bg-red-50/80 border-red-200/50 text-red-800"
              : "bg-emerald-50/80 border-emerald-200/50 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                messageType === "error" ? "bg-red-100" : "bg-emerald-100"
              }`}
            >
              <span className="text-sm">
                {messageType === "error" ? "⚠️" : "✅"}
              </span>
            </div>
            <span className="font-medium text-sm">{message}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {isPasswordResetMode ? (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nova Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={isNewPasswordVisible ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Digite sua nova senha"
                />
                <button
                  type="button"
                  onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {isNewPasswordVisible ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirmar Nova Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirme sua nova senha"
                />
                <button
                  type="button"
                  onClick={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {isConfirmPasswordVisible ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Digite seu email"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-slate-900 text-white rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isPasswordResetMode ? "Atualizando..." : "Enviando..."}
            </div>
          ) : isPasswordResetMode ? (
            "🔐 Atualizar Senha"
          ) : (
            "📧 Enviar Instruções"
          )}
        </button>
      </form>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate({ to: "/" })}
          className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
        >
          ← Voltar para Login
        </button>

        {!isPasswordResetMode && (
          <div className="text-slate-500 text-sm mt-4">
            💡 Dica: Verifique sua caixa de spam se não receber o email.
          </div>
        )}
      </div>
    </ScreenLayout>
  );
}

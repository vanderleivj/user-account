import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";

interface LoginModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onLoginSuccess: () => void;
  readonly userEmail?: string;
  readonly isManualTrigger?: boolean;
  readonly onInactiveUser?: (reason: string) => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  userEmail,
  isManualTrigger = false,
  onInactiveUser,
}: LoginModalProps) {
  const [email, setEmail] = useState(userEmail || "");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    } else if (isManualTrigger && isOpen) {
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [userEmail, isManualTrigger, isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) {
        throw authError;
      }

      if (data.user) {
        // Verificar se o usuário está na blacklist
        const { data: inactiveUser, error: inactiveUserError } = await supabase
          .from("inactive_users")
          .select("email, reason")
          .eq("email", email)
          .maybeSingle();

        if (inactiveUser && !inactiveUserError && inactiveUser.reason) {
          // Usuário está na blacklist
          if (onInactiveUser) {
            onInactiveUser(inactiveUser.reason);
          } else {
            setError(
              "Sua conta está inativa. Entre em contato conosco para mais informações."
            );
          }
          // Fazer logout para não manter a sessão ativa
          await supabase.auth.signOut();
          return;
        }

        // Usuário não está na blacklist, prosseguir com login
        onLoginSuccess();
      }
    } catch (err: any) {
      console.error("Erro ao fazer login:", err);
      setError(err.message || "Email ou senha incorretos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              {isManualTrigger ? "Fazer Login" : "Usuário já cadastrado"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-600 text-sm leading-relaxed">
            {isManualTrigger
              ? "Digite suas credenciais para acessar sua conta e continuar."
              : "Identificamos que este email já está cadastrado. Se você já possui uma conta, faça login para continuar."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mt-4 p-4 bg-red-50/80 border border-red-200/50 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-xs">⚠️</span>
              </div>
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 mt-6">
          <div className="space-y-2">
            <label
              htmlFor="modal-email"
              className="block text-sm font-medium text-slate-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="modal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
              disabled={isLoading || !!userEmail}
              className="w-full px-4 py-3 text-base rounded-full border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white/90 backdrop-blur-sm transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="modal-password"
              className="block text-sm font-medium text-slate-700"
            >
              Senha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="modal-password"
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 text-base rounded-full border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white/90 backdrop-blur-sm transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4 sm:justify-start">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-base font-medium rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-base font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

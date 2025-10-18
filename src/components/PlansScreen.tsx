import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import logo from "../assets/logo.png";
import { usePlans, type PlanConfig } from "../hooks/usePlans";
import { usePayment } from "../hooks/usePayment";
import ScreenLayout from "./ScreenLayout";

export default function PlansScreen() {
  const navigate = useNavigate();
  const {
    plans,
    loading: plansLoading,
    error: plansError,
    refetch,
  } = usePlans();
  const { handlePaymentWithStripe, loading: paymentLoading } = usePayment();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handlePayment = async (plan: PlanConfig) => {
    const result = await handlePaymentWithStripe(plan);

    if (result.success) {
      setMessage(result.message ?? "Sucesso!");
      setMessageType("success");

      if (plan.isFree) {
        setTimeout(() => {
          navigate({ to: "/" });
        }, 2000);
      } else if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } else {
      setMessage(result.error ?? "Erro no pagamento");
      setMessageType("error");
    }
  };

  const renderPlanCard = (plan: PlanConfig) => {
    const isPopular = plan.isPopular;
    const isFree = plan.isFree;

    const cardClassName = isPopular
      ? "bg-slate-900 text-white border-2 border-blue-500 ring-4 ring-blue-100 shadow-2xl scale-105"
      : "bg-white border border-slate-200 shadow-lg hover:shadow-xl";

    const getButtonClassName = () => {
      if (isPopular) {
        return "bg-white text-slate-900 hover:bg-slate-100";
      }
      if (isFree) {
        return "bg-blue-600 text-white hover:bg-blue-700";
      }
      return "bg-slate-900 text-white hover:bg-slate-800";
    };

    const getButtonText = () => {
      if (isFree) return "Ativar Plano Gratuito";
      if (isPopular) return "Gerenciar";
      return "Assinar Plano";
    };

    return (
      <div
        key={plan.id}
        className={`rounded-2xl p-8 relative transition-all duration-300 flex flex-col h-full ${cardClassName}`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              MAIS VENDIDO
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h3
            className={`text-2xl font-bold mb-3 ${
              isPopular ? "text-white" : "text-slate-900"
            }`}
          >
            {plan.name}
          </h3>
          <p
            className={`text-lg ${
              isPopular ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {plan.description}
          </p>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-end justify-center mb-2">
            <span
              className={`text-4xl font-bold ${
                isPopular ? "text-white" : "text-slate-900"
              }`}
            >
              R$
            </span>
            <span
              className={`text-6xl font-bold ml-2 ${
                isPopular ? "text-white" : "text-slate-900"
              }`}
            >
              {plan.price.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <p
            className={`text-lg ${
              isPopular ? "text-slate-300" : "text-slate-600"
            }`}
          >
            por mês
          </p>
        </div>

        <div className="space-y-4 mb-8 flex-grow">
          {plan.features.map((feature: string) => (
            <div key={feature} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" />
              </div>
              <span
                className={`text-base ${
                  isPopular ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => handlePayment(plan)}
            disabled={paymentLoading}
            className={`w-full py-4 px-6 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${getButtonClassName()}`}
          >
            {paymentLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </div>
            ) : (
              getButtonText()
            )}
          </button>

          {isFree && (
            <p className="text-center text-sm text-slate-500 mt-3">
              7 dias grátis
            </p>
          )}
          {isPopular && (
            <p className="text-center text-sm text-slate-300 mt-3">
              2 dias até expirar
            </p>
          )}
        </div>
      </div>
    );
  };

  if (plansLoading) {
    return (
      <ScreenLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 text-lg">Carregando planos...</p>
          {plansError && (
            <button
              onClick={refetch}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              Tentar novamente
            </button>
          )}
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <div className="text-center mb-12">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl blur-xl opacity-60"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
              <img
                src={logo}
                alt="Santo Encontro"
                className="h-20 w-20 object-contain"
              />
            </div>
          </div>
        </div>

        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          Santo Encontro
        </h1>
        <p className="text-slate-600 text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-8">
          Gerencie, acompanhe e otimize sua jornada espiritual com um plano
          feito para suas necessidades.
        </p>
      </div>

      {message && (
        <div
          className={`p-6 rounded-2xl mb-8 shadow-lg ${
            messageType === "error"
              ? "bg-red-50/80 border border-red-200/50 text-red-800"
              : "bg-emerald-50/80 border border-emerald-200/50 text-emerald-800"
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
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {plans.map((plan) => renderPlanCard(plan))}
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate({ to: "/registrar" })}
          className="px-8 py-3 bg-slate-500 text-white rounded-full hover:bg-slate-600 transition-colors font-medium"
        >
          Voltar ao Cadastro
        </button>
      </div>
    </ScreenLayout>
  );
}

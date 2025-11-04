import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  CreditCard,
  Receipt,
  Copy,
  CheckCircle2,
  Upload,
  FileImage,
} from "lucide-react";
import logo from "../assets/logo.png";
import { usePlans, type PlanConfig } from "../hooks/usePlans";
import { usePayment } from "../hooks/usePayment";
import { uploadPixProof } from "../lib/api/payments";
import { supabase } from "../lib/supabase";
import ScreenLayout from "./ScreenLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export type PaymentMethod = "boleto_card" | "pix";

interface PixData {
  paymentIntentId: string;
  qrCode: string;
  code: string;
  key: string;
  expiresAt: number;
  amount: number;
  currency: string;
}

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanConfig | null>(null);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePaymentClick = (plan: PlanConfig) => {
    if (plan.isFree) {
      handlePayment(plan);
    } else {
      setSelectedPlan(plan);
      setShowPaymentModal(true);
    }
  };

  const generateMockPixData = (plan: PlanConfig): PixData => {
    const expiresAt = Math.floor(Date.now() / 1000) + 30 * 60;

    const pixCode = `00020101021126810014BR.GOV.BCB.PIX2559pix-qr.mercadopago.com/instore/ol/v2/3Z8b2YH8xycGTxKS4KCwTb5204000053039865802BR592557.134.332 RAFAEL COSTA D6009SAO PAULO62080504mpis63047541`;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
      pixCode
    )}`;

    return {
      paymentIntentId: `pi_mock_${Date.now()}`,
      qrCode: qrCodeUrl,
      code: pixCode,
      key: "santoencontro.santidade@gmail.com",
      expiresAt: expiresAt,
      amount: plan.price,
      currency: "brl",
    };
  };

  const handlePayment = async (
    plan: PlanConfig,
    paymentMethod?: PaymentMethod
  ) => {
    setShowPaymentModal(false);

    if (paymentMethod === "pix") {
      const mockPixData = generateMockPixData(plan);
      setPixData(mockPixData);
      setMessage("Dados do PIX gerados com sucesso!");
      setMessageType("success");
      return;
    }

    const result = await handlePaymentWithStripe(
      plan,
      undefined,
      paymentMethod
    );

    if (result.success) {
      setMessage(result.message ?? "Sucesso!");
      setMessageType("success");

      if (plan.isFree) {
        setTimeout(() => {
          navigate({ to: "/" });
        }, 2000);
      } else if (result.checkoutUrl) {
        globalThis.window.location.href = result.checkoutUrl;
      }
    } else {
      setMessage(result.error ?? "Erro no pagamento");
      setMessageType("error");
    }
  };

  const handleCopyCode = async () => {
    if (pixData?.code) {
      try {
        await navigator.clipboard.writeText(pixData.code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } catch (err) {
        console.error("Erro ao copiar:", err);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setUserEmail(user.email || null);

          const { data: userProfile } = await supabase
            .from("users")
            .select("email")
            .eq("id", user.id)
            .single();

          if (userProfile?.email) {
            setUserEmail(userProfile.email);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!pixData?.expiresAt) return;

    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000);
      const expires = pixData.expiresAt;
      const remaining = expires - now;

      if (remaining <= 0) {
        setTimeRemaining("Expirado");
        return;
      }

      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [pixData?.expiresAt]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou PDF."
      );
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Arquivo muito grande. Tamanho máximo: 10MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || !pixData || !selectedPlan) {
      setUploadError("Selecione um arquivo");
      return;
    }

    if (!userId && !userEmail) {
      setUploadError("Usuário não identificado. Faça login novamente.");
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      await uploadPixProof(
        userId,
        userEmail,
        selectedPlan.id,
        pixData.amount,
        selectedFile
      );

      setUploaded(true);
      setMessage("Comprovante enviado com sucesso! Aguardando aprovação.");
      setMessageType("success");

      setTimeout(() => {
        navigate({ to: "/success", search: { paymentMethod: "pix" } });
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao enviar comprovante. Tente novamente.";
      setUploadError(errorMessage);
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setUploading(false);
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
            onClick={() => handlePaymentClick(plan)}
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

      <Dialog
        open={showPaymentModal}
        onOpenChange={(open) => !open && setShowPaymentModal(false)}
      >
        {selectedPlan && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-slate-600" size={20} />
                </div>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Escolha o método de pagamento
                </DialogTitle>
              </div>
              <DialogDescription className="text-slate-600 text-sm leading-relaxed">
                Selecione como deseja pagar o plano{" "}
                <span className="font-semibold">{selectedPlan.name}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-6">
              <button
                onClick={() => handlePayment(selectedPlan, "boleto_card")}
                disabled={paymentLoading}
                className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    Boleto ou Cartão
                  </div>
                  <div className="text-sm text-slate-600">
                    Pague com boleto bancário ou cartão de crédito
                  </div>
                </div>
              </button>

              <button
                onClick={() => handlePayment(selectedPlan, "pix")}
                disabled={paymentLoading}
                className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Receipt className="text-green-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">PIX</div>
                  <div className="text-sm text-slate-600">
                    Aprovação instantânea via PIX
                  </div>
                </div>
              </button>
            </div>

            {paymentLoading && (
              <div className="flex items-center justify-center gap-2 text-slate-600 mt-4">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Processando...
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>

      <Dialog
        open={!!pixData}
        onOpenChange={(open) => !open && setPixData(null)}
      >
        {pixData && (
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Receipt className="text-green-600" size={20} />
                </div>
                <DialogTitle className="text-3xl font-bold text-slate-900">
                  Pague com PIX
                </DialogTitle>
              </div>
              <DialogDescription className="text-slate-600 text-sm leading-relaxed">
                Escaneie o QR Code ou copie o código para pagar
              </DialogDescription>
            </DialogHeader>

            <div className="mb-6">
              <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-center mb-4">
                <img
                  src={pixData.qrCode}
                  alt="QR Code PIX"
                  className="w-64 h-64 object-contain"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="pix-code"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Código PIX (Copia e Cola)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="pix-code"
                      type="text"
                      readOnly
                      value={pixData.code}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleCopyCode}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                    >
                      {copiedCode ? (
                        <>
                          <CheckCircle2 size={18} />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={18} />
                          Copiar
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="pix-key"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Chave PIX
                  </label>
                  <div
                    id="pix-key"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900"
                  >
                    {pixData.key}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-900">
                      Valor a pagar
                    </span>
                    <span className="text-lg font-bold text-blue-900">
                      R$ {pixData.amount.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  {timeRemaining && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-700">Expira em</span>
                      <span className="text-sm font-semibold text-blue-900">
                        {timeRemaining}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Seção de Upload de Comprovante */}
            <div className="border-t border-slate-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Enviar Comprovante de Pagamento
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="proof-file"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Comprovante PIX
                  </label>
                  <div className="relative">
                    <input
                      id="proof-file"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      disabled={uploading || uploaded}
                      className="hidden"
                    />
                    <label
                      htmlFor="proof-file"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        uploading || uploaded
                          ? "bg-slate-100 border-slate-300 cursor-not-allowed"
                          : "bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-green-500"
                      }`}
                    >
                      {selectedFile ? (
                        <div className="flex items-center gap-3 p-3">
                          <FileImage className="text-green-600" size={24} />
                          <div className="text-left">
                            <p className="text-sm font-medium text-slate-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="text-slate-400" size={32} />
                          <div className="text-center">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold text-green-600">
                                Clique para enviar
                              </span>{" "}
                              ou arraste o arquivo
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              JPG, PNG, WEBP ou PDF (máx. 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {selectedFile && selectedFile.type.startsWith("image/") && (
                    <div className="mt-3">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="max-w-full max-h-48 rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    ⚠️ {uploadError}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading || uploaded}
                  className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(() => {
                    if (uploading) {
                      return (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      );
                    }
                    if (uploaded) {
                      return (
                        <>
                          <CheckCircle2 size={20} />
                          Enviado com sucesso!
                        </>
                      );
                    }
                    return (
                      <>
                        <Upload size={20} />
                        Enviar Comprovante
                      </>
                    );
                  })()}
                </button>

                {uploaded && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="text-green-600 flex-shrink-0 mt-0.5"
                        size={20}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900 mb-1">
                          Comprovante enviado com sucesso!
                        </p>
                        <p className="text-xs text-green-700">
                          Aguardando aprovação. Você será notificado quando o
                          pagamento for confirmado.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Após o pagamento, envie o
                comprovante acima. Sua assinatura será ativada assim que o
                pagamento for aprovado.
              </p>
            </div>

            <button
              onClick={() => {
                setPixData(null);
                setSelectedFile(null);
                setUploaded(false);
                setUploadError(null);
              }}
              className="w-full py-3 px-6 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
            >
              Fechar
            </button>
          </DialogContent>
        )}
      </Dialog>
    </ScreenLayout>
  );
}

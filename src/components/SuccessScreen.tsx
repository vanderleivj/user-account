import { useSearch } from "@tanstack/react-router";
import ScreenLayout from "./ScreenLayout";
import logo from "../assets/logo.png";

export default function SuccessScreen() {
  const search = useSearch({ strict: false });
  const isPixPayment = (search as any)?.paymentMethod === "pix";

  return (
    <ScreenLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="Santo Encontro"
              className="h-24 w-24 object-contain drop-shadow-xl"
            />
          </div>
          <h1 className="santo-text-gradient text-5xl font-bold mb-3 tracking-tight">
            Santo Encontro
          </h1>
          <p className="text-gray-600 italic mb-6 text-xl font-light">
            Juntos na fé, unidos pelo amor
          </p>
        </div>

        <div
          className={`border rounded-2xl p-8 max-w-md ${
            isPixPayment
              ? "bg-yellow-50 border-yellow-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="text-center">
            <div
              className={`text-6xl mb-4 ${
                isPixPayment ? "text-yellow-500" : "text-green-500"
              }`}
            >
              {isPixPayment ? "⏳" : "✅"}
            </div>
            <h2
              className={`text-2xl font-bold mb-2 ${
                isPixPayment ? "text-yellow-700" : "text-green-700"
              }`}
            >
              {isPixPayment ? "Comprovante Recebido!" : "Pagamento Realizado!"}
            </h2>
            <p
              className={`mb-6 ${
                isPixPayment ? "text-yellow-700" : "text-green-600"
              }`}
            >
              {isPixPayment
                ? "Estamos validando seu pagamento PIX. Quando estiver aprovado, você poderá fazer login e acessar o aplicativo."
                : "Seu pagamento foi processado com sucesso."}
            </p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Baixe nosso aplicativo:
              </h3>

              <div className="flex flex-col gap-3">
                {/* <a
                  href="https://apps.apple.com/app/santo-encontro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Baixar na App Store
                </a> */}

                <a
                  href="https://play.google.com/store/apps/details?id=com.santo.encontro&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  Baixar no Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}

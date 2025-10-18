import logo from "../assets/logo.png";

interface InactiveUserScreenProps {
  readonly reason: string;
  readonly onBackToLogin: () => void;
}

export default function InactiveUserScreen({
  reason,
}: InactiveUserScreenProps) {
  const getReasonMessage = (reason: string) => {
    switch (reason) {
      case "Nulidade matrimonial não possui":
        return {
          title: "Nulidade Matrimonial Necessária",
          message:
            "Para participar do Santo Encontro, é necessário ter o processo de nulidade matrimonial concluído pela Igreja Católica. Entre em contato com a Secretaria Paroquial da sua paróquia ou converse diretamente com o seu pároco para iniciar o processo.",
        };
      case "Não é católico apostólico romano":
        return {
          title: "Participação Restrita",
          message:
            "O Santo Encontro é exclusivamente para católicos apostólicos romanos que buscam viver um namoro casto. Conheça mais sobre a fé católica e considere fazer o processo de conversão.",
        };
      case "Não busca viver a castidade":
        return {
          title: "Valores do Santo Encontro",
          message:
            "O Santo Encontro é para pessoas que buscam viver a castidade e formar relacionamentos santos. Reflita sobre os valores do namoro católico e os ensinamentos da Igreja sobre castidade.",
        };
      case "Não é católico apostólico romano e não busca viver castidade":
        return {
          title: "Critérios de Participação",
          message:
            "O Santo Encontro é exclusivamente para católicos apostólicos romanos que buscam viver um namoro casto. Conheça mais sobre a fé católica e reflita sobre os valores do namoro católico.",
        };
      default:
        return {
          title: "Cadastro Não Aprovado",
          message:
            "Seu cadastro não pôde ser aprovado no momento. Entre em contato conosco para mais informações.",
        };
    }
  };

  const reasonInfo = getReasonMessage(reason);

  return (
    <div className="min-h-screen santo-gradient flex items-center justify-center p-5">
      <div className="glass-card rounded-3xl p-6 sm:p-12 max-w-4xl w-full shadow-2xl">
        {/* Header elegante */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <img
                src={logo}
                alt="Santo Encontro"
                className="h-16 w-16 sm:h-24 sm:w-24 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 rounded-full blur-xl sm:blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-orange-300 to-red-400 rounded-full blur-lg opacity-20"></div>
            </div>
          </div>
          <h1 className="santo-text-gradient text-3xl sm:text-5xl font-bold mb-3 sm:mb-4 tracking-tight">
            Santo Encontro
          </h1>
          <p className="text-gray-600 italic mb-6 sm:mb-8 text-lg sm:text-xl font-light">
            Juntos na fé, unidos pelo amor
          </p>
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <span className="text-lg sm:text-xl">⏸️</span>
            <span className="hidden sm:inline">
              Conta Temporariamente Inativa
            </span>
            <span className="sm:hidden">Conta Inativa</span>
          </div>
        </div>

        {/* Ícone central */}
        <div className="relative mb-8 sm:mb-12">
          <div className="text-6xl sm:text-9xl mb-4 sm:mb-6 animate-pulse">
            ⏳
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 rounded-full blur-2xl sm:blur-3xl opacity-25"></div>
          <div className="absolute inset-2 sm:inset-4 bg-gradient-to-r from-orange-300 to-red-400 rounded-full blur-lg sm:blur-xl opacity-15"></div>
        </div>

        {/* Título da situação */}
        <h2 className="text-orange-600 text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 tracking-tight text-center">
          {reasonInfo.title}
        </h2>

        {/* Mensagem explicativa */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-3xl p-8 sm:p-12 mb-8 shadow-lg">
          <p className="text-gray-700 leading-relaxed text-lg sm:text-xl text-center max-w-3xl mx-auto">
            {reasonInfo.message}
          </p>
        </div>

        {/* Informação adicional */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            <span className="font-semibold">💡 Dica:</span> Após resolver a
            situação, entre em contato conosco para reativar sua conta.
          </p>
        </div>
      </div>
    </div>
  );
}

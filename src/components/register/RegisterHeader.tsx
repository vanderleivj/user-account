import logo from "../../assets/logo.png";

export function RegisterHeader() {
  return (
    <div className="text-center mb-6 lg:mb-8">
      <div className="flex justify-center mb-4 lg:mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl blur-xl opacity-60"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-xl border border-white/50">
            <img
              src={logo}
              alt="Santo Encontro"
              className="h-16 w-16 lg:h-20 lg:w-20 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
          Santo Encontro
        </h1>
        <div className="w-20 h-0.5 lg:w-24 lg:h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        <p className="text-slate-600 text-base lg:text-lg font-light max-w-md mx-auto leading-relaxed">
          Juntos na fé, unidos pelo amor
        </p>
      </div>

      <div className="mt-4 lg:mt-6 inline-flex items-center gap-2 lg:gap-3 bg-slate-900 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-xl lg:rounded-2xl text-sm lg:text-base font-medium shadow-lg">
        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-400 rounded-full"></div>
        <span>Cadastro de Usuário</span>
      </div>
    </div>
  );
}

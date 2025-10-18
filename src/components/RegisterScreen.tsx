import { Controller } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import { useRegister } from "../hooks/useRegister";
import { statesList } from "../utils/states-list";
import { FormattedCEPInput } from "../components/FormattedCEPInput";
import { FormattedPhoneInput } from "../components/FormattedPhoneInput";
import { FormattedCPFInput } from "../components/FormattedCPFInput";
import InactiveUserScreen from "./InactiveUserScreen";
import ScreenLayout from "./ScreenLayout";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const {
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
    // handleBackToLogin, // Não usado mais com router
  } = useRegister();

  // Helper function para classes de input
  const getInputClasses = (fieldError: any, isLoading: boolean = false) => {
    if (isLoading) {
      return "bg-slate-100/80 border-slate-200";
    }
    if (fieldError) {
      return "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white/80 backdrop-blur-sm";
    }
    return "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white/80 backdrop-blur-sm";
  };

  // Mostrar tela de usuário inativo se necessário
  if (showInactiveScreen) {
    return (
      <InactiveUserScreen
        reason={inactiveReason}
        onBackToLogin={() => navigate({ to: "/" })}
      />
    );
  }

  return (
    <ScreenLayout>
      {/* Header Premium */}
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

      {/* Mensagem de status */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 shadow-sm border ${
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 lg:space-y-8"
      >
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0 space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <h3 className="text-slate-900 font-semibold text-lg">
                Dados Pessoais
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Nome <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      id="firstName"
                      placeholder="Nome"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.firstName
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      }`}
                    />
                  )}
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Sobrenome <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      id="lastName"
                      placeholder="Sobrenome"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.lastName
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      }`}
                    />
                  )}
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <FormattedPhoneInput control={control} errors={errors} />
            </div>

            <div className="mt-4">
              <FormattedCPFInput control={control} errors={errors} />
            </div>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    }`}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <fieldset>
                <legend className="block text-sm font-medium text-slate-700">
                  Sexo <span className="text-red-500">*</span>
                </legend>
                <Controller
                  control={control}
                  name="gender"
                  render={({ field: { onChange, value } }) => (
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="male"
                          checked={value === "male"}
                          onChange={onChange}
                          className="w-4 h-4 text-slate-600"
                        />
                        <span className="text-slate-700 font-medium">
                          Masculino
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="female"
                          checked={value === "female"}
                          onChange={onChange}
                          className="w-4 h-4 text-slate-600"
                        />
                        <span className="text-slate-700 font-medium">
                          Feminino
                        </span>
                      </label>
                    </div>
                  )}
                />
              </fieldset>
              {errors.gender && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="age"
                className="block text-sm font-medium text-slate-700"
              >
                Idade <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    id="age"
                    type="number"
                    placeholder="Sua idade"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    min="18"
                    max="120"
                    className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      errors.age
                        ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    }`}
                  />
                )}
              />
              {errors.age && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
              <p className="text-slate-500 text-sm">
                Deve ser maior de 18 anos
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <fieldset>
                <legend className="block text-sm font-medium text-slate-700">
                  Tem filhos? <span className="text-red-500">*</span>
                </legend>
                <Controller
                  control={control}
                  name="temFilhos"
                  render={({ field: { onChange, value } }) => (
                    <div className="flex gap-6 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="Sim"
                          checked={value === "Sim"}
                          onChange={onChange}
                          className="w-4 h-4 text-slate-600"
                        />
                        <span className="text-slate-700 font-medium">Sim</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="Não"
                          checked={value === "Não"}
                          onChange={onChange}
                          className="w-4 h-4 text-slate-600"
                        />
                        <span className="text-slate-700 font-medium">Não</span>
                      </label>
                    </div>
                  )}
                />
              </fieldset>
              {errors.temFilhos && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.temFilhos.message}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-slate-700"
              >
                Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  control={control}
                  name="senha"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      id="senha"
                      type={isSenhaVisible ? "text" : "password"}
                      placeholder="Sua senha"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full px-4 py-3 pr-12 text-base rounded-full border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.senha
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      }`}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setIsSenhaVisible(!isSenhaVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {isSenhaVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.senha.message}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="confirmarSenha"
                className="block text-sm font-medium text-slate-700"
              >
                Confirmar Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Controller
                  control={control}
                  name="confirmarSenha"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      id="confirmarSenha"
                      type={isConfirmarSenhaVisible ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      className={`w-full px-4 py-3 pr-12 text-base rounded-full border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                        errors.confirmarSenha
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      }`}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() =>
                    setIsConfirmarSenhaVisible(!isConfirmarSenhaVisible)
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {isConfirmarSenhaVisible ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.confirmarSenha.message}
                </p>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-lg">🏠</span>
              </div>
              <h3 className="text-slate-900 font-semibold text-lg">Endereço</h3>
            </div>

            <div className="mt-4">
              <FormattedCEPInput
                control={control}
                errors={errors}
                fetchAddress={fetchAddressFromCEP}
                isLoadingCep={isLoadingCep}
              />
            </div>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-700"
              >
                Endereço <span className="text-red-500">*</span>
              </label>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    id="address"
                    placeholder="Rua, número"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={isLoadingCep}
                    className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 ${getInputClasses(
                      errors.address,
                      isLoadingCep
                    )}`}
                  />
                )}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="complement"
                className="block text-sm font-medium text-slate-700"
              >
                Complemento
              </label>
              <Controller
                control={control}
                name="complement"
                render={({ field: { onChange, onBlur, value } }) => (
                  <input
                    id="complement"
                    placeholder="Apartamento, bloco, etc."
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={isLoadingCep}
                    className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 ${
                      isLoadingCep
                        ? "bg-slate-100/80 border-slate-200"
                        : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white/80 backdrop-blur-sm"
                    }`}
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-slate-700"
                >
                  Cidade <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      id="city"
                      placeholder="Cidade"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      disabled={isLoadingCep}
                      className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 ${getInputClasses(
                        errors.city,
                        isLoadingCep
                      )}`}
                    />
                  )}
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-slate-700"
                >
                  Estado <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="state"
                  render={({ field: { onChange, value } }) => (
                    <select
                      id="state"
                      value={value}
                      onChange={onChange}
                      disabled={isLoadingCep}
                      className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 ${getInputClasses(
                        errors.state,
                        isLoadingCep
                      )}`}
                    >
                      <option value="">Selecione o estado</option>
                      {statesList.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.state && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informações Religiosas */}
        <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">⛪</span>
            </div>
            <h3 className="text-slate-900 font-semibold text-lg">
              Informações Religiosas
            </h3>
          </div>

          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
            <div className="space-y-6">
              <div className="space-y-3">
                <fieldset>
                  <legend className="block text-sm font-medium text-slate-700">
                    Já foi casado? <span className="text-red-500">*</span>
                  </legend>
                  <Controller
                    control={control}
                    name="jaCasado"
                    render={({ field: { onChange, value } }) => (
                      <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Sim"
                            checked={value === "Sim"}
                            onChange={onChange}
                            className="w-4 h-4 text-slate-600"
                          />
                          <span className="text-slate-700 font-medium">
                            Sim
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Não"
                            checked={value === "Não"}
                            onChange={onChange}
                            className="w-4 h-4 text-slate-600"
                          />
                          <span className="text-slate-700 font-medium">
                            Não
                          </span>
                        </label>
                      </div>
                    )}
                  />
                </fieldset>
                {errors.jaCasado && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.jaCasado.message}
                  </p>
                )}
              </div>

              {jaCasado === "Sim" && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">
                    Se sim, tem o processo de nulidade matrimonial?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Nulidade matrimonial é quando um casamento é declarado
                    inválido pela Igreja Católica, mesmo tendo sido realizada a
                    cerimônia religiosa.
                  </p>
                  <Controller
                    control={control}
                    name="nulidadeMatrimonial"
                    render={({ field: { onChange, value } }) => (
                      <div className="flex gap-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            value="Sim"
                            checked={value === "Sim"}
                            onChange={onChange}
                            className="w-4 h-4 text-slate-600"
                          />
                          <span className="text-slate-700 font-medium">
                            Sim
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            value="Não"
                            checked={value === "Não"}
                            onChange={onChange}
                            className="w-4 h-4 text-slate-600"
                          />
                          <span className="text-slate-700 font-medium">
                            Não
                          </span>
                        </label>
                      </div>
                    )}
                  />
                  {errors.nulidadeMatrimonial && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.nulidadeMatrimonial.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <fieldset>
                  <legend className="block text-sm font-medium text-slate-700">
                    Busca viver a castidade?{" "}
                    <span className="text-red-500">*</span>
                  </legend>
                  <Controller
                    control={control}
                    name="viveCastidade"
                    render={({ field: { onChange, value } }) => (
                      <div className="flex gap-6 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Sim"
                            checked={value === "Sim"}
                            onChange={onChange}
                            className="w-4 h-4 text-slate-600"
                          />
                          <span className="text-slate-700 font-medium">
                            Sim
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="Não"
                            checked={value === "Não"}
                            onChange={onChange}
                            className="w-4 h-4 text-slate-600"
                          />
                          <span className="text-slate-700 font-medium">
                            Não
                          </span>
                        </label>
                      </div>
                    )}
                  />
                </fieldset>
                {errors.viveCastidade && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.viveCastidade.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  É católico apostólico romano?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="is_catholic"
                  render={({ field: { onChange, value } }) => (
                    <div className="flex gap-8">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          value="Sim"
                          checked={value === "Sim"}
                          onChange={onChange}
                          className="w-4 h-4 text-slate-600"
                        />
                        <span className="text-slate-700 font-medium">Sim</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          value="Não"
                          checked={value === "Não"}
                          onChange={onChange}
                          className="w-4 h-4 text-slate-600"
                        />
                        <span className="text-slate-700 font-medium">Não</span>
                      </label>
                    </div>
                  )}
                />
                {errors.is_catholic && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.is_catholic.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Termos e Condições */}
        <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
          <div className="space-y-3">
            <Controller
              control={control}
              name="concordaRegras"
              render={({ field: { onChange, value } }) => (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={onChange}
                    className="w-4 h-4 text-slate-600 mt-1 rounded"
                  />
                  <span className="text-sm text-slate-700 leading-relaxed">
                    Estou ciente que o Santo Encontro é para católicos,
                    solteiros, maiores de idade que buscam viver um namoro
                    casto. Que o não cumprimento de algumas das condições
                    citadas acima, desrespeitar outros integrantes, apresentar
                    falsas informações implicarão na minha exclusão do projeto
                    sem direito a reembolso. Que sou, exclusivamente responsável
                    por qualquer eventual problema que possa acontecer comigo ao
                    conhecer uma nova pessoa no Santo Encontro.
                  </span>
                </label>
              )}
            />
            {errors.concordaRegras && (
              <p className="text-red-600 text-sm mt-1">
                {errors.concordaRegras.message}
              </p>
            )}
          </div>
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          className="w-full py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-slate-900 text-white hover:bg-slate-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processando...
            </div>
          ) : (
            "Escolher Plano"
          )}
        </button>
      </form>
    </ScreenLayout>
  );
}

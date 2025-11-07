import { useNavigate } from "@tanstack/react-router";
import { useRegister } from "../hooks/useRegister";
import InactiveUserScreen from "./InactiveUserScreen";
import ScreenLayout from "./ScreenLayout";
import { RegisterHeader } from "./register/RegisterHeader";
import { PersonalDataSection } from "./register/PersonalDataSection";
import { AddressSection } from "./register/AddressSection";
import { ReligiousInfoSection } from "./register/ReligiousInfoSection";
import { TermsSection } from "./register/TermsSection";
import { LoginModal } from "./register/LoginModal";

export default function RegisterScreen() {
  const navigate = useNavigate();
  const {
    onSubmit,
    fetchAddressFromCEP,
    jaCasado,
    isViuvo,
    errors,
    control,
    handleSubmit,
    setIsConfirmarSenhaVisible,
    isConfirmarSenhaVisible,
    setIsSenhaVisible,
    isSenhaVisible,
    isLoadingCep,
    isSubmitting,
    showInactiveScreen,
    inactiveReason,
    showLoginModal,
    setShowLoginModal,
    existingUserEmail,
  } = useRegister();

  const handleLoginSuccess = () => {
    navigate({ to: "/plans" });
  };

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
      <RegisterHeader />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 lg:space-y-8"
      >
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0 space-y-6">
          <PersonalDataSection
            control={control}
            errors={errors}
            isSenhaVisible={isSenhaVisible}
            setIsSenhaVisible={setIsSenhaVisible}
            isConfirmarSenhaVisible={isConfirmarSenhaVisible}
            setIsConfirmarSenhaVisible={setIsConfirmarSenhaVisible}
          />

          <AddressSection
            control={control}
            errors={errors}
            fetchAddressFromCEP={fetchAddressFromCEP}
            isLoadingCep={isLoadingCep}
          />
        </div>

        <ReligiousInfoSection
          control={control}
          errors={errors}
          jaCasado={jaCasado}
          isViuvo={isViuvo}
        />

        <TermsSection control={control} errors={errors} />

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

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        userEmail={existingUserEmail}
      />
    </ScreenLayout>
  );
}

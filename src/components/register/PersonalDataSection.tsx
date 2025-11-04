import type { Control, FieldErrors } from "react-hook-form";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { RadioGroup } from "./RadioGroup";
import { FormattedPhoneInput } from "../FormattedPhoneInput";
import { FormattedCPFInput } from "../FormattedCPFInput";

interface PersonalDataSectionProps {
  readonly control: Control<any>;
  readonly errors: FieldErrors<any>;
  readonly isSenhaVisible: boolean;
  readonly setIsSenhaVisible: (visible: boolean) => void;
  readonly isConfirmarSenhaVisible: boolean;
  readonly setIsConfirmarSenhaVisible: (visible: boolean) => void;
}

export function PersonalDataSection({
  control,
  errors,
  isSenhaVisible,
  setIsSenhaVisible,
  isConfirmarSenhaVisible,
  setIsConfirmarSenhaVisible,
}: PersonalDataSectionProps) {
  const getInputClasses = (fieldError: any) => {
    if (fieldError) {
      return "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white/80 backdrop-blur-sm";
    }
    return "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white/80 backdrop-blur-sm";
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
        <h3 className="text-slate-900 font-semibold text-lg">Dados Pessoais</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="firstName"
          label="Nome"
          placeholder="Nome"
          errors={errors}
          required
          getInputClasses={getInputClasses}
        />

        <FormInput
          control={control}
          name="lastName"
          label="Sobrenome"
          placeholder="Sobrenome"
          errors={errors}
          required
          getInputClasses={getInputClasses}
        />
      </div>

      <div className="mt-4">
        <FormattedPhoneInput control={control} errors={errors} />
      </div>

      <div className="mt-4">
        <FormattedCPFInput control={control} errors={errors} />
      </div>

      <div className="mt-4">
        <FormInput
          control={control}
          name="email"
          label="Email"
          type="email"
          placeholder="seu.email@exemplo.com"
          errors={errors}
          required
          getInputClasses={getInputClasses}
        />
      </div>

      <div className="mt-4">
        <RadioGroup
          control={control}
          name="gender"
          label="Sexo"
          options={[
            { value: "male", label: "Masculino" },
            { value: "female", label: "Feminino" },
          ]}
          errors={errors}
          required
          legend
        />
      </div>

      <div className="mt-4">
        <FormInput
          control={control}
          name="age"
          label="Idade"
          type="number"
          placeholder="Sua idade"
          errors={errors}
          required
          min="18"
          max="120"
          helperText="Deve ser maior de 18 anos"
          getInputClasses={getInputClasses}
        />
      </div>

      <div className="mt-4">
        <RadioGroup
          control={control}
          name="temFilhos"
          label="Tem filhos?"
          options={[
            { value: "Sim", label: "Sim" },
            { value: "Não", label: "Não" },
          ]}
          errors={errors}
          required
          legend
        />
      </div>

      <div className="mt-4">
        <PasswordInput
          control={control}
          name="senha"
          label="Senha"
          placeholder="Sua senha"
          errors={errors}
          isVisible={isSenhaVisible}
          onToggleVisibility={() => setIsSenhaVisible(!isSenhaVisible)}
        />
      </div>

      <div className="mt-4">
        <PasswordInput
          control={control}
          name="confirmarSenha"
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          errors={errors}
          isVisible={isConfirmarSenhaVisible}
          onToggleVisibility={() =>
            setIsConfirmarSenhaVisible(!isConfirmarSenhaVisible)
          }
        />
      </div>
    </div>
  );
}

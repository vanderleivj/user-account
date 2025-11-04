import type { Control, FieldErrors } from "react-hook-form";
import { RadioGroup } from "./RadioGroup";

interface ReligiousInfoSectionProps {
  readonly control: Control<any>;
  readonly errors: FieldErrors<any>;
  readonly jaCasado: string;
}

export function ReligiousInfoSection({
  control,
  errors,
  jaCasado,
}: ReligiousInfoSectionProps) {
  return (
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
          <RadioGroup
            control={control}
            name="jaCasado"
            label="Já foi casado?"
            options={[
              { value: "Sim", label: "Sim" },
              { value: "Não", label: "Não" },
            ]}
            errors={errors}
            required
            legend
          />

          {jaCasado === "Sim" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Se sim, tem o processo de nulidade matrimonial?{" "}
                <span className="text-red-500">*</span>
              </label>
              <p className="text-slate-500 text-sm leading-relaxed">
                Nulidade matrimonial é quando um casamento é declarado inválido
                pela Igreja Católica, mesmo tendo sido realizada a cerimônia
                religiosa.
              </p>
              <RadioGroup
                control={control}
                name="nulidadeMatrimonial"
                label=""
                options={[
                  { value: "Sim", label: "Sim" },
                  { value: "Não", label: "Não" },
                ]}
                errors={errors}
              />
            </div>
          )}

          <RadioGroup
            control={control}
            name="viveCastidade"
            label="Busca viver a castidade?"
            options={[
              { value: "Sim", label: "Sim" },
              { value: "Não", label: "Não" },
            ]}
            errors={errors}
            required
            legend
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              É católico apostólico romano?{" "}
              <span className="text-red-500">*</span>
            </label>
            <RadioGroup
              control={control}
              name="is_catholic"
              label=""
              options={[
                { value: "Sim", label: "Sim" },
                { value: "Não", label: "Não" },
              ]}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

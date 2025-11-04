import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

interface TermsSectionProps {
  readonly control: Control<any>;
  readonly errors: FieldErrors<any>;
}

export function TermsSection({ control, errors }: TermsSectionProps) {
  return (
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
                Estou ciente que o Santo Encontro é para católicos, solteiros,
                maiores de idade que buscam viver um namoro casto. Que o não
                cumprimento de algumas das condições citadas acima, desrespeitar
                outros integrantes, apresentar falsas informações implicarão na
                minha exclusão do projeto sem direito a reembolso. Que sou,
                exclusivamente responsável por qualquer eventual problema que
                possa acontecer comigo ao conhecer uma nova pessoa no Santo
                Encontro.
              </span>
            </label>
          )}
        />
        {errors.concordaRegras && (
          <p className="text-red-600 text-sm mt-1">
            {errors.concordaRegras.message as string}
          </p>
        )}
      </div>
    </div>
  );
}

import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { FormInput } from "./FormInput";
import { FormattedCEPInput } from "../FormattedCEPInput";
import { statesList } from "../../utils/states-list";

interface AddressSectionProps {
  readonly control: Control<any>;
  readonly errors: FieldErrors<any>;
  readonly fetchAddressFromCEP: (cep: string) => Promise<void>;
  readonly isLoadingCep: boolean;
}

export function AddressSection({
  control,
  errors,
  fetchAddressFromCEP,
  isLoadingCep,
}: AddressSectionProps) {
  const getInputClasses = (fieldError: any, isLoading: boolean = false) => {
    if (isLoading) {
      return "bg-slate-100/80 border-slate-200";
    }
    if (fieldError) {
      return "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white/80 backdrop-blur-sm";
    }
    return "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white/80 backdrop-blur-sm";
  };

  return (
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

      <div className="mt-4">
        <FormInput
          control={control}
          name="address"
          label="Endereço"
          placeholder="Rua, número"
          errors={errors}
          required
          disabled={isLoadingCep}
          getInputClasses={getInputClasses}
          isLoading={isLoadingCep}
        />
      </div>

      <div className="mt-4">
        <FormInput
          control={control}
          name="complement"
          label="Complemento"
          placeholder="Apartamento, bloco, etc."
          errors={errors}
          disabled={isLoadingCep}
          getInputClasses={getInputClasses}
          isLoading={isLoadingCep}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <FormInput
          control={control}
          name="city"
          label="Cidade"
          placeholder="Cidade"
          errors={errors}
          required
          disabled={isLoadingCep}
          getInputClasses={getInputClasses}
          isLoading={isLoadingCep}
        />

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
              {errors.state.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

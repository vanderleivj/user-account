import type { Control, FieldErrors } from "react-hook-form";

interface FormattedCPFInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export const FormattedCPFInput = ({
  control,
  errors,
}: FormattedCPFInputProps) => {
  return (
    <div className="space-y-3">
      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
        CPF <span className="text-red-500">*</span>
      </label>
      <input
        id="cpf"
        {...control.register("cpf")}
        placeholder="000.000.000-00"
        maxLength={14}
        onChange={(e) => {
          const text = e.target.value;
          const formatted = text
            .replace(/\D/g, "")
            .replace(/^(\d{3})(\d)/g, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/g, "$1.$2.$3")
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/g, "$1.$2.$3-$4")
            .substring(0, 14);
          e.target.value = formatted;
        }}
        className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 bg-white shadow-sm ${
          errors.cpf
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {errors.cpf && (
        <p className="text-red-600 text-sm mt-1">
          {typeof errors.cpf.message === "string"
            ? errors.cpf.message
            : "CPF inválido"}
        </p>
      )}
    </div>
  );
};

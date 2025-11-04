import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  readonly control: Control<any>;
  readonly name: string;
  readonly label: string;
  readonly placeholder?: string;
  readonly errors: FieldErrors<any>;
  readonly isVisible: boolean;
  readonly onToggleVisibility: () => void;
}

export function PasswordInput({
  control,
  name,
  label,
  placeholder,
  errors,
  isVisible,
  onToggleVisibility,
}: PasswordInputProps) {
  const fieldError = errors[name];

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <input
              id={name}
              type={isVisible ? "text" : "password"}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={`w-full px-4 py-3 pr-12 text-base rounded-full border transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                fieldError
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              }`}
            />
          )}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {fieldError && (
        <p className="text-red-600 text-sm mt-1">
          {fieldError.message as string}
        </p>
      )}
    </div>
  );
}

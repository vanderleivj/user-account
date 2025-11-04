interface StatusMessageProps {
  readonly message: string;
  readonly type: "success" | "error";
}

export function StatusMessage({ message, type }: StatusMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`p-4 rounded-xl mb-6 shadow-sm border ${
        type === "error"
          ? "bg-red-50/80 border-red-200/50 text-red-800"
          : "bg-emerald-50/80 border-emerald-200/50 text-emerald-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            type === "error" ? "bg-red-100" : "bg-emerald-100"
          }`}
        >
          <span className="text-sm">{type === "error" ? "⚠️" : "✅"}</span>
        </div>
        <span className="font-medium text-sm">{message}</span>
      </div>
    </div>
  );
}

// src/components/ResponsiveLayout.jsx

/* ---------------- Layout ---------------- */

export default function ResponsiveLayout({
  children,
  maxWidth = "7xl",
}) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`
        ${maxWidthClasses[maxWidth]}
        mx-auto
        w-full
        px-4 sm:px-6 lg:px-8
      `}
    >
      {children}
    </div>
  );
}

/* ---------------- Page ---------------- */

export function PageContainer({ children, className = "" }) {
  return (
    <div
      className={`
    min-h-[100dvh]
        bg-gray-50
        pt-safe-top
        pb-safe-bottom
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ---------------- Content ---------------- */

export function ContentContainer({ children, className = "" }) {
  return (
    <ResponsiveLayout>
      <div className={`py-6 sm:py-8 lg:py-12 ${className}`}>
        {children}
      </div>
    </ResponsiveLayout>
  );
}

/* ---------------- Card ---------------- */

export function ResponsiveCard({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white
        rounded-xl
        shadow-sm
        p-4 sm:p-6 lg:p-8
        transition-shadow
        hover:shadow-md
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ---------------- Grid ---------------- */

export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 4,
  className = "",
}) {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const gapClasses = {
    2: "gap-2",
    4: "gap-4",
    6: "gap-6",
    8: "gap-8",
  };

  return (
    <div
      className={`
        grid
        ${colClasses[cols.sm]}
        md:${colClasses[cols.md]}
        lg:${colClasses[cols.lg]}
        ${gapClasses[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* ---------------- Button ---------------- */

export function ResponsiveButton({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100",
  };

  return (
    <button
      className={`
        min-h-[44px]
        px-4 sm:px-6
        py-2 sm:py-3
        rounded-lg
        font-medium
        flex items-center justify-center gap-2
        transition-all
        ${variants[variant]}
        ${fullWidth ? "w-full" : "w-full sm:w-auto"}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------- Header ---------------- */

export function ResponsiveHeader({
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        flex flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
        mb-6 sm:mb-8
        ${className}
      `}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/* ---------------- Modal ---------------- */

export function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title,
  maxWidth = "md",
}) {
  if (!isOpen) return null;

  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`
          bg-white
          rounded-xl
          w-full
          ${widths[maxWidth]}
          p-4 sm:p-6
          max-h-[90vh]
          overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="mb-4 text-xl sm:text-2xl font-bold">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

/* ---------------- Input ---------------- */

export function ResponsiveInput({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          px-4
          py-2 sm:py-3
          rounded-lg
          border
          text-base
          focus:ring-2 focus:ring-blue-500
          focus:border-transparent
          transition
          ${error ? "border-red-500" : "border-gray-300"}
        `}
        {...props}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

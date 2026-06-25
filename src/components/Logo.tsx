interface LogoProps {
  /** Tamanho do quadro "H9". */
  size?: "sm" | "md" | "lg";
  /** Mostrar o texto "Controla MEI" ao lado. */
  withText?: boolean;
  /** Variante de cor do texto (para fundos escuros). */
  light?: boolean;
}

const sizes = {
  sm: { box: "h-8 w-8 text-sm rounded-lg", text: "text-base" },
  md: { box: "h-10 w-10 text-base rounded-xl", text: "text-lg" },
  lg: { box: "h-12 w-12 text-lg rounded-xl", text: "text-xl" },
};

export default function Logo({
  size = "md",
  withText = true,
  light = false,
}: LogoProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center bg-primary font-extrabold tracking-tight text-white ${s.box}`}
      >
        H9
      </div>
      {withText && (
        <span
          className={`font-bold ${s.text} ${
            light ? "text-white" : "text-primary"
          }`}
        >
          Controla MEI
        </span>
      )}
    </div>
  );
}

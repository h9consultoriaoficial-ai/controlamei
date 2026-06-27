import Image from "next/image";

/**
 * Logo horizontal da marca (símbolo + "MEI no Limite").
 *  - variant "light": para fundos claros (texto escuro)
 *  - variant "dark":  para fundos escuros (texto claro)
 * Use className para controlar o tamanho (ex.: "h-8 w-auto").
 * SVG servido com unoptimized (o otimizador do Next não processa SVG).
 */
export default function Logo({
  variant = "light",
  className = "h-8 w-auto",
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const src =
    variant === "dark"
      ? "/logo/horizontal-dark.svg"
      : "/logo/horizontal-light.svg";

  return (
    <Image
      src={src}
      alt="MEI no Limite"
      width={1024}
      height={463}
      priority
      unoptimized
      className={className}
    />
  );
}

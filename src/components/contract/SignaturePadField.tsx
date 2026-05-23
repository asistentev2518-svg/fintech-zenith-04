import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { Eraser } from "lucide-react";

interface Props {
  onChange: (dataUrl: string | null) => void;
}

export function SignaturePadField({ onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      padRef.current?.clear();
      onChange(null);
    };

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgba(255,255,255,0)",
      penColor: "#06245C",
      minWidth: 1.2,
      maxWidth: 2.6,
    });
    padRef.current = pad;
    resize();

    pad.addEventListener("endStroke", () => {
      if (pad.isEmpty()) onChange(null);
      else onChange(canvas.toDataURL("image/png"));
    });

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [onChange]);

  const clear = () => {
    padRef.current?.clear();
    onChange(null);
  };

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-border bg-white">
        <canvas ref={canvasRef} className="h-64 w-full cursor-crosshair" />
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
          Firma aquí dentro
        </div>
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <Eraser className="h-3.5 w-3.5" />
        Limpiar firma
      </button>
    </div>
  );
}

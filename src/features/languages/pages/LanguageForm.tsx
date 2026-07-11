import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguagesStore } from "../stores/useLanguagesStore";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const languageSchema = z.object({
  category: z.enum(["vocabulary", "listening", "grammar", "speaking"]),
  duration: z.coerce
    .number({ message: "Introduce un número válido" })
    .min(5, "El bloque mínimo de estudio es de 5 minutos.")
    .max(300, "¡No te quemes! El máximo por bloque son 5 horas."),
  notes: z
    .string()
    .max(150, "La nota no puede superar los 150 caracteres.")
    .optional(),
});

type LanguageFormInput = z.input<typeof languageSchema>;
type LanguageFormOutput = z.output<typeof languageSchema>;

export function LanguageForm() {
  const addSession = useLanguagesStore((state) => state.addSession);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LanguageFormInput, object, LanguageFormOutput>({
    resolver: zodResolver(languageSchema),
    defaultValues: { 
      category: "vocabulary", 
      duration: 25, 
      notes: "" 
    },
  });

  const onSubmit = async (data: LanguageFormOutput) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    addSession(data);
    reset();
    setIsSaving(false);
  };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="font-semibold text-lg tracking-tight mb-1">
        Registrar Bloque
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        Añade tu última sesión de inmersión.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Área de estudio
          </label>
          <select
            {...register("category")}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="vocabulary">📝 Vocabulario / Anki</option>
            <option value="listening">🎧 Escucha / Podcasts</option>
            <option value="grammar">📚 Gramática / Teoría</option>
            <option value="speaking">🗣️ Práctica Oral / Shadowing</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Duración (minutos)
          </label>
          <input
            type="number"
            {...register("duration", { valueAsNumber: true })}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ej: 25"
          />
          {errors.duration && (
            <p className="text-xs text-destructive">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Notas (Opcional)
          </label>
          <textarea
            {...register("notes")}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-20 resize-none"
            placeholder="Ej: Repaso de verbos en el presente..."
          />
          {errors.notes && (
            <p className="text-xs text-destructive">{errors.notes.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Guardar Sesión"
          )}
        </button>
      </form>
    </div>
  );
}

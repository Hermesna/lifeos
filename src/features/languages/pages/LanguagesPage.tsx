import {
  BookOpen,
  Headphones,
  GraduationCap,
  MessageSquare,
  Trash2,
  Clock,
  Calendar,
} from "lucide-react";
import { LanguageForm } from "./LanguageForm";
import {
  useLanguagesStore,
  type StudyCategory,
} from "../stores/useLanguagesStore";

const categoryConfig: Record<
  StudyCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  vocabulary: {
    label: "Vocabulario",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  listening: {
    label: "Escucha",
    icon: <Headphones className="h-4 w-4" />,
    color: "text-blue-500 bg-blue-500/10",
  },
  grammar: {
    label: "Gramática",
    icon: <GraduationCap className="h-4 w-4" />,
    color: "text-indigo-500 bg-indigo-500/10",
  },
  speaking: {
    label: "Oral",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-violet-500 bg-violet-500/10",
  },
};

export function LanguagesPage() {
  const { sessions, targetLanguage, currentLevel, deleteSession } =
    useLanguagesStore();

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Objetivo: {targetLanguage}
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitorea tus bloques de enfoque y consistencia diaria.
          </p>
        </div>
        <div className="bg-card border px-3 py-1.5 rounded-lg text-sm shadow-sm w-fit font-medium">
          Nivel Actual:{" "}
          <span className="text-primary font-bold ml-1">{currentLevel}</span>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Tiempo Total
            </p>
            <h3 className="text-2xl font-bold">
              {totalMinutes}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                mins
              </span>
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              Bloques Completados
            </p>
            <h3 className="text-2xl font-bold">
              {sessions.length}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                logs
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Sección Inferior Split */}
      <div className="grid gap-6 md:grid-cols-5 items-start">
        {/* Historial (3/5) */}
        <div className="md:col-span-3 space-y-3">
          <div className="border rounded-xl bg-card p-5 shadow-sm">
            <h3 className="font-semibold text-base mb-4">
              Historial de Práctica
            </h3>

            {sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No has registrado ninguna sesión todavía. ¡Empieza hoy!
              </p>
            ) : (
              <div className="space-y-3 max-h-100 overflow-y-auto pr-1">
                {sessions.map((session) => {
                  const config = categoryConfig[session.category];
                  return (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-background/50 hover:bg-background transition-colors"
                    >
                      <div className="flex gap-3 items-start">
                        <div
                          className={`p-2 rounded-lg ${config.color} mt-0.5`}
                        >
                          {config.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{config.label}</p>
                          {session.notes && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {session.notes}
                            </p>
                          )}
                          <span className="text-[10px] text-muted-foreground block mt-1">
                            {session.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold bg-secondary px-2 py-1 rounded-md">
                          +{session.duration} min
                        </span>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Formulario (2/5) */}
        <div className="md:col-span-2">
          <LanguageForm />
        </div>
      </div>
    </div>
  );
}

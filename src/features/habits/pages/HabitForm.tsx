import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitsSchema, type HabitsFormValues } from "../schemas/habitsSchema";
import { useHabitsStore } from "../stores/useHabitsStore";
import { Plus } from "lucide-react";

export function HabitForm() {
  const addHabit = useHabitsStore((state) => state.addHabit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HabitsFormValues>({
    resolver: zodResolver(habitsSchema),
    defaultValues: {
      name: "",
      category: "lifestyle",
    },
  });

  const onSubmit = async (data: HabitsFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400)); // Efecto visual premium de carga
    addHabit(data.name, data.category);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">New Discipline</h3>
        <p className="text-sm text-muted-foreground">Build consistency through small daily actions.</p>
      </div>

      <div className="space-y-3">
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Habit Name</label>
          <input
            type="text"
            placeholder="e.g. Read 10 pages of technical books"
            {...register("name")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {errors.name && <p className="text-xs font-medium text-destructive">{errors.name.message}</p>}
        </div>

        {/* Category select */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
          <select
            {...register("category")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="lifestyle">Lifestyle / General</option>
            <option value="languages">Languages</option>
            <option value="work">Engineering / Focus</option>
            <option value="health">Health & Fitness</option>
          </select>
          {errors.category && <p className="text-xs font-medium text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary h-9 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        {isSubmitting ? "Creating..." : "Create Habit"}
      </button>
    </form>
  );
}
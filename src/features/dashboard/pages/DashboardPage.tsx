import { useState } from "react"
import { useTranslation } from "react-i18next"
import { LayoutGrid, Eye, EyeOff, Plus, GripVertical } from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { BooksWidget } from "../components/BooksWidget"
import { SavingsWidget } from "../components/SavingsWidget"
import { HabitsWidget } from "../components/HabitsWidget"
import { LanguagesWidget } from "../components/LanguagesWidget"
import { TravelWidget } from "../components/TravelWidget"

const WIDGET_MAP: Record<string, { titleKey: string; defaultTitle: string; component: React.ComponentType }> = {
    savings: { titleKey: "dashboard.widgets.savings", defaultTitle: "Ahorros y Finanzas", component: SavingsWidget },
    habits: { titleKey: "dashboard.widgets.habits", defaultTitle: "Hábitos Diarios", component: HabitsWidget },
    books: { titleKey: "dashboard.widgets.books", defaultTitle: "Lectura Actual", component: BooksWidget },
    languages: { titleKey: "dashboard.widgets.languages", defaultTitle: "Progreso de Idiomas", component: LanguagesWidget },
    travel: { titleKey: "dashboard.widgets.travel", defaultTitle: "Próximos Viajes", component: TravelWidget },
}

const DEFAULT_ORDER = ["savings", "habits", "books", "languages", "travel"]

export default function DashboardPage() {
    const { t } = useTranslation()
    const [isCustomizing, setIsCustomizing] = useState(false)

    const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
        const saved = localStorage.getItem("dashboard_widget_order")
        return saved ? JSON.parse(saved) : DEFAULT_ORDER
    })

    const [activeWidgets, setActiveWidgets] = useState<string[]>(() => {
        const saved = localStorage.getItem("dashboard_active_widgets")
        return saved ? JSON.parse(saved) : DEFAULT_ORDER
    })

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const toggleWidget = (id: string) => {
        const updated = activeWidgets.includes(id)
            ? activeWidgets.filter((wId) => wId !== id)
            : [...activeWidgets, id]

        setActiveWidgets(updated)
        localStorage.setItem("dashboard_active_widgets", JSON.stringify(updated))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setWidgetOrder((items) => {
                const oldIndex = items.indexOf(active.id as string)
                const newIndex = items.indexOf(over.id as string)
                const newOrder = arrayMove(items, oldIndex, newIndex)
                localStorage.setItem("dashboard_widget_order", JSON.stringify(newOrder))
                return newOrder
            })
        }
    }

    const visibleWidgetIds = widgetOrder.filter((id) => activeWidgets.includes(id))

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("dashboard.title", { defaultValue: "LifeOS Dashboard" })}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        {t("dashboard.subtitle", { defaultValue: "Resumen general de tu sistema y métricas clave." })}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCustomizing(!isCustomizing)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${isCustomizing
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-accent text-muted-foreground"
                        }`}
                >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>
                        {isCustomizing
                            ? t("dashboard.finishEditing", { defaultValue: "Finalizar edición" })
                            : t("dashboard.customizeWidgets", { defaultValue: "Personalizar widgets" })}
                    </span>
                </button>
            </div>

            {isCustomizing && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-3 animate-in fade-in duration-150">
                    <p className="text-xs font-medium text-foreground">
                        {t("dashboard.customizePrompt", { defaultValue: "Activa u oculta los módulos según tus necesidades:" })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {DEFAULT_ORDER.map((id) => {
                            const isActive = activeWidgets.includes(id)
                            const widgetMeta = WIDGET_MAP[id]
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => toggleWidget(id)}
                                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${isActive
                                            ? "border-primary/50 bg-primary/10 text-primary"
                                            : "border-border bg-background text-muted-foreground opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    {isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                                    <span>{t(widgetMeta.titleKey, { defaultValue: widgetMeta.defaultTitle })}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {visibleWidgetIds.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        {t("dashboard.noVisibleWidgets", { defaultValue: "No hay widgets visibles en tu Dashboard." })}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsCustomizing(true)}
                        className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium hover:underline cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        {t("dashboard.enableWidgets", { defaultValue: "Activar widgets" })}
                    </button>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={visibleWidgetIds} strategy={rectSortingStrategy}>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                            {visibleWidgetIds.map((id) => {
                                const WidgetComponent = WIDGET_MAP[id].component
                                return (
                                    <SortableWidgetContainer key={id} id={id} isCustomizing={isCustomizing}>
                                        <WidgetComponent />
                                    </SortableWidgetContainer>
                                )
                            })}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    )
}

interface SortableWidgetProps {
    id: string
    isCustomizing: boolean
    children: React.ReactNode
}

function SortableWidgetContainer({ id, isCustomizing, children }: SortableWidgetProps) {
    const { t } = useTranslation()
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 1,
        opacity: isDragging ? 0.6 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className="relative group h-full">
            <div
                {...attributes}
                {...listeners}
                aria-label={t("dashboard.reorderWidget", { defaultValue: "Reordenar widget" })}
                className={`absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background/80 backdrop-blur-xs text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing transition-opacity ${isCustomizing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
            >
                <GripVertical className="h-3.5 w-3.5" />
            </div>

            <div className="h-full [&>*]:h-full">
                {children}
            </div>
        </div>
    )
}
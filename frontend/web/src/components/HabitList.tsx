import { useEffect, useState } from "react";
import { Check, Trash, Fire } from "phosphor-react";
import { api } from "../lib";
import clsx from "clsx";

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
    _count: {
      dayHabits: number;
    };
  }[];
  completedHabits: string[];
}

export function HabitList() {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  // Função separada para poder recarregar a lista depois
  async function fetchHabits() {
    const response = await api.get("day", {
      params: {
        date: new Date().toISOString(),
      },
    });
    setHabitsInfo(response.data);
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  async function handleToggleHabit(habitId: string) {
    const isHabitAlreadyCompleted =
      habitsInfo!.completedHabits.includes(habitId);
    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    await api.patch(`/habits/${habitId}/toggle`);
  }

  async function handleDeleteHabit(event: React.MouseEvent, habitId: string) {
    event.stopPropagation(); // Importante: Impede o clique de "vazar" para o check

    const confirm = window.confirm(
      "Tem certeza que deseja apagar este hábito para sempre?"
    );

    if (confirm) {
      try {
        await api.delete(`/habits/${habitId}`);
        await fetchHabits(); // Atualiza a tela sem precisar de F5
      } catch (error) {
        console.log(error);
        alert("Erro ao tentar deletar.");
      }
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        const isHabitCompleted = habitsInfo.completedHabits.includes(habit.id);

        return (
          <div
            key={habit.id}
            className={clsx(
              "relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group",
              {
                "bg-slate-800 border-slate-700": !isHabitCompleted,
                "bg-violet-900/20 border-violet-800": isHabitCompleted,
              }
            )}
          >
            {/* Área clicável do Checkbox (Esquerda) */}
            <div
              onClick={() => handleToggleHabit(habit.id)}
              className="flex items-center gap-4 flex-1 cursor-pointer select-none"
            >
              <div
                className={clsx(
                  "h-6 w-6 rounded-md flex items-center justify-center transition-all duration-300",
                  {
                    "bg-violet-500 scale-110": isHabitCompleted,
                    "bg-slate-700 border border-slate-600": !isHabitCompleted,
                  }
                )}
              >
                {isHabitCompleted && (
                  <Check size={16} className="text-white" weight="bold" />
                )}
              </div>

              <div className="flex flex-col">
                <span
                  className={clsx("text-lg font-medium transition-colors", {
                    "line-through text-slate-500": isHabitCompleted,
                    "text-white": !isHabitCompleted,
                  })}
                >
                  {habit.title}
                </span>

                {/* Contador de dias (Streak) */}
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <Fire size={14} className="text-orange-500" weight="fill" />
                  <span>{habit._count.dayHabits} dias</span>
                </div>
              </div>
            </div>

            {/* Botão de Deletar (Direita) */}
            <button
              onClick={(e) => handleDeleteHabit(e, habit.id)}
              className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors p-2 rounded-lg focus:outline-none"
              title="Apagar hábito"
            >
              <Trash size={20} />
            </button>
          </div>
        );
      })}

      {habitsInfo?.possibleHabits.length === 0 && (
        <p className="text-slate-500 text-center py-10">
          Você não tem hábitos para hoje.
        </p>
      )}
    </div>
  );
}

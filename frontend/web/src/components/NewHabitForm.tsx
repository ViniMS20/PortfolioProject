import { type FormEvent, useState } from "react";
import { Check } from "phosphor-react";
import { api } from "../lib";
import clsx from "clsx";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();
    if (!title || weekDays.length === 0) return;

    await api.post("habits", { title, weekDays });

    setTitle("");
    setWeekDays([]);
    window.location.reload();
  }

  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      setWeekDays((prevState) => prevState.filter((day) => day !== weekDay));
    } else {
      setWeekDays((prevState) => [...prevState, weekDay]);
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label
        htmlFor="title"
        className="font-semibold leading-tight text-slate-200"
      >
        Qual seu comprometimento?
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex.: Beber 2L de água, Dormir 8h..."
        className="p-4 rounded-lg mt-3 bg-slate-800 text-white border border-slate-700 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label
        htmlFor=""
        className="font-semibold leading-tight mt-6 text-slate-200"
      >
        Qual a recorrência?
      </label>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => {
          return (
            <div
              key={weekDay}
              onClick={() => handleToggleWeekDay(index)}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition-colors",
                {
                  "bg-violet-600 border-violet-500": weekDays.includes(index),
                  "bg-slate-800 border-slate-700 hover:bg-slate-700":
                    !weekDays.includes(index),
                }
              )}
            >
              <div
                className={clsx(
                  "h-4 w-4 rounded flex items-center justify-center border transition-colors",
                  {
                    "bg-white border-white": weekDays.includes(index),
                    "bg-slate-700 border-slate-600": !weekDays.includes(index),
                  }
                )}
              >
                {weekDays.includes(index) && (
                  <Check size={12} className="text-violet-600" weight="bold" />
                )}
              </div>

              <span
                className={clsx("text-sm font-medium", {
                  "text-white": weekDays.includes(index),
                  "text-slate-300": !weekDays.includes(index),
                })}
              >
                {weekDay}
              </span>
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="mt-8 rounded-lg p-4 flex items-center justify-center gap-3 font-bold bg-green-600 text-white hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20"
      >
        <Check size={20} weight="bold" />
        Confirmar Hábito
      </button>
    </form>
  );
}

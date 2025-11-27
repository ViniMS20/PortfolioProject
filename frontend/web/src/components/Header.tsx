import { Plus, X } from "phosphor-react";
import * as Dialog from "@radix-ui/react-dialog";
import { NewHabitForm } from "./NewHabitForm";

export function Header() {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      {/* Logo com gradiente */}
      <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
        Habits
      </h1>

      <Dialog.Root>
        <Dialog.Trigger
          type="button"
          className="border border-violet-500 bg-violet-600/10 text-violet-400 font-semibold rounded-full px-6 py-3 flex items-center gap-3 hover:bg-violet-600 hover:text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0f172a]"
        >
          <Plus size={20} />
          Novo hábito
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="w-screen h-screen bg-black/60 backdrop-blur-sm fixed inset-0 z-40" />

          <Dialog.Content className="absolute p-10 bg-slate-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-slate-700 shadow-2xl z-50">
            <Dialog.Close className="absolute right-6 top-6 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none">
              <X size={24} aria-label="Fechar" />
            </Dialog.Close>

            <Dialog.Title className="text-2xl leading-tight font-bold text-white">
              Criar Hábito
            </Dialog.Title>
            <p className="text-slate-400 mt-2 text-sm">
              Adicione uma nova meta para rastrear diariamente.
            </p>

            <NewHabitForm />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

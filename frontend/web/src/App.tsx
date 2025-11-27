import { Header } from "./components/Header";
import { HabitList } from "./components/HabitList";
import "./index.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function App() {
  const today = format(new Date(), "EEEE, dd 'de' MMMM", {
    locale: ptBR,
  });

  const capitalizedDate = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="w-screen min-h-screen flex justify-center items-center relative overflow-hidden bg-[#0f172a]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-5xl px-6 flex flex-col gap-16 py-10">
        <Header />

        <div className="w-full max-w-lg mx-auto bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
          <div className="mb-6 border-b border-slate-700 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-200">
                Meus Compromissos
              </h2>
              {/* AQUI MOSTRA A DATA */}
              <span className="text-slate-400 text-sm font-medium">
                {capitalizedDate}
              </span>
            </div>
          </div>

          <HabitList />
        </div>
      </div>
    </div>
  );
}

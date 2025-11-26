import { Header } from "./components/header";
import { HabitList } from "./components/habitlist";
import "./index.css";

export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header /> {}
        <div className="w-full max-w-md mx-auto">
          <HabitList />
        </div>
      </div>
    </div>
  );
}

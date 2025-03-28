import { PiggyBank } from "lucide-react";

export default function Logo() {
  return (
    <a className="flex items-center gap-2 transition-all" href="/dashboard">
      <PiggyBank className="h-8 w-8 text-orange-400" />
      <span
        className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-xl font-bold text-transparent md:hidden"
        style={{
          // Fix the text gradient on mobile
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Finance Tracker
      </span>
    </a>
  );
}

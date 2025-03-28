import BalanceEditor from "@/app/_components/balance-editor";
import CurrencyPicker from "@/app/_components/currency-picker";
import CategoriesManager from "../_components/category-manager";

export const metadata = {
  title: "Manage",
};

export default function Page() {
  return (
    <div>
      <div className="bg-card border-b">
        <div className="mx-auto max-w-7xl py-6 px-6">
          <h1 className="text-3xl font-bold">Manage</h1>
          <p className="text-muted-foreground">
            Manage your account settings and categories
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-6 px-2 sm:px-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyPicker />
          <BalanceEditor />
        </div>

        <CategoriesManager />
      </div>
    </div>
  );
}

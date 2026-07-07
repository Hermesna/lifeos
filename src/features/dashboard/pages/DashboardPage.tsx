import DashboardGreeting from "../components/DashboardGreeting";
import SavingsCard from "../components/SavingsCard";

function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardGreeting />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SavingsCard />
      </div>
    </div>
  );
}

export default DashboardPage;
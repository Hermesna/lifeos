function DashboardGreeting() {
  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 19) {
    greeting = "Good afternoon";
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">
        {greeting}, Hermes 👋
      </h1>

      <p className="mt-2 text-muted-foreground">
        Welcome back to your LifeOS.
      </p>
    </div>
  );
}

export default DashboardGreeting;
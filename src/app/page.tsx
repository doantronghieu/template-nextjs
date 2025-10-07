export default function Home() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <main className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Welcome
        </h1>
        <p className="text-xl text-muted-foreground sm:text-2xl">
          Your application is ready
        </p>
      </main>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Nothing to see here</h1>
      <p className="max-w-xl text-base text-foreground/70">
        The page you were trying to reach does not exist in this vault. Double-check
        the URL or head back to the latest content.
      </p>
    </div>
  );
}

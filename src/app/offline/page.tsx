export default function OfflinePage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold">Vous êtes hors ligne</h1>
      <p className="text-muted-foreground max-w-sm">
        Vérifiez votre connexion internet et réessayez.
      </p>
    </div>
  );
}

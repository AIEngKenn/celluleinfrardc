'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body>
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 text-center">
          <div>
            <h1 className="mb-4 text-5xl font-bold text-rdc-red">Erreur</h1>
            <p className="mb-6 text-gray-600">
              Une erreur est survenue pendant le chargement de la page.
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-rdc-blue px-6 py-3 font-medium text-white"
            >
              Réessayer
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}

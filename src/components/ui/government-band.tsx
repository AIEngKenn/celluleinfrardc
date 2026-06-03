/**
 * Government Signature Band
 * Full-width RDC color stripe (Blue, Yellow, Red)
 * Appears above the footer on every page
 */

export function GovernmentBand() {
  return (
    <div
      className="w-full"
      role="presentation"
      aria-label="RDC Government Colors"
    >
      <div className="flex h-2">
        <div className="flex-1 bg-rdc-blue" />
        <div className="flex-1 bg-rdc-yellow" />
        <div className="flex-1 bg-rdc-red" />
      </div>
    </div>
  );
}

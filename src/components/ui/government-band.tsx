/**
 * Government Signature Band
 * Full-width RDC tricolour stripe — appears above every footer.
 */
export function GovernmentBand() {
  return (
    <div className="mx-auto flex w-full" role="presentation" aria-hidden="true">
      <div className="h-1.5 flex-1" style={{ background: '#007FFF' }} />
      <div className="h-1.5 flex-1" style={{ background: '#F7D618' }} />
      <div className="h-1.5 flex-1" style={{ background: '#CE1021' }} />
    </div>
  );
}

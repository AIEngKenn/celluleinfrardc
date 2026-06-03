/**
 * Government Signature Band
 * Full-width RDC tricolour stripe — appears above every footer.
 */
export function GovernmentBand() {
  return (
    <div
      className="w-full flex"
      role="presentation"
      aria-hidden="true"
    >
      <div className="flex-1 h-3" style={{ background: '#007FFF' }} />
      <div className="flex-1 h-3" style={{ background: '#F7D618' }} />
      <div className="flex-1 h-3" style={{ background: '#CE1021' }} />
    </div>
  );
}

}

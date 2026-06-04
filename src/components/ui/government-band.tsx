/**
 * Government Signature Band
 * Full-width RDC tricolour stripe — appears above every footer.
 */
export function GovernmentBand() {
  return (
    <div
      className="h-1.5 w-full border-0"
      style={{
        background:
          'linear-gradient(to right, #007FFF 33.333%, #F7D618 33.333% 66.666%, #CE1021 66.666%)',
      }}
      role="presentation"
      aria-hidden="true"
    />
  );
}

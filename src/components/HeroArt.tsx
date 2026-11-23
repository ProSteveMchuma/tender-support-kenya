/** Decorative "bid file" card: the stages a bid moves through. No real tender data. */
export function HeroArt() {
  const rows = [
    { t: "Requirements reviewed", done: true },
    { t: "Evidence organised", done: true },
    { t: "Forms completed", done: true },
    { t: "Expert review", done: false },
  ];
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="ha-card">
        <div className="ha-head">
          <span className="ha-doc" />
          <div>
            <span className="ha-line ha-line-strong" />
            <span className="ha-line" />
          </div>
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.t} data-done={r.done ? "1" : "0"}>
              <span className="ha-tick">
                {r.done && (
                  <svg viewBox="0 0 16 16" width="12" height="12"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </span>
              <span>{r.t}</span>
              <span className="ha-meter"><i /></span>
            </li>
          ))}
        </ul>
        <div className="ha-foot">
          <span className="ha-pill">Ready for your approval</span>
        </div>
      </div>
      <div className="ha-card ha-card-back" />
    </div>
  );
}

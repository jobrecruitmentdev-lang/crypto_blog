import { TICKER } from "@/lib/data";

function TickerItems() {
  return (
    <>
      {TICKER.map((t) => (
        <div className="ticker-item" key={t.sym}>
          <span className="sym">{t.sym}</span>
          <span>{t.price}</span>
          <span className={t.up ? "up" : "down"}>{t.chg}</span>
        </div>
      ))}
    </>
  );
}

export default function Ticker() {
  return (
    <div className="ticker-wrap">
      <div className="wrap">
        <div className="ticker-track">
          <TickerItems />
          <TickerItems />
        </div>
      </div>
    </div>
  );
}

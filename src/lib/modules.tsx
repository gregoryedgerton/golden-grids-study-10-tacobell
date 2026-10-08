import { useState } from "react";
import { CATEGORIES, DISCLAIMER, money } from "../menu";
import { useOrder, setQty, clearOrder } from "./order";

/** The sticky category strip, the order panel, the nutrition line. Lists and panels, not grids. */
export function CategoryStrip() {
  return (
    <nav className="cats" aria-label="Menu categories">
      <ul>{CATEGORIES.map((c) => <li key={c.id}><a href={`#${c.id}`}>{c.name}</a></li>)}</ul>
    </nav>
  );
}

export function OrderPanel() {
  const o = useOrder();
  const [open, setOpen] = useState(false);
  const [placed, setPlaced] = useState(false);
  return (
    <aside className={`order${open ? " is-open" : ""}`} aria-labelledby="order-title">
      <button type="button" className="order__toggle" aria-expanded={open} aria-controls="order-body" onClick={() => setOpen(!open)}>
        <span id="order-title"><strong>Your order</strong> · {o.count} {o.count === 1 ? "item" : "items"}</span><span>{money(o.total)}</span>
      </button>
      <div id="order-body" className="order__body">
        {o.lines.length === 0 ? <p className="note">Nothing yet. Choose an item and add it.</p> : (
          <ul className="order__lines">
            {o.lines.map((l) => (
              <li key={l.key}>
                <span className="order__name"><strong>{l.name}</strong>{l.summary && <span className="order__sum">{l.summary}</span>}<span className="order__cal">{l.cal * l.qty} cal</span></span>
                <span className="order__qty" role="group" aria-label={`Quantity of ${l.name}`}><button type="button" onClick={() => setQty(l.key, l.qty - 1)} aria-label="One fewer">−</button><span>{l.qty}</span><button type="button" onClick={() => setQty(l.key, l.qty + 1)} aria-label="One more">+</button></span>
                <span className="order__price">{money(l.unit * l.qty)}</span>
              </li>
            ))}
          </ul>
        )}
        <dl className="order__totals">
          <div><dt>Subtotal</dt><dd>{money(o.subtotal)}</dd></div>
          <div><dt>Tax (8.25%)</dt><dd>{money(o.tax)}</dd></div>
          <div><dt>Calories</dt><dd>{o.cal}</dd></div>
          <div className="order__grand"><dt>Total</dt><dd>{money(o.total)}</dd></div>
        </dl>
        <div className="order__actions">
          <button type="button" className="btn btn--primary" disabled={o.lines.length === 0} onClick={() => setPlaced(true)}>Checkout</button>
          <button type="button" className="btn btn--ghost" disabled={o.lines.length === 0} onClick={() => { clearOrder(); setPlaced(false); }}>Clear</button>
        </div>
        <p className="note" aria-live="polite">{placed ? "No order was placed: this is a layout study and nothing is sent." : "Checkout sends nothing; the order lives on this page only."}</p>
      </div>
    </aside>
  );
}

export function Disclaimer() { return <p className="disclaimer">{DISCLAIMER}</p>; }

import { useState } from "react";
import { money, type Item, type Combo, byId } from "../menu";
import { addLine, addCombo, priceOf, summarise } from "./order";

/**
 * The customiser: what the reference opens when an item is chosen. Remove
 * what comes on it, add what does not, pick the protein, shell or size, set
 * a quantity; the price and calories follow every change. Add to order puts
 * it in the order panel. It renders inside an expanded cell, so the way out
 * is the cell's Close at the top right.
 */
export function Customizer({ item, onAdded }: { item: Item; onAdded: () => void }) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [choices, setChoices] = useState<Record<string, string>>(Object.fromEntries((item.options ?? []).map((o) => [o.id, o.default])));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { price, cal } = priceOf(item, choices, extras);
  const toggle = (list: string[], set: (v: string[]) => void, id: string) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const summary = summarise(item, removed, extras, choices);
  return (
    <div className="cust">
      <p className="cust__desc">{item.long ?? item.desc}</p>
      <div className="cust__cols">
        {item.ingredients.length > 0 && (
          <fieldset className="cust__group">
            <legend>Comes with</legend>
            {item.ingredients.map((ing) => (
              <label key={ing.id} className="cust__row"><input type="checkbox" checked={!removed.includes(ing.id)} disabled={!ing.removable} onChange={() => toggle(removed, setRemoved, ing.id)} /> <span>{ing.name}</span>{removed.includes(ing.id) && <span className="cust__tag">removed</span>}</label>
            ))}
          </fieldset>
        )}
        {item.options?.map((o) => (
          <fieldset key={o.id} className="cust__group">
            <legend>{o.name}</legend>
            {o.choices.map((c) => (
              <label key={c.id} className="cust__row"><input type="radio" name={`${item.id}-${o.id}`} checked={(choices[o.id] ?? o.default) === c.id} onChange={() => setChoices({ ...choices, [o.id]: c.id })} /> <span>{c.name}</span><span className="cust__delta">{c.price ? (c.price > 0 ? `+${money(c.price)}` : `−${money(-c.price)}`) : ""}{c.cal ? ` · ${c.cal > 0 ? "+" : ""}${c.cal} cal` : ""}</span></label>
            ))}
          </fieldset>
        ))}
        {item.addons && item.addons.length > 0 && (
          <fieldset className="cust__group">
            <legend>Add</legend>
            {item.addons.map((a) => (
              <label key={a.id} className="cust__row"><input type="checkbox" checked={extras.includes(a.id)} onChange={() => toggle(extras, setExtras, a.id)} /> <span>{a.name}</span><span className="cust__delta">+{money(a.extra ?? 0)}{a.cal ? ` · +${a.cal} cal` : ""}</span></label>
            ))}
          </fieldset>
        )}
      </div>
      <div className="cust__bar">
        <div className="cust__qty" role="group" aria-label="Quantity">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="One fewer">−</button>
          <span aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} aria-label="One more">+</button>
        </div>
        <p className="cust__total" aria-live="polite"><strong>{money(price * qty)}</strong> <span>{cal * qty} cal{summary ? ` · ${summary}` : ""}</span></p>
        <button type="button" className="btn btn--primary" onClick={() => { addLine(item.id, qty, removed, extras, choices); setAdded(true); onAdded(); }}>Add to order</button>
      </div>
      <p className="note" aria-live="polite">{added ? "Added to your order. Nothing is sent anywhere: this is a layout study." : "The order totals on this page and is never sent."}</p>
    </div>
  );
}

/** A combo adds its items as separate lines at the combo's price, split proportionally. */
export function ComboView({ combo, onAdded }: { combo: Combo; onAdded: () => void }) {
  const [added, setAdded] = useState(false);
  const items = combo.items.map((id) => byId[id]);
  const apart = items.reduce((s, i) => s + i.price, 0);
  const cal = items.reduce((s, i) => s + i.cal, 0);
  return (
    <div className="cust">
      <p className="cust__desc">{combo.blurb} Bought apart these come to {money(apart)}; together {money(combo.price)}.</p>
      <ul className="cust__list">{items.map((i, n) => <li key={n}>{i.name} <span className="muted">{i.cal} cal</span></li>)}</ul>
      <div className="cust__bar">
        <p className="cust__total"><strong>{money(combo.price)}</strong> <span>{cal} cal · saves {money(apart - combo.price)}</span></p>
        <button type="button" className="btn btn--primary" onClick={() => { addCombo(combo.id); setAdded(true); onAdded(); }}>Add combo to order</button>
      </div>
      <p className="note" aria-live="polite">{added ? "Added to your order as one line. Nothing is sent anywhere: this is a layout study." : "The combo is one line in the order; items in it are as they come."}</p>
    </div>
  );
}

import { useState } from "react";
import { money, byId, type Item, type Box, BUILD, type Option } from "../menu";
import { addLine, addBox, addBuild, priceOf, summarise, drinkCal } from "./order";

/**
 * The customiser, after the site's item page: "Make it" switches (Supreme,
 * Fresco, Grilled), what's included (uncheck to remove), add-ons and
 * sauces with their prices and calories, a quantity; price and calories
 * follow every change; Add to order. It renders inside an expanded cell,
 * so the way out is the cell's Close at the top right.
 */
function Group({ legend, children }: { legend: string; children: React.ReactNode }) { return <fieldset className="cust__group"><legend>{legend}</legend>{children}</fieldset>; }
const delta = (price?: number, cal?: number) => `${price ? (price > 0 ? `+${money(price)}` : `−${money(-price)}`) : ""}${cal ? ` · ${cal > 0 ? "+" : ""}${cal} cal` : ""}`;

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
      <p className="cust__desc">{item.long ?? item.desc}{item.url && <> <a href={item.url}>Item page on tacobell.com</a>.</>}</p>
      <div className="cust__cols">
        {item.options?.map((o) => (
          <Group key={o.id} legend={o.name}>
            {o.choices.map((c) => (
              <label key={c.id} className="cust__row"><input type="radio" name={`${item.id}-${o.id}`} checked={(choices[o.id] ?? o.default) === c.id} onChange={() => setChoices({ ...choices, [o.id]: c.id })} /> <span>{c.name}{c.note && <span className="cust__note"> — {c.note}</span>}</span><span className="cust__delta">{delta(c.price, c.cal)}</span></label>
            ))}
          </Group>
        ))}
        {item.ingredients.length > 0 && (
          <Group legend="What's included">
            {item.ingredients.map((ing) => (
              <label key={ing.id} className="cust__row"><input type="checkbox" checked={!removed.includes(ing.id)} disabled={!ing.removable} onChange={() => toggle(removed, setRemoved, ing.id)} /> <span>{ing.name}</span>{removed.includes(ing.id) && <span className="cust__tag">removed</span>}</label>
            ))}
          </Group>
        )}
        {item.addons && item.addons.length > 0 && (
          <Group legend="Add-ons">
            {item.addons.map((a) => (
              <label key={a.id} className="cust__row"><input type="checkbox" checked={extras.includes(a.id)} onChange={() => toggle(extras, setExtras, a.id)} /> <span>{a.name}</span><span className="cust__delta">{delta(a.extra, a.cal)}</span></label>
            ))}
          </Group>
        )}
        {item.sauces && item.sauces.length > 0 && (
          <Group legend="Sauces">
            {item.sauces.map((a) => (
              <label key={a.id} className="cust__row"><input type="checkbox" checked={extras.includes(a.id)} onChange={() => toggle(extras, setExtras, a.id)} /> <span>{a.name}</span><span className="cust__delta">{delta(a.extra, a.cal)}</span></label>
            ))}
          </Group>
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

function DrinkPick({ drink, value, onChange, name }: { drink: Option; value: string; onChange: (id: string) => void; name: string }) {
  return (
    <Group legend={drink.name}>
      {drink.choices.map((c) => <label key={c.id} className="cust__row"><input type="radio" name={name} checked={value === c.id} onChange={() => onChange(c.id)} /> <span>{c.name}</span><span className="cust__delta">{c.cal ?? 0} cal</span></label>)}
    </Group>
  );
}

/** A box: each slot shows what comes in it and the site's swaps; a drink; one price. */
export function BoxView({ box, onAdded }: { box: Box; onAdded: () => void }) {
  const [picks, setPicks] = useState<Record<string, string>>(Object.fromEntries(box.slots.map((s) => [s.id, s.itemId])));
  const [drink, setDrink] = useState(box.drink.default);
  const [added, setAdded] = useState(false);
  const items = box.slots.map((s) => byId[picks[s.id]]);
  const apart = items.reduce((s, i) => s + i.price, 0) + 3.19;
  const cal = items.reduce((s, i) => s + i.cal, 0) + drinkCal(box.drink, drink);
  return (
    <div className="cust">
      <p className="cust__desc">{box.blurb} Bought apart these come to about {money(apart)} with a large drink. <a href={box.url}>Box page on tacobell.com</a>.</p>
      <div className="cust__cols">
        {box.slots.map((s) => (
          <Group key={s.id} legend={`${s.name}: ${byId[s.itemId].name}`}>
            {[s.itemId, ...(s.swaps ?? [])].map((id) => <label key={id} className="cust__row"><input type="radio" name={`${box.id}-${s.id}`} checked={picks[s.id] === id} onChange={() => setPicks({ ...picks, [s.id]: id })} /> <span>{byId[id].name}{id !== s.itemId && <span className="cust__note"> — swap</span>}</span><span className="cust__delta">{byId[id].cal} cal</span></label>)}
          </Group>
        ))}
        <DrinkPick drink={box.drink} value={drink} onChange={setDrink} name={`${box.id}-drink`} />
      </div>
      <div className="cust__bar">
        <p className="cust__total"><strong>{money(box.price)}</strong> <span>{cal} cal · {box.calRange} cal on the site</span></p>
        <button type="button" className="btn btn--primary" onClick={() => { addBox(box.id, picks, drink); setAdded(true); onAdded(); }}>Add to order</button>
      </div>
      <p className="note" aria-live="polite">{added ? "Added to your order as one line. Nothing is sent anywhere: this is a layout study." : "Swaps are the ones the site lists; the box is one line in the order."}</p>
    </div>
  );
}

/** Build Your Own: one from each group, a drink, $7.69. */
export function BuildView({ onAdded }: { onAdded: () => void }) {
  const [picks, setPicks] = useState<Record<string, string>>(Object.fromEntries(BUILD.groups.map((g) => [g.id, g.items[0]])));
  const [drink, setDrink] = useState(BUILD.drink.default);
  const [added, setAdded] = useState(false);
  const cal = BUILD.groups.reduce((s, g) => s + byId[picks[g.id]].cal, 0) + drinkCal(BUILD.drink, drink);
  const apart = BUILD.groups.reduce((s, g) => s + byId[picks[g.id]].price, 0) + 2.79;
  return (
    <div className="cust">
      <p className="cust__desc">{BUILD.blurb} The site lists {BUILD.groups[0].items.length} specialties, {BUILD.groups[1].items.length} tacos and burritos and {BUILD.groups[2].items.length} sides to choose from. <a href={BUILD.url}>Builder on tacobell.com</a>.</p>
      <div className="cust__cols">
        {BUILD.groups.map((g) => (
          <Group key={g.id} legend={g.name}>
            {g.items.map((id) => <label key={id} className="cust__row"><input type="radio" name={`build-${g.id}`} checked={picks[g.id] === id} onChange={() => setPicks({ ...picks, [g.id]: id })} /> <span>{byId[id].name}</span><span className="cust__delta">{byId[id].cal} cal · {money(byId[id].price)} alone</span></label>)}
          </Group>
        ))}
        <DrinkPick drink={BUILD.drink} value={drink} onChange={setDrink} name="build-drink" />
      </div>
      <div className="cust__bar">
        <p className="cust__total"><strong>{money(BUILD.price)}</strong> <span>{cal} cal · about {money(apart)} apart with a medium drink</span></p>
        <button type="button" className="btn btn--primary" onClick={() => { addBuild(picks, drink); setAdded(true); onAdded(); }}>Add to order</button>
      </div>
      <p className="note" aria-live="polite">{added ? "Added to your order as one line. Nothing is sent anywhere: this is a layout study." : "The box is one line in the order."}</p>
    </div>
  );
}

import { useSyncExternalStore } from "react";
import { byId, BOXES, BUILD, type Item, type Option } from "../menu";

/**
 * The order: lines of a customised item or a box, totalled. A tiny
 * external store so the menu bands, the customiser and the order panel
 * share it without a state library. Nothing is sent anywhere.
 */
export interface Line { key: string; name: string; qty: number; unit: number; cal: number; summary: string; url?: string }

let lines: Line[] = [];
const subs = new Set<() => void>();
const emit = () => subs.forEach((s) => s());

export function priceOf(item: Item, choices: Record<string, string>, extras: string[]) {
  let price = item.price, cal = item.cal;
  for (const o of item.options ?? []) {
    const c = o.choices.find((x) => x.id === (choices[o.id] ?? o.default));
    if (c) { price += c.price ?? 0; cal += c.cal ?? 0; }
  }
  for (const e of extras) { const a = [...(item.addons ?? []), ...(item.sauces ?? [])].find((x) => x.id === e); if (a) { price += a.extra ?? 0; cal += a.cal ?? 0; } }
  return { price: Math.max(0, Math.round(price * 100) / 100), cal: Math.max(0, cal) };
}

export function summarise(item: Item, removed: string[], extras: string[], choices: Record<string, string>) {
  const parts: string[] = [];
  for (const o of item.options ?? []) { const id = choices[o.id] ?? o.default; if (id !== o.default) parts.push(o.choices.find((c) => c.id === id)?.name ?? id); }
  for (const r of removed) parts.push(`no ${item.ingredients.find((i) => i.id === r)?.name.toLowerCase() ?? r}`);
  for (const e of extras) parts.push(`+ ${[...(item.addons ?? []), ...(item.sauces ?? [])].find((a) => a.id === e)?.name.toLowerCase() ?? e}`);
  return parts.join(", ");
}

function push(line: Omit<Line, "qty"> & { qty?: number }) {
  const qty = line.qty ?? 1;
  const existing = lines.find((l) => l.key === line.key);
  lines = existing ? lines.map((l) => (l.key === line.key ? { ...l, qty: l.qty + qty } : l)) : [...lines, { ...line, qty }];
  emit();
}

export function addLine(itemId: string, qty: number, removed: string[], extras: string[], choices: Record<string, string>) {
  const item = byId[itemId];
  const { price, cal } = priceOf(item, choices, extras);
  const summary = summarise(item, removed, extras, choices);
  push({ key: `${itemId}|${summary}`, name: item.name, qty, unit: price, cal, summary, url: item.url });
}

/** A box: the components chosen for each slot and a drink, at the box price. */
export function addBox(boxId: string, picks: Record<string, string>, drinkId: string) {
  const box = BOXES.find((b) => b.id === boxId)!;
  const names = box.slots.map((s) => byId[picks[s.id] ?? s.itemId].name);
  const drink = box.drink.choices.find((c) => c.id === drinkId) ?? box.drink.choices[0];
  const cal = box.slots.reduce((s, sl) => s + byId[picks[sl.id] ?? sl.itemId].cal, 0) + (drink.cal ?? 0);
  push({ key: `box:${boxId}|${names.join("+")}|${drink.id}`, name: box.name, unit: box.price, cal, summary: [...names, drink.name].join(", "), url: box.url });
}

export function addBuild(picks: Record<string, string>, drinkId: string) {
  const names = BUILD.groups.map((g) => byId[picks[g.id] ?? g.items[0]].name);
  const drink = BUILD.drink.choices.find((c) => c.id === drinkId) ?? BUILD.drink.choices[0];
  const cal = BUILD.groups.reduce((s, g) => s + byId[picks[g.id] ?? g.items[0]].cal, 0) + (drink.cal ?? 0);
  push({ key: `build|${names.join("+")}|${drink.id}`, name: BUILD.name, unit: BUILD.price, cal, summary: [...names, drink.name].join(", "), url: BUILD.url });
}

export function drinkCal(drink: Option, id: string) { return drink.choices.find((c) => c.id === id)?.cal ?? 0; }
export function setQty(key: string, qty: number) { lines = qty <= 0 ? lines.filter((l) => l.key !== key) : lines.map((l) => (l.key === key ? { ...l, qty } : l)); emit(); }
export function clearOrder() { lines = []; emit(); }

export function useOrder() {
  const snap = useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => lines, () => lines);
  const subtotal = snap.reduce((s, l) => s + l.unit * l.qty, 0);
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  const cal = snap.reduce((s, l) => s + l.cal * l.qty, 0);
  const count = snap.reduce((s, l) => s + l.qty, 0);
  return { lines: snap, subtotal, tax, total: Math.round((subtotal + tax) * 100) / 100, cal, count };
}

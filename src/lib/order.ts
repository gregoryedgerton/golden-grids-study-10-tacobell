import { useSyncExternalStore } from "react";
import { byId, COMBOS, type Item } from "../menu";

/**
 * The order: lines of a customised item, totalled. A tiny external store so
 * the menu bands, the customiser and the order panel share it without a
 * state library. Nothing is sent anywhere; Checkout says so.
 */
export interface Line { key: string; itemId: string; qty: number; removed: string[]; extras: string[]; choices: Record<string, string>; unit: number; cal: number; summary: string }

let lines: Line[] = [];
const subs = new Set<() => void>();
const emit = () => subs.forEach((s) => s());

export function priceOf(item: Item, choices: Record<string, string>, extras: string[]) {
  let price = item.price, cal = item.cal;
  for (const o of item.options ?? []) {
    const c = o.choices.find((x) => x.id === (choices[o.id] ?? o.default));
    if (c) { price += c.price ?? 0; cal += c.cal ?? 0; }
  }
  for (const e of extras) { const a = item.addons?.find((x) => x.id === e); if (a) { price += a.extra ?? 0; cal += a.cal ?? 0; } }
  return { price: Math.max(0, Math.round(price * 100) / 100), cal: Math.max(0, cal) };
}

export function summarise(item: Item, removed: string[], extras: string[], choices: Record<string, string>) {
  const parts: string[] = [];
  for (const o of item.options ?? []) { const id = choices[o.id] ?? o.default; if (id !== o.default) parts.push(o.choices.find((c) => c.id === id)?.name ?? id); }
  for (const r of removed) parts.push(`no ${item.ingredients.find((i) => i.id === r)?.name.toLowerCase() ?? r}`);
  for (const e of extras) parts.push(`+ ${item.addons?.find((a) => a.id === e)?.name.toLowerCase() ?? e}`);
  return parts.join(", ");
}

export function addLine(itemId: string, qty: number, removed: string[], extras: string[], choices: Record<string, string>) {
  const item = byId[itemId];
  const { price, cal } = priceOf(item, choices, extras);
  const summary = summarise(item, removed, extras, choices);
  const key = `${itemId}|${summary}`;
  const existing = lines.find((l) => l.key === key);
  lines = existing ? lines.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l)) : [...lines, { key, itemId, qty, removed, extras, choices, unit: price, cal, summary }];
  emit();
}
export function addCombo(comboId: string) {
  const combo = COMBOS.find((c) => c.id === comboId)!;
  const items = combo.items.map((id) => byId[id]);
  const cal = items.reduce((s, i) => s + i.cal, 0);
  const key = `combo:${comboId}`;
  const existing = lines.find((l) => l.key === key);
  lines = existing ? lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...lines, { key, itemId: key, qty: 1, removed: [], extras: [], choices: {}, unit: combo.price, cal, summary: items.map((i) => i.name).join(", ") }];
  emit();
}
export function nameOf(itemId: string) { return itemId.startsWith("combo:") ? `${COMBOS.find((c) => c.id === itemId.slice(6))?.name ?? "Combo"} combo` : byId[itemId]?.name ?? itemId; }
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

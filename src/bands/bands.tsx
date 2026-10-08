import type React from "react";
import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import type { PlacementValue } from "@gifcommit/golden-grids";
import { useViewport, pick, type Viewport } from "../lib/viewport";
import { useExpandGroup, ExpandedCell } from "../lib/expand";
import { Fact } from "../lib/boxes";
import { Band } from "./Band";
import { Customizer, ComboView } from "../lib/Customizer";
import { money, type Item, type Category, type Combo } from "../menu";
import photos from "../photos.json";

/**
 * A category is a band: its items as squares, the first in the hero. An
 * item's square is its photograph with name, price and calories over the
 * foot; choosing it expands the square into the customiser (remove, add,
 * swap, size, quantity, add to order). Below desktop a run of five or more
 * is dealt into two grids so no square falls under about 114px. Each
 * category has its own orientation, so eight bands turn through the eight.
 */
type O = [PlacementValue, boolean];
const orient = (v: Viewport, desktop: O, mobile: O) => pick<O>(v, { mobile, tablet: desktop, desktop });
function Grids({ boxes, placement, cw, split }: { boxes: React.ReactNode[]; placement: PlacementValue; cw: boolean; split: boolean }) {
  if (!split || boxes.length < 5) return <GoldenGrid from={1} to={boxes.length} placement={placement} clockwise={cw}>{boxes}</GoldenGrid>;
  const first = 3, rest = boxes.length - first;
  return (
    <div className="stack">
      <GoldenGrid from={1} to={first} placement="top" clockwise={cw}>{boxes.slice(0, first)}</GoldenGrid>
      <GoldenGrid from={1} to={rest} placement={rest % 2 ? "bottom" : "right"} clockwise={!cw}>{boxes.slice(first)}</GoldenGrid>
    </div>
  );
}
const noteFor = (v: Viewport, n: number, placement: PlacementValue, cw: boolean) => v !== "desktop" && n >= 5 ? `two grids: from=1 to=3 · placement="top" / from=1 to=${n - 3}` : `from=1 to=${n} · placement="${placement}" · clockwise=${cw}`;
const src = (key?: string) => `${import.meta.env.BASE_URL}assets/s10-${key ?? "crunchy"}.jpg`;
const PHOTOS = photos as Record<string, { credit: string; licence: string; page: string }>;
export { PHOTOS, src };

const TAGS: Record<string, string> = { vegetarian: "V", spicy: "🌶", new: "New", value: "$" };

export function ItemCard({ item, x, slotKey }: { item: Item; x: ReturnType<typeof useExpandGroup>; slotKey: string }) {
  return (
    <>
      <figure className="media">
        <img src={src(item.photo)} alt="" loading="lazy" />
        <button className="media__open" {...x.triggerProps(slotKey)}><span className="visually-hidden">Customise {item.name}, {money(item.price)}, {item.cal} calories</span></button>
        <figcaption className="media__caption">
          <span className="media__name">{item.name}{item.tags?.map((t) => <span key={t} className={`tag tag--${t}`} aria-label={t}>{TAGS[t]}</span>)}</span>
          <span className="media__meta"><strong>{money(item.price)}</strong> · {item.cal} cal</span>
          <span className="media__desc">{item.desc}</span>
        </figcaption>
      </figure>
      {x.isOpen(slotKey) && (
        <ExpandedCell id={x.panelId(slotKey)} title={`${item.name} · ${money(item.price)} · ${item.cal} cal`} onClose={x.close} closeRef={x.closeRef}>
          <div className="cell__split">
            <figure className="cell__photo"><img src={src(item.photo)} alt="" /><figcaption className="note">Photograph: {PHOTOS[item.photo ?? "crunchy"].credit}, <a href={PHOTOS[item.photo ?? "crunchy"].page}>Wikimedia Commons</a>, {PHOTOS[item.photo ?? "crunchy"].licence}. A stand-in; the item is invented.</figcaption></figure>
            <Customizer item={item} onAdded={() => {}} />
          </div>
        </ExpandedCell>
      )}
    </>
  );
}

const ORIENT: Record<string, [O, O]> = {
  tacos: [["right", true], ["top", true]], burritos: [["top", true], ["right", true]], bowls: [["bottom", false], ["left", false]], sides: [["top", false], ["right", false]],
  breakfast: [["bottom", true], ["left", true]], drinks: [["left", false], ["bottom", false]], value: [["top", true], ["left", true]], combos: [["bottom", false], ["right", false]],
};

export function MenuBand({ category, items }: { category: Category; items: Item[] }) {
  const v = useViewport();
  const x = useExpandGroup();
  const [d, m] = ORIENT[category.id] ?? [["right", true], ["top", true]];
  const [placement, cw] = orient(v, d, m);
  const boxes = items.map((it) => <GoldenBox key={it.id} {...x.boxProps(it.id)}><ItemCard item={it} x={x} slotKey={it.id} /></GoldenBox>);
  if (items.length === 2) boxes.push(<GoldenBox key="word"><Fact label={category.name} fitClass="fit--word" max={120} tone="brand">{String(items.length)} items</Fact></GoldenBox>);
  return (
    <Band id={category.id} title={category.name} lesson={category.blurb} note={noteFor(v, boxes.length, placement, cw)}>
      <Grids placement={placement} cw={cw} split={v !== "desktop"} boxes={boxes} />
    </Band>
  );
}

/** Value: the seven cheapest things, price as the line. */
export function ValueBand({ items }: { items: Item[] }) {
  const v = useViewport();
  const x = useExpandGroup();
  const [placement, cw] = orient(v, ["top", true], ["left", true]);
  const list = items.slice(0, 7);
  return (
    <Band id="value" title="Value menu" lesson="Seven things under three dollars, cheapest first. The price is the point, so the price is the line." note={noteFor(v, list.length, placement, cw)}>
      <Grids placement={placement} cw={cw} split={v !== "desktop"} boxes={list.map((it) => (
        <GoldenBox key={it.id} {...x.boxProps(it.id)}>
          <Fact label={it.name} fitClass="fit--num" max={120} tone="value" imprint={<svg className="box__imprint" viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="21" textAnchor="middle" fontSize="24" fontWeight="700" fill="currentColor" fontFamily="Oswald, sans-serif">$</text></svg>}
            body={<><p className="box__body--short">{it.desc}</p><p className="box__body--long">{it.desc} {it.cal} calories.</p></>}
            expand={{ group: x, slotKey: it.id, title: `${it.name} · ${money(it.price)}`, full: <Customizer item={it} onAdded={() => {}} /> }}>
            {money(it.price)}
          </Fact>
        </GoldenBox>
      ))} />
    </Band>
  );
}

export function CombosBand({ combos }: { combos: Combo[] }) {
  const v = useViewport();
  const x = useExpandGroup();
  const [placement, cw] = orient(v, ["bottom", false], ["right", false]);
  return (
    <Band id="combos" title="Combos" lesson="An entrée, a side and a medium drink, priced a dollar or two under the three apart. Choose one to see what is in it and what it saves." note={noteFor(v, combos.length, placement, cw)}>
      <Grids placement={placement} cw={cw} split={v !== "desktop"} boxes={combos.map((c) => (
        <GoldenBox key={c.id} {...x.boxProps(c.id)}>
          <figure className="media">
            <img src={src(c.photo)} alt="" loading="lazy" />
            <button className="media__open" {...x.triggerProps(c.id)}><span className="visually-hidden">Open combo: {c.name}, {money(c.price)}</span></button>
            <figcaption className="media__caption"><span className="media__name">{c.name} combo</span><span className="media__meta"><strong>{money(c.price)}</strong></span><span className="media__desc">{c.blurb}</span></figcaption>
          </figure>
          {x.isOpen(c.id) && <ExpandedCell id={x.panelId(c.id)} title={`${c.name} combo · ${money(c.price)}`} onClose={x.close} closeRef={x.closeRef}><ComboView combo={c} onAdded={() => {}} /></ExpandedCell>}
        </GoldenBox>
      ))} />
    </Band>
  );
}

import type React from "react";
import { GoldenGrid, GoldenBox } from "@gifcommit/golden-grids";
import type { PlacementValue } from "@gifcommit/golden-grids";
import { useViewport, pick, type Viewport } from "../lib/viewport";
import { useExpandGroup, ExpandedCell } from "../lib/expand";
import { Fact } from "../lib/boxes";
import { Band } from "./Band";
import { Customizer, BoxView, BuildView } from "../lib/Customizer";
import { money, byId, BOXES, BUILD, LISTS, inCategory, type Item, type Category, type Box } from "../menu";
import photos from "../photos.json";

/** The real Taco Bell app, where the reference's "Order" controls lead. */
export const APP_URL = "https://apps.apple.com/us/app/taco-bell-fast-food-deals/id497387361";
export const PLAY_URL = "https://play.google.com/store/apps/details?id=com.tacobell.ordering";

/**
 * A category is a band: its items as squares, the first in the hero. An
 * item's square is a photograph of the real item (a third party's, from
 * Commons) with its name, price and calories over the foot; choosing it
 * expands the square into the customiser. A category with more items than
 * the band shows ends with a square that says how many more, linking to
 * the category on tacobell.com. Below desktop a run of five or more is
 * dealt into two grids so no square falls under about 114px.
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
const src = (key?: string) => `${import.meta.env.BASE_URL}assets/s10-${key ?? "crunchy-taco"}.jpg`;
const PHOTOS = photos as Record<string, { credit: string; licence: string; page: string; exact?: boolean; shows?: string }>;
export { PHOTOS, src };
const TAGS: Record<string, string> = { vegetarian: "V", spicy: "🌶", new: "New", value: "$", online: "Online" };

function Credit({ photo }: { photo?: string }) {
  const p = PHOTOS[photo ?? "crunchy-taco"];
  return <figcaption className="note">Photograph{p.shows ? ` of ${p.shows}` : ""}: {p.credit}, <a href={p.page}>{p.page.includes("flickr") ? "Flickr" : "Wikimedia Commons"}</a>, {p.licence}. A fan's photograph, not the chain's.</figcaption>;
}

/** No fan photograph of the exact item under a free licence: the square is type. */
function TypeCard({ item, x, slotKey, compact }: { item: Item; x: ReturnType<typeof useExpandGroup>; slotKey: string; compact?: boolean }) {
  if (compact) {
    // In the two smallest squares a long name cannot be set legibly; the price is the line and the name is spoken.
    return (
      <Fact fitClass="fit--num" max={120} tone="paper" spoken={`${item.name}, ${money(item.price)}, ${item.cal} calories`} body={<p>{item.name}</p>}
        expand={{ group: x, slotKey, title: `${item.name} · ${money(item.price)} · ${item.cal} cal`, full: <Customizer item={item} onAdded={() => {}} /> }}>
        {money(item.price)}
      </Fact>
    );
  }
  return (
    <Fact label={`${money(item.price)} · ${item.cal} cal`} fitClass="fit--name" max={120} tone="paper"
      body={<><p className="box__body--short">{item.desc}</p><p className="box__body--long">{item.desc} {item.long ?? ""}</p></>}
      expand={{ group: x, slotKey, title: `${item.name} · ${money(item.price)} · ${item.cal} cal`, full: <Customizer item={item} onAdded={() => {}} /> }}>
      {item.name}
    </Fact>
  );
}

export function ItemCard({ item, x, slotKey, compact }: { item: Item; x: ReturnType<typeof useExpandGroup>; slotKey: string; compact?: boolean }) {
  if (!item.photo || !PHOTOS[item.photo]?.exact) return <TypeCard item={item} x={x} slotKey={slotKey} compact={compact} />;
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
          <div className="cell__split"><figure className="cell__photo"><img src={src(item.photo)} alt="" /><Credit photo={item.photo} /></figure><Customizer item={item} onAdded={() => {}} /></div>
        </ExpandedCell>
      )}
    </>
  );
}

function BoxCard({ box, x }: { box: Box; x: ReturnType<typeof useExpandGroup> }) {
  return (
    <>
      <figure className="media">
        <img src={src(box.photo)} alt="" loading="lazy" />
        <button className="media__open" {...x.triggerProps(box.id)}><span className="visually-hidden">Open {box.name}, {money(box.price)}, {box.calRange} calories</span></button>
        <figcaption className="media__caption"><span className="media__name">{box.name}{box.tags?.map((t) => <span key={t} className={`tag tag--${t}`} aria-label={t}>{TAGS[t]}</span>)}</span><span className="media__meta"><strong>{money(box.price)}</strong> · {box.calRange} cal</span><span className="media__desc">{box.blurb}</span></figcaption>
      </figure>
      {x.isOpen(box.id) && <ExpandedCell id={x.panelId(box.id)} title={`${box.name} · ${money(box.price)}`} onClose={x.close} closeRef={x.closeRef}><div className="cell__split"><figure className="cell__photo"><img src={src(box.photo)} alt="" /><Credit photo={box.photo} /></figure><BoxView box={box} onAdded={() => {}} /></div></ExpandedCell>}
    </>
  );
}

const ORIENT: Record<string, [O, O]> = {
  "best-sellers": [["top", true], ["right", true]], "luxe-value": [["bottom", false], ["left", false]], cantina: [["top", false], ["right", false]], boxes: [["bottom", true], ["left", true]],
  tacos: [["top", true], ["right", true]], burritos: [["bottom", false], ["left", false]], specialties: [["top", false], ["right", false]], quesadillas: [["bottom", true], ["left", true]],
  nachos: [["top", true], ["right", true]], snacks: [["bottom", false], ["left", false]], drinks: [["top", false], ["right", false]], vegetarian: [["bottom", true], ["left", true]], breakfast: [["top", true], ["right", true]],
};
/** Even counts take right/left; the table above is for odd counts, so an even band turns the pair a quarter. */
const forCount = ([d, m]: [O, O], n: number): [O, O] => (n % 2 === 0 ? [[d[0] === "top" ? "right" : "left", d[1]], [m[0] === "right" ? "top" : "bottom", m[1]]] : [d, m]);

export function MenuBand({ category }: { category: Category }) {
  const v = useViewport();
  const x = useExpandGroup();
  const all = LISTS[category.id] ? LISTS[category.id].map((id) => byId[id]) : inCategory(category.id);
  const show = Math.min(category.show ?? 7, all.length);
  const shown = all.slice(0, show);
  const more = all.length - show;
  // The first item is the hero. After it, items without a photograph take
  // the larger squares (type needs room), photographs the smaller ones (a
  // picture survives 57px; a name does not), and the "more" square sits
  // third, where it is still legible.
  const hasPhoto = (it: Item) => !!(it.photo && PHOTOS[it.photo]?.exact);
  const items = [shown[0], ...shown.slice(1).filter((it) => !hasPhoto(it)), ...shown.slice(1).filter(hasPhoto)];
  const boxes: React.ReactNode[] = items.map((it, i) => <GoldenBox key={it.id} {...x.boxProps(`${category.id}-${it.id}`)}><ItemCard item={it} x={x} slotKey={`${category.id}-${it.id}`} compact={i + (more > 0 ? 1 : 0) >= 4} /></GoldenBox>);
  if (more > 0) boxes.splice(Math.min(2, boxes.length), 0, <GoldenBox key="more"><Fact label={category.name} fitClass="fit--num" max={120} tone="brand" source={`${all.length} in all`} body={<p>{more} more in this category on the reference's menu.</p>}>{`+${more}`}</Fact></GoldenBox>);
  const n = boxes.length;
  const [d, m] = forCount(ORIENT[category.id] ?? [["top", true], ["right", true]], n);
  const [placement, cw] = orient(v, d, m);
  return (
    <Band id={category.id} title={category.name} lesson={category.blurb} note={noteFor(v, n, placement, cw)}>
      <Grids placement={placement} cw={cw} split={v !== "desktop"} boxes={boxes} />
    </Band>
  );
}

/** Boxes & combos: the three Luxe Boxes, Build Your Own, and two combos. */
export function BoxesBand({ category }: { category: Category }) {
  const v = useViewport();
  const x = useExpandGroup();
  const boxes: React.ReactNode[] = [
    ...BOXES.slice(0, 5).map((b) => <GoldenBox key={b.id} {...x.boxProps(b.id)}><BoxCard box={b} x={x} /></GoldenBox>),
    <GoldenBox key="build" {...x.boxProps("build")}>
      <figure className="media">
        <img src={src(BUILD.photo)} alt="" loading="lazy" />
        <button className="media__open" {...x.triggerProps("build")}><span className="visually-hidden">Build your own Luxe Cravings Box, {money(BUILD.price)}</span></button>
        <figcaption className="media__caption"><span className="media__name">{BUILD.name}<span className="tag tag--online">Online</span></span><span className="media__meta"><strong>{money(BUILD.price)}</strong> · {BUILD.calRange} cal</span><span className="media__desc">{BUILD.blurb}</span></figcaption>
      </figure>
      {x.isOpen("build") && <ExpandedCell id={x.panelId("build")} title={`${BUILD.name} · ${money(BUILD.price)}`} onClose={x.close} closeRef={x.closeRef}><BuildView onAdded={() => {}} /></ExpandedCell>}
    </GoldenBox>,
  ];
  const [d, m] = forCount(ORIENT.boxes, boxes.length);
  const [placement, cw] = orient(v, d, m);
  return (
    <Band id={category.id} title={category.name} lesson={category.blurb} note={noteFor(v, boxes.length, placement, cw)}>
      <Grids placement={placement} cw={cw} split={v !== "desktop"} boxes={boxes} />
    </Band>
  );
}

# Layout study — an interactive food menu, as GIFcommit

**Live:** [`https://gregoryedgerton.github.io/golden-grids-study-10-tacobell/`](https://gregoryedgerton.github.io/golden-grids-study-10-tacobell/)

An unaffiliated layout study. It rebuilds the structure of a quick-service
chain's interactive food menu — Taco Bell's menu and ordering flow, as they
are known: categories, item cards with price and calories, a customiser
that removes, adds and swaps, combos, a value menu and a running order —
as stacked golden grids for GIFcommit, a fictional taqueria. Every item,
name, price, calorie count and ingredient is invented; the photographs are
Wikimedia Commons files standing in for the invented items; the order
totals on the page and is never sent. The reference refused the capture
(tacobell.com returns a protocol error to automated browsers), so the
structure is from how the menu is known to be organised and no side-by-side
exists. Nothing of the chain's design, marks, menu or copy is reproduced.
Built with [Golden Grids](https://github.com/gregoryedgerton/golden-grids)
from the [study template](https://github.com/gregoryedgerton/golden-grids-study-template).

## Reference

Taco Bell's web and app menu, as of 2026, from knowledge of it: a sticky
row of categories (tacos, burritos, bowls, nachos and sides, breakfast,
drinks and sweets, a value menu, combos), each category a grid of equal
cards with a photograph, name, price and calories; an item opens a
customiser — the ingredients it comes with to remove, extras to add, a
protein, shell or size to pick, a quantity — with the price and calories
following every change and an Add to order control; an order drawer with
lines, quantities, subtotal, tax and total; a calorie disclaimer under the
menu. The register (a deep purple brand, a hot pink accent, white rounded
cards, condensed display type, calories everywhere) is the chain's as it is
widely known, not measured here; Oswald stands in for the display face.

## The claim

A menu is a grid of equal cards because a kiosk cannot know what you want;
a golden grid makes each category a ranking, the house item in the hero
square and the rest in descending squares, and the customiser opens in the
square itself, so the page never leaves the menu to take an order.

## The page

One page; `src/lib/Page.tsx` is the shell (brand bar, sticky category
strip, the menu, the order panel beside it at desktop and as a drawer at
the foot below). Each category is one band; an item's square is its
photograph with name, price and calories, and choosing it expands the
square into the customiser. Below desktop a run of five or more is dealt
into two grids so no square falls under about 114px. Measured sizes are the
grid's width×height at 390 / 820 / 1440 (the menu column is 924px at 1440
beside the 340px order panel).

| Band | Range · placement · cw (desktop) | Measured | What it holds |
| --- | --- | --- | --- |
| Tacos | 1–6 · right · cw | 2×(366×244) / 2×(796×531) / 924×569 | Crunchy, soft, supreme, grilled chicken, black bean, fiery steak |
| Burritos | 1–5 · top · cw | 366×244+183 / 796×531+398 / 924×578 | Bean, seasoned beef, grilled stuffed, chipotle chicken, veggie power |
| Bowls & salads | 1–3 · bottom · ccw | 366×549 / 796×531 / 924×616 | Power bowl, veggie bowl, taco salad |
| Nachos & sides | 1–5 · top · ccw | 366×244+183 / 796×531+398 / 924×578 | Nachos grande, chips & cheese, chips & salsa, quesadilla, rice & beans |
| Breakfast | 1–3 · bottom · cw | 366×549 / 796×531 / 924×616 | Breakfast burrito, breakfast taco, hash browns |
| Drinks & sweets | 1–4 · left · ccw | 366×610 / 796×478 / 924×554 | Fountain drink, horchata, cinnamon twists, churros |
| Value menu | 1–7 · top · cw | 366×244+220 / 796×531+478 / 924×572 | Seven items under $3, cheapest first, the price as the line |
| Combos | 1–5 · bottom · ccw | 366×244+183 / 796×531+398 / 924×578 | Five combos; each opens to its items and what it saves |

Six of the eight orientations appear; only the two even-count bands can be
landscape as `right`/`left`, so left·cw and right·ccw are unused.

## The subject

`src/menu.ts` is the whole menu: 26 items in six categories, each with
its ingredients (removable), optional extras with their price and calories,
and options (shell, protein, size, flavour) with per-choice deltas; five
combos; the value menu is derived (everything tagged value, by price). The
order ([`src/lib/order.ts`](src/lib/order.ts)) is an external store: lines
keyed by item and customisation, quantities, an 8.25% tax, totals and
calories; a combo is one line. All of it is fiction, and the calorie
disclaimer says so.

Photographs are Wikimedia Commons files under CC0, CC BY, CC BY-SA or
public domain, credited in the footer and in each open item, and recorded
in [`captures/commons.tsv`](captures/commons.tsv). They show real tacos,
burritos, bowls, nachos and drinks from other kitchens; none shows a chain's
product.

## How it works

- An item's square is a `.media` card: the photograph, a gradient foot with
  the name, price, calories and a line of description (dropped as the square
  shrinks), and the whole square as the control. Choosing it expands the
  square in place ([`src/lib/expand.tsx`](src/lib/expand.tsx)) into the
  customiser ([`src/lib/Customizer.tsx`](src/lib/Customizer.tsx)): checkboxes
  for what it comes with, radios for options, checkboxes for extras, a
  quantity, the live price and calories, Add to order. Close sits at the top
  right of the open cell, under the sticky category strip.
- The value squares are `Fact`s with the price fitted
  ([`src/lib/fit.tsx`](src/lib/fit.tsx), capped at 120px) on the value
  yellow, a large dollar sign imprinted behind; they open the same
  customiser.
- The order panel reads the store; Checkout and Clear say what they do, and
  Checkout sends nothing.
- Light is the brand's; dark is its night palette, by device preference.
- [`captures/scan.cjs`](captures/scan.cjs), Chrome and WebKit, 390 / 820 /
  1440, light and dark: nothing overflows, no fitted line under 12px, axe
  (WCAG 2.0/2.1/2.2 A/AA, best practice) clean with an item open. No
  screen-reader user has tested it.

## What did not

- No capture, so no side-by-side and no measured tokens.
- Thirteen photographs for twenty-six items: several items share one, and
  the hero of a category is whichever item came first, not a photograph
  chosen for the square.
- Only even-count bands can be landscape as `right`/`left`, so two
  orientations are unused.
- A combo is one order line at the combo price; the reference lets you
  customise each item inside a combo.

## Study tools

Hidden by default (`?tools=1` shows the panel); `g`, `n` and `m` toggle grid
outlines, band notes and reduced motion.

## Running and deploying

```bash
npm install
npm run dev
```

`npm run build` type-checks and builds to `dist/`; pushing to `main` deploys
to GitHub Pages. The library is consumed from npm at its published version,
never linked locally.

# Layout study — Taco Bell's food menu, as GIFcommit

**Live:** [`https://gregoryedgerton.github.io/golden-grids-study-10-tacobell/`](https://gregoryedgerton.github.io/golden-grids-study-10-tacobell/)

An unaffiliated layout study. It rebuilds Taco Bell's online food menu —
[tacobell.com/food](https://www.tacobell.com/food), its category pages
such as [Boxes & Combos](https://www.tacobell.com/food/boxes-and-combos),
and its item pages such as the
[Supreme Luxe Box](https://www.tacobell.com/food/deals-and-combos/supreme-luxe-box)
— as stacked golden grids under the GIFcommit brand, with the menu's own
facts as read on October 8, 2026: the categories in the site's order, each
item's name, price and calories, what it comes with, what can be added and
for how much, the "Make it" switches, the boxes' components and swaps, and
the Build Your Own box's groups. Choosing an item opens the site's
customiser in the square; choosing a box opens its components and swaps;
the order totals on the page and is never sent. The descriptions are the
study's words, the photographs are fans' photographs of the real items
under free licences, and nothing of the chain's photography, marks or
copy is reproduced. Built with
[Golden Grids](https://github.com/gregoryedgerton/golden-grids) from the
[study template](https://github.com/gregoryedgerton/golden-grids-study-template).

## Reference

tacobell.com refuses automated browsers, so the three pages and the
category and item pages behind them were read in the desktop app's browser
pane as text and link lists ([`captures/menu-capture.md`](captures/menu-capture.md)
records what was read); no page was saved and no screenshot of the site is
in this repo. The structure: a sticky row of categories; each category a
grid of equal cards (photograph, name, "$1.99 | 170 Cal", Add to order,
Customize); an item page with "Customer creations", "Make it your own"
(Supreme +$0.90, Fresco, Grilled), popular upgrades, what's included,
add-ons and sauces each with a price and calories; a box page listing each
component with Customize and Swap and a drink to choose; a Build Your Own
page with four groups. Tokens were measured in the pane
([`captures/tokens.md`](captures/tokens.md)): white ground, black text with
`#565656` secondary, purple `#501098` for actions and the active category,
`#9a23f8` as accent, 2px radii on buttons, Interstate (Bold Condensed for
category tabs and names), GT America for body, Brandon Grotesque Black for
the big headings. Barlow, Barlow Condensed and Montserrat 900 stand in.

## The claim

A menu is a grid of equal cards because a kiosk cannot know what you want;
a golden grid makes each category a ranking — the first item in the hero
square, the rest descending — and the customiser and the box's swaps open
in the square itself, so the page never leaves the menu to take an order.

## The page

One page; `src/lib/Page.tsx` is the shell (black brand bar, sticky
category strip in the site's order, the menu, the order panel beside it at
desktop and as a drawer at the foot below). Each category is one band of up
to seven items plus a "+N" square linking to the rest on tacobell.com. An
item with a fan photograph of that exact item is a photograph square; one
without is a type square (name, or in the two smallest squares the price,
with the name spoken). Below desktop a run of five or more is dealt into
two grids so no square falls under about 114px. Measured sizes are the
grid's width×height at 390 / 820 / 1440 (the menu column is 924px at 1440).

| Band | Items shown / listed | Range · placement · cw (desktop) | Measured |
| --- | --- | --- | --- |
| Best sellers | 7 / 12 | 1–8 · right · cw | 2×(366×244) / 2×(796×531) / 924×569 |
| Luxe Value Menu | 7 / 11 | 1–8 · left · ccw | 2×(366×244) / 2×(796×531) / 924×569 |
| Cantina Chicken Menu | 5 / 5 | 1–5 · top · ccw | 366×244+183 / 796×531+398 / 924×578 |
| Boxes & combos | 6 (3 Luxe Boxes, Build Your Own, 2 combos) | 1–6 · right · cw | 2×(366×244) / 2×(796×531) / 924×569 |
| Tacos | 7 / 7 | 1–7 · top · cw | 366×244+220 / 796×531+478 / 924×572 |
| Burritos | 7 / 7 | 1–7 · bottom · ccw | 366×244+220 / 796×531+478 / 924×572 |
| Specialties | 7 / 17 | 1–8 · right · ccw | 2×(366×244) / 2×(796×531) / 924×569 |
| Quesadillas | 3 / 3 | 1–3 · bottom · cw | 366×549 / 796×531 / 924×616 |
| Nachos | 3 / 3 | 1–3 · top · cw | 366×549 / 796×531 / 924×616 |
| Snacks & sweets | 7 / 30 | 1–8 · left · ccw | 2×(366×244) / 2×(796×531) / 924×569 |
| Drinks | 7 / 36 | 1–7 · top · ccw | 366×244+220 / 796×531+478 / 924×572 |
| Veggie Cravings | 7 / 17 | 1–8 · left · cw | 2×(366×244) / 2×(796×531) / 924×569 |
| Breakfast | 7 / 23 | 1–8 · right · cw | 2×(366×244) / 2×(796×531) / 924×569 |

## The subject

`src/menu.ts` carries 73 items across the site's categories with the
prices and calories it listed for its sample store (prices vary by
location), the add-on and sauce price list from its item pages (onions
+$0.50, tomatoes +$0.80, steak +$1.70, guacamole +$1.15 …), the "Make it"
switches, six boxes and combos with their components and swap lists, and
the Build Your Own box's three groups (7 specialties, 6 tacos and
burritos, 3 sides) with a medium drink. Facts are the site's; descriptions
are the study's.

Photographs are fans' photographs of the real items from Wikimedia Commons
and Flickr under CC BY, CC BY-SA or CC0 — a Crunchwrap Supreme, a Chalupa
Supreme, a Mexican Pizza, Nachos BellGrande, Doritos Locos Tacos, a Cantina
Chicken Bowl, a Breakfast Crunchwrap, a Discovery Luxe Box, a Luxe Cravings
Box, Cinnabon Delights and so on — credited in the footer, in each open
item, and in [`captures/commons.tsv`](captures/commons.tsv). Items with no
such photograph (the Beefy 5-Layer Burrito, the Bean Burrito, most drinks)
are type squares rather than a picture of something else. Reddit and other
fan posts without a reuse licence were not used.

## How it works

- An item square is a `.media` card (photograph, gradient foot with name,
  tags, "$ · cal" and a line of description) and the whole square is the
  control; a type square is a `Fact` with the name fitted
  ([`src/lib/fit.tsx`](src/lib/fit.tsx), 120px cap). Choosing either
  expands the square in place ([`src/lib/expand.tsx`](src/lib/expand.tsx))
  into the customiser ([`src/lib/Customizer.tsx`](src/lib/Customizer.tsx)):
  Make it, what's included, add-ons, sauces, quantity, live price and
  calories, Add to order. A box opens `BoxView` (each slot with its swaps, a
  drink); Build Your Own opens `BuildView` (one from each group). Close sits
  at the top right of the open cell, under the sticky strip.
- The order ([`src/lib/order.ts`](src/lib/order.ts)) is an external store:
  lines keyed by item and customisation, a box as one line at the box
  price, 8.25% tax, totals and calories. Checkout sends nothing and says so.
- Within a band the first item is the hero; after it, type squares take
  the larger squares and photographs the smaller, since a picture survives
  57px and a name does not; the "+N" square sits third.
- Light is the site's; dark is the study's, the same purple on near-black.
- [`captures/scan.cjs`](captures/scan.cjs), Chrome and WebKit, 390 / 820 /
  1440, light and dark: nothing overflows, no fitted line under 12px, axe
  (WCAG 2.0/2.1/2.2 A/AA, best practice) clean with an item open. No
  screen-reader user has tested it.

## What did not

- No capture of the reference's pixels, so no side-by-side; the structure
  and tokens are from what the browser pane could read.
- Of 73 items, 29 have a fan photograph of the exact item; the rest are
  type. The reference has a photograph for every item.
- Six boxes and combos of the site's seventeen; seven items of a category's
  thirty or thirty-six, with the rest a link.
- A box's swaps are the site's lists where the page showed them; the
  Cantina and value items' add-on lists are the generic one from the item
  pages read, which may differ by item.
- Only even-count bands can be landscape as `right`/`left`; the ORIENT table
  turns a pair a quarter for even counts, so which orientation a band gets
  depends on how many of its items are shown.

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

import type { ReactNode } from "react";
import { Tools } from "./tools";
import { CategoryStrip, OrderPanel, Disclaimer } from "./modules";
import { PHOTOS } from "../bands/bands";

/**
 * The shell: a brand bar with the store and the order, a sticky category
 * strip, the menu, and the order panel beside it at desktop (a bar at the
 * foot of the screen below). GIFcommit is a fictional taqueria.
 */
export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <Tools />
      <header className="brand">
        <div className="wrap brand__row">
          <a className="wordmark" href="./index.html"><span className="wordmark__mark" aria-hidden="true">G</span>GIFcommit</a>
          <p className="brand__store">A layout study of the Taco Bell menu · not the chain</p>
          <ul className="brand__links"><li>Menu</li><li>Rewards</li><li>Locations</li><li>Sign in</li></ul>
        </div>
      </header>
      <CategoryStrip />
      <div className="wrap layout">
        <main id="content">
          <h1 className="visually-hidden">Menu</h1>
          {children}
          <Disclaimer />
        </main>
        <OrderPanel />
      </div>
      <footer className="colophon wrap">
        <p>
          A layout study of Taco Bell's online food menu — <a href="https://www.tacobell.com/food">tacobell.com/food</a>, its category pages such as{" "}
          <a href="https://www.tacobell.com/food/boxes-and-combos">Boxes &amp; Combos</a>, and its item pages such as the{" "}
          <a href="https://www.tacobell.com/food/deals-and-combos/supreme-luxe-box">Supreme Luxe Box</a> — as read on October 8, 2026. The categories, item
          names, prices, calories, what each item includes, the add-ons and their prices, the boxes' components and swaps are the menu's own facts as the
          site listed them for its sample store; prices vary by location. GIFcommit is a layout-study brand, not the chain: the descriptions are the
          study's words, the photographs are fans' photographs of the real items, from Wikimedia Commons and Flickr under CC BY, CC BY-SA or CC0 (credited where they appear and below); items with no such photograph are shown as type, none
          of the chain's photography, marks or copy is reproduced, and the order on this page totals but is never sent. Built with{" "}
          <a href="https://github.com/gregoryedgerton/golden-grids">Golden Grids</a> · <a href="https://www.npmjs.com/package/@gifcommit/golden-grids">npm</a> ·{" "}
          <a href="https://gregoryedgerton.github.io/golden-grids/">generator</a>.
        </p>
        <details className="credits"><summary>Photograph credits</summary><ul>{Object.entries(PHOTOS).filter(([, p]) => p.exact).map(([k, p]) => <li key={k}><a href={p.page}>{p.shows ?? k}</a> — {p.credit}, {p.licence}.</li>)}</ul></details>
      </footer>
    </>
  );
}

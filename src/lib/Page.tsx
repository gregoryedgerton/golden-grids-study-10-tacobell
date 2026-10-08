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
          <p className="brand__store">Pickup · <strong>Main St.</strong> · Open until midnight</p>
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
          A layout study of a quick-service chain's interactive food menu, after Taco Bell's menu and ordering flow as they are known
          (tacobell.com refused the capture). GIFcommit is a fictional taqueria: every item, name, price, calorie count and ingredient is
          invented, nothing is a chain's product, and the order on this page totals but is never sent. Photographs are Wikimedia Commons
          files standing in for the invented items, credited where they appear and below. Nothing of the chain's design, marks or menu is
          reproduced. Built with <a href="https://github.com/gregoryedgerton/golden-grids">Golden Grids</a> ·{" "}
          <a href="https://www.npmjs.com/package/@gifcommit/golden-grids">npm</a> · <a href="https://gregoryedgerton.github.io/golden-grids/">generator</a>.
        </p>
        <details className="credits"><summary>Photograph credits</summary><ul>{Object.entries(PHOTOS).map(([k, p]) => <li key={k}><a href={p.page}>{k}</a> — {p.credit}, {p.licence}.</li>)}</ul></details>
      </footer>
    </>
  );
}

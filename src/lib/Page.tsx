import type { ReactNode } from "react";
import { Tools } from "./tools";
import { StudyBanner, StudyDisclosure } from "./study";
import { CategoryStrip, OrderPanel, Disclaimer } from "./modules";
import { PHOTOS, APP_URL, PLAY_URL } from "../bands/bands";

/**
 * The shell: a brand bar with the store and the order, a sticky category
 * strip, the menu, and the order panel beside it at desktop (a bar at the
 * foot of the screen below). GIFbell is a fictional taqueria.
 */
export function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <StudyBanner />
      <Tools />
      <header className="brand">
        <div className="wrap brand__row">
          <a className="wordmark" href="./index.html"><span className="wordmark__mark" aria-hidden="true">G</span>GIFbell</a>
          <p className="brand__store">A layout study of the Taco Bell menu · Crear Más</p>
          <ul className="brand__links"><li>Menu</li><li><a href={APP_URL}>App Store</a></li><li><a href={PLAY_URL}>Google Play</a></li></ul>
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
      <StudyDisclosure>
        <details className="credits"><summary>Photograph credits</summary><ul>{Object.entries(PHOTOS).filter(([, p]) => p.exact).map(([k, p]) => <li key={k}><a href={p.page}>{p.shows ?? k}</a> — {p.credit}, {p.licence}.</li>)}</ul></details>
        <p>To order, the real Taco Bell app is on the <a href={APP_URL}>App Store</a> and <a href={PLAY_URL}>Google Play</a>.</p>
      </StudyDisclosure>
    </>
  );
}

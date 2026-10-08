import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Page } from "../lib/Page";
import { useFontsReady } from "../lib/fonts";
import { MenuBand, BoxesBand } from "../bands/bands";
import { CATEGORIES } from "../menu";
import "../styles.css";

function App() {
  useFontsReady(["700 1em 'Barlow Condensed'", "900 1em Montserrat", "700 1em Barlow"]);
  return (
    <Page>
      {CATEGORIES.map((c) => (c.id === "boxes" ? <BoxesBand key={c.id} category={c} /> : <MenuBand key={c.id} category={c} />))}
    </Page>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Page } from "../lib/Page";
import { useFontsReady } from "../lib/fonts";
import { MenuBand, ValueBand, CombosBand } from "../bands/bands";
import { CATEGORIES, COMBOS, inCategory, valueItems } from "../menu";
import "../styles.css";

function App() {
  useFontsReady(["700 1em Oswald", "500 1em Oswald"]);
  return (
    <Page>
      {CATEGORIES.map((c) => {
        if (c.id === "value") return <ValueBand key={c.id} items={valueItems()} />;
        if (c.id === "combos") return <CombosBand key={c.id} combos={COMBOS} />;
        return <MenuBand key={c.id} category={c} items={inCategory(c.id)} />;
      })}
    </Page>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

import {Colour} from "coin-canvas-lib";
import useEscape from "../hooks/useEscape";
import "./Palette.scss";

export default function Palette(
  {
    selectedColour,
    onSelection
  }: {
    selectedColour: Colour | null,
    onSelection: (colour: Colour | null) => void
  }
) {

  // Clear colour on escape
  useEscape(() => onSelection(null));

  function onColourClick(c: Colour) {
    const didSelect = c.id == selectedColour?.id;
    onSelection(didSelect ? null : c);
  }

  const colourDivs = Colour.palette.map(
    c => <div
      className={`palette-colour ${c.id == selectedColour?.id ? "selected" : ""}`}
      style={{ background: c.cssStr }}
      onClick={() => onColourClick(c)}
      key={c.id}
    />
  );

  return (
    <div className="palette-container">
      <div className="palette">
        {colourDivs}
      </div>
    </div>
  );

}

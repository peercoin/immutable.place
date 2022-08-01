import {Colour} from "coin-canvas-lib";
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

  const colours = Colour.palette();

  function onColourClick(c: Colour) {
    const didSelect = c.id == selectedColour?.id;
    onSelection(didSelect ? null : c);
  }

  const colourDivs = colours.map(
    c => <div
      className={`palette-colour ${c.id == selectedColour?.id ? "selected" : ""}`}
      style={{ background: c.cssStr }}
      onClick={() => onColourClick(c)}
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

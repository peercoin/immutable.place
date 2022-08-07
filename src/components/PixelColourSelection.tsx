import {Colour, PixelData} from "coin-canvas-lib";
import {satsToCoinString} from "../utils/coin";
import {Fragment} from "react";

/* eslint-disable max-lines-per-function */
export default function PixelColourSelection(
  {
    colours,
    onHoverColour,
    onSelectColour
  }: {
    colours: PixelData,
    onHoverColour: (c: Colour | null) => void,
    onSelectColour: (c: Colour) => void
  }
) {

  function biCmp(a: bigint, b: bigint) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  const colourRows = colours.sort(
    (a, b) => -biCmp(a.balance, b.balance)
  ).map(data => (
    <div
      className="pixel-colour-row"
      key={data.colour.id.toString()}
      onMouseEnter={() => onHoverColour(data.colour)}
      onMouseLeave={() => onHoverColour(null)}
      onClick={() => onSelectColour(data.colour)}
    >
      <div className="pixel-colour" style={{ background: data.colour.cssStr }}></div>
      <div className="pixel-colour-name">{ data.colour.name }</div>
      <div className="pixel-colour-balance">
        { `${satsToCoinString(data.balance)} PPC` }
      </div>
    </div>
  ));

  return (
    <Fragment>
      <p>
        Select a colour that you would like to paint this pixel with. The
        colours are ordered by total amounts received. The colour with the
        highest amount is selected.
      </p>
      {colourRows}
    </Fragment>
  );

}
/* eslint-enable */


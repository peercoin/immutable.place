import "./PixelColourPayment.scss";
import {PixelData, PixelColourData} from "coin-canvas-lib";
import {satsToCoinString} from "../utils/coin";
import {Fragment} from "react";

const MIN_AMOUNT = BigInt(10000);

/* eslint-disable max-lines-per-function */
export default function PixelColourPayment(
  {
    colours, colourData, activeColour
  }: {
    colours: PixelData,
    colourData: PixelColourData,
    activeColour?: PixelColourData
  }
) {

  const maxReceived = colours.map(c => c.balance).reduce((a, b) => (a > b ? a : b));
  const selectedReceived = colourData.balance;
  const diffPlusOne = maxReceived - selectedReceived + BigInt(1);
  const toPay = diffPlusOne > MIN_AMOUNT ? diffPlusOne : MIN_AMOUNT;

  const newColour = activeColour === undefined
    || activeColour.colour.id !== colourData.colour.id;

  const amtStr = satsToCoinString(toPay, { short: true });

  return (
    <Fragment>
      <p>
        {
          newColour
            ? <Fragment>
              To change the colour to {colourData.colour.name}, please pay a
              minimum of {amtStr} PPC to the following address. You can scan the
              QR code to make payment. The required payment amount may be
              different if this pixel receives any other payments.
            </Fragment>
            : <Fragment>
              The colour {colourData.colour.name} is currently active but you
              may make an additional payment to make it more costly to change
              the colour. Please use the address and/or QR code below.
            </Fragment>
        }
      </p>
      <p className="payment-details">
        <b>Required Amount</b>: {amtStr} PPC<br/>
        <b>Address</b>: {colourData.address}
      </p>
    </Fragment>
  );

}
/* eslint-enable */


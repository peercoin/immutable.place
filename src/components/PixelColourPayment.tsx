import "./PixelColourPayment.scss";
import {PixelColourData, PixelCoord} from "coin-canvas-lib";
import {satsToCoinString} from "../utils/coin";
import {Fragment} from "react";
import {QRCodeSVG} from "qrcode.react";

const MIN_AMOUNT = BigInt(10000);

/* eslint-disable max-lines-per-function */
export default function PixelColourPayment(
  {
    pixel, colourData, activeColourData, onCancel, onConfirm
  }: {
    pixel: PixelCoord,
    colourData: PixelColourData,
    activeColourData: PixelColourData,
    onCancel: () => void,
    onConfirm: () => void
  }
) {

  const isNewColour = activeColourData.colour.id !== colourData.colour.id;

  let amtStr = "";

  if (isNewColour) {
    // Calculate the required amount for the new colour
    const maxReceived = activeColourData.balance;
    const selectedReceived = colourData.balance;
    const diffPlusOne = maxReceived - selectedReceived + BigInt(1);
    const toPay = diffPlusOne > MIN_AMOUNT ? diffPlusOne : MIN_AMOUNT;
    amtStr = satsToCoinString(toPay, { short: true });
  }

  const colourName = colourData.colour.name;
  const capitalColour = colourName.charAt(0).toUpperCase() + colourName.slice(1);
  const label = `Pixel%20(${pixel.x},%20${pixel.y})%20${capitalColour}`;

  const amtSegment = isNewColour ? `amount=${amtStr}&` : "";
  const uri = `peercoin:${colourData.address}?${amtSegment}label=${label}`;

  return (
    <Fragment>
      <p>
        {
          isNewColour
            ? <Fragment>
              To change the colour to {colourName}, please pay a minimum
              of {amtStr} PPC to the following address. You can scan the QR code
              to make payment. The required payment amount may be different if
              this pixel receives any other payments.
            </Fragment>
            : <Fragment>
              The colour {colourName} is currently active but you may make an
              additional payment to make it more costly to change the colour.
              Please use the address and/or QR code below.
            </Fragment>
        }
      </p>
      <p className="payment-details">
        {
          isNewColour
            ? <Fragment><b>Required Amount</b>: {amtStr} PPC<br/></Fragment>
            : null
        }
        <b>Address</b>: {colourData.address}
      </p>
      <QRCodeSVG
        className="payment-qr"
        value={uri}
        bgColor="#0000"
      />
      {
        isNewColour
          ? <p>
            <small>
              All confirmed payments will be counted, even if you press
              "Cancel". By clicking "I have made payment", the pixel will remain
              painted until it is refreshed or updated, but otherwise your
              transaction will not be counted until it is confirmed.
            </small>
          </p>
          : null
      }
      <p>
        <small>Payments are subject to the Terms of Use.</small>
      </p>
      {
        isNewColour
          ? <div className="payment-buttons">
            <button className="payment-cancel" onClick={onCancel}>Cancel</button>
            <button className="payment-confirm" onClick={onConfirm}>I have made payment</button>
          </div>
          : null
      }
    </Fragment>
  );

}
/* eslint-enable */


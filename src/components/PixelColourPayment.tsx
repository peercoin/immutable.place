import "./PixelColourPayment.scss";
import {PixelColourData, PixelCoord} from "coin-canvas-lib";
import {satsToCoinString} from "../utils/coin";
import {Fragment, useCallback, useState} from "react";
import {QRCodeSVG} from "qrcode.react";

const MIN_AMOUNT = BigInt(10000);

/* eslint-disable max-lines-per-function */
export default function PixelColourPayment(
  {
    pixel, colourData, activeColourData, onCancel, onConfirm, onTerms
  }: {
    pixel: PixelCoord,
    colourData: PixelColourData,
    activeColourData: PixelColourData,
    onCancel: () => void,
    onConfirm: () => void,
    onTerms: () => void
  }
) {

  const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

  const copyAddr = useCallback(async () => {
    await navigator.clipboard.writeText(colourData.address);
    setCopiedAddr(colourData.address);
    setTimeout(() => setCopiedAddr(null), 5000);
  }, [colourData.address]);

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
              of {amtStr} PPC to the following burn address. You can scan the QR
              code to make payment. The required payment amount may be different
              if this pixel receives any other payments.
            </Fragment>
            : <Fragment>
              The colour {colourName} is currently active but you may make an
              additional payment to make it more costly to change the colour.
              Please use the burn address and/or QR code below.
            </Fragment>
        }
      </p>
      <div className="payment-details">
        <QRCodeSVG
          className="payment-qr"
          value={uri}
          bgColor="#0000"
          fgColor="#fff"
        />
        <p className="payment-text">
          {
            isNewColour
              ? <Fragment><b>Required Amount</b>: {`${amtStr}\u00A0PPC`}<br/></Fragment>
              : null
          }
          <b>Address</b>: <b
            onClick={copyAddr} className="addr-copy"
          >
            { copiedAddr === colourData.address ? "Copied!" : "Copy ⧉" }
          </b>
          <div>{colourData.address}</div>
        </p>
      </div>
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
        <small>
          Payments are subject to the <a onClick={onTerms}>Terms of Use</a>.
        </small>
      </p>
      {
        isNewColour
          ? <div className="modal-button-container">
            <button className="secondary" onClick={onCancel}>Cancel</button>
            <button className="primary" onClick={onConfirm}>I have made payment</button>
          </div>
          : null
      }
    </Fragment>
  );

}
/* eslint-enable */


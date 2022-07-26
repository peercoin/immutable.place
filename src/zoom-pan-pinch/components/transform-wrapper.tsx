import React, { useImperativeHandle, useState } from "react";
import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "../models";
import { TransformContext } from "./transform-context";

// Not sure why a wrapper component is needed.
export const TransformWrapper = React.forwardRef(
  (
    props: Omit<ReactZoomPanPinchProps, "ref">,
    ref: React.Ref<ReactZoomPanPinchRef | null>
  ) => {
    const [innerRef, setRef] = useState<ReactZoomPanPinchRef | null>(null);

    useImperativeHandle(ref, () => innerRef, [innerRef]);

    return <TransformContext {...props} setRef={setRef} />;
  }
);

export default TransformWrapper;

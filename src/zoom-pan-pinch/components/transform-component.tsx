import React, { useContext, useEffect, useRef } from "react";
import "./transform-component.scss";
import { Context } from "./transform-context";

interface Props {
  children: React.ReactNode;
  wrapperClass?: string;
  contentClass?: string;
  wrapperStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

export default function TransformComponent({
  children,
  wrapperClass = "",
  contentClass = "",
  wrapperStyle,
  contentStyle
}: Props) {

  const { setComponents } = useContext(Context);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (wrapper !== null && content !== null) {
      setComponents(wrapper, content);
    }
  }, [setComponents]);

  return (
    <div
      ref={wrapperRef}
      className={`react-transform-wrapper ${wrapperClass}`}
      style={wrapperStyle}
    >
      <div
        ref={contentRef}
        className={`react-transform-component ${contentClass}`}
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );

}


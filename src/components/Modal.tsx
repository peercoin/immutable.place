import "./Modal.scss";
import {ReactNode} from "react";
import useEscape from "../hooks/useEscape";

export default function Modal(
  {
    children,
    title,
    topLeftElement,
    open,
    onClose = () => undefined
  }: {
    children: ReactNode,
    topLeftElement?: ReactNode,
    title: string,
    open: boolean,
    onClose?: () => void
  }
) {

  // Close the modal when the escape key is pressed
  useEscape(onClose);

  if (!open) return null;

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          {topLeftElement}
          {title}
          <div className="closeBtn" onClick={onClose}>×</div>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );

}

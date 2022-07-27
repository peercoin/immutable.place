import "./Modal.scss";
import {ReactNode} from "react";

export default function Modal(
  {
    children,
    title,
    open,
    onClose = () => undefined
  }: {
    children: ReactNode,
    title: string,
    open: boolean,
    onClose?: () => void
  }
) {

  if (!open) return null;

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          {title}
          <button className="closeBtn" onClick={onClose}>Close X</button>
        </div>
        {children}
      </div>
    </div>
  );

}

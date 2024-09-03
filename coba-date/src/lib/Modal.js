import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, isOpen = false }) => {
    const divRef = useRef(document.createElement("div"));

    useEffect(() => {
        const currentDiv = divRef.current;
        currentDiv.classList.add("Modal-Portal");
        document.body.appendChild(currentDiv);

        return () => {
            ReactDOM.unmountComponentAtNode(currentDiv);
            document.body.removeChild(currentDiv);
        };
    }, []);

    return isOpen ? ReactDOM.createPortal(children, divRef.current) : null;
};

export default Modal;

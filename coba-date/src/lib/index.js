import "./index.css";
import React from "react";
import DatePicker from "./DatePicker.js";
import Modal from "./Modal.js";
import { defaultProps } from "./dataSource";

function EnhanceDatePicker({ isOpen, onCancel, ...props }) {
    function onModalClose(event) {
        if (event.target === event.currentTarget) {
            onCancel();
        }
    }

    return (
        <div
            style={{ display: isOpen ? "" : "none" }}
            onClick={onModalClose}
            className="datepicker-modal"
        >
            <DatePicker {...props} />
        </div>
    );
}

function ModalDatePicker({ isPopup, ...props }) {
    if (!isPopup) {
        return <DatePicker {...props} />;
    }

    return (
        <Modal {...props}>
            <EnhanceDatePicker {...props} />
        </Modal>
    );
}

ModalDatePicker.displayName = "MobileDatePicker";
ModalDatePicker.defaultProps = defaultProps;

export default ModalDatePicker;

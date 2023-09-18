import React from "react";
import {Card, Modal, ModalBody} from "reactstrap";

const QRCode = ({modal, setModal, qrcode}) => {
    const toggle = () => {
        setModal(false)
    }
    return <>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalBody>
                <Card className="gallery">
                    <img className="w-100 rounded-top" src={qrcode} alt="" />
                </Card>
            </ModalBody>
        </Modal>
    </>
}
export default QRCode
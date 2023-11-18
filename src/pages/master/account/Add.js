import React, {useState} from "react";
import {Button, Label, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Icon} from "../../../components";
import {actionType, Dispatch} from "../../../reducer";

const Add = ({open, setOpen, datatable}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bank: '',
        number: '',
        name: '',
        desc: ''
    });
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
        setFormData({
            bank: '',
            number: '',
            name: '',
            desc: ''
        });
    }
    return <>
        <Modal isOpen={open} toggle={toggle}>
            <ModalHeader
                toggle={toggle}
                close={
                    <button className="close" onClick={toggle}>
                        <Icon name="cross"/>
                    </button>
                }
            >
                TAMBAH REKENING
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    Dispatch(actionType.ACCOUNT_STORE, {
                        formData: formData,
                        setLoading: setLoading,
                        toggle: toggle,
                        setReload: datatable
                    }).then();
                }}>
                    <div className="form-group">
                        <Label htmlFor="bank" className="form-label">
                            Nama Bank
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="bank"
                                placeholder="Ex. BCA"
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="number" className="form-label">
                            Nomor Rekening
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="number"
                                placeholder="Ex. 12399484938"
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="name" className="form-label">
                            Nama Pemilik
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Ex. Muhammad Arif Muntaha"
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="desc" className="form-label">
                            Diskripsi
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="desc"
                                placeholder="Ex. Rekening Utama"
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Button
                            size="lg"
                            className="btn-block"
                            type="submit"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" color="light"/> : 'SIMPAN'}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    </>
}
export default Add
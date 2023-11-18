import React, {useState} from "react";
import {Button, Label, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Icon} from "../../../components";
import {actionType, Dispatch} from "../../../reducer";
const Add = ({open, setOpen, datatable}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
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
                TAMBAH GRUP
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    Dispatch(actionType.CATEGORY_STORE, {
                        formData: formData,
                        setLoading: setLoading,
                        toggle: toggle,
                        setReload: datatable
                    }).then();
                }}>
                    <div className="form-group">
                        <Label htmlFor="name" className="form-label">
                            Nama Grup
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Ex. Intenet"
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
                                placeholder="Ex. Pelanggan Internet"
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
                            {loading ? <Spinner size="sm" color="light" /> : 'SIMPAN' }
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    </>
}
export default Add;
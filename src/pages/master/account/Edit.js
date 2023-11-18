import React, {useEffect, useState} from "react";
import {Icon} from "../../../components";
import {Button, Label, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {actionType, Dispatch} from "../../../reducer";

const Edit = ({open, setOpen, datatable, account}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
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
            id: '',
            bank: '',
            number: '',
            name: '',
            desc: ''
        });
    }
    useEffect(() => {
        setFormData({
            id: account.id || '',
            bank: account.bank || '',
            number: account.number || '',
            name: account.name || '',
            desc: account.desc || ''
        });
    }, [account]);
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
                UBAH
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    Dispatch(actionType.ACCOUNT_UPDATE, {
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
                                value={formData.bank}
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
                                value={formData.number}
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
                                value={formData.name}
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
                                value={formData.desc}
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
export default Edit;
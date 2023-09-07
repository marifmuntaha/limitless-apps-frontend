import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import React, {useState} from "react";
import axios from "axios";
import HandleError from "../auth/handleError";

const Add = ({open, setOpen, datatable}) => {
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        desc: '',
        price: '',
        cycle: '',
        image: ''
    });
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/product`, formData, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            toggle();
            datatable(true);
        }).catch(error => {
            HandleError(error)
        });
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
    };

    return (
        <Modal isOpen={open} toggle={toggle}>
            <ModalHeader
                toggle={toggle}
                close={
                    <button className="close" onClick={toggle}>
                        <Icon name="cross"/>
                    </button>
                }
            >
                TAMBAH PRODUK
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <Label htmlFor="code" className="form-label">
                            Kode Produk
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="code"
                                placeholder="Ex. SRV-RDM"
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="name" className="form-label">
                            Nama Produk
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Ex. Server RDM"
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="desc" className="form-label">
                            Diskripsi Produk
                        </Label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                name="desc"
                                placeholder="Ex. Layanan Server RDM Murah"
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="price" className="form-label">
                                    Harga
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="price"
                                        placeholder="Ex. 250000"
                                        onChange={(e) => handleFormInput(e)}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="cycle" className="form-label">
                                    Siklus Tagihan
                                </Label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={[
                                            {value: '1', label: 'Bulanan'},
                                            {value: '2', label: '3 Bulan'},
                                            {value: '3', label: '6 Bulan'},
                                            {value: '4', label: 'Tahunan'},
                                        ]}
                                        onChange={(e) => {
                                            setFormData({...formData, cycle: e.value})
                                        }}
                                        placeholder="Pilih Siklus Tagihan"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Button size="lg" className="btn-block" type="submit" color="primary">
                            SIMPAN
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}
export default Add;
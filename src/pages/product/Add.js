import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, RSelect} from "../../components";
import React, {useState} from "react";
import {actionType, Dispatch} from "../../reducer";

const Add = ({open, setOpen, datatable}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        desc: '',
        price: '',
        cycle: '',
        image: ''
    });
    const cycleOption = [
        {value: '1', label: 'Bulanan'},
        {value: '2', label: '3 Bulan'},
        {value: '3', label: '6 Bulan'},
        {value: '4', label: 'Tahunan'},
    ];
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
        setFormData({
            code: '',
            name: '',
            desc: '',
            price: '',
            cycle: '',
            image: ''
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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    Dispatch(actionType.PRODUCT_STORE, {
                        formData: formData,
                        setLoading: setLoading,
                        toggle: toggle,
                        setReload: datatable
                    }).then();
                }}>
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
                                        options={cycleOption}
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
                        <Button
                            size="lg"
                            className="btn-block"
                            type="submit"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" color="light"/> : 'SIMPAN' }
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}
export default Add;
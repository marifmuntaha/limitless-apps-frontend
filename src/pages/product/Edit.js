import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import React, {useEffect, useState} from "react";
import axios from "axios";
import HandleError from "../auth/handleError";

const Edit = ({open, setOpen, datatable, product}) => {
    const [formData, setFormData] = useState({
        id: '',
        code: '',
        name: '',
        desc: '',
        price: '',
        cycle: '',
        image: ''
    });
    const [cycleSelected, setCycleSelected] = useState({});
    const cycleOption = [
        {value: '1', label:'Bulanan'},
        {value: '2', label:'3 Bulan'},
        {value: '3', label:'6 Bulan'},
        {value: '4', label:'Tahunan'},
    ]
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/product/${formData.id}`, formData, {
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
        setFormData({
            id: '',
            code: '',
            name: '',
            desc: '',
            price: '',
            cycle: '',
            image: ''
        });
    };
    useEffect(() => {
        setFormData({
            id: product.id || '',
            code: product.code || '',
            name: product.name || '',
            desc: product.desc || '',
            price: product.price || '',
            cycle: product.cycle,
            image: product.image || ''
        });
        setCycleSelected(() => {
            return cycleOption.filter((cycle) => {
                return product.cycle && cycle.value === product.cycle;
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

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
                UBAH PRODUK
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
                                value={formData.code}
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
                                value={formData.name}
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
                                value={formData.desc}
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
                                        value={formData.price}
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
                                            setFormData({...formData, cycle: e.value});
                                            setCycleSelected(e);
                                        }}
                                        value={cycleSelected}
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
export default Edit;
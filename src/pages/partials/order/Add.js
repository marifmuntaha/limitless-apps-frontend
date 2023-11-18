import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, RSelect} from "../../../components";
import React, {useContext, useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../../utils/Utils";
import {actionType, Dispatch} from "../../../reducer";
import {MemberContext} from "../../member/MemberContext";
import moment from "moment";

const Add = ({open, setOpen, datatable}) => {
    const {member} = useContext(MemberContext);
    const [loading, setLoading] = useState(false);
    const [due, setDue] = useState(new Date());
    const [formData, setFormData] = useState({
        member: '',
        product: '',
        price: '',
        cycle: '',
        due: setDateForPicker(moment().toDate()),

    });
    const [productOption, setProductOption] = useState([]);
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
        setFormData({
            member: '',
            product: '',
            price: '',
            cycle: '',
            due: setDateForPicker(moment().toDate()),
        })
    };

    useEffect(() => {
        setFormData({
            ...formData, member: member.id || ''
        });
    }, [member]);

    useEffect(() => {
        Dispatch(actionType.PRODUCT_GET,
            {setData: setProductOption},
            {type: 'select'}).then();
    }, []);

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
                    Dispatch(actionType.ORDER_STORE, {
                        formData: formData,
                        setLoading: setLoading,
                        setReload: datatable,
                        toggle: toggle
                    }).then()
                }}>
                    <div className="form-group">
                        <Label htmlFor="member" className="form-label">
                            Nama Pelanggan
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="member"
                                value={member ? member.name : ''}
                                onChange={(e) => handleFormInput(e)}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="product" className="form-label">
                                    Produk
                                </Label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={productOption}
                                        onChange={(e) => {
                                            setFormData({...formData, product: e.value})
                                        }}
                                        placeholder="Pilih Produk"
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
                                <Label htmlFor="due" className="form-label">
                                    Jatuh Tempo
                                </Label>
                                <div className="form-control-wrap">
                                    <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={due}
                                        onChange={(e) => {
                                            setDue(e);
                                            setFormData({...formData, due: setDateForPicker(e)})
                                        }}
                                        className="form-control date-picker"
                                    />{" "}
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Button size="lg" className="btn-block" type="submit" color="primary" disabled={loading}>
                            {loading ? <Spinner size="sm" color="light"/> : "SIMPAN"}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}
export default Add;
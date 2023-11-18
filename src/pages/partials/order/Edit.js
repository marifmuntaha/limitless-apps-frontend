import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, RSelect} from "../../../components";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import {setDateForPicker} from "../../../utils/Utils";
import {actionType, Dispatch} from "../../../reducer";

const Edit = ({open, setOpen, datatable, order}) => {
    const [loading, setLoading] = useState(false);
    const [due, setDue] = useState(moment(order.due, 'YYYY-MM-DD').toDate());
    const [formData, setFormData] = useState({
        id: '',
        member: '',
        product: '',
        cycle: '',
        price: '',
        due: '',
        status: ''

    });
    const [productSelected, setProductSelected] = useState([]);
    const [productOption, setProductOption] = useState([]);
    const [cycleSelected, setCycleSelected] = useState([]);
    const cycleOption = [
        {value: '1', label: 'Bulanan'},
        {value: '2', label: '3 Bulan'},
        {value: '3', label: '6 Bulan'},
        {value: '4', label: 'Tahunan'},
    ]
    const [statusSelected, setStatusSelected] = useState([]);
    const statusOption = [
        {value: '1', label: 'Aktif'},
        {value: '2', label: 'Disable'},
        {value: '3', label: 'Ditangguhkan'},
    ]
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
            member: '',
            product: '',
            cycle: '',
            price: '',
            due: '',
            status: ''
        });
    };

    useEffect(() => {
        Dispatch(actionType.PRODUCT_GET,
            {setData: setProductOption},
            {type: 'select'}).then(resp => {
            setProductSelected(() => {
                return resp.filter((product) => {
                    return order.product && product.value === order.product.id
                });
            });
        });

        setFormData({
            id: order.id,
            member: order.member ? order.member.id : '',
            product: order.product ? order.product.id : '',
            cycle: order.cycle || '',
            price: order.price || '',
            due: order.due || '',
            status: order.status || '',
        });

        setDue(moment(order.due || new Date(), 'YYYY-MM-DD').toDate());

        setCycleSelected(cycleOption.filter(cycle => {
            return order.cycle && cycle.value === order.cycle;
        }));
        setStatusSelected(statusOption.filter(status => {
            return order.status && status.value === order.status
        }));
    }, [order]);

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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    Dispatch(actionType.ORDER_UPDATE, {
                        formData: formData,
                        setLoading: setLoading,
                        setReload: datatable,
                        toggle: toggle
                    }).then();
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
                                value={order.member ? order.member.name : ''}
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
                                            setFormData({...formData, product: e.value});
                                            setProductSelected(e);
                                        }}
                                        value={productSelected}
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
                                            setCycleSelected(e);
                                        }}
                                        value={cycleSelected}
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
                                        value={formData.price}
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
                        <Label htmlFor="status" className="form-label">
                            Status
                        </Label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={statusOption}
                                onChange={(e) => {
                                    setFormData({...formData, status: e.value})
                                    setStatusSelected(e);
                                }}
                                value={statusSelected}
                            />
                        </div>
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
export default Edit;
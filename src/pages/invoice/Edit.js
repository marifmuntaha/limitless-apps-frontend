import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, RSelect} from "../../components";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";
import moment from "moment";
import {actionType, Dispatch} from "../../reducer";

const Edit = ({open, setOpen, datatable, invoice}) => {
    const [loading, setLoading] = useState(false);
    const [due, setDue] = useState(moment().toDate());
    const [productSelected, setProductSelected] = useState([]);
    const [productOption, setProductOption] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        member: '',
        product: '',
        desc: '',
        price: 0,
        discount: 0,
        fees: 0,
        amount: 0,
        due: setDateForPicker(due),
        status: ''
    });
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [fees, setFees] = useState(0);
    const [memberSelected, setMemberSelected] = useState([]);
    const [memberOption, setMemberOption] = useState([]);
    const [statusSelected, setStatusSelected] = useState([]);
    const statusOption = [
        {value: '1', label: 'Lunas'},
        {value: '2', label: 'Belum Lunas'},
        {value: '3', label: 'Batal'},
        {value: '4', label: 'Jatuh Tempo'},
    ]
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false,
            pay: false,
        });
        setFormData({
            id: '',
            member: '',
            product: '',
            desc: '',
            price: 0,
            discount: 0,
            fees: 0,
            amount: 0,
            due: setDateForPicker(moment().toDate()),
            status: ''
        })
    };
    useEffect(() => {
        Dispatch(actionType.MEMBER_GET,
            {setData: setMemberOption},
            {type: 'select'}).then();
    }, []);
    useEffect(() => {
        Dispatch(actionType.PRODUCT_GET,
            {setData: setProductOption},
            {type: 'select'}).then(resp => {
            setProductSelected(() => {
                return resp.filter((product) => {
                    return invoice.product && product.value === invoice.product.id;
                });
            });
        })
        setFormData({
            id: invoice.id || '',
            member: invoice.member ? invoice.member.id : '',
            product: invoice.product ? invoice.product.id : '',
            desc: invoice.desc || '',
            price: invoice.price || 0,
            discount: invoice.discount || 0,
            fees: invoice.fees || 0,
            amount: invoice.amount || 0,
            due: invoice.due || moment().format('YYYY-MM-DD'),
            status: invoice.status || ''
        });
        setMemberSelected(memberOption.filter((item) => {
            return item.value === invoice.member.id
        }));
        setStatusSelected(statusOption.filter(status => {
            return status.value === invoice.status
        }));
        setDue(() => {
            return invoice.due ? moment(invoice.due, 'YYYY-MM-DD').toDate() : moment().toDate();
        });
        setPrice(invoice.price || 0);
        setDiscount(invoice.discount || 0);
        setFees(invoice.fees || 0);
    }, [invoice]);
    useEffect(() => {
        setFormData({
            ...formData, amount: ((price || 0) - (discount || 0)) + (fees || 0)
        });
    }, [price, discount, fees]);
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
                TAMBAH
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    Dispatch(actionType.INVOICE_UPDATE, {
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
                            <RSelect
                                options={memberOption}
                                value={memberSelected}
                                onChange={(e) => {
                                    setFormData({...formData, member: e.value});
                                    setMemberSelected(e)
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="product" className="form-label">
                            Produk
                        </Label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={productOption}
                                onChange={(e) => {
                                    setProductOption(e);
                                    setFormData({...formData, product: e.value});
                                }}
                                value={productSelected}
                                placeholder="Pilih Produk"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="desc" className="form-label">
                            Keterangan
                        </Label>
                        <input
                            className="form-control"
                            type="text"
                            name="desc"
                            value={formData.desc}
                            onChange={(e) => {
                                handleFormInput(e)
                            }}
                        />
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
                                        onChange={(e) => {
                                            handleFormInput(e)
                                            setPrice(parseInt(e.target.value))
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="discount" className="form-label">
                                    Diskon
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={(e) => {
                                            handleFormInput(e)
                                            setDiscount(parseInt(e.target.value))
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="fees" className="form-label">
                                    Biaya Admin
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="fees"
                                        value={formData.fees}
                                        onChange={(e) => {
                                            handleFormInput(e)
                                            setFees(parseInt(e.target.value))
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="amount" className="form-label">
                                    Total
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={(e) => handleFormInput(e)}
                                        disabled={true}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="due" className="form-label">
                                    Jatuh Tempo
                                </Label>
                                <div className="form-control-wrap">
                                    <DatePicker
                                        dateFormat="dd-MM-yyyy"
                                        selected={due}
                                        onChange={(e) => {
                                            setDue(e);
                                            setFormData({...formData, due: setDateForPicker(e)})
                                        }}
                                        className="form-control date-picker"
                                    />{" "}
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="status" className="form-label">
                                    Status
                                </Label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={statusOption}
                                        onChange={(e) => {
                                            setStatusSelected(e);
                                            setFormData({...formData, status: e.value});
                                        }}
                                        value={statusSelected}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Button size="lg" className="btn-block" type="submit" color="primary">
                            {loading ? <Spinner size="sm" color="light"/> : "SIMPAN"}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    </>
}
export default Edit;
import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../../components";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../../utils/Utils";
import axios from "axios";
import HandleError from "../../auth/handleError";
import moment from "moment";

const Add = ({open, setOpen, datatable, invoice, ...params}) => {
    const [formDataPayment, setFormDataPayment] = useState({
        invoice: invoice.id || '',
        amount: invoice.amount || 0,
        method: '',
        at: setDateForPicker(new Date())
    });
    const [createdAt, setCreatedAt] = useState(moment().toDate());
    const [totalPayment, setTotalPayment] = useState(0);
    const [methodSelected, setMethodSelected] = useState([]);
    const [methodOption, setMethodOption] = useState([]);
    const handleMethodOption = async () => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/account`, {
            params: {
                type: 'select'
            },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setMethodOption(resp.data.result);
        }).catch(error => HandleError(error));
    }
    const handleFormInput = (e) => {
        setFormDataPayment({...formDataPayment, [e.target.name]: e.target.value});
    }
    const handlePaymentsData = async () => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/payment`, {
            params: {
                invoice: invoice.id || ''
            },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            let total = 0;
            setTotalPayment(() => {
                resp.data.result.forEach((payment) => {
                    total += parseInt(payment.amount);
                });
                return total
            })
        }).catch(error => HandleError(error));
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/payment`, formDataPayment, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            parseInt(invoice.amount) === totalPayment + formDataPayment.amount &&
            axios.put(`${process.env.REACT_APP_API_ENDPOINT}/invoice/${invoice.id}`, {
                desc: invoice.desc,
                price: invoice.price,
                discount: invoice.discount,
                fees: invoice.fees,
                amount: invoice.amount,
                status: '1',
                due: invoice.due,
            }, {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(resp => {
                toastSuccess('Terimakasih, tagihan telah lunas');
                toggle();
                datatable(true);
                params.setReload && params.setReload(true);
            }).catch(error => HandleError(error));
            axios.post(`${process.env.REACT_APP_API_ENDPOINT}/cashflow`, {
                payment: resp.data.result.id,
                type: '1',
                desc: resp.data.result.invoices.desc + '#' + resp.data.result.invoices.members.name,
                amount: resp.data.result.amount,
                method: resp.data.result.method,
            }, {
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).catch(error => HandleError(error));
        }).catch(error => HandleError(error));
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
        setMethodSelected([]);
    };
    useEffect(() => {
        setFormDataPayment({
            invoice: invoice.id || '',
            amount: invoice.amount || '',
            method: '',
            at: moment().format('YYYY-MM-DD')
        });
        handleMethodOption().then();
        handlePaymentsData().then();
        // eslint-disable-next-line
    }, [invoice]);

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
                PEMBAYARAN
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <Label htmlFor="member" className="form-label">
                            Nama Pelanggan
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="member"
                                value={invoice.member ? invoice.member.name : ''}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="desc" className="form-label">
                            Layanan
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="desc"
                                value={invoice.desc || ''}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="amount" className="form-label">
                                    Bayar
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="amount"
                                        value={formDataPayment.amount}
                                        onChange={(e) => handleFormInput(e)}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="cycle" className="form-label">
                                    Metode Pembayaran
                                </Label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={methodOption}
                                        onChange={(e) => {
                                            setFormDataPayment({...formDataPayment, method: e.value})
                                            setMethodSelected(e);
                                        }}
                                        value={methodSelected}
                                        placeholder="Pilih Metode Pembayaran"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="at" className="form-label">
                            Tanggal Pembayaran
                        </Label>
                        <div className="form-control-wrap">
                            <DatePicker
                                dateFormat="dd-MM-yyyy"
                                selected={createdAt}
                                onChange={(e) => {
                                    setCreatedAt(e)
                                    setFormDataPayment({...formDataPayment, at: setDateForPicker(e)})
                                }}
                                className="form-control date-picker"
                            />{" "}
                        </div>
                    </div>
                    <div className="form-group">
                        <Button size="lg" className="btn-block" type="submit" color="primary">
                            SIMPAN
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    </>
}
export default Add;
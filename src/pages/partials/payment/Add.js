import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../../components";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../../utils/Utils";
import moment from "moment";
import {actionType, Dispatch} from "../../../reducer";

const Add = ({open, setOpen, datatable, invoice, ...params}) => {
    const [loading, setLoading] = useState(false);
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
    const handleFormInput = (e) => {
        setFormDataPayment({...formDataPayment, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        Dispatch(actionType.PAYMENT_STORE, {
            formData: formDataPayment,
            setLoading: setLoading,
            toggle: toggle
        }).then(resp => {
            parseInt(invoice.amount) === totalPayment + formDataPayment.amount && Dispatch(actionType.INVOICE_UPDATE,{
                formData: {
                    id: invoice.id,
                    status: '1',
                },
                setLoading: setLoading,
                setReload: datatable,
                toggle: toggle
            }).then(() => {
                toastSuccess('Terimakasih, tagihan telah lunas');
                params.setReload && params.setReload(true);
            });
            Dispatch(actionType.CASHFLOW_STORE, {
                formData: {
                    payment: resp.id,
                    type: '1',
                    desc: resp.invoices.desc + '#' + resp.invoices.members.name,
                    amount: resp.amount,
                    method: resp.method,
                },
                setLoading: setLoading
            })
        })
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
        Dispatch(actionType.ACCOUNT_GET,
            {setData: setMethodOption},
            {type: "select"}).then();
        Dispatch(actionType.PAYMENT_GET, {}, {invoice: invoice.id}).then(resp => {
            let total = 0;
            setTotalPayment(() => {
                resp.forEach((payment) => {
                    total += parseInt(payment.amount);
                });
                return total
            })
        })
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
                            {loading ? <Spinner size="sm" color="light"/> : "SIMPAN" }
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    </>
}
export default Add;
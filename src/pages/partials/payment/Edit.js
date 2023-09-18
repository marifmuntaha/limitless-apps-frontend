import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../../components";
import {setDateForPicker} from "../../../utils/Utils";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import HandleError from "../../auth/handleError";

const Edit = ({open, setOpen, datatable, payment}) => {
    const methodOption = [
        {value: '1', label: 'Tunai'},
        {value: '2', label: 'BCA'},
        {value: '3', label: 'DANA'},
    ];
    const [methodSelected, setMethodSelected] = useState([]);
    const [createdAt, setCreatedAt] = useState(moment().toDate());
    const [formData, setFormData] = useState({
        id: '',
        invoice: '',
        amount: '',
        method: '',
        at: ''
    });
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/payment/${formData.id}`, formData,{
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            datatable(true);
            toggle();
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
        setFormData({
            id: payment.id || '',
            invoice: payment.invoice ? payment.invoice.id : '',
            amount: payment.amount || '',
            method: payment.method || '',
            at: payment.at || ''
        });
        setMethodSelected(methodOption.filter((option) => {
            return option.value === payment.method
        }));
        setCreatedAt(() => {
            return payment.length > 0 ? moment(payment.at, 'YYYY-MM-DD').toDate() : moment().toDate()
        });
        // eslint-disable-next-line
    }, [payment])
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
                UBAH PEMBAYARAN
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
                                value={payment.invoice ? payment.invoice.member.name : ''}
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
                                value={payment.invoice ? payment.invoice.desc : ''}
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
                                        value={formData.amount}
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
                                            setFormData({...formData, method: e.value})
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
                                selected={createdAt}
                                onChange={(e) => {
                                    setCreatedAt(e);
                                    setFormData({...formData, at: setDateForPicker(e)})
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
export default Edit
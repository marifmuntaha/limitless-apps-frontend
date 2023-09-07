import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../../../components";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../../../utils/Utils";
import axios from "axios";
import HandleError from "../../../auth/handleError";

const Add = ({open, setOpen, datatable, invoice, ...params}) => {
    const [formData, setFormData] = useState({
        invoice: invoice.id || '',
        amount: invoice.amount || '',
        method: '',
        at: setDateForPicker(new Date())
    });
    const [createdAt, setCreatedAt] = useState(new Date());
    const [totalPayment, setTotalPayment] = useState('');
    const [methodSelected, setMethodSelected] = useState([]);
    const methodOption = [
        {value: '1', label: 'Tunai'},
        {value: '2', label: 'BCA'},
        {value: '3', label: 'DANA'},
    ]
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
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
              return total.toString()
          })
      }).catch(error => HandleError(error));
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/payment`, formData, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            toggle();
            datatable(true);
            parseInt(invoice.amount) === parseInt(totalPayment) + parseInt(formData.amount) &&
                axios.put(`${process.env.REACT_APP_API_ENDPOINT}/invoice/${invoice.id}`, {
                    desc: invoice.desc,
                    amount: invoice.amount,
                    status: '2',
                    due: invoice.due,
                }, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(resp => {
                    toastSuccess('Terimakasih, tagihan telah lunas');
                    params.setReload && params.setReload(true);
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
        setFormData({
            invoice: invoice.id || '',
            amount: invoice.amount || '',
            method: '',
            at: setDateForPicker(new Date())
        });
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
export default Add;
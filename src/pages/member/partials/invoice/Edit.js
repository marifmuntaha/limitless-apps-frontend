import {Button, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../../../components";
import React, {useEffect, useState} from "react";
import axios from "axios";
import HandleError from "../../../auth/handleError";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../../../utils/Utils";
import moment from "moment";
const Edit = ({open, setOpen, datatable, invoice}) => {
    const [due, setDue] = useState(new Date());
    const [productSelected, setProductSelected] = useState([]);
    const [productOption, setProductOption] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        member: '',
        product: '',
        desc: '',
        amount: '',
        due: '',
        status: ''
    });
    const [statusSelected, setStatusSelected] = useState([]);
    const statusOption = [
        {value: '1', label: 'Belum Lunas'},
        {value: '2', label: 'Lunas'},
        {value: '3', label: 'Batal'},
    ]
    const handleProductOption = async () => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/product`, {
            params: {
                type: 'select'
            },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setProductOption(resp.data.result);
            setProductSelected(() =>{
                return resp.data.result.filter((product) => {
                    return invoice.product && product.value === invoice.product.id;
                });
            });
        }).catch(error => {
            HandleError(error);
        });
    }
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/invoice/${formData.id}`, formData, {
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
            edit: false,
            pay: false
        });
    };
    useEffect(() => {
        handleProductOption().then();
        setFormData({
            id: invoice.id || '',
            member: invoice.member ? invoice.member.id : '',
            product: invoice.product ? invoice.product.id : '',
            desc: invoice.desc || '',
            amount: invoice.amount || '',
            due: invoice.due || '',
            status: invoice.status || ''
        });
        setStatusSelected(statusOption.filter(status => {
            return status.value === invoice.status
        }));
        setDue(() => {
            return invoice.due && moment(invoice.due, 'YYYY-MM-DD').toDate()
        });
        // eslint-disable-next-line
    }, [invoice]);
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
                UBAH
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
                                onChange={(e) => handleFormInput(e)}
                                disabled
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
                        <Label htmlFor="amount" className="form-label">
                            Harga
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
                    </div>
                    <div className="form-group">
                        <Label htmlFor="due" className="form-label">
                            Jatuh Tempo
                        </Label>
                        <div className="form-control-wrap">
                            <DatePicker
                                selected={due}
                                onChange={(e) => {
                                    setDue(e);
                                    setFormData({...formData, due: setDateForPicker(e)})
                                }}
                                className="form-control date-picker"
                            />{" "}
                        </div>
                    </div>
                    <div className="form-group">
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
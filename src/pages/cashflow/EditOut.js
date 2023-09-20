import React, {useEffect, useState} from "react";
import {Button, Label, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";
import moment from "moment";
import axios from "axios";
import HandleError from "../auth/handleError";

const EditOut = ({open, setOpen, datatable, cashflow}) => {
    const [loading, setLoading] = useState(false);
    const [createdAt, setCreatedAt] = useState(moment().toDate());
    const [formData, setFormData] = useState({
        id: '',
        created_at: '',
        type: '2',
        desc: '',
        amount: 0,
        method: ''
    });
    const [methodOption, setMethodOption] = useState([]);
    const [methodSelected, setMethodSelected] = useState([]);
    const handleMethodOption = async () => {
        await axios.get(`/account`, {
            params: {
                type: 'select'
            },
        }).then(resp => {
            setMethodOption(resp.data.result);
        }).catch(error => HandleError(error));
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.put(`/cashflow/${formData.id}`, formData).then(resp => {
            toastSuccess(resp.data.message);
            toggle();
            datatable(true);
            setLoading(false);
        }).catch(error => {
            HandleError(error);
            setLoading(false);
        });
    }
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false,
            pay: false,
        });
    };
    useEffect(() => {
        handleMethodOption().then();
    }, []);
    useEffect(() => {
        setFormData({
            id: cashflow.id || '',
            created_at: cashflow.created_at || '',
            type: '2',
            desc: cashflow.desc || '',
            amount: cashflow.amount || '',
            method: cashflow.method ? cashflow.method.id : ''
        });
        setCreatedAt(cashflow.created_at ? moment(cashflow.created_at, 'YYYY-MM-DD').toDate() : moment().toDate());
        setMethodSelected(methodOption.filter((item) => {
            return cashflow.method && item.value === cashflow.method.id
        }));
        // eslint-disable-next-line
    }, [cashflow]);
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
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <Label htmlFor="create_at" className="form-label">
                            Tanggal
                        </Label>
                        <div className="form-control-wrap">
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={createdAt}
                                onChange={(e) => {
                                    setCreatedAt(e);
                                    setFormData({...formData, created_at: setDateForPicker(e)})
                                }}
                                className="form-control date-picker"
                            />{" "}
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-wrap">
                            <Label htmlFor="desc" className="form-label">
                                Keterangan
                            </Label>
                            <input
                                className="form-control"
                                type="text"
                                name="desc"
                                value={formData.desc}
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-control-wrap">
                            <Label htmlFor="amount" className="form-label">
                                Jumlah
                            </Label>
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
                        <Label htmlFor="method" className="form-label">
                            Metode
                        </Label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={methodOption}
                                value={methodSelected}
                                onChange={(e) => {
                                    setFormData({...formData, method: e.value})
                                    setMethodSelected(e);
                                }}
                                placeholder="Pilih Metode"
                            />
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
export default EditOut;
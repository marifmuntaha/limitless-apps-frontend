import React, {useEffect, useState} from "react";
import {Button, Label, Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import {setDateForPicker} from "../../utils/Utils";
import moment from "moment/moment";
import {Icon, RSelect, toastSuccess} from "../../components";
import DatePicker from "react-datepicker";
import axios from "axios";
import HandleError from "../auth/handleError";

const AddIn = ({open, setOpen, datatable}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        created_at: moment().format('YYYY-MM-DD'),
        type: '1',
        desc: '',
        amount: 0,
        method: ''
    });
    const [createdAt, setCreatedAt] = useState(moment().toDate());
    const [methodOption, setMethodOption] = useState([]);
    const [methodSelected, setMethodSelected] = useState([]);
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        await axios.post(`/cashflow`, formData).then(resp => {
            toastSuccess(resp.data.message);
            toggle();
            datatable(false);
            setLoading(false);
        }).catch(error => {
            HandleError(error);
            setLoading(false);
        });
    }
    const handleMethodData = async () => {
        await axios.get(`/account`, {
            params: {
                type: 'select'
            },
        }).then(resp => {
            setMethodOption(resp.data.result);
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        handleMethodData().then();
    }, []);
    const toggle = () => {
        setOpen({
            add: false,
            edit: false,
            pay: false,
        });
    };
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
                                placeholder="Ex. Pemasangan Baru"
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
                                placeholder="Ex. 500000"
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
export default AddIn;
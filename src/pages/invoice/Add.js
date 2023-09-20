import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import axios from "axios";
import HandleError from "../auth/handleError";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";
import moment from "moment";

const Add = ({open, setOpen, datatable, ...params}) => {
    const [loading, setLoading] = useState(false);
    const member = params.member;
    const [memberOption, setMemberOption] = useState([]);
    const [memberSelected, setMemberSelected] = useState([]);
    const [due, setDue] = useState(moment().toDate());
    const [formData, setFormData] = useState({
        member: '',
        desc: '',
        price: 0,
        discount: 0,
        fees: 0,
        amount: 0,
        due: setDateForPicker(moment().toDate())
    });
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [fees, setFees] = useState(0);
    const handleMemberOption = async () => {
        await axios.get(`/member`, {
            params: {
                type: 'select'
            }
        })
            .then(resp => setMemberOption(resp.data.result))
            .catch(error => HandleError(error));
    }
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post(`/invoice`, formData).then(resp => {
            toastSuccess(resp.data.message);
            toggle();
            datatable(true);
            setLoading(false);
        }).catch(error => {
            HandleError(error);
            setLoading(false);
        });
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false,
            pay: false,
        });
        setFormData({
            member: member ? member.id : '',
            desc: '',
            price: 0,
            discount: 0,
            fees: 0,
            amount: 0,
            due: setDateForPicker(moment().toDate())
        });
        member
            ? setMemberSelected(() => memberOption.filter((item) => {
                return item.value === member.id}))
            : setMemberSelected([]);
        setDue(moment().toDate());
    };
    useEffect(() => {
        handleMemberOption().then();
    }, []);
    useEffect(() => {
        if (member) {
            setFormData({
                ...formData, member: member.id
            });
            setMemberSelected(() => memberOption.filter((item) => {
                return item.value === member.id
            }));
        }
        // eslint-disable-next-line
    }, [member]);
    useEffect(() => {
        setFormData({
            ...formData, amount: ((price || 0) - (discount || 0)) + (fees || 0)
        });
        // eslint-disable-next-line
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
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <Label htmlFor="member" className="form-label">
                            Nama Pelanggan
                        </Label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={memberOption}
                                value={memberSelected}
                                onChange={(e) => {
                                    setFormData({...formData, member: e.value})
                                    setMemberSelected(e);
                                }}
                                placeholder="Pilih Pelanggan"
                            />
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
                                        placeholder="Ex. 450000"
                                        onChange={(e) => {
                                            handleFormInput(e)
                                            setPrice(parseInt(e.target.value));
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
                                        placeholder="Ex. 450000"
                                        onChange={(e) => {
                                            handleFormInput(e)
                                            setDiscount(parseInt(e.target.value));
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
                                        placeholder="Ex. 450000"
                                        onChange={(e) => {
                                            handleFormInput(e)
                                            setFees(parseInt(e.target.value));
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
                                        disabled={true}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
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
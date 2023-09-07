import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";
import axios from "axios";
import HandleError from "../auth/handleError";
import moment from "moment";

const Edit = ({open, setOpen, datatable, invoice}) => {
    const [due, setDue] = useState(new Date());
    const [formData, setFormData] = useState({
        id: '',
        member: '',
        desc: '',
        amount: '',
        due: '',
        status: ''
    });
    const [memberSelected, setMemberSelected] = useState([]);
    const [memberOption, setMemberOption] = useState([]);
    const [statusSelected, setStatusSelected] = useState([]);
    const statusOption = [
        {value: '1', label: 'Belum Lunas'},
        {value: '2', label: 'Lunas'},
        {value: '3', label: 'Batal'},
    ]
    const handleMemberData = async () => {
      await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/member`, {
          params: {
              type: 'select'
          },
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      }).then(resp => {
          setMemberOption(resp.data.result);
      }).catch(error => HandleError(error));
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
        }).catch(error => HandleError(error));
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false,
            pay: false,
        });
    };
    useEffect(() => {
        handleMemberData().then();
    }, []);
    useEffect(() => {
        setFormData({
            id: invoice.id || '',
            member: invoice.member ? invoice.member.id : '',
            desc: invoice.desc || '',
            amount: invoice.amount || '',
            due: invoice.due || '',
            status: invoice.status || ''
        });
        setMemberSelected(memberOption.filter((member) => {
            return invoice.member && member.value === invoice.member.id
        }));
        setStatusSelected(statusOption.filter((status) => {
            return invoice.status && status.value === invoice.status
        }))
        setDue(moment(invoice.due || new Date(), 'YYYY-MM-DD').toDate());
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
                                    setFormData({...formData, member: e.value});
                                    setMemberSelected(e)
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
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
                            </Col>
                            <Col sm="6">
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
                            </Col>
                        </Row>
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
                                value={statusSelected}
                                onChange={(e) => {
                                    setFormData({...formData, status: e.value});
                                    setStatusSelected(e)
                                }}
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
    </>
}
export default Edit;
import React, {useEffect, useState} from "react";
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import axios from "axios";
import HandleError from "../auth/handleError";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";

const Add = ({open, setOpen, datatable}) => {
    const [memberOption, setMemberOption] = useState([]);
    const [due, setDue] = useState(new Date());
    const [formData, setFormData] = useState({
        member: '',
        desc: '',
        amount: '',
        due: ''
    });
    const handleMemberOption = async () => {
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
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/invoice`, formData, {
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
        setFormData({
            member: '',
            desc: '',
            amount: '',
            due: ''
        });
    };
    useEffect(() => {
        handleMemberOption().then();
    }, []);
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
                                onChange={(e) => {
                                    setFormData({...formData, member: e.value})
                                }}
                                placeholder="Pilih Pelanggan"
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
                                    placeholder="Ex. Pemasangan Baru"
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
                                        placeholder="Ex. 450000"
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
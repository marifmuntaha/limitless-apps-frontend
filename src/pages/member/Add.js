import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, toastSuccess} from "../../components";
import React, {useState} from "react";
import axios from "axios";
import HandleError from "../auth/handleError";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";

const Add = ({open, setOpen, datatable}) => {
    const [installation, setInstallation] = useState(new Date());
    const [formDataUser, setFormDataUser] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
    });
    const [formDataMember, setFormDataMember] = useState({
        user: '',
        name: '',
        address: '',
        installation: setDateForPicker(installation),
        note: '',
    });
    const handleFormInputUser = (e) => {
        setFormDataUser({...formDataUser, [e.target.name]: e.target.value});
    }
    const handleFormInputMember = (e) => {
        setFormDataMember({...formDataMember, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/user`, formDataUser, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setFormDataMember({...formDataMember, user: resp.data.result.id});
            axios.post(`${process.env.REACT_APP_API_ENDPOINT}/member`, {
                user: resp.data.result.id,
                name: formDataMember.name,
                address: formDataMember.address,
                installation: formDataMember.installation,
                note: formDataMember.note
            }, {
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
        }).catch(error => HandleError(error));
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
    };

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
                TAMBAH
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <Label htmlFor="email" className="form-label">
                            Alamat Email
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="email"
                                placeholder="Ex. marifmuntaha@gmail.com"
                                onChange={(e) => handleFormInputUser(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="password" className="form-label">
                                    Kata Sandi
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="password"
                                        placeholder="Ex. ******"
                                        onChange={(e) => handleFormInputUser(e)}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="password_confirmation" className="form-label">
                                    Ulangi Sandi
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="Ex. ******"
                                        onChange={(e) => handleFormInputUser(e)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="name" className="form-label">
                            Nama Lengkap
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Ex. Muhammad Arif Muntaha"
                                onChange={(e) => {
                                    handleFormInputUser(e);
                                    handleFormInputMember(e);
                                }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="phone" className="form-label">
                            Nomor HP
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="phone"
                                placeholder="Ex. 6282229366507"
                                onChange={(e) => handleFormInputUser(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="address" className="form-label">
                            Alamat
                        </Label>
                        <div className="form-control-wrap">
                            <textarea
                                className="form-control"
                                name="address"
                                placeholder="Ex. Sukosono, Kedung, Jepara"
                                onChange={(e) => handleFormInputMember(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="instalation" className="form-label">
                            Tanggal Pemasangan
                        </Label>
                        <div className="form-control-wrap">
                            <div className="form-file">
                                <DatePicker
                                    selected={installation}
                                    onChange={setInstallation}
                                    className="form-control date-picker"/>{" "}
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="note" className="form-label">
                            Catatan
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="note"
                                placeholder="Ex. Pelanggan Baru"
                                onChange={(e) => handleFormInputMember(e)}
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
export default Add;
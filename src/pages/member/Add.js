import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, toastSuccess} from "../../components";
import React, {useState} from "react";
import axios from "axios";
import HandleError from "../auth/handleError";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";
import moment from "moment";

const Add = ({open, setOpen, datatable}) => {
    const [loading, setLoading] = useState(false);
    const [installation, setInstallation] = useState(moment().toDate());
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
        installation: setDateForPicker(moment().toDate()),
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
        setLoading(true);
        await axios.post(`/user`, formDataUser).then(resp => {
            setFormDataMember({
                ...formDataMember, user: resp.data.result.id
            });
            axios.post(`/member`, {
                user: resp.data.result.id,
                name: formDataMember.name,
                address: formDataMember.address,
                installation: formDataMember.installation,
                note: formDataMember.note
            }).then(resp => {
                toastSuccess(resp.data.message);
                toggle();
                datatable(true);
                setLoading(false);
            }).catch(error => {
                HandleError(error);
                setLoading(false);
            });
        }).catch(error => {
            HandleError(error);
            setLoading(false);
        });
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
        setFormDataUser({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            phone: '',
        });
        setFormDataMember({
            user: '',
            name: '',
            address: '',
            installation: setDateForPicker(moment().toDate()),
            note: '',
        })
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
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">+62</span>
                                </div>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="phone"
                                    placeholder="Ex. 82229366507"
                                    onChange={(e) => handleFormInputUser(e)}
                                />
                            </div>
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
                                    dateFormat="dd/MM/yyyy"
                                    selected={installation}
                                    onChange={(e) => {
                                        setInstallation(e);
                                        setFormDataMember({
                                            ...formDataMember, installation: setDateForPicker(e)
                                        })
                                    }}
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
                        <Button
                            size="lg"
                            className="btn-block"
                            type="submit"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" color="light"/> : 'SIMPAN' }
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}
export default Add;
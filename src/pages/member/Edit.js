import {Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, Spinner} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import React, {useEffect, useState} from "react";
import axios from "axios";
import HandleError from "../auth/handleError";
import moment from "moment";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../utils/Utils";

const Edit = ({open, setOpen, datatable, member}) => {
    const [loading, setLoading] = useState(false);
    const [formDataUser, setFormDataUser] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: '',
        image: ''
    });
    const [formDataMember, setFormDataMember] = useState({
        id: '',
        user: '',
        category: '',
        name: '',
        pppoe_user: '',
        pppoe_password: '',
        installation: setDateForPicker(moment().toDate()),
        address: '',
        note: '',
        status: ''
    });
    const [statusSelected, setStatusSelected] = useState([]);
    const [categorySelected, setCategorySelected] = useState([]);
    const [categoryOption, setCategoryOption] = useState([]);
    const [installation, setInstallation] = useState(moment().toDate());
    const statusOption = [
        {value: '1', label: 'Aktif'},
        {value: '2', label: 'Non Aktif'}
    ];
    const handleFormInputUser = (e) => {
        setFormDataUser({...formDataUser, [e.target.name]: e.target.value});
    }
    const handleFormInputMember = (e) => {
        setFormDataMember({...formDataMember, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.put(`/user/${formDataUser.id}`, formDataUser).then(() => {
            axios.put(`/member/${formDataMember.id}`, formDataMember).then(resp => {
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
    const handleCategoryOption = async () => {
        await axios.get('/category', {
            params: {
                type: 'select'
            }
        }).then(resp => {
            setCategoryOption(resp.data.result);
        }).catch(error => HandleError(error));
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
        setFormDataUser({
            id: '',
            name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            role: '',
            image: ''
        });
    };
    useEffect(() => {
        handleCategoryOption().then();
    }, []);
    useEffect(() => {
        setFormDataUser({
            id: member.user ? member.user.id : '',
            name: member.user ? member.user.name : '',
            email: member.user ? member.user.email : '',
            phone: member.user ? member.user.phone : '',
            password: member.user ? member.user.password : '',
            password_confirmation: member.user ? member.user.password : '',
            role: member.user ? member.user.role : '',
            image: member.image || ''
        });
        setFormDataMember({
            id: member.id || '',
            user: member.user || '',
            category: member.category ? member.category.id : '',
            name: member.name || '',
            pppoe_user: member.pppoe_user || '',
            pppoe_password: member.pppoe_password || '',
            installation: member.installation,
            address: member.address || '',
            note: member.note || '',
            status: member.status || '',
        });
        setStatusSelected(() => {
            return statusOption.filter((status) => {
                return status.value === member.status;
            });
        });
        setInstallation(member.installation ? moment(member.installation, 'YYYY-MM-DD').toDate() : moment().toDate());
        setCategorySelected(categoryOption.filter((category) => {
            return member.category && category.value === member.category.id
        }));
        // eslint-disable-next-line
    }, [member]);

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
                UBAH PELANGGAN
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="category">
                            Grup
                        </label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={categoryOption}
                                onChange={(e) => {
                                    setFormDataMember({...formDataMember, category: e.value});
                                    setCategorySelected(e);
                                }}
                                value={categorySelected}
                                placeholder="Pilih Grup"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="email" className="form-label">
                            Alamat Email
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="email"
                                value={formDataUser.email}
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
                                        placeholder="******"
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
                                        placeholder="******"
                                        onChange={(e) => handleFormInputUser(e)}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="name" className="form-label">
                                    Nama Pelanggan
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="name"
                                        value={formDataUser.name}
                                        onChange={(e) => {
                                            handleFormInputUser(e);
                                            handleFormInputMember(e);
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
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
                                            value={formDataUser.phone}
                                            onChange={(e) => handleFormInputUser(e)}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="pppoe_user" className="form-label">
                                    PPPOE User
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="pppoe_user"
                                        value={formDataMember.pppoe_user}
                                        onChange={(e) => {
                                            handleFormInputMember(e);
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="pppoe_password" className="form-label">
                                    PPPOE Password
                                </Label>
                                <div className="form-control-wrap">
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="pppoe_password"
                                        value={formDataMember.pppoe_password}
                                        onChange={(e) => handleFormInputMember(e)}
                                    />
                                </div>
                            </Col>
                        </Row>
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
                                value={formDataMember.address}
                                onChange={(e) => handleFormInputMember(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
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
                                                    ...formDataMember,
                                                    installation: setDateForPicker(e)
                                                });
                                            }}
                                            className="form-control date-picker"/>{" "}
                                    </div>
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="status" className="form-label">
                                    Status
                                </Label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={statusOption}
                                        onChange={(e) => {
                                            setFormDataMember({...formDataMember, member: e.value});
                                            setStatusSelected(e);
                                        }}
                                        value={statusSelected}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="image" className="form-label">
                            Gambar
                        </Label>
                        <div className="form-control-wrap">
                            <div className="form-file">
                                <Input
                                    type="file"
                                    id="customFile"
                                    onChange={(e) => {
                                        setFormDataUser({...formDataUser, image: e.target.files[0].name})
                                    }}
                                />
                            </div>
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
export default Edit;
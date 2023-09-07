import {Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../components";
import React, {useEffect, useState} from "react";
import axios from "axios";
import HandleError from "../auth/handleError";

const Edit = ({open, setOpen, datatable, member}) => {
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
        name: '',
        address: '',
        note: '',
    });
    const [roleSelected, setRoleSelected] = useState({});
    const handleFormInputUser = (e) => {
        setFormDataUser({...formDataUser, [e.target.name]: e.target.value});
    }
    const handleFormInputMember = (e) => {
        setFormDataMember({...formDataMember, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/user/${formDataUser.id}`, formDataUser, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            axios.put(`${process.env.REACT_APP_API_ENDPOINT}/member/${formDataMember.id}`, formDataMember, {
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
        setFormDataUser({
            id: member.user ? member.user.id : '',
            name: member.user ? member.user.name : '',
            email: member.user ? member.user.email : '',
            phone: member.user ? member.user.phone : '',
            password: member.user ? member.user.password : '',
            password_confirmation: member.user ? member.user.password : '',
            role: member.user ? member.user.role : '',
            image:member.image || ''
        });
        let role = member.user && member.user.role === '1' ? {value: '1', label: 'Administrator'} : {value: '2', label: 'Pelanggan'}
        setRoleSelected(role);
        setFormDataMember({
            id: member.id,
            user: member.user,
            name: member.name,
            address: member.address,
            note: member.note,
        })
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
                                value={formDataUser.phone}
                                onChange={(e) => handleFormInputUser(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="role" className="form-label">
                            Hak Akses
                        </Label>
                        <div className="form-control-wrap">
                            <RSelect
                                options={[
                                    {value: '1', label: 'Administrator'},
                                    {value: '2', label: 'Pelanggan'}
                                ]}
                                onChange={(e) => {
                                    setFormDataUser({...formDataUser, role: e.value});
                                    setRoleSelected(e);
                                }}
                                value={roleSelected}
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
                                value={formDataMember.address}
                                onChange={(e) => handleFormInputMember(e)}
                            />
                        </div>
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
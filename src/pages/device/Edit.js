import React, {useEffect} from "react";
import {Button, Label, Modal, ModalBody, ModalHeader} from "reactstrap";
import {Icon, toastSuccess} from "../../components";
import {useState} from "react";
import axios from "axios";
import HandleError from "../auth/handleError";
import {ToastContainer} from "react-toastify";

const Edit = ({open, setOpen, setDatatable, device}) => {
    const [formData, setFormData] = useState([{
        id: '',
        name: '',
        address: '',
        username: '',
        password: ''
    }]);
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/device/${formData.id}`, formData, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            toggle();
            setDatatable(true);
        }).catch(error => {
            HandleError(error);
        });
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
    };
    useEffect(() => {
        setFormData(device);
    }, [device]);

    return <>
        <ToastContainer/>
        <Modal isOpen={open} toggle={toggle}>
            <ModalHeader
                toggle={toggle}
                close={
                    <button className="close" onClick={toggle}>
                        <Icon name="cross"/>
                    </button>
                }
            >
                UBAH PERANGKAT
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <Label htmlFor="name" className="form-label">
                            Nama Perangkat
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Ex. MikroTik-01"
                                value={formData.name}
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="address" className="form-label">
                            IP MikroTik
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="address"
                                placeholder="Ex. 192.168.1.1"
                                value={formData.address}
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="username" className="form-label">
                            Username
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                placeholder="Ex. admin"
                                value={formData.username}
                                onChange={(e) => handleFormInput(e)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Label htmlFor="password" className="form-label">
                            Password
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="password"
                                placeholder="Ex. ********"
                                value={formData.password}
                                onChange={(e) => handleFormInput(e)}
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
import {Button, Col, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import {Icon, RSelect, toastSuccess} from "../../../../components";
import React, {useEffect, useState} from "react";
import axios from "axios";
import HandleError from "../../../auth/handleError";
import DatePicker from "react-datepicker";
import {setDateForPicker} from "../../../../utils/Utils";

const Add = ({open, setOpen, datatable, member}) => {
    const [due, setDue] = useState(new Date());
    const [formData, setFormData] = useState({
        member: '',
        product: '',
        price: '',
        cycle: '',
        due: setDateForPicker(due),

    });
    const [productOption, setProductOption] = useState([]);
    const handleProductOption = async () => {
      await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/product`, {
          params: {
              type: 'select'
          },
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      }).then(resp => {
          setProductOption(resp.data.result);
      }).catch(error => {
          HandleError(error);
      });
    }
    const handleFormInput = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/order`, formData, {
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
    }
    const toggle = () => {
        setOpen({
            add: false,
            edit: false
        });
    };

    useEffect(() => {
        setFormData({
            ...formData, member: member.id || ''
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [member]);

    useEffect(() => {
        handleProductOption().then();
    }, []);

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
                TAMBAH PRODUK
            </ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="form-group">
                        <Label htmlFor="member" className="form-label">
                            Nama Pelanggan
                        </Label>
                        <div className="form-control-wrap">
                            <input
                                className="form-control"
                                type="text"
                                name="member"
                                value={member ? member.name : ''}
                                onChange={(e) => handleFormInput(e)}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <Row className="gy-4">
                            <Col sm="6">
                                <Label htmlFor="product" className="form-label">
                                    Produk
                                </Label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={productOption}
                                        onChange={(e) => {
                                            setFormData({...formData, product: e.value})
                                        }}
                                        placeholder="Pilih Produk"
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <Label htmlFor="cycle" className="form-label">
                                    Siklus Tagihan
                                </Label>
                                <div className="form-control-wrap">
                                    <RSelect
                                        options={[
                                            {value: '1', label: 'Bulanan'},
                                            {value: '2', label: '3 Bulan'},
                                            {value: '3', label: '6 Bulan'},
                                            {value: '4', label: 'Tahunan'},
                                        ]}
                                        onChange={(e) => {
                                            setFormData({...formData, cycle: e.value})
                                        }}
                                        placeholder="Pilih Siklus Tagihan"
                                    />
                                </div>
                            </Col>
                        </Row>
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
                                        placeholder="Ex. 250000"
                                        onChange={(e) => handleFormInput(e)}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
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
                            </Col>
                        </Row>
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
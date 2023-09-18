import React, {useEffect, useState} from "react";
import {
    Block,
    BlockHead,
    BlockTitle, Button,
    Col,
    Icon,
    PreviewAltCard,
    Row, toastSuccess,
    UserAvatar
} from "../../../../components";
import axios from "axios";
import img from "../../../../images/socials/facebook.png"
import HandleError from "../../../auth/handleError";
import QRCode from "./QRCode";

const Notification = () => {
    const [modal, setModal] = useState(false);
    const [reload, setReload] = useState(true);
    const [status, setStatus] = useState('1');
    const [whatsapp, setWhatsapp] = useState([]);
    const [qtcode, setQtcode] = useState([]);
    const handleWhatsappData = async () => {
        await axios.post(`/setting/whatsapp/info`, {
            key: 'limitless-apps'
        }, {})
            .then(resp => {
                let whatsapp = resp.data.result;
                whatsapp.error === true ?
                    setStatus('3')
                    : whatsapp.instance_data.phone_connected ?
                        setStatus('1')
                        : setStatus('2')
                setWhatsapp(resp.data.result.instance_data || [])
            })
            .catch(error => HandleError(error));
    }
    const handleQrcodeData = async () => {
        await axios.post(`/setting/whatsapp/qr64`, {
            key: 'limitless-apps'
        }, {})
            .then(resp => {
                setQtcode(resp.data.result.qrcode);
                setModal(true)
            })
            .catch(error => HandleError(error));
    }
    const handleWhatsappCrate = async () => {
        await axios.post(`/setting/whatsapp/init`, {
            key: 'limitless-apps'
        }, {})
            .then(resp => {
                toastSuccess(resp.data.message);
                setReload(true);
            }).catch(error => HandleError(error));
    }
    const handleWhatsappDelete = async () => {
        await axios.post(`/setting/whatsapp/delete`, {
            key: 'limitless-apps'
        }, {})
            .then(resp => {
                toastSuccess(resp.data.message);
                setReload(true);
            }).catch(error => HandleError(error));
    }
    useEffect(() => {
        reload && handleWhatsappData().then(() => setReload(false));
    }, [reload]);
    return <>
        <Block>
            <BlockHead>
                <BlockTitle tag="h5">Notifikasi</BlockTitle>
                <p>Basic info, like your name and address, that you use on Nio Platform.</p>
            </BlockHead>
            <Block>
                <Row className="g-gs">
                    <Col sm="6" lg="4" xxl="3">
                        <PreviewAltCard>
                            <div className="team">
                                <div
                                    className={`team-status ${
                                        status === '1'
                                            ? "bg-success text-white"
                                            : status === '2'
                                                ? "bg-warning text-white"
                                                : "bg-danger text-white"
                                    } `}
                                >
                                    <Icon
                                        name={`${
                                            status === "1" ? "check-thick" : status === "2" ? "clock" : "na"
                                        }`}
                                    ></Icon>
                                </div>
                                {status !== '3' && (
                                    <div className="team-options">
                                        <div className="dropdown-toggle btn btn-icon btn-trigger">
                                            <Icon
                                                name="trash"
                                                onClick={() => handleWhatsappDelete()}
                                            ></Icon>
                                        </div>
                                    </div>
                                )}
                                <div className="user-card user-card-s2">
                                    <UserAvatar theme="white" className="md" image={img}>
                                        <div
                                            className={`status dot dot-lg ${status === '1' ? 'dot-success' : status === '2' ? 'dot-warning' : 'dot-danger'}`}></div>
                                    </UserAvatar>
                                    <div className="user-info">
                                        <h6>Whatsapp Notification</h6>
                                        {/*<span className="sub-text">@{item.name.split(" ")[0].toLowerCase()}</span>*/}
                                    </div>
                                </div>
                                <div className="team-details">
                                    {status === '1' ? (
                                        <p>Whatsapp terhubung</p>
                                    ) : status === '2' ? (
                                        <p>Whatsapp tidak terhubung</p>
                                    ) : (
                                        <p>Silahkan menghubungkan whatsapp anda</p>
                                    )}
                                </div>
                                <ul className="team-statistics">
                                    <li>
                                        <span>Intance</span>
                                        <span>{status === '1' && whatsapp.instance_key}</span>
                                    </li>
                                    <li>
                                        <span>Nomor</span>
                                        <span>{status === '1' && ('082229366506')}</span>
                                    </li>
                                    <li>
                                        <span>Nama</span>
                                        <span>{status === '1' && ('Arif Muntaha')}</span>
                                    </li>
                                </ul>
                                <div className="team-view">
                                    {status === '1' ? (
                                        <Button
                                            outline
                                            color="success"
                                            className="btn-round w-150px"
                                        >
                                            <span>TERHUBUNG</span>
                                        </Button>
                                    ) : status === '2' ? (
                                        <Button
                                            outline
                                            color="warning"
                                            className="btn-round w-150px"
                                            onClick={() => handleQrcodeData()}
                                        >
                                            <span>SCAN QR</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            outline
                                            color="danger"
                                            className="btn-round w-150px"
                                            onClick={() => handleWhatsappCrate()}
                                        >
                                            <span>HUBUNGKAN</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </PreviewAltCard>
                    </Col>
                </Row>
            </Block>
        </Block>
        <QRCode modal={modal} setModal={setModal} qrcode={qtcode}/>
    </>
}
export default Notification;
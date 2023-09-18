import React, {useEffect, useState} from "react";
import Head from "../../layout/head";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import HandleError from "../auth/handleError";
import Content from "../../layout/content";
import {
    Block,
    BlockBetween,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon
} from "../../components";
import LogoDark from "../../images/limitless/logo-dark.png"
import {Currency} from "../../utils/Utils";
import Payment from "../partials/payment";
import {Badge} from "reactstrap";
import {ToastContainer} from "react-toastify";

const Detail = () => {
    const {invoiceID} = useParams();
    const [reload, setReload] = useState(false);
    const [invoice, setInvoice] = useState([]);
    const navigate = useNavigate();
    const handleInvoiceData = async () => {
        await axios.get(`/invoice/${invoiceID}`, {}).then(resp => {
            setInvoice(resp.data.result);
        }).catch(error => HandleError(error));
    }
    const handleInvoiceStatusText = (status) => {
        let state = '';
        switch (status) {
            case '1':
                state = 'Lunas'
                break;
            case '2':
                state = 'Belum Lunas'
                break;
            case '3':
                state = 'Batal'
                break;
            case '4':
                state = 'Jatuh Tempo'
                break;
            default :
                state = ''
        }
        return state;
    }
    const handleInvoiceStatusColor = (status) => {
        let state = '';
        switch (status) {
            case '1':
                state = 'success'
                break;
            case '2':
                state = 'warning'
                break;
            case '3':
                state = 'grey'
                break;
            case '4':
                state = 'danger'
                break;
            default :
                state = ''
        }
        return state;
    }
    useEffect(() => {
        handleInvoiceData().then(() => setReload(false));
        // eslint-disable-next-line
    }, [reload]);
    return <>
        <Head title="Detail Tagihan"></Head>
        {invoice && (
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle tag="h3" page>
                                Tagihan / <strong className="text-primary small">{invoice.number}</strong>
                            </BlockTitle>
                            <BlockDes className="text-soft">
                                <ul className="list-inline">
                                    <li>
                                        Dibuat Tanggal: <span className="text-base">{invoice.create}</span>
                                    </li>
                                </ul>
                            </BlockDes>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <Button
                                color="light"
                                outline
                                className="bg-white d-none d-sm-inline-flex"
                                onClick={() => navigate(-1)}
                            >
                                <Icon name="arrow-left"></Icon>
                                <span>Kembali</span>
                            </Button>
                            <a
                                href="#back"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    navigate(-1);
                                }}
                                className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
                            >
                                <Icon name="arrow-left"></Icon>
                            </a>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <Block>
                    <div className="invoice">
                        <div className="invoice-action">
                            <Link to={`${process.env.PUBLIC_URL}/tagihan/${invoiceID}/cetak`} target="_blank">
                                <Button size="lg" color="primary" outline className="btn-icon btn-white btn-dim">
                                    <Icon name="printer-fill"></Icon>
                                </Button>
                            </Link>
                        </div>
                        <div className="invoice-wrap">
                            <div className="invoice-brand text-center">
                                <img src={LogoDark} alt="" />
                            </div>
                            <div className="invoice-head">
                                <div className="invoice-contact">
                                    <span className="overline-title">Ditagihkan ke:</span>
                                    <div className="invoice-contact-info">
                                        <h4 className="title">{invoice.member ? invoice.member.name : ''}</h4>
                                        <ul className="list-plain">
                                            <li>
                                                <Icon name="map-pin-fill"></Icon>
                                                <span>{invoice.member ? invoice.member.address : ''}</span>
                                            </li>
                                            <li>
                                                <Icon name="call-fill"></Icon>
                                                <span>{invoice.member ? invoice.member.user.phone : ''}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="invoice-desc">
                                    <h3 className="title">TAGIHAN</h3>
                                    <ul className="list-plain">
                                        <li className="invoice-id">
                                            <span>ID Tagihan</span>:<span>{invoice.number}</span>
                                        </li>
                                        <li className="invoice-date">
                                            <span>Jatuh Tempo</span>:<span>{invoice.due}</span>
                                        </li>
                                    </ul>
                                    <Badge className="badge-md" pill color={handleInvoiceStatusColor(invoice.status)}>
                                        {handleInvoiceStatusText(invoice.status)}
                                    </Badge>
                                </div>
                            </div>
                            <div className="invoice-bills">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th className="w-400px">Produk</th>
                                            <th className="w-50">Diskripsi</th>
                                            <th>Harga</th>
                                            <th>Qty</th>
                                            <th>Jumlah</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>{invoice.product ? invoice.product.name : '-'}</td>
                                            <td>{invoice.desc}</td>
                                            <td>{Currency(invoice.product ? invoice.product.price : invoice.price)}</td>
                                            <td>1</td>
                                            <td>{Currency(invoice.price)}</td>
                                        </tr>
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan="2"></td>
                                            <td colSpan="2">Subtotal</td>
                                            <td>{Currency(invoice.price)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"></td>
                                            <td colSpan="2">Diskon</td>
                                            <td>{Currency(invoice.discount)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"></td>
                                            <td colSpan="2">Biaya Admin</td>
                                            <td>{Currency(invoice.fees)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2"></td>
                                            <td colSpan="2">Total</td>
                                            <td>{Currency(invoice.amount)}</td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                    <div className="nk-notes ff-italic fs-12px text-soft">
                                        Faktur dibuat di komputer dan sah tanpa tanda tangan dan stempel.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Block>
                <Payment invoice={invoice} setReload={setReload}/>
                <ToastContainer />
            </Content>
        )}
    </>
}
export default Detail
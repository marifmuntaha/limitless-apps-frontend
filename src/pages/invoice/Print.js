import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {Block, Button, Icon} from "../../components";
import LogoDark from "../../images/limitless/logo-dark.png";
import axios from "axios";
import HandleError from "../auth/handleError";
import {Currency} from "../../utils/Utils";
import {Badge} from "reactstrap";

const Print = () => {
    const {invoiceID} = useParams()
    const [invoice, setInvoice] = useState([]);
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
        handleInvoiceData().then();
        // eslint-disable-next-line
    }, []);
    return (
        <body className="bg-white">
        <Head title="Invoice Print"></Head>
        {invoice && (
            <Content>
                <Block>
                    <div className="invoice invoice-print">
                        <div className="invoice-action">
                            <Button
                                size="lg"
                                color="primary"
                                outline
                                className="btn-icon btn-white btn-dim"
                                onClick={() => window.print()}
                            >
                                <Icon name="printer-fill"></Icon>
                            </Button>
                        </div>
                        <div className="invoice-wrap">
                            <div className="invoice-brand text-center">
                                <img src={LogoDark} alt="" />
                            </div>
                            <div className="invoice-head">
                                <div className="invoice-contact">
                                    <span className="overline-title">DITAGIHKAN KE</span>
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
                                            <span>ID TAGIHAN</span>:<span>{invoice.number}</span>
                                        </li>
                                        <li className="invoice-date">
                                            <span>JATUH TEMPO</span>:<span>{invoice.due}</span>
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
            </Content>
        )}
        </body>
    )
}
export default Print;
import React, {useEffect, useState} from "react";
import {
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Button,
    Icon,
    PreviewCard,
    ReactDataTable, toastSuccess
} from "../../../components";
import {ButtonGroup} from "reactstrap";
import Add from "./Add";
import axios from "axios";
import HandleError from "../../auth/handleError";
import {Currency} from "../../../utils/Utils";
import Edit from "./Edit";

const Payment = ({invoice, ...params}) => {
    const [sm, updateSm] = useState(false);
    const [reload, setReload] = useState(false);
    const [modal, setModal] = useState({
        add: false,
        edit: false
    });
    const [payments, setPayments] = useState([]);
    const [payment, setPayment] = useState([]);
    const Columns = [
        {
            name: "Tanggal",
            selector: (row) => row.at,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Jumlah",
            selector: (row) => Currency(row.amount),
            sortable: false,
        },
        {
            name: "Pembayaran",
            selector: (row) => {
                return row.method === '1' ? 'Tunai' : row.method === '2' ? 'BCA' : 'Dana'
            },
            sortable: false,
            hide: 370,
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-warning"
                        onClick={() => handlePaymentShow(row.id)}

                    >
                        <Icon name="edit"/></Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handlePaymentDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handlePaymentData = async () => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/payment`, {
            params: {
                invoice: invoice.id || ''
            },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setPayments(resp.data.result);
            setReload(false);
        }).catch(error => HandleError(error));
    }
    const handlePaymentShow = async (id) => {
      await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/payment/${id}`, {
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      }).then(resp => {
          setPayment(resp.data.result);
          setModal({
              add: false,
              edit: true,
          });
      }).catch(error => HandleError(error));
    }
    const handlePaymentDelete = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/payment/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        handlePaymentData().then();
        // eslint-disable-next-line
    }, [reload, invoice]);
    return <>
        <Block>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Pembayaran</BlockTitle>
                        <p>
                            Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for
                            react dashlite.
                        </p>
                    </BlockHeadContent>
                    <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                            <Button
                                className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                onClick={() => updateSm(!sm)}
                            >
                                <Icon name="menu-alt-r"></Icon>
                            </Button>
                            <div className="toggle-expand-content" style={{display: sm ? "block" : "none"}}>
                                <ul className="nk-block-tools g-3">
                                    <li
                                        className="nk-block-tools-opt"
                                        onClick={() => {
                                            setModal({
                                                add: true,
                                                edit: false
                                            })
                                        }}
                                    >
                                        <Button color="secondary">
                                            <Icon name="plus"></Icon>
                                            <span>Tambah</span>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <PreviewCard>
                <ReactDataTable data={payments} columns={Columns} pagination className="nk-tb-list"/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload} invoice={invoice} setReload={params.setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} payment={payment}/>
        </Block>
    </>
}

export default Payment
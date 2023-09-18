import React, {useEffect, useState} from "react";
import Head from "../../../layout/head";
import Content from "../../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable, toastSuccess
} from "../../../components";
import {Button, ButtonGroup, Spinner} from "reactstrap";
import axios from "axios";
import HandleError from "../../auth/handleError";
import {ToastContainer} from "react-toastify";
import Add from "./Add";
import Edit from "./Edit";

const Account = () => {
    const [loading, setLoading] = useState({
        show: '',
        delete: ''
    });
    const [reload, setReload] = useState(true);
    const [modal, setModal] = useState({
        add: false,
        edit: false
    });
    const [accounts, setAccounts] = useState([]);
    const [account, setAccount] = useState([]);
    const Columns = [
        {
            name: "Bank",
            selector: (row) => row.bank,
            sortable: true,
        },
        {
            name: "Nomor Rekening",
            selector: (row) => row.number,
            sortable: true,
        },
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Diskripsi",
            selector: (row) => row.desc,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-info"
                        onClick={() => handleAccountShow(row.id)}
                        disabled={loading.show === row.id}

                    >
                        {loading.show === row.id ? <Spinner size="sm" color="light"/> : <Icon name="edit"/>}
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleAccountDelete(row.id)}
                        disabled={loading.delete === row.id}
                    >
                        {loading.delete === row.id ? <Spinner size="sm" color="light"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleAccountData = async () => {
        await axios.get("/account").then(resp => {
            setAccounts(resp.data.result)
        }).catch(error => HandleError(error));
    }
    const handleAccountShow = async (id) => {
        setLoading({
            show: id,
            delete: ''
        });
        await axios.get(`/account/${id}`).then(resp => {
            setAccount(resp.data.result);
            setModal({
                add: false,
                edit: true
            });
            setLoading({
                show: '',
                delete: ''
            })
        }).catch(error => HandleError(error));
    }
    const handleAccountDelete = async (id) => {
        setLoading({
            show: '',
            delete: id
        })
        await axios.delete(`/account/${id}`).then(resp => {
                toastSuccess(resp.data.message);
                setReload(true);
                setLoading({
                    show: '',
                    delete: ''
                })
            }).catch(error => HandleError(error));
    }
    useEffect(() => {
        reload && handleAccountData().then(() => setReload(false));
    }, [reload]);
    return <>
        <Head title="Rekening"/>
        <Content page="component">
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">
                        DASHBOARD
                    </BackTo>
                </BlockHeadContent>
            </BlockHead>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Data Rekening</BlockTitle>
                        <p>
                            Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for
                            react dashlite.
                        </p>
                    </BlockHeadContent>
                    <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                            <Button
                                color="secondary"
                                onClick={() => setModal({
                                    add: true,
                                    edit: false
                                })}
                            >
                                <Icon name="plus"/>
                                <span>Tambah</span>
                            </Button>
                        </div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <PreviewCard>
                <ReactDataTable data={accounts} columns={Columns} expandableRows pagination onLoad={reload}/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} account={account}/>
        </Content>
        <ToastContainer/>
    </>
}
export default Account;
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
    ReactDataTable
} from "../../../components";
import {Button, ButtonGroup, Spinner} from "reactstrap";
import {ToastContainer} from "react-toastify";
import Add from "./Add";
import Edit from "./Edit";
import {actionType, Dispatch} from "../../../reducer";

const Account = () => {
    const [loading, setLoading] = useState(0);
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
            hide: "sm"
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
            // hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-info"
                        onClick={() => {
                            setAccount(row);
                            setModal({
                                add: false,
                                edit: true
                            })
                        }}
                    >
                        <Icon name="edit"/>
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => Dispatch(actionType.ACCOUNT_DELETE, {
                            id: row.id,
                            setLoading: setLoading,
                            setReload: setReload
                        })}
                        disabled={loading === row.id}
                    >
                        {loading === row.id ? <Spinner size="sm" color="light"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    useEffect(() => {
        reload && Dispatch(actionType.ACCOUNT_GET, {
            setData: setAccounts
        }).then(() => setReload(false));
    }, [reload]);
    return <>
        <Head title="Rekening"/>
        <Content page="component">
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">DASHBOARD</BackTo>
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
                <ReactDataTable data={accounts} columns={Columns} pagination onLoad={reload}/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} account={account}/>
        </Content>
        <ToastContainer/>
    </>
}
export default Account;
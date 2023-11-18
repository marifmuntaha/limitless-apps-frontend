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
import Add from "./Add";
import {ToastContainer} from "react-toastify";
import Edit from "./Edit";
import {actionType, Dispatch} from "../../../reducer";

const Group = () => {
    const [reload, setReload] = useState(true);
    const [loading, setLoading] = useState(0);
    const [modal, setModal] = useState({
        add: false,
        edit: false
    });
    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState([]);
    const Columns = [
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Diskripsi",
            selector: (row) => row.desc,
            sortable: true,
            hide: "sm"
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-info"
                        onClick={() => {
                            setGroup(row);
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
                        onClick={() => Dispatch(actionType.CATEGORY_DELETE, {
                            id: row.id,
                            setLoading: setLoading,
                            setReload: setReload
                        })}
                        disabled={loading === row.id}
                    >
                        {loading === row.id ? <Spinner size="sm" color="light"/> : <Icon name="trash"/> }
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    useEffect(() => {
        reload && Dispatch(actionType.CATEGORY_GET, {
            setData: setGroups
        }).then(() => setReload(false));
    }, [reload])
    return <>
        <Head title="Grup"/>
        <Content page="component">
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">DASHBOARD</BackTo>
                </BlockHeadContent>
            </BlockHead>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Data Grup</BlockTitle>
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
                <ReactDataTable data={groups} columns={Columns} pagination onLoad={reload}/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} group={group}/>
        </Content>
        <ToastContainer/>
    </>
}
export default Group;
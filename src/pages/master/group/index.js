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
import Add from "./Add";
import {ToastContainer} from "react-toastify";
import Edit from "./Edit";

const Group = () => {
    const [reload, setReload] = useState(true);
    const [loading, setLoading] = useState({
        show: '',
        delete: ''
    });
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
                        onClick={() => handleGroupShow(row.id)}
                        disabled={loading.show === row.id}
                    >
                        {loading.show === row.id ? <Spinner size="sm" color="light"/> : <Icon name="edit"/> }
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleGroupDelete(row.id)}
                        disabled={loading.delete === row.id}
                    >
                        {loading.delete === row.id ? <Spinner size="sm" color="light"/> : <Icon name="trash"/> }
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleGroupsData = async () => {
        await axios.get('/category').then(resp => {
            setGroups(resp.data.result)
        }).catch(error => HandleError(error));
    }
    const handleGroupShow = async (id) => {
        setLoading({
            show: id,
            delete: ''
        });
        await axios.get(`/category/${id}`).then(resp => {
            setGroup(resp.data.result);
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
    const handleGroupDelete = async (id) => {
        setLoading({
            show: '',
            delete: id
        });
        await axios.delete(`/category/${id}`).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
            setLoading({
                show: '',
                delete: ''
            });
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        reload && handleGroupsData().then(() => setReload(false));
    }, [reload])
    return <>
        <Head title="Grup"/>
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
                <ReactDataTable data={groups} columns={Columns} expandableRows pagination onLoad={reload}/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} group={group}/>
        </Content>
        <ToastContainer/>
    </>
}
export default Group;
import React, {useEffect, useState} from "react";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {
    BackTo,
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    PreviewCard, ReactDataTable, toastSuccess
} from "../../components";
import {Button, ButtonGroup} from "reactstrap";
import Add from "../device/add";
import Edit from "../device/Edit";
import axios from "axios";
import HandleError from "../auth/handleError";
import {useNavigate} from "react-router-dom";

const Device = () => {
    const [modal, setModal] = useState({
        add: false,
        edit: false
    });
    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState([]);
    const [reload, setReload] = useState(false);
    const deviceColumn = [
        {
            name: "Nama Perangkat",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Address",
            selector: (row) => row.address,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Username",
            selector: (row) => row.username,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Password",
            selector: (row) => row.password,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            hide: "sm",
            cell: (row) => (
                <ButtonGroup>
                    <Button
                        color="outline-primary"
                        onClick={() => navigate('/')}
                    >
                        <Icon name="check-thick"/>
                    </Button>
                    <Button
                        color="outline-primary"
                        onClick={() => handleDeviceShow(row.id)}

                    >
                        <Icon name="edit"/></Button>
                    <Button
                        color="outline-primary"
                        onClick={() => handleDeviceDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const navigate = useNavigate();
    const handleDeviceData = async () => {
      await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/device`, {
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      }).then(resp => {
          setDevices(resp.data.result);
      }).catch(error => HandleError(error));
    }
    const handleDeviceShow = async (id) => {
      await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/device/${id}`, {
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      }).then(resp => {
          setModal({
              add: false,
              edit: true,
          });
          setDevice(resp.data.result);
      }).catch(error => HandleError(error));
    }
    const handleDeviceDelete = async (id) => {
      await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/device/${id}`, {
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
        handleDeviceData().then(() => setReload(false));
    }, [reload]);
    return <>
        <Head title="Perangakat" />
        <Content page="component">
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/components" icon="arrow-left">
                        PERANGKAT
                    </BackTo>
                </BlockHeadContent>
            </BlockHead>
            <Block size="lg">
                <BlockHead>
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle tag="h4">Data Perangkat</BlockTitle>
                            <p>
                                Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for react dashlite.
                            </p>
                        </BlockHeadContent>
                        <BlockHeadContent>
                            <div className="toggle-wrap nk-block-tools-toggle">
                                <Button
                                    color="primary"
                                    onClick={() => setModal({
                                        add: true,
                                        edit: false
                                    })}
                                >
                                    <Icon name="plus" />
                                    <span>Tambah</span>
                                </Button>
                            </div>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <PreviewCard>
                    <ReactDataTable data={devices} columns={deviceColumn} expandableRows pagination />
                </PreviewCard>
                <Add open={modal.add} setOpen={setModal} setDatatable={setReload}/>
                <Edit open={modal.edit} setOpen={setModal} setDatatable={setReload} device={device}/>
            </Block>
        </Content>
    </>
}
export default Device;
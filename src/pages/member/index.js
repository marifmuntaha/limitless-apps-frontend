import React, {useEffect, useState} from "react";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle, Icon,
    PreviewCard,
    ReactDataTable, toastSuccess, UserAvatar
} from "../../components";
import {Button, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import Add from "./Add";
import {ToastContainer} from "react-toastify";
import axios from "axios";
import HandleError from "../auth/handleError";
import Edit from "./Edit";
import {findUpper, RandomBG} from "../../utils/Utils";
import {useNavigate} from "react-router-dom";

const Member = () => {
    const [sm, updateSm] = useState(false);
    const [filter, setFilter] = useState('1');
    const [members, setMembers] = useState([]);
    const [member, setMember] = useState([]);
    const [reload, setReload] = useState(true);
    const [modal, setModal] = useState({
        add: false,
        edit: false
    });
    const navigate = useNavigate();
    const Columns = [
        {
            name: "Pelanggan",
            selector: (row) => row.name,
            compact: true,
            grow: 2,
            style: {paddingRight: "20px"},
            cell: (row) => (
                <div className="user-card mt-2 mb-2">
                    <UserAvatar theme={RandomBG} text={findUpper(row.name)}></UserAvatar>
                    <div className="user-info">
                        <span className="tb-lead">
            {row.name}{" "}
              <span
                  className={`dot dot-${
                      row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger"
                  } d-md-none ms-1`}
              ></span>
          </span>
                        <span>{row.user.email}</span>
                    </div>
                </div>
            ),
            sortable: true,
        },
        {
            name: "Paket",
            selector: (row) => {
                let order = row.order.filter((order) => {
                    return order.status === '1'
                })
                return order.length > 0 && order[0].product.name;
            },
            sortable: false,
            hide: "sm",
        },
        {
            name: "Nomor WA",
            selector: (row) => row.user.phone,
            sortable: false,
        },
        {
            name: "Alamat",
            selector: (row) => row.address,
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
                        color="outline-info"
                        onClick={() => {
                            navigate(`${process.env.PUBLIC_URL}/pelanggan/${row.id}`)
                        }}

                    >
                        <Icon name="eye"/></Button>
                    <Button
                        color="outline-warning"
                        onClick={() => handleMemberShow(row.id)}

                    >
                        <Icon name="edit"/></Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleMemberDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleMemberData = async () => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/member`, {
            params: {
                order: true,
                status: filter
            },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setMembers(resp.data.result);
            setReload(false);
        }).catch(error => {
            HandleError(error);
        });
    }
    const handleMemberShow = async (id) => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/member/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setMember(resp.data.result);
            setModal({
                add: false,
                edit: true
            });
        }).catch(error => {
            HandleError(error);
        });
    }
    const handleMemberDelete = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/member/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
        }).catch(error => {
            HandleError(error);
        });
    }

    useEffect(() => {
        reload &&
        handleMemberData();
        // eslint-disable-next-line
    }, [reload]);
    return <>
        <Head title="Pelanggan"/>
        <Content>
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/components" icon="arrow-left">
                        PELANGGAN
                    </BackTo>
                </BlockHeadContent>
            </BlockHead>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Data Pelanggan</BlockTitle>
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
                                    <li>
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="a"
                                                            className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                                                <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                                                <span>Saring</span>
                                                <Icon name="chevron-right" className="dd-indc"></Icon>
                                            </DropdownToggle>
                                            <DropdownMenu end>
                                                <ul className="link-list-opt no-bdr">
                                                    <li>
                                                        <DropdownItem
                                                            tag="a"
                                                            href="#dropdownitem"
                                                            onClick={() => {
                                                                setFilter('1');
                                                                setReload(true);
                                                            }}
                                                        >
                                                            <span>Aktif</span>
                                                        </DropdownItem>
                                                    </li>
                                                    <li>
                                                        <DropdownItem
                                                            tag="a"
                                                            href="#dropdownitem"
                                                            onClick={() => {
                                                                setFilter('2');
                                                                setReload(true);
                                                            }}
                                                        >
                                                            <span>Non Aktif</span>
                                                        </DropdownItem>
                                                    </li>
                                                </ul>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </li>
                                    <li
                                        className="nk-block-tools-opt"
                                        onClick={() => setModal({
                                            add: true,
                                            edit: false
                                        })}
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
                <ReactDataTable data={members} columns={Columns} pagination className="nk-tb-list" selectableRows/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} member={member}/>
            <ToastContainer/>
        </Content>
    </>
}
export default Member;
import React, {useContext, useEffect, useState} from "react";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle, Icon,
    PreviewCard,
    ReactDataTable, UserAvatar
} from "../../components";
import {
    Button,
    ButtonGroup,
    Spinner
} from "reactstrap";
import Add from "./Add";
import {ToastContainer} from "react-toastify";
import Edit from "./Edit";
import {findUpper} from "../../utils/Utils";
import {useNavigate} from "react-router-dom";
import {actionType, Dispatch} from "../../reducer";
import {MemberContext} from "./MemberContext";
import {InvoiceContext} from "../partials/invoice/InvoiceContext";
import CategoryDropdown from "../partials/member/CategoryDropdown";
import StatusDropdown from "../partials/member/StatusDropdown";

const Member = () => {
    const {member, setMember} = useContext(MemberContext)
    const {setInvoices} = useContext(InvoiceContext);
    const [sm, updateSm] = useState(false);
    const [loading, setLoading] = useState(0);
    const [filter, setFilter] = useState('1');
    const [category, setCategory] = useState(0);
    const [members, setMembers] = useState([]);
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
            style: {paddingRight: "20px"},
            cell: (row) => (
                <div className="user-card mt-2 mb-2">
                    <UserAvatar theme={row.background} text={findUpper(row.name)}></UserAvatar>
                    <div className="user-info">
                        <span className="tb-lead">
                            {row.name}{" "}
                            <span
                                className={`dot dot-${row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger"} d-md-none ms-1`}></span>
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
            selector: (row) => '+62' + row.user.phone,
            sortable: false,
            hide: "sm"
        },
        {
            name: "Alamat",
            selector: (row) => row.address,
            sortable: false,
            hide: "sm",
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
                            setMember(row);
                            setInvoices(row.invoice);
                            navigate(`${process.env.PUBLIC_URL}/pelanggan/detail`)
                        }}

                    >
                        <Icon name="eye"/></Button>
                    <Button
                        color="outline-warning"
                        onClick={() => {
                            setMember(row);
                            setModal({
                                add: false,
                                edit: true
                            });
                        }}
                    >
                        <Icon name="edit"/>
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => Dispatch(actionType.MEMBER_DELETE, {
                            id: row.id,
                            setLoading: setLoading,
                            setReload: setReload
                        })}
                        disabled={row.id === loading}
                    >
                        {row.id === loading ? <Spinner size="sm" color="danger"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    useEffect(() => {
        reload && Dispatch(actionType.MEMBER_GET,
            {setData: setMembers},
            {order: "DESC", status: filter, category: category, invoice: true}
        ).then(() => setReload(false));
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
                                        <CategoryDropdown setReload={setReload} setCategory={setCategory}/>
                                    </li>
                                    <li>
                                        <StatusDropdown setReload={setReload} setFilter={setFilter}/>
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
                <ReactDataTable
                    data={members}
                    columns={Columns}
                    pagination
                    className="nk-tb-list"
                    selectableRows
                    onLoad={reload}
                />
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} member={member}/>
            <ToastContainer/>
        </Content>
    </>
}
export default Member;
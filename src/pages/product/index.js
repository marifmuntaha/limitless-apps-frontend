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
    ReactDataTable, toastSuccess
} from "../../components";
import {Badge, Button, ButtonGroup, Spinner} from "reactstrap";
import Add from "./Add";
import {ToastContainer} from "react-toastify";
import Edit from "./Edit";
import {Currency} from "../../utils/Utils";
import {actionType, Dispatch} from "../../reducer";

const Product = () => {
    const [loading, setLoading] = useState(0);
    const [products, setProducts] = useState();
    const [product, setProduct] = useState([]);
    const [reload, setReload] = useState(true);
    const [modal, setModal] = useState({
        add: false,
        edit: false
    });
    const Columns = [
        {
            name: "Kode Produk",
            selector: (row) => row.code,
            sortable: true,
            hide: "sm"
        },
        {
            name: "Nama Produk",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Siklus Tagihan",
            selector: (row) => row.cycle,
            sortable: false,
            hide: "sm",
            cell: (row) => (
                <Badge className="badge-dot" color="success">
                    {row.cycle === '1' ? 'Bulanan' : row.cycle === '2' ? '3 Bulan' : row.cycle === '3' ? '6 Bulan' : 'Tahunan'}
                </Badge>
            )
        },
        {
            name: "Harga",
            selector: (row) => Currency(row.price),
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
                            setProduct(row);
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
                        onClick={() => Dispatch(actionType.PRODUCT_DELETE, {
                            id: row.id,
                            setLoading: setLoading,
                            setReload: setReload
                        })}
                        disabled={loading === row.id}
                    >
                        {loading === row.id ? <Spinner size="sm" color="danger"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            )
        },
    ];

    useEffect(() => {
        reload && Dispatch(actionType.PRODUCT_GET, {
            setData: setProducts
        }).then(() => setReload(false));
    }, [reload]);
    return <>
        <Head title="Produk"/>
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
                        <BlockTitle tag="h4">Data Produk</BlockTitle>
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
                <ReactDataTable data={products} columns={Columns} pagination onLoad={reload}/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} product={product}/>
            <ToastContainer/>
        </Content>
    </>
}
export default Product;
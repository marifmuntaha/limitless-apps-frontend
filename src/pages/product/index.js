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
import {Badge, Button, ButtonGroup} from "reactstrap";
import Add from "./add";
import {ToastContainer} from "react-toastify";
import axios from "axios";
import handleError from "../auth/handleError";
import HandleError from "../auth/handleError";
import Edit from "./Edit";
import {Currency} from "../../utils/Utils";

const Product = () => {
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
            hide: 370,
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
            hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-info"
                        onClick={() => handleProductShow(row.id)}

                    >
                        <Icon name="edit"/></Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleProductDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleProductsData = async () => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/product`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setProducts(resp.data.result);
        }).catch(error => {
            handleError(error);
        });
    }
    const handleProductShow = async (id) => {
        await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/product/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setProduct(resp.data.result);
            setModal({
                add: false,
                edit: true
            })
        }).catch(error => {
            handleError(error);
        });
    }
    const handleProductDelete = async (id) => {
        await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/product/${id}`, {
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
        reload === true &&
            handleProductsData().then(() => setReload(false))
    }, [reload]);
    return <>
        <Head title="Produk" />
        <Content page="component">
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/components" icon="arrow-left">
                        PRODUK
                    </BackTo>
                </BlockHeadContent>
            </BlockHead>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Data Produk</BlockTitle>
                        <p>
                            Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for react dashlite.
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
                                <Icon name="plus" />
                                <span>Tambah</span>
                            </Button>
                        </div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <PreviewCard>
                <ReactDataTable data={products} columns={Columns} expandableRows pagination />
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} product={product} />
            <ToastContainer />
        </Content>
    </>
}
export default Product;
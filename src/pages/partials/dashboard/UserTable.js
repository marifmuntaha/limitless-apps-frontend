import React, {useEffect, useState} from "react";
import {ReactDataTable} from "../../../components";
import {Card, CardBody, CardTitle} from "reactstrap";
import axios from "axios";
import HandleError from "../../auth/handleError";
import moment from "moment";
import "moment/locale/id"
const UserTable = () => {
    const [members, setMembers] = useState([]);
    const Columns = [
        {
            name: "Nama",
            selector: (row) => row.name,
            sortable: false,
        },
        {
            name: "Alamat",
            selector: (row) => row.address,
            sortable: false,
            hide: 480,
        },
        {
            name: "Pendaftaran",
            selector: (row) => row.installation,
            sortable: false,
            hide: 370,
            cell: (row) => (
                moment(row.installation, 'YYYY-MM-DD').local("ID").format('DD MMMM YYYY')
            )
        },
    ];
    const handleMemberData = async () => {
        await axios.get("/member", {
            params: {
                order: 'DESC',
                limit: '5'
            },
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }).then(resp => {
            setMembers(resp.data.result);
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        handleMemberData().then()
    }, [])
    return <>
        <Card className="card-bordered">
            <CardBody className="card-inner">
                <CardTitle tag="h6">Pelanggan Terbaru</CardTitle>
                <ReactDataTable data={members} columns={Columns} expandableRows/>
            </CardBody>
        </Card>
    </>
}
export default UserTable;
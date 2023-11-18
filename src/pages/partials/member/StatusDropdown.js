import React, {useState} from "react";
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {Icon} from "../../../components";
const StatusDropdown = ({setReload, setFilter}) => {
    const [filterSelected, setFilterSelected] = useState('');
    return <>
        <UncontrolledDropdown>
            <DropdownToggle tag="a"
                            className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                <span>{filterSelected || "Saring"}</span>
                <Icon name="chevron-right" className="dd-indc"></Icon>
            </DropdownToggle>
            <DropdownMenu end>
                <ul className="link-list-opt no-bdr">
                    <li>
                        <DropdownItem
                            tag="a"
                            href="#dropdownitem"
                            onClick={() => {
                                setFilterSelected('Aktif')
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
                                setFilterSelected('Non Aktif')
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
    </>
}
export default StatusDropdown;
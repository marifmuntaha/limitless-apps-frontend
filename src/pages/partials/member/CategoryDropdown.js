import React, {useEffect, useState} from "react";
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {actionType, Dispatch} from "../../../reducer";
import {Icon} from "../../../components";

const CategoryDropdown = ({setReload, setCategory}) => {
    const [categoryOption, setCategoryOption] = useState([]);
    const [categorySelected, setCategorySelected] = useState({});
    useEffect(() => {
        Dispatch(actionType.CATEGORY_GET, {
            setData: setCategoryOption
        }).then();
    }, []);
    return <>
        <UncontrolledDropdown>
            <DropdownToggle tag="a" className="dropdown-toggle btn btn-white btn-dim btn-outline-light">
                <Icon name="filter-alt" className="d-none d-sm-inline"></Icon>
                <span>{categorySelected.name || 'Grup'}</span>
                <Icon name="chevron-right" className="dd-indc"></Icon>
            </DropdownToggle>
            <DropdownMenu end>
                <ul className="link-list-opt no-bdr">
                    <li>
                        <DropdownItem
                            tag="a"
                            href="#dropdownitem"
                            onClick={() => {
                                setCategorySelected({name: 'Semua'})
                                setCategory(0);
                                setReload(true);
                            }}
                        >
                            <span>Semua</span>
                        </DropdownItem>
                    </li>
                    {categoryOption.map((category, idx) => (
                        <li key={idx}>
                            <DropdownItem
                                tag="a"
                                href="#dropdownitem"
                                onClick={() => {
                                    setCategory(category.id);
                                    setCategorySelected(category);
                                    setReload(true);
                                }}
                            >
                                <span>{category.name}</span>
                            </DropdownItem>
                        </li>
                    ))}
                </ul>
            </DropdownMenu>
        </UncontrolledDropdown>
    </>
}
export default CategoryDropdown;
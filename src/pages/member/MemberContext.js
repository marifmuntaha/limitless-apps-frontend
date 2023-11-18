import React, { useState, createContext } from "react";
import { Outlet } from "react-router-dom";

export const MemberContext= createContext({});

export const MemberProvider = () => {
    const [member, setMember] = useState([]);

    return <MemberContext.Provider value={{member, setMember}}>
        <Outlet />
    </MemberContext.Provider>;
};

const menuAdmin = [
    {
        icon: "monitor",
        text: "Dashboard",
        link: "/",
    },
    {
        icon: "server",
        text: "Perangkat",
        active: "false",
        link: "/perangkat",
    },
    {
        icon: "archived",
        text: "Produk",
        active: "false",
        link: "/produk",
    },
    {
        icon: "users-fill",
        text: "Pelanggan",
        active: "false",
        link: "/pelanggan",
    },
    {
        icon: "ticket",
        text: "Tagihan",
        active: "false",
        link: "/tagihan",
    },
    {
        icon: "users-fill",
        text: "Member",
        active: false,
        subMenu: [
            {
                text: "User List - Default",
                link: "/user-list-default",
            },
            {
                text: "User List - Regular",
                link: "/user-list-regular",
            },
            {
                text: "User List - Compact",
                link: "/user-list-compact",
            },
            {
                text: "User Details - Regular",
                link: "/user-details-regular/1",
            },
            {
                text: "User Profile - Regular",
                link: "/user-profile-regular",
            },
            {
                text: "User Contact - Card",
                link: "/user-contact-card",
            },
        ],
    },
];
export default menuAdmin;

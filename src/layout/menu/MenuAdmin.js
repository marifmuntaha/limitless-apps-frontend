const menuAdmin = [
    {
        icon: "monitor",
        text: "Dashboard",
        link: "/",
    },
    {
        icon: "archived",
        text: "Master",
        active: false,
        subMenu: [
            {
                text: "Rekening",
                link: "/master/rekening",
            },
            {
                text: "Grup",
                link: "/master/grup",
            },
        ],
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
        icon: "reports",
        text: "Laporan",
        active: false,
        subMenu: [
            {
                text: "Pembayaran",
                link: "/laporan/pembayaran",
            },
            {
                text: "Tagihan",
                link: "/laporan/tagihan",
            },
        ],
    },
    {
        icon: "money",
        text: "Kas Keuangan",
        active: "false",
        link: "/arus-kas",
    },
    {
        icon: "setting-alt",
        text: "Pengaturan",
        active: "false",
        link: "/pengaturan",
    },
];
export default menuAdmin;

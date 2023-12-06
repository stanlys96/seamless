import Image from "next/image";

export const dropdownDataHelper = [
  {
    id: 1,
    name: "Service",
    children: [
      {
        id: 1,
        name: "Payment Destination",
        route: "/",
        icon: (
          <Image
            src={`/img/payment-destination.svg`}
            width={20}
            height={20}
            alt="logo"
          />
        ),
        isActive: false,
        children: [
          {
            id: 1,
            name: "Transfer",
            isActive: false,
            children: [
              {
                id: 1,
                name: "Bank Transfer",
                isValid: true,
              },
              {
                id: 2,
                name: "By Profile",
                isValid: false,
              },
            ],
          },
          {
            id: 2,
            name: "E-Wallet",
          },
          {
            id: 3,
            name: "E-Commerce",
          },
          {
            id: 4,
            name: "Travel",
          },
          {
            id: 5,
            name: "Virtual Account",
          },
          {
            id: 6,
            name: "Top-Up",
          },
          {
            id: 7,
            name: "Utility Bills",
          },
        ],
      },
      {
        id: 2,
        name: "Transaction History",
        route: "/transactions",
        isActive: false,
        icon: (
          <Image src={`/img/history.svg`} width={20} height={20} alt="logo" />
        ),
      },
    ],
  },
  {
    id: 2,
    name: "Account",
    children: [
      {
        id: 1,
        name: "Activity History",
        isActive: false,
        icon: (
          <Image src={`/img/history.svg`} width={20} height={20} alt="logo" />
        ),
      },
      {
        id: 2,
        name: "Settings",
        icon: (
          <Image src={`/img/settings.svg`} width={20} height={20} alt="logo" />
        ),
        isActive: false,
        route: "/settings",
      },
      {
        id: 3,
        name: "Documentations",
        isActive: false,
        isUrl: true,
        url: "https://docs.seamless.finance",
        icon: (
          <Image
            src={`/img/documentation.svg`}
            width={20}
            height={20}
            alt="logo"
          />
        ),
      },
      {
        id: 4,
        name: "Support",
        isActive: false,
        isUrl: true,
        url: "https://t.me/seamlessfi/2",
        icon: (
          <Image src={`/img/support.svg`} width={20} height={20} alt="logo" />
        ),
      },
    ],
  },
];

export const MENU_DATA = [
    {
        id: 1,
        name: "Espresso",
        category: "Καφέδες",
        price: 1.50,
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: 2,
        name: "Cappuccino",
        category: "Καφέδες",
        price: 2.20,
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: 3,
        name: "Freddo Espresso",
        category: "Καφέδες",
        price: 2.00,
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: 4,
        name: "Freddo Cappuccino",
        category: "Καφέδες",
        price: 2.50,
        image: "https://www.dailycious.gr/wp-content/uploads/2016/07/freddo-cappuccino.jpg"
    },
    {
        id: 5,
        name: "Τυρόπιτα",
        category: "Σνακ",
        price: 1.80,
        image: "https://tasty.athinorama.gr/Content/ImagesDatabase/p/696x696/crop/both/lmnts/articles/2524533/tyropita2.jpg"
    },
    {
        id: 6,
        name: "Νερό 500ml",
        category: "Ποτά",
        price: 0.50,
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=200"
    }
];

export const initialOrders = [
    {
        id: 1001,
        status: 'pending',
        timestamp: '13:15',
        total: 5.70,
        items: [
            { name: 'Freddo Espresso', quantity: 2, price: 2.00 },
            { name: 'Τυρόπιτα', quantity: 1, price: 1.80 }
        ]
    },
    {
        id: 1002,
        status: 'preparing',
        timestamp: '13:20',
        total: 2.20,
        items: [
            { name: 'Cappuccino', quantity: 1, price: 2.20 }
        ]
    },
    {
        id: 1003,
        status: 'ready',
        timestamp: '13:10',
        total: 3.50,
        items: [
            { name: 'Freddo Cappuccino', quantity: 1, price: 2.50 },
            { name: 'Νερό 500ml', quantity: 2, price: 0.50 }
        ]
    },
    {
        id: 1004,
        status: 'delivering',
        timestamp: '13:25',
        total: 4.50,
        items: [
            { name: 'Espresso', quantity: 1, price: 1.50 },
            { name: 'Freddo Espresso', quantity: 1, price: 2.00 },
            { name: 'Νερό 500ml', quantity: 2, price: 0.50 }
        ]
    },
    {
        id: 1005,
        status: 'delivered',
        timestamp: '12:45',
        total: 7.20,
        items: [
            { name: 'Cappuccino', quantity: 2, price: 2.20 },
            { name: 'Τυρόπιτα', quantity: 1, price: 1.80 },
            { name: 'Νερό 500ml', quantity: 2, price: 0.50 }
        ]
    }
];

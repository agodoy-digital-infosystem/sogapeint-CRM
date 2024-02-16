import { ChartType } from './dashboard.model';

const revenueChart: ChartType = {
    series: [{
        name: '2024',
        type: 'column',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
    }, {
        name: '2023',
        type: 'line',
        data: [23, 32, 27, 38, 27, 32, 27, 38, 22, 31, 21, 16]
    }],
    chart: {
        height: 280,
        type: 'line',
        toolbar: {
            show: false,
        }
    },
    stroke: {
        width: [0, 3],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '20%',
        },
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
    colors: ['#5664d2', '#1cbb8c'],
    labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'],
};

const salesAnalytics: ChartType = {
    series: [42, 26, 15],
    chart: {
        height: 250,
        type: 'donut',
    },
    labels: ['Prestation A', 'Prestation B', 'Prestation C'],
    plotOptions: {
        pie: {
            donut: {
                size: '75%'
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    colors: ['#5664d2', '#1cbb8c', '#eeb902'],
};

const sparklineEarning: ChartType = {
    series: [72],
    chart: {
        type: 'radialBar',
        wight: 60,
        height: 60,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#5664d2'],
    stroke: {
        lineCap: 'round'
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '70%'
            },
            track: {
                margin: 0,
            },

            dataLabels: {
                show: false
            }
        }
    }
};

const sparklineMonthly: ChartType = {
    series: [65],
    chart: {
        type: 'radialBar',
        wight: 60,
        height: 60,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#1cbb8c'],
    stroke: {
        lineCap: 'round'
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '70%'
            },
            track: {
                margin: 0,
            },

            dataLabels: {
                show: false
            }
        }
    }
};

const chatData = [
    {
        id: 1,
        name: 'Adrien Godoy',
        message: 'Hey! J\'ai sommeil!',
        image: 'assets/images/users/avatar-2.jpg',
        time: '02:09'
    },
    {
        id: 2,
        align: 'right',
        name: 'Elliot Alderson',
        message: 'Tu m\'étonnes',
        time: '02:10'
        
    },
    {
        text: 'Today'
    },
    {
        id: 3,
        name: 'Adrien Godoy',
        message: 'Help!',
        image: 'assets/images/users/avatar-2.jpg',
        time: '10:06'
    },
    {
        id: 4,
        name: 'Adrien Godoy',
        message: 'Comment on sort de vim ?',
        image: 'assets/images/users/avatar-2.jpg',
        time: '10:06'
    },
    {
        id: 5,
        align: 'right',
        name: 'Elliot Alderson',
        message: 'Personne ne sort de vim',
        time: '10:07'
    }
];

const transactions = [
    {
        orderid: '#NZ1563',
        date: '28 mars, 2020',
        billingname: 'Bart Simpson',
        total: '164 k€',
        paymentstatus: 'Non payé'
    },
    {
        orderid: '#NZ1564',
        date: '28 mars, 2020',
        billingname: 'Eric Cartman',
        total: '141 k€',
        paymentstatus: 'Payé'
    },
    {
        orderid: '#NZ1565',
        date: '29 mars, 2020',
        billingname: 'Kyle Broflovski',
        total: '123 k€',
        paymentstatus: 'Payé'
    },
    {
        orderid: '#NZ1566',
        date: '30 mars, 2020',
        billingname: 'Rick Sanchez',
        total: '112 k€',
        paymentstatus: 'Payé'
    },
    {
        orderid: '#NZ1567',
        date: '31 mars, 2020',
        billingname: 'Morty Smith',
        total: '105 k€',
        paymentstatus: 'Non payé'
    },
    {
        orderid: '#NZ1568',
        date: '01 avr., 2020',
        billingname: 'Kenny McCormick',
        total: '160 k€',
        paymentstatus: 'Contestation'
    }
];

const statData = [
    {
        icon: 'ri-stack-line',
        title: 'Nombre de ventes',
        value: '1452'
    }, {
        icon: 'ri-store-2-line',
        title: 'Revenus des ventes',
        value: '38452 k€'
    }, {
        icon: 'ri-briefcase-4-line',
        title: 'Prix moyen',
        value: '15.4 k€'
    }
];

export { revenueChart, salesAnalytics, sparklineEarning, sparklineMonthly, chatData, transactions, statData };

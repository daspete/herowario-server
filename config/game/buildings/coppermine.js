export default {
    build: {
        time: 1,
        cost: {
            wood: 30,
            stone: 50,
            blink: 80
        },
        dependencies: {
            stonehut: 1
        }
    },
    levels: [
        {
            time: 6,
            cost: {
                wood: 80,
                stone: 110,
                blink: 160
            },
            grow: {
                copper: {
                    amount: 15,
                    time: 5
                }
            }
        },
    ],
    grow: {
        copper: {
            time: 8,
            amount: 4
        }
    },
}
export default {
    build: {
        time: 1,
        cost: {
            blink: 10,
        },
        dependencies: {}
    },
    levels: [
        {
            time: 6,
            cost: {
                blink: 25,
                stone: 50
            },
            grow: {
                stone: {
                    amount: 15,
                    time: 5
                }
            }
        },
        {
            time: 8,
            cost: {
                blink: 65,
                stone: 120
            },
            grow: {
                stone: {
                    amount: 45,
                    time: 6
                }
            }
        },
    ],
    grow: {
        stone: {
            time: 5,
            amount: 3
        }
    },
}
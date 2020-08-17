export default {
    build: {
        time: 1,
        cost: {
            blink: 100,
            wood: 50,
            stone: 50
        },
        dependencies: {
            lumberjack: 1
        }
    },
    levels: [
        {
            time: 6,
            cost: {
                wood: 30,
                stone: 50
            },
            grow: {
                board: {
                    amount: 3,
                    time: 6
                }
            }
        },
        {
            time: 8,
            cost: {
                wood: 70,
                stone: 120
            },
            grow: {
                board: {
                    amount: 8,
                    time: 6.5
                }
            }
        },
    ],
    grow: {
        board: {
            time: 4,
            amount: 1
        }
    },
}
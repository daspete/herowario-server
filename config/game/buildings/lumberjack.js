export default {
    build: {
        time: 1,
        cost: {
            blink: 20,
        },
        dependencies: {}
    },
    levels: [
        {
            time: 5,
            cost: {
                wood: 30,
                blink: 20
            },
            grow: {
                wood: {
                    amount: 25,
                    time: 5
                }
            }
        },
        {
            time: 8,
            cost: {
                wood: 50,
                blink: 40
            },
            grow: {
                wood: {
                    amount: 55,
                    time: 6
                }
            }
        },
    ],
    grow: {
        wood: {
            time: 4,
            amount: 6
        }
    },
}
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
            time: 5,
            cost: {
                wood: 20,
                blink: 30
            },
            grow: {
                blink: {
                    amount: 15,
                    time: 4
                }
            }
        },
        {
            time: 8,
            cost: {
                wood: 50,
                blink: 70
            },
            grow: {
                blink: {
                    amount: 35,
                    time: 5
                }
            }
        },
        {
            time: 15,
            cost: {
                wood: 110,
                blink: 130
            },
            grow: {
                blink: {
                    amount: 95,
                    time: 6
                }
            }
        },
        
    ],
    grow: {
        blink: {
            time: 3,
            amount: 7
        }
    },
}
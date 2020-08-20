class Timer {
    constructor(){
        this.last = null

        this.timer = {
            start: null,
            end: null
        }
    }

    get Now(){
        const time = new Date().getTime()
        this.last = time
        return time
    }

    StartTimer(){
        this.timer.start = this.Now
    }

    GetTimerTime(){
        return this.Now - this.timer.start
    }
}

export default Timer
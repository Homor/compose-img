class Limit {
    constructor(max=1) {
        this.max = max
        this.num = 0
        this.queue = []
        this.left = []
    }
    start(arr) {
        this.left = [...arr]
        while (this.num < this.max) {
            this.addTask()
        }
        let race = Promise.race(this.queue)
        return this.run(race)
    }
    addTask() {
        if (this.left.length) {
            let task = this.left.shift()
            this.queue.push(task)
            this.num++
            task.then(() => {
                this.queue.splice(this.queue.indexOf(task), 1)
            })
        }
    }
    run(race) {
        race.then(() => {
            this.addTask()
            let race = Promise.race(this.queue)
            return this.run(race)
        })
    }
}

module.exports=Limit;
import {makeAutoObservable, runInAction} from 'mobx';

export class Timer2 {
    secondsPassed = 0

    constructor() {
        makeAutoObservable(this);

        setInterval(() => {
            runInAction(() => this.increaseTimer())
        }, 2000)
    }

    increaseTimer() {
        this.secondsPassed += 2;
    }
}

const timer2 = new Timer2()
export default timer2;

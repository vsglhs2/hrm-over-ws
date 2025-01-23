import {makeAutoObservable, runInAction} from 'mobx';

export class Timer1 {
    secondsPassed = 0

    constructor() {
        makeAutoObservable(this);

        setInterval(() => {
            runInAction(() => this.increaseTimer())
        }, 1000)
    }

    increaseTimer() {
        this.secondsPassed += 1;
    }
}

const timer1 = new Timer1();
export default timer1;

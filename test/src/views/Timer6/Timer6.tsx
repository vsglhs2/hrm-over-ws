import React from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import {Timer2} from './Timer2Store';

export type Timer2Props = {
    timer: Timer2;
}

export default observer<Timer2Props>(({timer}) => {
    return <span>Seconds passed: {timer.secondsPassed}</span>;
})

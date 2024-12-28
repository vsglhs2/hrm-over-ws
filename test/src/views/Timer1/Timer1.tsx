import React from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react-lite"
import {Timer1} from './Timer1Store';
import FormComponent1 from '../../components/FormComponents/FormComponent1';
import FormComponent13 from '../../components/FormComponents/FormComponent13';
import FormComponent12 from '../../components/FormComponents/FormComponent12';
import FormComponent11 from '../../components/FormComponents/FormComponent11';
import FormComponent10 from '../../components/FormComponents/FormComponent10';
import FormComponent17 from '../../components/FormComponents/FormComponent17';
import FormComponent16 from '../../components/FormComponents/FormComponent16';
import FormComponent15 from '../../components/FormComponents/FormComponent15';
import FormComponent14 from '../../components/FormComponents/FormComponent14';
import FormComponent50 from '../../components/FormComponents/FormComponent50';
import FormComponent19 from '../../components/FormComponents/FormComponent19';
import FormComponent18 from '../../components/FormComponents/FormComponent18';
import FormComponent24 from '../../components/FormComponents/FormComponent24';
import FormComponent28 from '../../components/FormComponents/FormComponent28';
import FormComponent27 from '../../components/FormComponents/FormComponent27';
import FormComponent26 from '../../components/FormComponents/FormComponent26';
import FormComponent25 from '../../components/FormComponents/FormComponent25';
import FormComponent20 from '../../components/FormComponents/FormComponent20';
import FormComponent8 from '../../components/FormComponents/FormComponent8';
import FormComponent7 from '../../components/FormComponents/FormComponent7';
import FormComponent6 from '../../components/FormComponents/FormComponent6';
import FormComponent5 from '../../components/FormComponents/FormComponent5';
import FormComponent29 from '../../components/FormComponents/FormComponent29';
import FormComponent4 from '../../components/FormComponents/FormComponent4';
import FormComponent3 from '../../components/FormComponents/FormComponent3';
import FormComponent2 from '../../components/FormComponents/FormComponent2';
import FormComponent35 from '../../components/FormComponents/FormComponent35';
import FormComponent34 from '../../components/FormComponents/FormComponent34';
import FormComponent33 from '../../components/FormComponents/FormComponent33';
import FormComponent32 from '../../components/FormComponents/FormComponent32';
import FormComponent39 from '../../components/FormComponents/FormComponent39';
import FormComponent38 from '../../components/FormComponents/FormComponent38';
import FormComponent37 from '../../components/FormComponents/FormComponent37';
import FormComponent36 from '../../components/FormComponents/FormComponent36';
import FormComponent31 from '../../components/FormComponents/FormComponent31';
import FormComponent30 from '../../components/FormComponents/FormComponent30';
import FormComponent46 from '../../components/FormComponents/FormComponent46';
import FormComponent45 from '../../components/FormComponents/FormComponent45';
import FormComponent44 from '../../components/FormComponents/FormComponent44';
import FormComponent43 from '../../components/FormComponents/FormComponent43';
import FormComponent49 from '../../components/FormComponents/FormComponent49';
import FormComponent48 from '../../components/FormComponents/FormComponent48';
import FormComponent47 from '../../components/FormComponents/FormComponent47';
import FormComponent42 from '../../components/FormComponents/FormComponent42';
import FormComponent41 from '../../components/FormComponents/FormComponent41';
import FormComponent40 from '../../components/FormComponents/FormComponent40';
import FormComponent9 from '../../components/FormComponents/FormComponent9';
import FormComponent23 from '../../components/FormComponents/FormComponent23';
import FormComponent22 from '../../components/FormComponents/FormComponent22';
import FormComponent21 from '../../components/FormComponents/FormComponent21';

export type Timer1Props = {
    timer: Timer1;
}

export default observer<Timer1Props>(({timer}) => {
    return <span>
        <FormComponent1/>
        <FormComponent2/>
        <FormComponent3/>
        <FormComponent4/>
        <FormComponent5/>
        <FormComponent6/>
        <FormComponent7/>
        <FormComponent8/>
        <FormComponent9/>
        <FormComponent10/>
        <FormComponent11/>
        <FormComponent12/>
        <FormComponent13/>
        <FormComponent14/>
        <FormComponent15/>
        <FormComponent16/>
        <FormComponent17/>
        <FormComponent18/>
        <FormComponent19/>
        <FormComponent20/>
        <FormComponent21/>
        <FormComponent22/>
        <FormComponent23/>
        <FormComponent24/>
        <FormComponent25/>
        <FormComponent26/>
        <FormComponent27/>
        <FormComponent28/>
        <FormComponent29/>
        <FormComponent30/>
        <FormComponent31/>
        <FormComponent32/>
        <FormComponent33/>
        <FormComponent34/>
        <FormComponent35/>
        <FormComponent36/>
        <FormComponent37/>
        <FormComponent38/>
        <FormComponent39/>
        <FormComponent40/>
        <FormComponent41/>
        <FormComponent42/>
        <FormComponent43/>
        <FormComponent44/>
        <FormComponent45/>
        <FormComponent46/>
        <FormComponent47/>
        <FormComponent48/>
        <FormComponent49/>
        <FormComponent50/>
        <br/>Seconds passed: {timer.secondsPassed}</span>;
})

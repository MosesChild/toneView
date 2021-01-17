import { createElement, makeTrigger, makeSelectList, SelectListener} from "../midi_browser/home_modules/makeView.js";
import { toneView, awaitTone } from "./toneView.js";

var envelope= new Tone.Envelope();
var signal=new Tone.Signal();


let parameters=envelope.get();

function applyRampCurve(curve, frequency){
    if (curve==="linear"){
      //  linearRampTo
    } else if (curve==="exponential"){
     //   exponentialRampTo
    } 
};


var FreqEnv=function (){
    Object.assign({},parameters,{
    name:"betterFrequencyEnvelope",
    attack: 0.01,
    attackCurve: "linear",
    decay:	0.1,
    decayCurve:	"exponential",
    release: 1,
    releaseCurve: "exponential",
    offset: { peak: 0 , sustain: 0}, /* semitones */
    output: new Tone.Signal(),
    triggerAttackRelease: function triggerAttackRelease (note, duration){
    }
});
}
toneView(envelope);
console.log(myFreqEnv);
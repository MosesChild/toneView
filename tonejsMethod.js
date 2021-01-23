

import { createElement, makeTrigger, makeSelectList, SelectListener} from "./makeView.js";
import { toneView } from "./toneView.js";
import { getShallowMethods, getMethods } from "./methodExperiments.js";

var synth=new Tone.FMSynth()
.toDestination()
var metal=new Tone.MetalSynth()
.toDestination()
var trigger1=makeTrigger(synth);
var trigger2=makeTrigger(metal);
var synthView=new toneView(synth);
console.log(synthView)

let initialize = createElement('button', {textContent : "log", onclick:(e)=>{synthView.logState()}})
document.body.appendChild(initialize);

//synthView.initialize()
//setTimeout(synthView.initialize, 2000);
//toneView(metal);

/*********************get usable methods 
var methods=getMethods(synth).filter(value => value.indexOf('_')<0 )
var selector=makeSelectList(methods);
const SelectList= new SelectListener(selector, synth);
*/

synth.debug=true;



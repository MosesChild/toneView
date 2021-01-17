

import { createElement, makeTrigger, makeSelectList, SelectListener} from "../midi_browser/home_modules/makeView.js";
import { toneView, awaitTone } from "./toneView.js";
import { getShallowMethods, getMethods } from "./methodExperiments.js";



document.body.addEventListener('mousedown', awaitTone);

var synth=new Tone.FMSynth()
.toDestination()
var metal=new Tone.MetalSynth()
.toDestination()
var trigger1=makeTrigger(synth);
var trigger2=makeTrigger(metal);
toneView(synth);
toneView(metal);

/*********************get usable methods 
var methods=getMethods(synth).filter(value => value.indexOf('_')<0 )
var selector=makeSelectList(methods);
const SelectList= new SelectListener(selector, synth);
*/

synth.debug=true;



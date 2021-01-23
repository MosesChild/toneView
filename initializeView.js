import {
    getTableRowsByClassNames,
} from "../simpleTable/simpleTable.js";

function clickButton(button) {
    let eventObj = document.createEvent("Events");
    eventObj.initEvent("click", true, true);
    button.dispatchEvent(eventObj);
}

function openInnerButtons(buttons) { //this recursive function no longer necessary with updated simple table.
    // this function opens the whole toneObject to the DOM, allowing for
    //an initialization of values that further customize the simpleTable DOM to toneView.  It gets a bit awkward in the middle but does work...
    buttons.forEach((button, index) => {
         if (
              button.dataset.address &&
              button.dataset.address.indexOf("partials") < 0 // prevents partials object that has no usable properties from creating loop.
         ) {
              //  then buttons will open one at a time,
              clickButton(button); // opens object
              clickButton(button); // closes object immediately as the next level has been created (just not displayed!)
              // then you must only select the newly created rows
              let nextRow = button.parentElement.parentElement.nextSibling; // find the newly created next row and use its className to make select rows..
              let classNames = nextRow.className.split(" ");
              let innerRows = getTableRowsByClassNames(classNames);
              let innerButtons = innerRows.map((
                   outerElement // map the rows to get buttons elements and nulls,
              ) => outerElement.querySelector("button"));

              innerButtons = innerButtons.filter(
                   // remove all null values from nodeMap.
                   (member) => member !== null
              );
              if (innerButtons.length > 0) {
                   // check for buttons... if so
                   openInnerButtons(innerButtons); // recursively do the same.
              }
         }
    });
}

const constraints={
   'vibratoAmount': {min: 0, max: 1, step: .01 }, 
   'harmonicity':{min: -1 },
   'vibratoRate':{min: 0, max: '127'},
   'volume':{min: -Infinity, max: Infinity},
   'detune':{step: 1 },
   'portamento':{min: 0, max:12.7, step: .1}
}
function applyInputClass(){
    //Object.keys(constraints).forEach(constraint=>{
        let matchString = Object.keys(constraints);
        let inputs =   document.querySelectorAll("input");
        inputs.forEach(input=>{
            if (input.dataset.address){
                let [...address]= input.dataset.address.split('_');
                input.classList.add(address.pop());
            }
        })
    }
    function applyConstraints(){
        let constraintNames=Object.keys(constraints);
        constraintNames.forEach(cName=>{
            let inputs=document.getElementsByClassName(cName);
            [...inputs].forEach(input=>Object.assign(input, constraints[cName]))
            //console.log(cName, );
        })
    }
    function initializeToneView(viewObj){
        // fully open object!
        let buttons = viewObj.querySelectorAll("button");
        openInnerButtons(buttons);
        applyInputClass();
        applyConstraints();
    }
    const lists={
        attackCurve: ["linear", "exponential" ,"sine", "cosine", "bounce", "ripple", "step"],
        decayCurve: ["linear", "exponential"] ,
        releaseCurve: ["linear", "exponential" ,"sine", "cosine", "bounce", "ripple", "step"],
        
    }
    const OmniOscillatorTypes= ["sine", "square", "triangle", "sawtooth", "fatsine" , "fatsquare" , "fatsawtooth" , "fattriangle" , "fatcustom" , "fmsine" , "fmsquare" , "fmsawtooth" , "fmtriangle" , "fmcustom" , "amsine" , "amsquare" , "amsawtooth" , "amtriangle" , "amcustom", "pulse" , "pwm"]
    
    const filterTypes=["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"];
    
    const selectListObjectArray=[{address: "oscillator_type", choices: OmniOscillatorTypes},
    {address: 'attackCurve', choices: lists.attackCurve}, 
    {address: 'decayCurve', choices: lists.decayCurve}, 
    {address: 'releaseCurve', choices: lists.releaseCurve},
    {address: 'filter_type', choices: filterTypes },
    {address: 'modulation_type', choices: OmniOscillatorTypes },

    ]; 
    export {initializeToneView, clickButton, selectListObjectArray};
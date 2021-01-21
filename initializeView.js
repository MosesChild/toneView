import {
    getTableRowsByClassNames,
} from "../simpleTable/simpleTable.js";
import {makeSelectList} from './makeView.js';

function clickButton(button) {
    let eventObj = document.createEvent("Events");
    eventObj.initEvent("click", true, true);
    button.dispatchEvent(eventObj);
}

function openInnerButtons(buttons) {
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
              //console.log(button);
              // then you must only select the newly created rows
              let nextRow = button.parentElement.parentElement.nextSibling; // find the newly opened next row and use its classname to get new address...
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
function changeToSelectList(element, choiceArray){
   let parentCell=element.parentElement;
   let choice=`option[value='${element.value}']`;
   //console.log(choice, choiceArray)
   parentCell.removeChild(element);

   let selectList = makeSelectList(choiceArray);
   selectList.dataset.address=element.dataset.address;
   parentCell.appendChild(selectList);
   let option= selectList.querySelector(choice);
   selectList.selectedIndex=option.index;
   //console.log("current selectList selected option is", option, option.index);
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
   applySelectLists();
}
const lists={
   attackCurve: ["linear", "exponential" ,"sine", "cosine", "bounce", "ripple", "step"],
   decayCurve: ["linear", "exponential"] ,
   releaseCurve: ["linear", "exponential" ,"sine", "cosine", "bounce", "ripple", "step"],
  
}
const OmniOscillatorTypes= ["sine", "square", "triangle", "sawtooth", "fatsine" , "fatsquare" , "fatsawtooth" , "fattriangle" , "fatcustom" , "fmsine" , "fmsquare" , "fmsawtooth" , "fmtriangle" , "fmcustom" , "amsine" , "amsquare" , "amsawtooth" , "amtriangle" , "amcustom", "pulse" , "pwm"]

const filterTypes=["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"];



function applySelectLists(){
   let selectArrays=Object.keys(lists);
   selectArrays.forEach(array=>{
       let currentClass=document.querySelectorAll(`.${array}`);
      // console.log(currentClass, lists[array]);
       [...currentClass].forEach(textInput=>changeToSelectList(textInput, lists[array]));
   })
   // needs to do check on oscillator or possible errors will occur.
   let typeLists=document.querySelectorAll('.type');
   let oscillators=[...typeLists].filter(element=>element.dataset.address.indexOf('oscillator_type')>-1)
   let filters=[...typeLists].filter(element=>element.dataset.address.indexOf('filter_type')>-1)
   oscillators.forEach(oscillator=>{changeToSelectList(oscillator, OmniOscillatorTypes)})
   filters.forEach(filter=>{changeToSelectList(filter, filterTypes)})
     //   if (oscillator.)
}

export {initializeToneView};
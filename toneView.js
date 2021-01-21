import {
     simpleTable,
     getTableRowsByClassNames,
} from "../simpleTable/simpleTable.js";

import {makeSelectList, searchObject} from './uncommitted/makeView.js';


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
    let choice=`[value='${element.value}']`;
    //console.log(choice, choiceArray)
    parentCell.removeChild(element);

    let selectList = makeSelectList(choiceArray);
    selectList.dataset.address=element.dataset.address;
    parentCell.appendChild(selectList);
    let option= selectList.querySelector('option'+choice);
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
    releaseCurve: ["linear", "exponential" ,"sine", "cosine", "bounce", "ripple", "step"]
}
function applySelectLists(){
    let selectArrays=Object.keys(lists);
    selectArrays.forEach(array=>{
        let currentClass=document.querySelectorAll(`.${array}`);
       // console.log(currentClass, lists[array]);
        [...currentClass].forEach(textInput=>changeToSelectList(textInput, lists[array]));
    })

}

const getInnerObject = (toneObj, addressArray) => {
     let innerObject = addressArray.reduce((accum, key) => accum[key], toneObj);
     return innerObject;
};

const ToneViewListener = function (element, toneObj) {
     this.name = toneObj.name + "Listener";
     this.onchange = function (event) {
         let [base, ...address] = event.target.dataset.address.split("_");
         let attribute = address.pop();
         let inner = getInnerObject(toneObj, address);
         let previousValue = inner[attribute];
         let target=event.target, value=target.value

        if (target.selectedIndex){
            value=target.options[target.selectedIndex].value;    // redefine value for select lists...
        }
        inner.set({ [attribute]: value });
        console.log(inner, value);
     };
     this.scroll = function (event) {
          console.log("ToneViewScroll", event, event.target);
     };

     element.addEventListener("input", this.onchange.bind(this), false);
     document.addEventListener("wheel", this.scroll.bind(this), {
          passive: true,
     });
};

const toneView = function (toneObj) {
     // create toneView object.
     var view = simpleTable(toneObj.get()),
          caption = view.table.createCaption();
     caption.innerText = toneObj.name;
     initializeToneView(view.table);
     view.listener = new ToneViewListener(view.table, toneObj);
     return view;
};


export { toneView };

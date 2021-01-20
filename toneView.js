import {
     simpleTable,
     getTableRowsByClassNames,
} from "../simpleTable/simpleTable.js";

async function awaitTone() {
     await Tone.start();
     console.log("audio is ready");
     document.body.removeEventListener("mousedown", awaitTone);
}

function clickButton(button) {
     let eventObj = document.createEvent("Events");
     eventObj.initEvent("click", true, true);
     console.log(button, "event?", eventObj);
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
               clickButton(button); // closes object immediately as the next level has been created (just not displayed1)
               console.log(button);
               // then you must only select the newly created rows
               let nextRow = button.parentElement.parentElement.nextSibling; // find the newly opened next row and use its classname to get new address...
               let classNames = nextRow.className.split(" ");

               let innerRows = getTableRowsByClassNames(classNames);
               let innerButtons = innerRows.map((
                    outerElement // map the rows to get buttons elements and nulls,
               ) => outerElement.querySelector("button"));

               innerButtons = innerButtons.filter(
                    // remove all null values.
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
    'vibratoAmount': {min: 0, max: 1 }, 
    'harmonicity':{min: -1 },
    'vibratoRate':{min: 0, max: '127'},
    'volume':{min: -64, max: 64},
    'detune':{step: 1 },
    'portamento':{min: 0, max:12.7}
}
function applyInputConstraints(){
    //Object.keys(constraints).forEach(constraint=>{
    let inputs =   document.querySelectorAll('inputs[type=number]')
    //})
    console.log(inputs)
}

function initializeToneView(viewObj){
     // fully open object!
     let buttons = viewObj.querySelectorAll("button");
     openInnerButtons(buttons);
     // add number restraints
    applyInputConstraints()
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
          let value = event.target.value;
          let inner = getInnerObject(toneObj, address);
          let previousValue = inner[attribute];
          try {
               inner.set({ [attribute]: value });
          } catch (error) {
               if (error instanceof RangeError) {
                    if (previousValue > value) {
                         inner.set({ [attribute]: previousValue });
                         event.target.setAttribute("min", previousValue);
                    } else {
                         event.target.setAttribute("max", previousValue);
                    }
                    console.log(event.target, previousValue, value);
               }
          }
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


export { toneView, awaitTone };

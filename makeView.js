import { getAllPropertyNames } from "./methodExperiments.js";

function createElement(element, options) {
  // potentially dangerous! no check if valid properties!
  let domObject = Object.assign(document.createElement(element), options);
  return domObject;
}

function encapsulate() {
  let args = [].slice.call(arguments);
  let div = createElement("div");
  args.forEach((element, index, array) => {
    let nextArg = array[index + 1];
    if (typeof nextArg === "object") {
      console.log(nextArg, nextArg);
      div.appendChild(createElement(element, nextArg));
    } else if (typeof element === "string") {
      div.appendChild(createElement(element));
    }
  });
  
  return div;
}

function makeSelectList(_array){
    var stuff=_array.map(entry=>["option", {value: entry, textContent: entry }]);
    var select=createElement('select');
    stuff.forEach(pair=>{ 
        let option=createElement(pair[0], pair[1])
        select.appendChild(option);
    });
    console.log(select);
  
    document.body.append(select);
    return select;
};
function SelectListener(element){
    console.log(`SelectListener`, element, toneObj)
    this.selectMe=function(e){
        let index=e.target.options.selectedIndex;
        let value=e.target.options[index].value;
        console.log(`event`,value);
    }
    element.addEventListener('change', this.selectMe.bind(this), false);
}


function makeTrigger(toneObj) {
    var triggerStuff = encapsulate("button", { textContent: "Trigger" }, 
    "input", {  type: "text", classList: "frequency", value:"C4"}, 
    "input", {type: "text", classList: "duration", value:"1n"}
    );
    let button=triggerStuff.querySelector('button');
    document.body.appendChild(triggerStuff);
    console.log("button",button);
    const triggerEvent=new TriggerAttackRel(button, toneObj);
    return triggerStuff;
}

function TriggerAttackRel(element, toneObj) {
    this.clickEvent = function (event) {
      let frequency=event.target.parentElement.querySelector('.frequency').value;
      let duration=event.target.parentElement.querySelector('.duration').value;
     // console.log(`methodsTrigger ${methods[8]}`);
      toneObj.triggerAttackRelease(frequency, duration)
    }
    element.addEventListener('click', this.clickEvent.bind(this), false);
    //synth[methods[8]](value, "1n");
};



function makeAction(methodName) {
  var trigger = encapsulate("button", { textContent: methodName }, "input", {
    type: "text"}
  );
  document.body.appendChild(trigger);
  return trigger;
}



export { createElement,  encapsulate, makeTrigger, makeSelectList, SelectListener, makeAction };

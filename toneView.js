import { simpleTable } from "../simpleTable/simpleTable.js";

import { initializeToneView } from "./initializeView.js";

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
          let target = event.target,
               value = target.value;

          if (target.selectedIndex) {
               value = target.options[target.selectedIndex].value; // redefine value for select lists...
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
     console.log(this, "this");
     // create toneView object.
     var view;
     this.initialize = () => {
          console.log('initialized called')
          let parent;
          if (typeof view=== 'object'){
               parent=view.table.parentElement;
               console.log('parent', parent)
               parent.removeChild(view.table);
          }
          view = simpleTable(toneObj.get());
            var caption = view.table.createCaption();
               caption.innerText = toneObj.name;
               initializeToneView(view.table);
               view.listener = new ToneViewListener(view.table, toneObj);
          
     };
     this.initialize(toneObj);
     return this;
};

export { toneView };

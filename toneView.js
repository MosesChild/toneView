import { getTableRowsByClassNames, simpleTable } from "../simpleTable/simpleTable.js";

import { initializeToneView, clickButton, selectListObjectArray } from "./initializeView.js";

const getInnerObject = (toneObj, addressArray) => {
     let innerObject = addressArray.reduce((accum, key) => accum[key], toneObj);
     return innerObject;
};
const updateInnerObjectTableRows=(target)=>{
     let thisRow=target.parentElement.parentElement;
     let removeTarget=thisRow.className.split(' ')
     let table=target.parentElement.parentElement.parentElement;
     [...getTableRowsByClassNames(removeTarget)].forEach(row=>{ table.removeChild(row) });
     //then use clickEvent to reopen innerObject. 
     let buttonAddress = removeTarget.join(',').replace(/,/g, '_').split();
     console.log('table', table, 'buttonAddress', buttonAddress)
     let objectButton=table.querySelector(`button[data-address="${buttonAddress}"]`);
     clickButton(objectButton);
}
const ToneViewListener = function (element, toneViewObj) {
     this.name = toneViewObj.toneObject.name + "Listener";
     console.log(toneViewObj)
     function updatePrimary(){toneViewObj.simpleTable.primaryObject=toneViewObj.toneObject.get()}
     this.onchange = function (event) {
          let [base, ...address] = event.target.dataset.address.split("_");
          let attribute = address.pop();
          let inner = getInnerObject(toneViewObj.toneObject, address);
          let previousValue = inner[attribute];
          let target = event.target,
               value = target.value;
          if (target.selectedIndex) {
               value = target.options[target.selectedIndex].value; // redefine value for select lists...
               inner.set({ [attribute]: value }); 
               // some selectlists change the options (innerObject) that the toneObj uses.  To update the inner object we must remove all inner object rows.
          if (attribute==='type'){
               updateInnerObjectTableRows(target);
          }   
          } else {
               inner.set({ [attribute]: value });
          }
          //update the simpleTable primaryObject so it is in sync.
          updatePrimary();
          console.log(this, inner, value);
     };
     this.scroll = function (event) {
          console.log("ToneViewScroll", event, event.target);
     };

     element.addEventListener("input", this.onchange.bind(this), false);
     document.addEventListener("wheel", this.scroll.bind(this), {
          passive: true,
     });
};

const toneView = function (toneObject) {
     console.log(this, "this");
     // create permanent toneView object.

     this.toneObject=toneObject;
     let parent;
     this.initialize = () => {
         this.simpleTable=new simpleTable(toneObject.get(), selectListObjectArray );
         this.logState=this.simpleTable.logState ;
          console.log('initialized called', this);          
            var caption = this.simpleTable.table.createCaption();
               caption.innerText = toneObject.name;
               //initializeToneView(view.table);
               this.listener = new ToneViewListener(this.simpleTable.table, this);
          
     };
     this.reset=()=>{
               parent=view.table.parentElement;
               console.log('parent', parent)
               parent.removeChild(view.table);
     }
     this.initialize();
     return this;
};

export { toneView };
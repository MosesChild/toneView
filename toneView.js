import { simpleTable } from "../simpleTable/simpleTable.js";

async function awaitTone(){
    await Tone.start()
    console.log('audio is ready');
    document.body.removeEventListener('mousedown', awaitTone);
  };

const toneView=function(toneObj) {
    // create toneView object.
    var view=simpleTable(toneObj.get()),
    caption=view.table.createCaption();
    caption.innerText = toneObj.name;
    view.listener=new ToneViewListener(view.table,toneObj);
    return view;
} 

const ToneViewListener = function (element, toneObj) {
    this.name = toneObj.name+"Listener";
    this.onchange = function (event) {
        let attribute=event.target.className
        let value = event.target.value,
        [base, ...address] = event.target.parentElement.parentElement.className.split(' ');
        let inner = getInnerObject(toneObj, address);
        inner.set({[attribute]: value});

    }
    this.scroll = function (event) {
        console.log('ToneViewScroll', event, event.target);

    }
    element.addEventListener('input', this.onchange.bind(this), false);
    document.addEventListener('wheel', this.scroll.bind(this), {passive: true} );
}



const getInnerObject = (toneObj, addressArray) => {
    let innerObject = addressArray.reduce((accum, key)=>accum[key], toneObj);

    return innerObject
};

export {
    toneView, awaitTone
};
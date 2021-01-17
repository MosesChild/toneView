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
    console.log("toneView initialized", view);
    view.listener=new ToneViewListener(view.table,toneObj);
    return view;
} 

const ToneViewListener = function (element, toneObj) {
    
    this.name = toneObj.name+"Listener";
    this.onchange = function (event) {
        console.log('ToneViewListener')
        let value = event.target.value,
            address = interpretRowId(event.target.id),
            set = getSetPartial(toneObj, address);
        try {
            set(value);
        } catch (error) {
            console.log("eventlistener set(value) failed", error)
        }
    }
    this.scroll = function (event) {
        console.log('ToneViewScroll', event, event.target);

    }
    element.addEventListener('input', this.onchange.bind(this), false);
    document.addEventListener('wheel', this.scroll.bind(this), {passive: true} );
}

const interpretRowId = (rowId) => {
    const propertyAddress = rowId.split('_');
    return propertyAddress;
};

const getSetPartial = (toneObj, propertyAddress) => {
    // returns the correct 'partial' for value.
    let property1 = propertyAddress[0],
        property2 = propertyAddress[1],
        property3 = propertyAddress[2];
    console.log("property", property1);

    if (property3) {
        return (value) => toneObj[property1][property2].set({
            [property3]: value
        });
    } else if (property2) {
        return (value) => toneObj[property1].set({
            [property2]: value
        });
    } else {
        return (value) => toneObj.set({
            [property1]: value
        });
    }
};

export {
    toneView, awaitTone, interpretRowId, getSetPartial
};
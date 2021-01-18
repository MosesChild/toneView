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
        let attribute=event.target.className
        let value = event.target.value,
        [base, ...address] = event.target.parentElement.parentElement.className.split(' ');
        address.push(attribute);
        let set = getSetPartial(toneObj, address);

        console.log('ToneViewListener',address);
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
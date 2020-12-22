const Keypads = require('./keypads');
const { EventEmitter } = require('events');
const { createKeyboard } = require('./keyboard');
let config = require('./config');
let joins = require('lodash-joins').default;

// npm i usb x11 lodash-joins

// rules ids MUST be in hex
// /etc/udev/rules.d/90-keypads.rules
//
// SUBSYSTEM=="usb", ATTRS{idVendor}=="248A", MODE="0666"
// SUBSYSTEM=="usb_device", ATTRS{idVendor}=="248A", MODE="0666"

let keypad1 = undefined;
let keypad2 = undefined;
let map = [
    41, 148,  43,  39,
    83,  84,  85,  42,
    95,  96,  97,  86,
    92,  93,  94,  87,
    89,  90,  91,  40,
         98,  99,
];

function getMap(keycode) {
    for (let i = 0; i < map.length; i++) {
        if (map[i] == keycode) {
            return i;
        }
    }
    return undefined;
}

let xkey = (state, keycode) => { };

let events = new EventEmitter();

let keyboardsPr = [];
for (let i = 0; i < 1; i++) {
    keyboardsPr.push(createKeyboard());
}
Promise.all(keyboardsPr).then(keyboards => {
    xkey = (state, keycode) => {
        if(keycode==undefined)return;
        console.log(state?"+":"-", keycode);
        let keyboard = keyboards.pop();
        keyboards.unshift(keyboard);
        (state ? keyboard.press : keyboard.release)(keycode);
    }

    let keypads = new Keypads(config.keypads);

    keypads.on('attach', device => {
        // TODO: edit this part to connect depending on which USB it's connected
        if (!keypad2) {
            keypad2 = device;
        } else if (!keypad1) {
            keypad1 = device;
        }
        device.clickedCalc = false;
        device.clicked = [];
        device.clickedLayer = [];
        device.clickedMeta = [];
    });

    keypads.on('detach', device => {
        if (keypad1 && keypad1.mid == device.mid) {
            keypad1 = undefined;
        }
        if (keypad2 && keypad2.mid == device.mid) {
            keypad2 = undefined;
        }
        if (device.clickedCalc) {
            events.emit('key', device, false, getMap(148), 148);
        }
        device.clicked.forEach(keycode => {
            events.emit('key', device, false, getMap(keycode), keycode);
        });
    });

    keypads.on('data', (device, data) => {
        let clicked = device.clicked;
        if (data.length == 5) {
            let keycode = 148;
            let state = !!data[2];
            if (data[2] != device.clickedCalc) {
                events.emit('key', device, state, getMap(keycode), keycode);
            }
            device.clickedCalc = state;
        } else {
            let nowClicked = [];
            for (let i = 2; i < data.length; i++) {
                if (data[i] != 0) {
                    nowClicked.push(data[i]);
                }
            }
            // Yeah, I'm lazy.
            let pressed = joins.hashLeftAntiJoin(nowClicked, i => i, clicked, i => i);
            let released = joins.hashLeftAntiJoin(clicked, i => i, nowClicked, i => i);
            pressed.forEach(keycode => {
                events.emit('key', device, true, getMap(keycode), keycode);
            });
            released.forEach(keycode => {
                events.emit('key', device, false, getMap(keycode), keycode);
            });
            device.clicked = nowClicked;
        }
    });

});

let mod = {
    shift: false,
    ctrl: false,
    alt: false,
    altgr: false,
    super: false,
    fn1: false,
    fn2: false,
    fn3: false,
    fn4: false,
    fn5: false,
    fn6: false,
};

//        0    1    2    3    4      5    6    7    8    9
//  10   11   12   13   14   15     16   17   18   19   20   21
//  22   23   24   25   26   27     28   29   30   31   32   33
//       34   35   37   38   39     40   41   42   43   44 

// shift
let S = (keycode)=>(state,device)=>{
    if(state){
        let shift = !mod.shift;
        if(shift)setShift(true);
        device.clickedMeta[keycode] = shift;
        xkey(state,keycode);
    }else{
        xkey(state,keycode);
        if(device.clickedMeta[keycode])setShift(false);
        delete device.clickedMeta[keycode];
    }
}

let layers = [
    [ // main
              24,   25,   26,   27,   28,          29,   30,   31,   32,   33,
        22,   38,   39,   40,   41,   42,          43,   44,   45,   46,   47,   36,
        50,   52,   53,   54,   55,   56,          57,   58,   59,   60,   61, "??",
              37,    9,   64,   65, "F1",        "F2",   62, "F3",   23, "??",
    ],
    [ // F1 !@#$%^&*()_+
              10,   11,   12,   13,   14,          15,   16,   17,   18,   19,
        22,S(10),S(11),S(12),S(13),S(14),       S(15),S(16),S(17),S(18),S(19),   36,
        50,    0,   20,   21,S(20),S(21),           0,   48,   34,   35,   51,    0,
              37,    9,   64,   65, "F1",           0,   62,    0,   23, "??",
    ],
    [ // F2
               0,    0,    0,    0,    0,           0,  110,  117,  112,  115,
        22,    0,    0,    0,    0,    0,           0,  113,  116,  111,  114,   36,
        67,   68,   69,   70,   71,   72,          73,   74,   75,   76,   95,   96,
              37,    9,   64,   65,    0,        "F2",   62,    0,   23, "??",
    ],
    [ // F3
               0,    0,    0,    0,    0,           0,    0,    0,    0,    0,
        22,    0,    0,    0,    0,    0,           0,    0,    0,    0,    0,   36,
        50,    0,    0,    0,    0,    0,           0,    0,    0,    0,    0, "??",
              37,    9,   64,   65,    0,           0,   62, "F3",   23, "??",
    ],
];
/*
     0   1   2   3   4   |   5   6   7   8   9
10  11  12  13  14  15   |  16  17  18  19  20  21
22  23  24  25  26  27   |  28  29  30  31  32  33
    34  35  37  38  39   |  40  41  42  43  44
*/
let translateKeypads = [];
let translateKeypadsInv = [
    [
             0,  1,  2,  3,  4,
        10, 11, 12, 13, 14, 15,
        22, 23, 24, 25, 26, 27,
            34, 35, 36, 37, 38,
    ],[
         5,  6,  7,  8,  9,
        16, 17, 18, 19, 20, 21,
        28, 29, 30, 31, 32, 33,
        39, 40, 41, 42, 43,
    ]
];
let translateKeys = [];
let translateInv = [
    [
            16, 12,  8,  4,  0,
        20, 17, 13,  9,  5,  1,
        21, 18, 14, 10,  6,  2,
            19, 15, 11,  7,  3,
    ],
    [
         3,  7, 11, 15, 19,
         2,  6, 10, 14, 18, 21,
         1,  5,  9, 13, 17, 20,
         0,  4,  8, 12, 16,
    ]
];

for (let transl of translateInv) {
    let keyMapping = [];
    transl.forEach((i, index) => {
        keyMapping[i] = index;
    });
    translateKeys.push(keyMapping);
}
for (let transl of translateKeypadsInv) {
    let keyMapping = [];
    transl.forEach((i, index) => {
        keyMapping[i] = index;
    });
    translateKeypads.push(keyMapping);
}

let currentLayer = 0, layer = [];
let switchLayer = (index) => {
    console.log("Switching layer to "+index);
    layer = layers[currentLayer = index];
}
switchLayer(0);

let shiftingCount = 0;
function setShift(state){
    shiftingCount += state?1:-1;
    if(shiftingCount<0)shiftingCount=0;
    if(mod.shift!=shiftingCount){
        xkey(state, 50);
        mod.shift=state;
    }
}

events.on('key', (device, state, key) => {
    let whichKeypad = 0;
    if (device == keypad1) {
        whichKeypad = 0;
    } else if (device == keypad2) {
        whichKeypad = 1;
    } else {
        throw new Error("Over 2 keypads found!");
    }
    let keyloc = translateKeypadsInv[whichKeypad][translateKeys[whichKeypad][key]];
    let clayer = state?currentLayer:device.clickedLayer[key];
    if(state){
        device.clickedLayer[key] = currentLayer;
    }else{
        device.clickedLayer[key] = undefined;
    }
    let keylayer = layers[clayer][keyloc];
    if (keylayer === undefined || keylayer === 0) {
        console.warn("Did not find " + keyloc + " on layer " + currentLayer);
    } else if(typeof keylayer == "function"){
        keylayer(state,device);
    } else if (
        keylayer == "F1" ||
        keylayer == "F2" ||
        keylayer == "F3" ||
        keylayer == "F4" ||
        keylayer == "F5" ||
        keylayer == "F6" ||
        0) {
        if(state){
            switchLayer(keylayer[1]-0);
        }else{
            switchLayer(0);
        }
    } else {
        // let keyb = isNaN(keylayer) ? keycode(keylayer) : keylayer;
        let keyb = keylayer;
        if(keyb==50){
            setShift(state);
        }else{
            xkey(state, keyb);
        }
    }
    // console.log(keylayer);

    // console.log(whichKeypad, state, key);
});
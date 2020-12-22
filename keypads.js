const usb = require('usb')
const EventEmitter = require('events').EventEmitter;

// do cleanup when exiting
// process.stdin.resume();// so the program will not close instantly
// function exitHandler(options, exitCode) {
//     usb.cleanup();
//     if (exitCode || exitCode === 0) console.log(exitCode);
//     if (options.exit) process.exit();
// }
// // do something when app is closing
// process.on('exit', exitHandler.bind(null,{cleanup:true}));
// // catches ctrl+c event
// process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// // catches "kill pid" (for example: nodemon restart)
// process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
// process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
// // catches uncaught exceptions
// process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

module.exports = class Keypads extends EventEmitter {

    usbId = 0;
    listProductVendorIds;

    constructor(listProductVendorIds) {

        // rules ids MUST be in hex
        // SUBSYSTEM=="usb", ATTRS{idVendor}=="248A", MODE="0666"
        // SUBSYSTEM=="usb_device", ATTRS{idVendor}=="248A", MODE="0666"

        super();
        this.listProductVendorIds = listProductVendorIds;
        setImmediate(() => {
            let onAttachDevice = device => {
                if (this.isAllowedDevice(device)) {
                    device.mid = this.usbId++;
                    console.info("Found keypad!");
                    this.loadKeypad(device);
                    this.emit('attach', device);
                }else{
                    console.info("Connected not recognized device: [ "+device.deviceDescriptor.idProduct+", "+device.deviceDescriptor.idVendor+" ]");
                }
                this.emit('attachUSB', device);
            };
            usb.on('detach', device => {
                if (device.mid) {
                    this.emit('detach', device);
                }
                this.emit('detachUSB', device);
            });
            usb.on('attach', onAttachDevice);
            usb.getDeviceList().forEach(onAttachDevice);
        });
    }

    isAllowedDevice(device) {
        for(let productVendorId of this.listProductVendorIds) {
            if (device.deviceDescriptor.idProduct == productVendorId[0] &&
                device.deviceDescriptor.idVendor == productVendorId[1]) {
                return true;
            }
        };
        return false;
    }

    loadKeypad(device) {
        device.open();
        device.interfaces.forEach(interf=>{
            let endpoint = interf.endpoints[0];
            if(interf.isKernelDriverActive()){
                interf.detachKernelDriver();
            }
            interf.claim();
            endpoint.startPoll(1000, 8);
            endpoint.on('data', data=>{
                this.emit('data', device, data);
            });
            endpoint.on('error', error=>{
                // most of the time thrown when laptop goes to sleep or something else happens
                // console.info("Some error occurred:", error)
            });
            endpoint.on('end', data=>{
                try{
                    if(interf.isKernelDriverActive()){
                        interf.detachKernelDriver();
                    }
                    interf.claim();
                    endpoint.startPoll(1000, 8);
                }catch(e){}
            });
        })
    }
    
}
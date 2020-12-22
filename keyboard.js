const x11 = require('x11');

module.exports = {

    createKeyboard() {
        return new Promise((resolve, reject) =>{
            x11.createClient((err,display)=>{
                if(err){
                    return reject(err);
                }
                var root = display.screen[0].root;
                display.client.require('xtest', function(err, Test) {
                    let queue = [];
                    setInterval(()=>{
                        let k = queue.shift();
                        if(!k)return;
                        Test.FakeInput(k[0]?Test.KeyPress:Test.KeyRelease, k[1], 0, root, 0, 0);
                    },1);
                    resolve({
                        press(keycode){
                            // Test.FakeInput(Test.KeyPress, keycode, 0, root, 0, 0);
                            queue.push([true,keycode]);
                        },
                        release(keycode){
                            // Test.FakeInput(Test.KeyRelease, keycode, 0, root, 0, 0);
                            queue.push([false,keycode]);
                        }
                    });//ts
                });
                display.client.on('error', function(err) {
                    reject(err);
                });
            });
        })
    }
    
}
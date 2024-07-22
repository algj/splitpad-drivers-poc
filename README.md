# splitpad-drivers-poc

Node.js "drivers" for two numpads to work as one keyboard:
`npm i usb x11 lodash-joins`

You must add udev rules, they're in hexadecimal, my code accepts decimal in `config.js`.

## What's this?

This is a poor man's 40% "planck" - two wireless keypads, I have used Deltaco TB-125:

![image](https://github.com/user-attachments/assets/26ebb2ed-9e35-4544-8136-b20a58bbbb0e)

## FAQ

Q: QMK firmware?

A: Nope! I wrote libusb drivers which sends key events over Xlib(x11). I quickly written it in 4hrs with node.js, I will fully rewrite it later on, works only in Linux (since I'm not a MS Windows user).

Q: But why did you buy it?

A: I was on budget and I suck at soldering. I don't have any job rn. Those numpads were quite cheap and I often travel. I had bad experience with mechanical keyboards so I thought that wouldn't be that bad.

Q: What's the price?

A: It cost me around 11 EUR/13.50 USD for one keypad.

Q: Why Deltaco TB-125?

A: Well those aren't popular numpads, I tried to find the best numpad which had equal size keys and as many keys as possible without tall "+" key. This was the best numpad which I found. Ordered from local shop. It was on sale. Also, keep in mind to not buy numpads with "00" or "000" key, unless you're planning to install firmware on it (good luck), since it's almost impossible to figure out if you're holding "0" and "00"/"000" keys. It sends lots of press and release events when you hold it, kinda hard to write good drivers for it. Also the cover is metallic and sturdy.

Q: Why not mechanical?

A: I had bad experience in the past with mechanical keyboards and I don't want it to be loud. I like short actuation distance. This is also very comfortable for traveling,

Q: Battery life?

A: 2 weeks max.

Q: Round keycaps?

A: They comfy tbh.

Q: Any regrets or cons?

A: Yes. Some shortcuts may not work, like clicking CTRL+ALT+A did not work for me. I may not even need Super(WIN)/Alt buttons at all, I can just change the shortcuts or change drivers.

Q: What are the good things?

A: Price and no soldering.

Q: Layout?

A: Colemak, switched using Tarmak transitional layout. I fully switched on 2019 Christmas.

Q: Layers?

A: Currently using two layers. They do work well, I also programmed special symbols like `!@#$%^&*()_+-=[]{}\|`, F1-F12, arrow keys, home,end,pgdn,pgup and some other keys.

Q: Macros?

A: Yup! Currently no macros added, but it does work. :)

## Oh no

This is not ready for use, I wrote this code in couple hours since I was excited to test this out ASAP.

I noticed how many mistakes I've made, and I'm not proud of the code.

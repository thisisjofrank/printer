import { Printer, Image, BitmapDensity } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";

(async () => {

  console.log("It's printing time!");

  const device = new USB();
  console.log("USB Device created...");

  device.open(async (err) => {
    if (err) {
      console.error("Error opening device:", err);
      return;
    }

    console.log("Device opened successfully.");
    const printer = new Printer(device, { encoding: "GB18030" });

    printer.initialise = () => {
        printer.buffer.write("\x1B@");
        return printer;
    };
    
    // Epson LX-350 compatible 9-pin ESC/P Escape Codes
    styles = {
        "initialise": "\x1B@",
        "clear": "\x1B@",
        "dw": "\x1BW1",
        "dw_cancel": "\x1BW0",
        "dh": "\x1Bw1",
        "dh_cancel": "\x1Bw0",
        "normal": "\x1BP",
        "condensed": "\x1BM",
        "very_condensed": "\x1Bg",
        "proportional": "\x1Bp1",
        "fixed": "\x1Bp0",
        "bold": "\x1BE",
        "bold_cancel": "\x1BF",
        "italic": "\x1B4",
        "italic_cancel": "\x1B5"
        }
        
    
    printer.initialise()
    printer
        .lineSpace(48)
        .pureText(styles.dw)
        .pureText(styles.dh)
        .pureText(styles.bold)
        .pureText("Matt Gray")
        .pureText(styles.bold_cancel)
        .pureText(styles.dw_cancel)
        .pureText(styles.dh_cancel)
        .pureText(styles.italic)
        .text(" @MattGrayYes@Chaos.Social")
        .pureText(styles.italic_cancel)
        .lineSpace()
        .drawLine()
        .pureText(styles.proportional)
        .text(splitLines("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum..",83))
        .feed()
        .feed()
        .close();

  });

  device.close();

})();

// Default image function sets line spacing to 0. Epson LX-350 needs a line spacing of 24 for images
async function imageWithLineSpacing(printer: Printer<[]>, image: Image, density?: BitmapDensity | undefined) {
  const defaultLineSpace = printer.lineSpace;
  const lineSpace24 = (n?: number | null) => {
    printer.buffer.write("\x1B\x33");
    printer.buffer.writeUInt8(24);
    return printer;
  }

  printer.lineSpace = lineSpace24;
  await printer.image(image, density);

  printer.lineSpace = defaultLineSpace;
}


/*
* Ths function is taken from https://liza.io/splitting-text-into-lines-according-to-maximum-width-vertical-text-scroll-in-javascript-and-html5/
* and has been slightly modified to output a string separated by newlines
*/
function splitLines(text: string, maxTextWidth: number) {
    // Split text into words by spaces
    var words = text.split(' ');
    var lastWord = words[words.length - 1];
    var lineWidth = 0;
    var wordWidth = 0;
    var thisLine = '';
    var allLines = new Array();

    // For every element in the array of words
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        // Add current word to current line
        thisLine = thisLine.concat(word + ' ');
        // Get width of the entire current line
        lineWidth = thisLine.length;
        // If word is not the last element in the array
        if (word !== lastWord) {
            // Find out what the next upcoming word is
            var nextWord = words[i + 1];

            // Check if the current line + the next word would go over width limit
            if (lineWidth + nextWord.length >= maxTextWidth) {
                // If so, add the current line to the allLines array
                // without adding the next word
                addToAllLines(thisLine);
            } 

            // '~' indicates inserting a blank line, if required
            else if (word === '~') {
                addToAllLines(' ');
            }

            // If the next word is a line break, end line now
            else if (nextWord === '~') {
                addToAllLines(thisLine);
            }
        }

        // If this IS the last word in the array
        else {
            // Add this entire line to the array and return allLines
            addToAllLines(thisLine);
            
            return allLines.join("\n");
        }
    }

    // Function that adds text to the array of all lines
    function addToAllLines(text) {
        allLines.push(text);
        thisLine = '';
        lineWidth = 0;
    }
}
import * as fs  from 'node:fs';
import { Printer, Image, BitmapDensity } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";

  
if (fs.existsSync('/dev/usb/lp0')) {
    console.error("🚨 no done folder.")
    process.exit(1);
}

if (!fs.existsSync('done/')) {
    console.error("🚨 no done folder.")
    process.exit(1);
}

if (!fs.existsSync('out/')) {
    console.error("🚨 no out folder.")
    process.exit(1);
}

(async () => {
/*
    const device = new USB();
    console.log("USB Device created...");

    device.open(async (err) => {
        if (err) {
          console.error("Error opening device:", err);
          process.exit(1);
        }
    
        console.log("Device opened successfully.");
        const printer = new Printer(device, { encoding: "GB18030" });
*/   
        while(true) {
            var filenames = fs.readdirSync("out/"); 
        
            filenames.forEach(file => 
            { 
                console.log("\n\n📄 "+file);

                var filetype = file.split(".").pop();
                console.log("filetype:", filetype)
        
                try {
                    var filestats = fs.statSync('out/'+file);
        
                } catch (err) {
                    console.error(err);
                    return
                }
        
                var filetime = new Date(filestats.ctime).getTime() + 10000;
                var now = new Date().getTime();
        
                // if the file's been sat there for 10s
                if(now > filetime) {
                    var file_contents = fs.readFileSync('out/'+file, 'utf8');
                    
                    if(filetype == "txt") {
                        // print the string
                        if(false) { // IF ITS SUCCESSFULLY PRINTED THE STRING
                            console.log('moving: out/'+file+' to done/'+file)
                            fs.renameSync('out/'+file, 'done/'+file);
                        }
                        else
                            console.error('not printed. not moving.')
                    }
                    else if (filetype == "json") {
                        var toot = JSON.parse(file_contents)

                        console.log(toot.account.display_name)
                        console.log(toot.account.acct)
                        console.log(toot.account.avatar)
                        console.log(toot.created_at)
                        console.log(toot.content)

                        if(toot.media_attachments.length >= 1) {
                            toot.media_attachments.forEach( (item) => {
                                console.log(item.type)
                                console.log(item.preview_url)
                                console.log(item.description)
                            })
                        }
                    }
                    else
                        console.error("I have no idea what to do with this file, it's not txt or json",file)
                    
                }
                else
                    console.log("file not old enough yet")
            
            }); 
        
            console.log("\n\n⏰ pause")
            await new Promise(r => setTimeout(r, 5000));

        } // while true

        //printer.feed().close();
    //}); //device.open
  
    //device.close();
  
  })();
  



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
  
  
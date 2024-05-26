import { Printer, Image, BitmapDensity } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";


(async () => {

  console.log("It's printing time!");

  const image = await Image.load("./blessed.jpg");
  console.log("Image loaded, size:", image.size);

  const device = new USB();
  console.log("USB Device created...");

  device.open(async (err) => {
    if (err) {
      console.error("Error opening device:", err);
      return;
    }

    console.log("Device opened successfully.");
    const printer = new Printer(device, { encoding: "GB18030" });

    await imageWithLineSpacing(printer, image, "s8");

    printer
      .feed()
      .close();

  });

  device.close();

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


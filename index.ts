import { Printer, Image } from "@node-escpos/core";
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

    await printer
      .lineSpace(24)
      .image(image, "s8");

    printer
      .feed()
      .close();

  });

  device.close();

})();


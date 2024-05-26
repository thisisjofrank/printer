# Mastodot - Mastodon on a Dot Matrix Printer

This is being made as an installation for [Electromagnetic Field Festival](https://emfcamp.org)

## Usage

You'll need to install the dependencies first:

```bash
npm install
```

Then compile and run the two programs at the same time in two terminals:

```bash
npm run mastodot
```

```bash
npm run mastoprint
```
## How it Works

- Mastodot
  - connects to the mastodon streaming api
  - saves all received toot objects as json files in the out folder.
- Mastoprint
  - connects to the printer
  - goes through each toot json in the out folder
  - formats the toot with ESC/P commands
  - sends the formatted toot to the printer
  - moves the now-printed toot json file to the done folder

These have been separated as the toots can come in way faster than the printer can print them.

We're accessing the printer directly with ESC/P -- It doesn't have a queue. If you try to print while something else is trying to print, it errors.

So Mastoprint acts as the print queue.

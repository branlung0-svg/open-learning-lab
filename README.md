# Open Learning Lab

**A free, open lab for learning about the world, for anyone from age 10 to 100.** No ads, no accounts, no tracking.

The Lab covers 24 disciplines, from mathematics, physics and biology to history, politics, economics, religion and the arts. Each one has:

- its history and the people who built it
- primary documents and real images
- complete public-domain books
- hands-on labs and simulations
- quizzes
- live photos, films and documents from open archives

The aim is to understand how we know what we know, how the fields connect, and how to use them in real life.

## Principles

- **Same standard for everyone.** Every country, party, religion and system is judged by the same questions.
- **Both sides, then the evidence.** Each side's strongest case comes first, then what the evidence shows, with a confidence label: Established, Strong, Contested, Unknown, Clouded or Developing.
- **Real evidence, with context.** That includes hard historical material. Graphic items are blurred until tapped and hidden for ages 10–12.
- **Credit everything.** Every image, book and dataset keeps its creator and license.

## How it's made

Most of the text and code was drafted with an AI model (Claude, by Anthropic), guided and reviewed by a human volunteer, and checked against the sources it cites. Mistakes happen, so **please report them**: use the ⚑ button on any page, or [open an issue](../../issues/new).

## Run it locally

It's a static site with no build step:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Licenses

- **Code:** MIT License (see `LICENSE`).
- **Original text:** Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0).
- **Images, books and data:** keep their own licenses, shown next to each item and in the site footer. Sources include:
  - Wikimedia Commons, NASA, Project Gutenberg and the Internet Archive
  - the Avalon Project
  - Maddison Project, V-Dem, SIPRI, UCDP/PRIO, World Bank, Our World in Data
  - historical borders by A. Ourednik (GPL-3)
  - periodic-table data by Bowserinator
- **Bundled libraries:** d3 (ISC), three.js (MIT) and topojson-client (ISC).

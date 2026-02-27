import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CardsJS",
  base: "/docs/",
  outDir: "../dist/docs",
  description: "A Javascript library for creating card games",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Downloading Library", link: "/downloading-the-package" },
          { text: "Basic Setup", link: "/getting-started" },
        ],
      },
      {
        text: "Advanced ",
        items: [
          {
            text: "Card",
            link: "/card",
            items: [{ text: "Playing Card", link: "/playingCard" }],
          },
          {
            text: "Card Element",
            link: "/cardElement",
            items: [
              { text: "Playing Card Element", link: "/playingCardElement" },
            ],
          },
          { text: "Deck", link: "/deck" },
          { text: "Pile", link: "/pile" },
          {
            text: "Pile Element",
            link: "/pileElement",
            items: [
              {
                text: "Pile Options",
                link: "/pile-options",
                items: [
                  { text: "Rules", link: "/rules" },
                  { text: "Callbacks", link: "/callbacks" },
                ],
              },
              { text: "Animations", link: "/animations" },
            ],
          },
          { text: "Player Class", link: "/playerClass" },

          { text: "Custom Themes", link: "/custom-themes" },
          { text: "Override CSS", link: "/overrideCSS" },
        ],
      },
      {
        text: "Creating Your Own Card Type",
        items: [
          { text: "Custom Card Guidelines", link: "/custom-card-guidelines" },
          { text: "Extending Card", link: "/extend-card" },
          { text: "Custom Card Element", link: "/custom-element" },
          { text: "Final Steps", link: "/custom-card-final-steps" },
        ],
      },
      {
        text: "Contributing",
        items: [
          { text: "Contribution Guide", link: "/contribution-guide" },
          { text: "Running Project", link: "/running-project" },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Daver067/cards-npm-package",
      },
    ],
  },
  ignoreDeadLinks: "localhostLinks",
});

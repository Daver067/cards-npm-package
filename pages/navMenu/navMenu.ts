import "./styles.css";

interface NavItem {
  text: string;
  slug: string;
}

const navMenuData: NavItem[] = [
  {
    text: "Home",
    slug: "/",
  },
  {
    text: "Documentation",
    slug: "/docs/",
  },
  {
    text: "Card",
    slug: "/card/",
  },
  {
    text: "Deck",
    slug: "/deck/",
  },
  {
    text: "Pile Size",
    slug: "/pile-size/",
  },
  {
    text: "FreeCell",
    slug: "/freecell/",
  },
  {
    text: "Demo",
    slug: "/demo/",
  },
  {
    text: "Flash Card",
    slug: "/flashCard/",
  },
];

const navMenu = (data: NavItem[]): void => {
  const nav = document.createElement("nav");
  nav.className = "nav";

  const menuList = document.createElement("ul");
  menuList.className = "nav__list";

  const createMenuItem = (item: NavItem): HTMLLIElement => {
    const listItem = document.createElement("li");
    listItem.className = "nav__item";

    const link = document.createElement("a");
    link.className = "nav__link";
    link.href = item.slug;
    link.textContent = item.text;

    if (window.location.pathname === item.slug) {
      link.classList.add("nav__link--active");
    }

    listItem.appendChild(link);
    return listItem;
  };

  const menuItems = data.map(createMenuItem);
  menuItems.forEach((item) => menuList.appendChild(item));

  nav.appendChild(menuList);

  const navTarget = document.body.firstElementChild;
  if (navTarget) {
    navTarget.prepend(nav);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  navMenu(navMenuData);
});

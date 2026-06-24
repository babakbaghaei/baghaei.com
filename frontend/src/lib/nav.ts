// Single canonical source for the primary navigation items.
//
// `id` is the in-page section element id (home page) OR a route key the consumer
// resolves to a route (e.g. 'projects' -> /projects, 'tools' -> /tools,
// 'about' -> /about). Clicking محصولات navigates to the dedicated /projects page
// (Navbar + RootMobileMenu special-case the id); the `hasDropdown` mega-menu is
// only a hover preview on desktop. The mobile menu and command palette ignore
// `hasDropdown`.

export interface NavLink {
 id: string;
 label: string;
 hasDropdown?: boolean;
}

export const navLinks: NavLink[] = [
 { id: 'hero', label: 'خانه' },
 { id: 'projects', label: 'محصولات', hasDropdown: true },
 { id: 'tools', label: 'ابزارها', hasDropdown: true },
 { id: 'about', label: 'درباره ما' },
];

// Single canonical source for the primary navigation items.
//
// `id` is the in-page section element id (home page) OR a route key the consumer
// resolves to a route (e.g. 'tools' -> /tools, 'about' -> /about). The products
// item intentionally points at the real home section element `id="projects"`
// (verified in src/components/home/Projects.tsx) while labelling it محصولات.
// `hasDropdown` flags the mega-menu items in the desktop Navbar; the mobile menu
// and command palette ignore it.

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

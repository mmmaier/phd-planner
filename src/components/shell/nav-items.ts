import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  FlaskConical,
  BookMarked,
  ListTodo,
  Users,
  Inbox,
  ScrollText,
  Settings,
  Home,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const primaryNavItems: NavItem[] = [
  { href: "/", label: "Today", icon: Home },
  { href: "/todos", label: "To Dos", icon: ListTodo },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/projects", label: "Projects", icon: FlaskConical },
  { href: "/learnings", label: "Learnings", icon: BookMarked },
];

export const secondaryNavItems: NavItem[] = [
  { href: "/meetings", label: "Meeting Notes", icon: Users },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/review", label: "Weekly review", icon: ScrollText },
];

export const settingsNavItem: NavItem = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
};

export const allNavItems: NavItem[] = [
  ...primaryNavItems,
  ...secondaryNavItems,
  settingsNavItem,
];

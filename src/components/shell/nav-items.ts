import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  FlaskConical,
  BookMarked,
  TrendingUp,
  Users,
  HelpCircle,
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
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/projects", label: "Projects", icon: FlaskConical },
  { href: "/learnings", label: "Learnings", icon: BookMarked },
];

export const secondaryNavItems: NavItem[] = [
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/meetings", label: "Meetings", icon: Users },
  { href: "/questions", label: "Questions", icon: HelpCircle },
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

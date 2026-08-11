import { FileText, Newspaper, Video, Globe, GraduationCap, type LucideIcon } from "lucide-react";
import type { ResourceType } from "@/lib/db/types";

const ICONS: Record<ResourceType, LucideIcon> = {
  paper: FileText,
  article: Newspaper,
  video: Video,
  website: Globe,
  course: GraduationCap,
};

export function ResourceTypeIcon({
  type,
  className,
}: {
  type: ResourceType;
  className?: string;
}) {
  const Icon = ICONS[type];
  return <Icon className={className} strokeWidth={1.75} />;
}

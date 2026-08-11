import { create } from "zustand";
import { todayStamp } from "@/lib/dates";
import type { DateStamp } from "@/lib/dates";

export type CalendarView = "month" | "week";

type UiState = {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;

  calendarAnchorDate: DateStamp;
  setCalendarAnchorDate: (date: DateStamp) => void;

  selectedDate: DateStamp | null;
  setSelectedDate: (date: DateStamp | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  calendarView: "month",
  setCalendarView: (view) => set({ calendarView: view }),

  calendarAnchorDate: todayStamp(),
  setCalendarAnchorDate: (date) => set({ calendarAnchorDate: date }),

  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

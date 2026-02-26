export type Category = 'sleep' | 'work' | 'study' | 'free';

export interface TimelineEvent {
    id: string;
    title: string;
    category: Category;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    date: string; // YYYY-MM-DD
    memo?: string;
    tags?: string[];
}

export interface Habit {
    id: string;
    title: string;
    category: Category;
    targetTimeMinutes: number; // Daily target in minutes
    currentStreak: number;
    completedDates: string[]; // Array of YYYY-MM-DD strings
}

export interface AppState {
    events: TimelineEvent[];
    habits: Habit[];
    selectedDate: string; // YYYY-MM-DD
}

import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { format, subDays } from 'date-fns';
import type { AppState, TimelineEvent, Habit } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
    state: AppState;
    // Date Navigation
    setSelectedDate: (date: string) => void;
    // Events
    addEvent: (event: Omit<TimelineEvent, 'id'>) => void;
    updateEvent: (id: string, event: Partial<TimelineEvent>) => void;
    deleteEvent: (id: string) => void;
    // Habits
    addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'completedDates'>) => void;
    updateHabit: (id: string, habit: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    toggleHabitCompletion: (id: string, date: string) => void;
    // Data Management
    clearAllData: () => void;
}

// Pure helper function to calculate streak for a given array of date strings (yyyy-MM-dd) ending on 'today' (or up to yesterday)
const calculateStreak = (completedDates: string[]): number => {
    if (!completedDates || completedDates.length === 0) return 0;

    // Convert to a Set for fast O(1) lookups
    const datesSet = new Set(completedDates);

    let streak = 0;
    let currentDate = new Date(); // Start checking from actual system today

    // If today is not completed, we should check if yesterday was. 
    // If yesterday wasn't completed either, the streak is 0.
    const todayStr = format(currentDate, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(currentDate, 1), 'yyyy-MM-dd');

    if (!datesSet.has(todayStr) && !datesSet.has(yesterdayStr)) {
        return 0; // Broken streak
    }

    // If today is completed, start counting from today. Else start counting from yesterday.
    let dateToCheck = datesSet.has(todayStr) ? currentDate : subDays(currentDate, 1);

    while (true) {
        const dateStr = format(dateToCheck, 'yyyy-MM-dd');
        if (datesSet.has(dateStr)) {
            streak++;
            dateToCheck = subDays(dateToCheck, 1); // Move to previous day
        } else {
            break; // Streak broken
        }
    }

    return streak;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Start completely empty so the user can use the app from scratch.
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [events, setEvents] = useLocalStorage<TimelineEvent[]>('timecraft-events', []);
    const [habits, setHabits] = useLocalStorage<Habit[]>('timecraft-habits', []);
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const addEvent = (eventData: Omit<TimelineEvent, 'id'>) => {
        const newEvent: TimelineEvent = {
            ...eventData,
            id: crypto.randomUUID(),
        };
        setEvents(prev => [...prev, newEvent]);
    };

    const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
        setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updates } : ev));
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(ev => ev.id !== id));
    };

    const addHabit = (habitData: Omit<Habit, 'id' | 'currentStreak' | 'completedDates'>) => {
        const newHabit: Habit = {
            ...habitData,
            id: crypto.randomUUID(),
            currentStreak: 0,
            completedDates: [],
        };
        setHabits(prev => [...prev, newHabit]);
    };

    const updateHabit = (id: string, updates: Partial<Habit>) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    };

    const deleteHabit = (id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id));
    };

    const toggleHabitCompletion = (id: string, date: string) => {
        setHabits(prev => prev.map(h => {
            if (h.id !== id) return h;

            const isCompleted = h.completedDates.includes(date);
            let newCompletedDates = [...h.completedDates];

            if (isCompleted) {
                newCompletedDates = newCompletedDates.filter(d => d !== date);
            } else {
                if (!newCompletedDates.includes(date)) {
                    newCompletedDates.push(date);
                }
            }

            return {
                ...h,
                completedDates: newCompletedDates,
                currentStreak: calculateStreak(newCompletedDates)
            };
        }));
    };

    // Calculate streaks dynamically on load/update just to be safe they are always correct in state
    const computedHabits = useMemo(() => {
        return habits.map(h => ({
            ...h,
            currentStreak: calculateStreak(h.completedDates)
        }));
    }, [habits]);

    const clearAllData = () => {
        setEvents([]);
        setHabits([]);
        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    };

    const state: AppState = {
        events,
        habits: computedHabits,
        selectedDate
    };

    return (
        <AppContext.Provider value={{
            state,
            setSelectedDate,
            addEvent, updateEvent, deleteEvent,
            addHabit, updateHabit, deleteHabit, toggleHabitCompletion,
            clearAllData
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};

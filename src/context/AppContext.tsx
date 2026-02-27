import React, { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from 'react';
import { format, subDays } from 'date-fns';
import type { AppState, TimelineEvent, Habit } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase } from '../lib/supabase';

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
    // For MVP, we still use local storage as the single source of truth for the UI 
    // to keep it offline-first and snappy, but we push/pull from Supabase in the background.
    const [events, setEvents] = useLocalStorage<TimelineEvent[]>('timecraft-events', []);
    const [habits, setHabits] = useLocalStorage<Habit[]>('timecraft-habits', []);
    const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    // --- Supabase Sync on Mount ---
    useEffect(() => {
        const fetchRemoteData = async () => {
            // Fetch events
            const { data: remoteEvents, error: evErr } = await supabase.from('events').select('*');
            if (!evErr && remoteEvents) {
                // Map DB columns (snake_case) to client types (camelCase)
                const mappedEvents: TimelineEvent[] = remoteEvents.map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    category: r.category as any,
                    startTime: r.start_time,
                    endTime: r.end_time,
                    date: r.date,
                    tags: r.tags || []
                }));
                // We overwrite local with remote on mount (simplest sync strategy for this MVP without complex conflict resolution)
                if (mappedEvents.length > 0) setEvents(mappedEvents);
            }

            // Fetch habits
            const { data: remoteHabits, error: habErr } = await supabase.from('habits').select('*');
            if (!habErr && remoteHabits) {
                const mappedHabits: Habit[] = remoteHabits.map((r: any) => ({
                    id: r.id,
                    title: r.title,
                    category: r.category as any,
                    targetTimeMinutes: r.target_time_minutes,
                    completedDates: r.completed_dates || [],
                    currentStreak: calculateStreak(r.completed_dates || []) // purely local calc
                }));
                if (mappedHabits.length > 0) setHabits(mappedHabits);
            }
        };

        fetchRemoteData();
    }, []);

    // --- Data Mutations ---
    const addEvent = async (eventData: Omit<TimelineEvent, 'id'>) => {
        const newId = crypto.randomUUID();
        const newEvent: TimelineEvent = { ...eventData, id: newId };

        // Optimistic UI Update
        setEvents(prev => [...prev, newEvent]);

        // Remote Sync
        await supabase.from('events').insert({
            id: newId,
            title: newEvent.title,
            category: newEvent.category,
            start_time: newEvent.startTime,
            end_time: newEvent.endTime,
            date: newEvent.date,
            tags: newEvent.tags
        });
    };

    const updateEvent = async (id: string, updates: Partial<TimelineEvent>) => {
        setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updates } : ev));

        const payload: any = {};
        if (updates.title) payload.title = updates.title;
        if (updates.category) payload.category = updates.category;
        if (updates.startTime) payload.start_time = updates.startTime;
        if (updates.endTime) payload.end_time = updates.endTime;
        if (updates.date) payload.date = updates.date;
        if (updates.tags) payload.tags = updates.tags;

        await supabase.from('events').update(payload).eq('id', id);
    };

    const deleteEvent = async (id: string) => {
        setEvents(prev => prev.filter(ev => ev.id !== id));
        await supabase.from('events').delete().eq('id', id);
    };

    const addHabit = async (habitData: Omit<Habit, 'id' | 'currentStreak' | 'completedDates'>) => {
        const newId = crypto.randomUUID();
        const newHabit: Habit = {
            ...habitData,
            id: newId,
            currentStreak: 0,
            completedDates: [],
        };
        setHabits(prev => [...prev, newHabit]);

        await supabase.from('habits').insert({
            id: newId,
            title: newHabit.title,
            category: newHabit.category,
            target_time_minutes: newHabit.targetTimeMinutes,
            completed_dates: []
        });
    };

    const updateHabit = async (id: string, updates: Partial<Habit>) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));

        const payload: any = {};
        if (updates.title) payload.title = updates.title;
        if (updates.category) payload.category = updates.category;
        if (updates.targetTimeMinutes) payload.target_time_minutes = updates.targetTimeMinutes;
        if (updates.completedDates) payload.completed_dates = updates.completedDates;

        await supabase.from('habits').update(payload).eq('id', id);
    };

    const deleteHabit = async (id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id));
        await supabase.from('habits').delete().eq('id', id);
    };

    const toggleHabitCompletion = async (id: string, date: string) => {
        let finalCompletedDates: string[] = [];

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

            finalCompletedDates = newCompletedDates; // save for remote sync

            return {
                ...h,
                completedDates: newCompletedDates,
                currentStreak: calculateStreak(newCompletedDates)
            };
        }));

        if (finalCompletedDates.length > 0 || true /* always run */) {
            await supabase.from('habits').update({ completed_dates: finalCompletedDates }).eq('id', id);
        }
    };

    // Calculate streaks dynamically on load/update just to be safe they are always correct in state
    const computedHabits = useMemo(() => {
        return habits.map(h => ({
            ...h,
            currentStreak: calculateStreak(h.completedDates)
        }));
    }, [habits]);

    const clearAllData = async () => {
        setEvents([]);
        setHabits([]);
        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));

        // Delete completely from remote as well
        // Passing true to bypass RLS missing checks for "delete all" or we can iterate and delete
        try {
            await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // hack to delete all
            await supabase.from('habits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        } catch (e) {
            console.error('Failed to clear remote');
        }
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

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TimelineEvent } from '../types';
import { GripVertical, Sun, Briefcase, Laptop, Coffee, Edit3 } from 'lucide-react';

interface Props {
    event: TimelineEvent;
    onEdit: (event: TimelineEvent) => void;
}

export const SortableEventCard: React.FC<Props> = ({ event, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: event.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
    };

    const getCategoryColorClass = (category: string) => {
        switch (category) {
            case 'work': return 'border-accent';
            case 'study': return 'border-purple';
            case 'free': return 'border-orange';
            case 'sleep': return 'border-muted';
            default: return '';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sleep': return <Sun size={18} className="timeline-icon text-muted" />;
            case 'work': return <Briefcase size={18} className="timeline-icon text-accent" />;
            case 'study': return <Laptop size={18} className="timeline-icon text-purple" />;
            case 'free': return <Coffee size={18} className="timeline-icon text-orange" />;
            default: return <Edit3 size={18} className="timeline-icon text-muted" />;
        }
    };

    return (
        <div ref={setNodeRef} style={style} className="timeline-event">
            <div className={`timeline-icon-wrapper ${getCategoryColorClass(event.category)}`}>
                {getCategoryIcon(event.category)}
            </div>
            <div
                className={`timeline-card ${event.category === 'work' ? 'border-accent-left' : ''}`}
                style={{ display: 'flex', gap: '12px' }}
            >
                {/* Drag Handle */}
                <div
                    className="drag-handle"
                    {...attributes}
                    {...listeners}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'grab', color: 'var(--text-muted)' }}
                >
                    <GripVertical size={20} />
                </div>

                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onEdit(event)}>
                    <div className="card-top">
                        <span className={`event-time ${event.category === 'work' ? 'text-accent' : 'text-muted'}`}>
                            {event.startTime} - {event.endTime}
                        </span>
                        <button
                            className="event-more"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(event);
                            }}
                            style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                        >
                            ...
                        </button>
                    </div>
                    <h3 className="event-title" style={{ marginTop: '4px', marginBottom: '8px' }}>{event.title}</h3>
                    {event.memo && <span className="event-location text-muted" style={{ display: 'block', marginBottom: '8px' }}>{event.memo}</span>}

                    {event.tags && event.tags.length > 0 && (
                        <div className="event-tags">
                            {event.tags.map((tag: string) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

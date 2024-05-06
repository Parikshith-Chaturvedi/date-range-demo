import React, { useState, useEffect, useRef } from 'react';
import DateRangePicker, { PredefinedRange } from './DateRangePicker';
import './DateRangePicker.css';

const DatePicker: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false),
        [selectedRange, setSelectedRange] = useState<{
            start: Date | null; end: Date | null
        }>({
            start: null,
            end: null,
        }),

        datePickerRef = useRef<HTMLDivElement>(null);

    const predefinedRanges: PredefinedRange[] = [
        {
            label: 'Last 7 Days',
            startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
        },
        {
            label: 'Last 30 Days',
            startDate: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
        },
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleRangeChange = (
        dateRange: [Date | null, Date | null],
        weekendDates: Date[]
    ) => {
        const [start, end] = dateRange;
        setSelectedRange({ start, end });
        setIsOpen(false);
        console.log(dateRange, weekendDates)
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const clearSelection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setSelectedRange({ start: null, end: null });
        setIsOpen(false);
    };

    return (
        <div className="center-wrapper">
            <h3>Click below to select range</h3>
            <div className="date-picker" ref={datePickerRef}>
                <div className="date-picker-trigger" onClick={toggleDropdown}>
                    {selectedRange.start
                        ? `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end?.toLocaleDateString()}`
                        : 'Select a date range'}
                    {selectedRange.start && (
                        <button className="clear-selection" onClick={clearSelection}>
                            &times;
                        </button>
                    )}
                </div>

                {isOpen && (
                    <div className="date-picker-dropdown">
                        <DateRangePicker
                            onChange={handleRangeChange}
                            predefinedRanges={predefinedRanges}
                            selectedRange={{
                                startDate: selectedRange.start,
                                endDate: selectedRange.end,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatePicker;

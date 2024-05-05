import React, { useState, useRef, useEffect } from 'react';
import DateRangePicker from './DateRangePicker';
import './DateRangePicker.css';

const DatePicker: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false); 
    const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
        start: null,
        end: null,
    });

    const datePickerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen); 
    };

    const clearSelection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); 
        setSelectedRange({ start: null, end: null });
        setIsOpen(false); 
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


    const handleRangeChange = (dateRange: { startDate: Date | null; endDate: Date | null }, weekendDates: Date[]) => {
        setSelectedRange({ start: dateRange.startDate, end: dateRange.endDate });
        setIsOpen(false); 
        console.log("Date Range:", dateRange);
        console.log("Weekend Dates:", weekendDates);
    };

    return (
        <>

            <div className="center-wrapper"> 
                <h3>Click to Select Range</h3>
                <div className="date-picker" ref={datePickerRef}>
                    <div className="date-picker-trigger" onClick={toggleDropdown}>
                        {selectedRange.start
                            ? `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end?.toLocaleDateString() || '...'}` // Display selected range
                            : 'Select a date range'}

                        {selectedRange.start && ( 
                            <button className="clear-selection" onClick={clearSelection}>
                                &times; 
                            </button>
                        )}
                    </div>

                    {isOpen && (
                        <div className="date-picker-dropdown">
                            <DateRangePicker onChange={handleRangeChange} /> 
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DatePicker;

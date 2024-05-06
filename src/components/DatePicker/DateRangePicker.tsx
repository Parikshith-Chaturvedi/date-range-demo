import React, { useState } from 'react';
import './DateRangePicker.css';
import {
    getDaysInMonth,
    getMonthStartDay,
    isWeekend,
    getWeekendDates,
    getAdjustedMonthYear
} from '../../utils/utils';

import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'



const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const getYearOptions = (startYear: number, endYear: number) => {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
        years.push(year);
    }
    return years;
};

type DateRange = {
    startDate: Date | null;
    endDate: Date | null;
};

export type PredefinedRange = {
    label: string;
    startDate: Date;
    endDate: Date;
};

type DateRangePickerProps = {
    onChange: (dateRange: [Date | null, Date | null], weekendDates: Date[]) => void;
    selectedRange?: DateRange;
    predefinedRanges?: PredefinedRange[];
};

const isToday = (date: Date) => {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
};


const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, selectedRange, predefinedRanges }) => {
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: selectedRange?.startDate || null,
        endDate: selectedRange?.endDate || null,
    }),
        [currentMonth, setCurrentMonth] = useState(
            selectedRange?.startDate || new Date()
        ),
        [hoveredDate, setHoveredDate] = useState<Date | null>(null);

    const handleDateClick = (date: Date | null) => {
        if (!date || isWeekend(date)) return;

        let newRange: DateRange;

        if (!dateRange.startDate) {
            newRange = { startDate: date, endDate: null };
        } else if (!dateRange.endDate) {
            if (date < dateRange.startDate) {
                newRange = { startDate: date, endDate: null };
            } else {
                newRange = { startDate: dateRange.startDate, endDate: date };
            }
        } else {
            newRange = { startDate: date, endDate: null };
        }

        setDateRange(newRange);
        setHoveredDate(null);
    };

    const confirmSelection = () => {
        if (dateRange.startDate && dateRange.endDate) {
            const weekendDates = getWeekendDates(dateRange.startDate, dateRange.endDate);
            onChange([dateRange.startDate, dateRange.endDate], weekendDates);
        }
    };

    const handlePredefinedRange = (range: PredefinedRange) => {
        setDateRange({ startDate: range.startDate, endDate: range.endDate });
        const weekendDates = getWeekendDates(range.startDate, range.endDate);
        onChange([range.startDate, range.endDate], weekendDates);
    };

    const handleMouseEnter = (date: Date | null) => {
        if (date && !isWeekend(date) && dateRange.startDate && !dateRange.endDate) {
            setHoveredDate(date);
        }
    };


    const handleMonthChange = (delta: number) => {
        const newMonth = getAdjustedMonthYear(currentMonth, delta);
        setCurrentMonth(newMonth);
    };

    const handleYearChange = (newYear: number) => {
        const newMonth = currentMonth.getMonth();
        setCurrentMonth(new Date(newYear, newMonth, 1));
    };


    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);

        const firstDayOffset = getMonthStartDay(year, month);

        const offsetDays: (Date | null)[] = Array.from({ length: firstDayOffset }, () => null);
        const monthDays: Date[] = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

        const days = offsetDays.concat(monthDays);

        return (
            <div className="calendar">
                <div className="d-flex">
                    <div className="w15">
                        <button className='btn btn-no-border btn-hover' onClick={() => handleMonthChange(-1)}>
                            <ArrowLeftIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className='w70'>
                        <select className="select-style mx-5"
                            value={currentMonth.getMonth()}
                            onChange={(e) =>
                                handleMonthChange(parseInt(e.target.value) - currentMonth.getMonth()
                                )}
                        >
                            {months.map((m, index) => (
                                <option key={index} value={index}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        <select className="select-style" value={currentMonth.getFullYear()} onChange={(e) => handleYearChange(parseInt(e.target.value))}>
                            {getYearOptions(1900, 2100).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w15">
                        <button className='btn btn-no-border btn-hover' onClick={() => handleMonthChange(+1)}>
                            <ArrowRightIcon className="h-4 w-4" />
                        </button>
                    </div>

                </div>

                <div className="calendar-week mt-1">
                    {daysOfWeek.map((day, index) => (
                        <div key={index} className="day-name">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="calendar-days">
                    {days.map((date, index) => {
                        if (!date) {
                            return <button key={index} disabled></button>;
                        }
                        const isDayWeekend = date ? isWeekend(date) : false;

                        const isDayInRange =
                            dateRange.startDate &&
                            !isDayWeekend &&
                            (
                                (dateRange.endDate && date >= dateRange.startDate && date <= dateRange.endDate) ||
                                (hoveredDate && date >= dateRange.startDate && date <= hoveredDate)
                            );
                        const isDayToday = date ? isToday(date) : false;

                        const isDaySelected =
                            dateRange.startDate && date && date === dateRange.startDate;


                        return (
                            <button
                                key={index}
                                onClick={() => date && handleDateClick(date)}
                                onMouseEnter={() => handleMouseEnter(date)}
                                className={
                                    isDayToday
                                        ? 'today'
                                        : isDaySelected
                                            ? 'highlighted-start'
                                            : isDayInRange
                                                ? 'selected'
                                                : isDayWeekend
                                                    ? 'weekend'
                                                    : 'weekday'
                                }
                                disabled={isDayWeekend}
                            >
                                {date ? date.getDate() : ''}
                            </button>
                        );
                    })}
                </div>
                <div className="d-flex mt1">
                    {predefinedRanges?.map((range, index) => (
                        <button
                            className='btn btn-outline mx-5'
                            key={index}
                            onClick={() => handlePredefinedRange(range)}
                        >
                            {range.label}
                        </button>
                    ))}
                    {dateRange.startDate && dateRange.endDate && (
                        <div className="calendar-footer">
                            <button onClick={confirmSelection} className='btn btn-outline btn-bg'>
                                OK
                            </button>
                        </div>
                    )}
                </div>

            </div>
        );
    };

    return (
        <div className="date-range-picker">
            <h3>Weekday Date Range Picker</h3>
            {renderCalendar()}
        </div>
    );
};

export default DateRangePicker;

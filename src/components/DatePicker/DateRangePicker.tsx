import React, { useState } from 'react';
import './DateRangePicker.css';
import { getDaysInMonth, getMonthStartDay, isWeekend, getWeekendDates } from '../../utils/utils';

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

type DateRangePickerProps = {
    onChange: (dateRange: DateRange, weekendDates: Date[]) => void;
    selectedRange?: DateRange;
    predefinedRanges?: { label: string; startDate: Date; endDate: Date }[];
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
            onChange(dateRange, weekendDates);
        }
    };

    const handleMouseEnter = (date: Date | null) => {
        if (date && !isWeekend(date) && dateRange.startDate && !dateRange.endDate) {
            setHoveredDate(date);
        }
    };


    const handleMonthChange = (delta: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(currentMonth.getMonth() + delta);

        if (newDate.getMonth() > 11) {
            newDate.setFullYear(newDate.getFullYear() + 1);
            newDate.setMonth(0);
        } else if (newDate.getMonth() < 0) {
            newDate.setFullYear(newDate.getFullYear() - 1);
            newDate.setMonth(11);
        }
        setCurrentMonth(newDate);
    };


    const handleYearChange = (newYear: number) => {
        const newDate = new Date(currentMonth);
        newDate.setFullYear(newYear);
        setCurrentMonth(newDate);
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
                <div className="calendar-header">
                    {/* <span>
                        {currentMonth.toLocaleString('default', { month: 'long' })} {year}
                    </span> */}

                    <select className="select-style" value={month} onChange={(e) => handleMonthChange(parseInt(e.target.value))}>
                        {months.map((m, index) => (
                            <option key={index} value={index}>
                                {m}
                            </option>
                        ))}
                    </select>

                    <select className="select-style" value={year} onChange={(e) => handleYearChange(parseInt(e.target.value))}>
                        {getYearOptions(1900, 2100).map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="calendar-week">
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
                {dateRange.startDate && dateRange.endDate && (
                    <div className="calendar-footer">
                        <button onClick={confirmSelection} className="ok-button">
                            OK
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="date-range-picker">
            <h3>Weekday Date Range Picker</h3>
            {renderCalendar()}

            <div className="navigation">
                <button onClick={() => handleMonthChange(-1)}>Previous Month</button>
                <button onClick={() => handleMonthChange(+1)}>Next Month</button>
            </div>

            {predefinedRanges && (
                <div className="predefined-ranges">
                    {predefinedRanges.map((range, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDateRange({ startDate: range.startDate, endDate: range.endDate });
                                const weekendDates = getWeekendDates(range.startDate, range.endDate);
                                onChange({ startDate: range.startDate, endDate: range.endDate }, weekendDates);
                            }}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;

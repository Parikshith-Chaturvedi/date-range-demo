export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

    isLeapYear = (year: number): boolean =>
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0,

    getDaysInMonth = (year: number, month: number): number =>
        month === 1 && isLeapYear(year) ? 29 : DAYS_IN_MONTH[month],

    isWeekend = (date: Date): boolean => {
        const day = date.getDay();
        return day === 0 || day === 6;
    },

    isWeekday = (date: Date): boolean => !isWeekend(date),

    getMonthStartDay = (year: number, month: number): number => {
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay;
    },

    getWeekendDates = (startDate: Date, endDate: Date): Date[] => {
        const weekendDates: Date[] = [];
        const current = new Date(startDate.getTime());

        while (current <= endDate) {
            if (current.getDay() === 0 || current.getDay() === 6) {
                weekendDates.push(new Date(current));
            }
            current.setDate(current.getDate() + 1);
        }

        return weekendDates;
    },

    formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    }

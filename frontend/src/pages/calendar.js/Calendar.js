import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import { subMonths, addMonths } from "date-fns";
import CalendarBody from "./CalendarBody";

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const date = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const onDateClick = (day) => {
        setSelectedDate(day);
    }

    return(
        <div className="Calendar">
            <div className="calendar_wrap">
                <CalendarHeader
                    currentMonth={currentMonth}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                />
                <div className="days">
                    {date.map((days)=><div key={days}> {days} </div>)}
                </div>
                <CalendarBody 
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                />
            </div>
        </div>
    )
}

export default Calendar;
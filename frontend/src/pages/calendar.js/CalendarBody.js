import { addDays, endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import { format, isSameMonth, isSameDay, isToday } from 'date-fns';

const CalendarBody = ({currentMonth, selectedDate, onDateClick}) => {
    const monthStart = startOfMonth(currentMonth); //오늘이 속한 달의 시작일
    const monthEnd = endOfMonth(monthStart); //오늘이 속한 달의 마지막일
    const startDate = startOfWeek(monthStart); //monthStart가 속한 주의 시작일
    const endDate = endOfWeek(monthEnd); //monthEnd가 속한 주의 마지막일

    let days = [];
    let day = startDate;
    let formatDate = '';

    while(day<=endDate){
        for(let i = 0; i < 7; i++){
            formatDate = format(day, 'd');
            const cloneDay = day;
            days.push(
                <div key={day} 
                    className={`cell 
                    ${!isSameMonth(day, monthStart)? 'disabled' 
                    : isSameDay(day, selectedDate)? 'selected' 
                    : isToday(day) ? 'today'
                    : 'valid'
                    }`}
                    onClick={()=> onDateClick(cloneDay)}
                >
                    <span>{formatDate}</span>
                </div>
            )
            day = addDays(day, 1);
        }
    };

    return(
        <div className="CalendarBody">
            {days}
        </div>
    )
}

export default CalendarBody;
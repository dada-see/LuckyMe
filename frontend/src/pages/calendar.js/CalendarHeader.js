import { format } from 'date-fns';

const CalendarHeader = ({currentMonth, prevMonth, nextMonth}) => {
    return(
        <div className="CalendarHeader">
            <div className='title'>
                <p>
                   {format(currentMonth, 'yyyy')}.{format(currentMonth, 'M')}
                </p>
            </div>
            <div className='changeMonth'>
                <span className="material-symbols-rounded left" onClick={prevMonth}>arrow_back_ios</span>
                <span className="material-symbols-rounded right" onClick={nextMonth}>arrow_forward_ios</span>
            </div>
        </div>
    )
}

export default CalendarHeader;
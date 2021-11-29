import React, {useState}from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styles from "./calender_styles.css"

let eventsAr = [
    {
      title: 'Cover Dewayne',
      start: '2021-11-01',
      end: '2021-11-04',
      color: 'red'
    },
    {
      title: 'Js Request',
      start: '2021-11-07',
      end: '2021-11-15'
    },
]

const handleDateClick = (arg) => {
  if (window.confirm("Do you want to remove this event?")) {
    arg.event.remove();
  }
}

const Calendar = () => {
  return (
    
    <FullCalendar styles={styles}
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      weekends={true}
      events={eventsAr}
      eventClick={handleDateClick}
    />
    
  )
}

export default Calendar;
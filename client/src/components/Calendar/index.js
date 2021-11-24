import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

let eventsAr = [
    {
      title: 'test event',
      start: '2021-11-01',
      color: 'red'
    },
    {
      title: 'test event 2',
      start: '2021-11-01',
      end: '2021-11-05'
    },
    {
      title: 'test event 3',
      start: '2021-11-01',
      end: '2021-11-05'
    }
]

const handleDateClick = (arg) => {
  console.log("hello")
}

const Calendar = () => {
  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      weekends={false}
      events={eventsAr}
      eventClick={function(info) {
        console.log(info.event.remove())
      }}
    />
  )
}

export default Calendar;
import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styles from "./calender_styles.css"
import { QUERY_CALENDAR, QUERY_RESERVATIONS } from '../../utils/queries';
import { REMOVE_RESERVATION } from '../../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';

const Calendar = ({ calendar, userId, userRole }) => {
  const [removeReservation] = useMutation(REMOVE_RESERVATION);
  const { loading: calendarLoading, error: calendarError, data: calendarData } = useQuery(QUERY_CALENDAR, {
    variables: { calendarId: calendar._id },
  });
  const { loading: reservationLoading, error: reservationError, data: reservationData } = useQuery(QUERY_RESERVATIONS);

  if (calendarLoading || reservationLoading) return 'Loading...';
  if (calendarError) return `${calendarError.message}`;
  if (reservationError) return `${reservationError.message}`;

  const reservations = reservationData.reservations.map(reservation => {
    return {
      title: reservation.title,
      start: reservation.start,
      end: reservation.end,
      reservationId: reservation._id,
      calendarId: calendar._id,
      requestedUserId: reservation.requestedUserId
    }
  })

  const handleDateClick = (arg) => {
    if (userRole === 'reliever') {
      if(window.confirm("Do you want to accept this event?")) {
        console.log('added user to reservation.');
      }
    } else if(userId === arg.event._def.extendedProps.requestedUserId || userRole === 'administrator') {
      if (window.confirm("Do you want to remove this event?")) {
        removeReservation({ variables: { 
          reservationId: arg.event._def.extendedProps.reservationId,
          calendarId: arg.event._def.extendedProps.calendarId
         }})
      }
    }
  }

  return (
    <FullCalendar styles={styles}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      events={reservations}
      eventClick={handleDateClick}
    />
  )
}

export default Calendar;
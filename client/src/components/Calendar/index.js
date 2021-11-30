import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styles from "./calender_styles.css"
import { QUERY_CALENDAR } from '../../utils/queries';
import { REMOVE_RESERVATION, ACCEPT_RESERVATION } from '../../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';

const Calendar = ({ calendarId, userId, userRole }) => {
  const [removeReservation, { loading: reservationLoading, error: reservationError }] = useMutation(REMOVE_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });
  const [acceptReservation, { loading: reservationAcceptLoading, error: reservationAcceptError }] = useMutation(ACCEPT_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });
  const { loading: calendarLoading, error: calendarError, data: calendarData } = useQuery(QUERY_CALENDAR, {
    variables: { calendarId },
  });

  if (calendarLoading || reservationLoading || reservationAcceptLoading) return 'Loading...';
  if (calendarError) return `${calendarError.message}`;
  if (reservationError) return `${reservationError.message}`;
  if (reservationAcceptError) return `${reservationAcceptError.message}`;

  let color;

  const reservations = calendarData.calendar.reservations.map(reservation => {
    if (reservation.isAvailable) {
      // change this variable for reservations that are accepted
      color = '#9C27B0';
    } else {
      // changes this variable for reservations that are not accepted
      color = '#444'
    }

    return {
      title: reservation.title,
      start: reservation.start,
      end: reservation.end,
      reservationId: reservation._id,
      calendarId,
      color,
      requestedUserId: reservation.requestedUser._id
    }
  })

  const handleDateClick = (arg) => {
    if (userRole === 'reliever') {
      if (window.confirm("Do you want to accept this reservation?")) {
        acceptReservation({
          variables: {
            reservationId: arg.event._def.extendedProps.reservationId
          }
        })
      }
    } else if (userId === arg.event._def.extendedProps.requestedUserId || userRole === 'administrator') {
      if (window.confirm("Do you want to remove this reservation?")) {
        removeReservation({
          variables: {
            reservationId: arg.event._def.extendedProps.reservationId,
            calendarId: arg.event._def.extendedProps.calendarId
          }
        })
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
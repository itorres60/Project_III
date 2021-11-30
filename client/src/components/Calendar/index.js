import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import styles from "./calender_styles.css"
import { QUERY_CALENDAR } from '../../utils/queries';
import { REMOVE_RESERVATION, ACCEPT_RESERVATION, CREATE_RESERVATION } from '../../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';

let reservationAr = [];
let reservationTitle = '';

const Calendar = ({ calendarId, userId, userRole, userFirstName }) => {
  const [removeReservation, { loading: reservationLoading, error: reservationError }] = useMutation(REMOVE_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });

  const [acceptReservation, { loading: reservationAcceptLoading, error: reservationAcceptError }] = useMutation(ACCEPT_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });

  const [createReservation, { loading: createReservationLoading, error: createReservationError }] = useMutation(CREATE_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });

  const { loading: calendarLoading, error: calendarError, data: calendarData } = useQuery(QUERY_CALENDAR, {
    variables: { calendarId },
  });

  if (calendarLoading || reservationLoading || reservationAcceptLoading || createReservationLoading) return 'Loading...';
  if (calendarError) return `${calendarError.message}`;
  if (createReservationError) return `${createReservationError.message}`;
  if (reservationError) return `${reservationError.message}`;
  if (reservationAcceptError) return `${reservationAcceptError.message}`;

  let color;

  const reservations = calendarData.calendar.reservations.map(reservation => {
    if (reservation.isAvailable) {
      // change this variable for reservations that are accepted
      color = 'red';
    } else {
      // changes this variable for reservations that are not accepted
      color = '#333'
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

  const selectDate = (info) => {
    //The first thing this function does is check to see if there is a value in the reservationsAr array. If there IS NOT then the logic will skip over to line 96.
    if (reservationAr.length) {
      // if a value DOES exists in the array it is implied as the startDate therefore this second date is going to be pushed as the second or endDate for the reservation.
      reservationAr.push(info.dateStr)
      //After the second date has been pushed the user is to confirm the reservation dates or cancel the request.
      const confirmReservation = window.confirm(`Would you like to request ${reservationAr[0]} through ${reservationAr[1]} for relief or CANCEL reservation?`)
      //if the user cancels the reservation process then the user will be alerted and the array will be clear or set back to empty.
      if (!confirmReservation) {
        window.alert("Request cancelled!")
        //clear reservationAr for next use
        reservationAr = [];
        return;
      } else {
        reservationTitle = confirmReservation;
      }
      //If the user confirms the reservation dates then the user will be alerted and the values should then be sent to the server.
      const promptTwo = window.prompt(`You have requested ${reservationAr[0]} through ${reservationAr[1]} for relief!`)
      //Array is sent to the server/console.log for verification
      if (promptTwo) {
        reservationTitle = promptTwo
      } else if (promptTwo === '') {
        reservationTitle = `Cover ${userFirstName}`
      } else {
        window.alert("You have cancelled your request")
        return;
      }
      createReservation({
        variables: {
          start: reservationAr[0],
          end: reservationAr[1],
          title: reservationTitle,
          calendarId: calendarId
        }
      });
      reservationTitle = '';
      reservationAr = []
      return
    }
    //If the array is empty at the time that a date is clicked the the user will be asked if they'd like to select and end date.
    const askEndDate = window.confirm(`You have selected ${info.dateStr} as your start date. Would you like to add an end date`)
    //If the user confirms to request an endDate then the process continues on line 118

    //If no end date is desired the user is asked if they would like to request selected date for relief or cancel reservation process.
    if (!askEndDate) {
      const askCancel = window.confirm("Would you like to request " + info.dateStr + " for relief or CANCEL reservation?")
      //If the user cancle the reservation process then the user is alerted, no value is pushed and the function ends.
      if (!askCancel) {
        window.alert("You have cancelled your request")
        return;
      } else {
        //if the user confirms the request for the single day then the date is pushed to the array and the user is alerted.
        reservationAr.push(info.dateStr);
        const promptOne = window.prompt("You have requested " + info.dateStr + " for relief! Input a title for your reservation:");
        //At this point the array can be sent to the server/console.log
        //Array is sent to the server/console.log for verification
        if (promptOne) {
          reservationTitle = promptOne
        } else if (promptOne === '') {
          reservationTitle = `Cover ${userFirstName}`
        } else {
          window.alert("You have cancelled your request")
          return;
        }
        createReservation({
          variables: {
            start: reservationAr[0],
            title: reservationTitle,
            calendarId: calendarId
          }
        });
        reservationTitle = '';
        //after the data has been sent to the server/console.log the the reservationsAr array is cleared and the function ends.
        reservationAr = [];
        return
      }
      //if the user confirms to add an end date then the first date is pushed to the reservationAr and the and the user is then free to select a date in the main UI.
    } else if (askEndDate) {
      reservationAr.push(info.dateStr);
    }
  }

  return (
    <FullCalendar styles={styles}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      events={reservations}
      eventClick={handleDateClick}
      dateClick={selectDate}
    />
  )
}

export default Calendar;
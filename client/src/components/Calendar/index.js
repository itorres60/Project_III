import React, { useState } from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import "../../calendar.css"
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../../alert.css'; // Import css
import { QUERY_CALENDAR } from '../../utils/queries';
import { REMOVE_RESERVATION, ACCEPT_RESERVATION, CREATE_RESERVATION, REMOVE_ACCEPTED_RESERVATION } from '../../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import moment from 'moment';

let reservationAr = [];
// let reservationTitle = '';


const Calendar = ({ calendarId, userId, userRole, userFirstName }) => {

  const [selectText, setSelectText] = useState(<span style={{color: '#45b167', fontWeight: 'bolder', fontSize: 'larger'}}>Select Start Date</span>)

  const [removeReservation, { loading: reservationLoading, error: reservationError }] = useMutation(REMOVE_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });
  
  const [acceptReservation, { loading: reservationAcceptLoading, error: reservationAcceptError }] = useMutation(ACCEPT_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });
  
  const [removeAcceptReservation, { loading: reservationRemoveAcceptLoading, error: reservationRemoveAcceptError }] = useMutation(REMOVE_ACCEPTED_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });
  
  const [createReservation, { loading: createReservationLoading, error: createReservationError }] = useMutation(CREATE_RESERVATION, { refetchQueries: [{ query: QUERY_CALENDAR, variables: { calendarId: calendarId } }] });
  
  const { loading: calendarLoading, error: calendarError, data: calendarData } = useQuery(QUERY_CALENDAR, {
    variables: { calendarId },
  });
  
  if (calendarLoading || reservationLoading || reservationAcceptLoading || createReservationLoading || reservationRemoveAcceptLoading) return "Loading...if I'm stuck swipe down to reload.";
  if (calendarError) return `${calendarError.message}`;
  if (createReservationError) return `${createReservationError.message}`;
  if (reservationRemoveAcceptError) return `${reservationRemoveAcceptError.message}`;
  if (reservationError) return `${reservationError.message}`;
  if (reservationAcceptError) return `${reservationAcceptError.message}`;
  
  let color;
  
  const reservations = calendarData.calendar.reservations.map(reservation => {
    if (reservation.isAvailable) {
      // change this variable for reservations that are accepted
      color = '#2c664b';
    } else {
      // changes this variable for reservations that are not accepted
      color = '#d39090'
    }
    
    return {
      title: reservation.title,
      start: reservation.start,
      end: reservation.end,
      reservationId: reservation._id,
      calendarId,
      color,
      requestedUserId: reservation.requestedUser._id,
      assignedUserId: reservation.assignedUser
    }
  })
  
  
  const handleDateClick = (arg) => {
    // if you are the owner of an accepted reservation
    if (userRole === "employee" && userId === arg.event._def.extendedProps.requestedUserId && arg.event._def.extendedProps.assignedUserId) {
      confirmAlert({
        title: '',
        message: 'Do you want to remove this reservation?',
        buttons: [
          {
            label: 'YES',
            onClick: () => {
              removeReservation({
                variables: {
                  reservationId: arg.event._def.extendedProps.reservationId,
                  calendarId: arg.event._def.extendedProps.calendarId
                }
              })
            }
          },
          {
            label: 'NO'
          }
        ]
      })
    }

    // if you are the relief on a reservation
    if (arg.event._def.extendedProps.assignedUserId) {
      if (userId === arg.event._def.extendedProps.assignedUserId._id) {
        confirmAlert({
          title: '',
          message: 'Do you want to remove your acceptance from this reservation?',
          buttons: [
            {
              label: 'YES',
              onClick: () => {
                removeAcceptReservation({
                  variables: {
                    reservationId: arg.event._def.extendedProps.reservationId
                  }
                })
              }
            },
            {
              label: 'NO'
            }
          ]
        })
      }
    } else if (userRole === 'reliever') {
      confirmAlert({
        title: '',
        message: "Do you want to accept this reservation?",
        buttons: [
          {
            label: 'YES',
            onClick: () => {
              acceptReservation({
                variables: {
                  reservationId: arg.event._def.extendedProps.reservationId
                }
              })
            }
          },
          {
            label: 'NO',
          }
        ]
      })
    } else if (userId === arg.event._def.extendedProps.requestedUserId || userRole === 'administrator') {
      confirmAlert({
        title: '',
        message: 'Do you want to remove this request?',
        buttons: [
          {
            label: 'YES',
            onClick: () => {
              removeReservation({
                variables: {
                  reservationId: arg.event._def.extendedProps.reservationId,
                  calendarId: arg.event._def.extendedProps.calendarId
                }
              })
            }
          },
          {
            label: 'NO',
          }
        ]
      })
    }
  }

  const selectDate = (info) => {
    if (userRole === 'employee') {
      if (reservationAr.length) {
        reservationAr.push(info.dateStr)
        confirmAlert({
          title: "Confirm Request",
          message: `Would you like to request ${moment(reservationAr[0], "YYYY-MM-DD").format('MM-DD-YYYY')} through ${moment(reservationAr[1], "YYYY-MM-DD").format('MM-DD-YYYY')} for relief or CANCEL request?`,
          buttons: [
            {
              label: "YES",
              onClick: () => {
                createReservation({
                  variables: {
                    start: reservationAr[0],
                    end: reservationAr[1],
                    title: `${userFirstName} cover`,
                    calendarId: calendarId
                  }
                });
                // reservationTitle = '';
                reservationAr = []
                setSelectText(<span style={{color: 'green', fontWeight: 'bolder'}}>Select Start Date</span>)
                return
              }
            },
            {
              label: "CANCEL",
              onClick: () => {
                //clear reservationAr for next use
                reservationAr = [];
                setSelectText(<span>Request Cancelled!  <span style={{color: 'green', fontWeight: 'bolder'}}>Select Start Date</span></span>)
                return;
              }
            }
          ]
        })
      } else {
        confirmAlert({
          title: '',
          message: `You have selected ${moment(info.dateStr, "YYYY-MM-DD").format('MM-DD-YYYY')} as your start date. Press OK to select an end date or press RESERVE to submit your request.`,
          buttons: [
            {
              label: "OK",
              onClick: () => {
                reservationAr.push(info.dateStr)
                setSelectText(<span style={{color: '#e05d05', fontWeight: 'bolder', fontSize: 'larger'}}>Select End Date</span>)
              }
            },
            {
              label: "RESERVE",
              onClick: () => {
                // //if the user confirms the request for the single day then the date is pushed to the array and the user is alerted.
                reservationAr.push(info.dateStr);
                createReservation({
                  variables: {
                    start: reservationAr[0],
                    title: `${userFirstName} cover`,
                    calendarId: calendarId
                  }
                });
                //after the data has been sent to the server/console.log the the reservationsAr array is cleared and the function ends.
                reservationAr = [];
                setSelectText(<span style={{color: '#45b167', fontWeight: 'bolder', fontSize: 'larger'}}>Select Start Date</span>)
                return
              }
            }
          ]
        }) 
      }
    }
  }


  return (
    <>
    {userRole === 'employee' && <p className='select-text text-center'>{selectText}</p>}
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      weekends={true}
      events={reservations}
      eventClick={handleDateClick}
      dateClick={selectDate}
    />
    </>
  )
}

export default Calendar;
// App.js
import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import Popup from 'reactjs-popup';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "reactjs-popup/dist/index.css";
const localizer = momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleSelectSlot = ({ start }) => {
    Popup.create({
      title: "Add Event",
      content: (
        <EventForm
          onSave={(newEvent) => {
            setEvents([...events, newEvent]);
            Popup.close();
          }}
          start={start}
        />
      ),
      buttons: {},
    });
  };

  const handleSelectEvent = (event) => {
    Popup.create({
      title: "Edit/Delete Event",
      content: (
        <EventForm
          event={event}
          onSave={(updatedEvent) => {
            setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
            Popup.close();
          }}
          onDelete={() => {
            setEvents(events.filter((e) => e.id !== event.id));
            Popup.close();
          }}
        />
      ),
      buttons: {},
    });
  };

  const getFilteredEvents = () => {
    const now = moment();
    if (filter === "past") {
      return events.filter((e) => moment(e.start).isBefore(now));
    } else if (filter === "upcoming") {
      return events.filter((e) => moment(e.start).isSameOrAfter(now));
    }
    return events;
  };

  const eventStyleGetter = (event) => {
    const isPast = moment(event.start).isBefore(moment());
    return {
      style: {
        backgroundColor: isPast ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)",
      },
    };
  };

  return (
    <div className="App">
      <h1>Event Tracker Calendar</h1>
      <div>
        <button className="btn" onClick={() => setFilter("all")}>All</button>
        <button className="btn" onClick={() => setFilter("past")}>Past</button>
        <button className="btn" onClick={() => setFilter("upcoming")}>Upcoming</button>
      </div>
      <Calendar
        localizer={localizer}
        events={getFilteredEvents()}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, margin: "50px" }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
      <Popup />
    </div>
  );
}

function EventForm({ event = {}, onSave, onDelete, start }) {
  const [title, setTitle] = useState(event.title || "");
  const [location, setLocation] = useState(event.location || "");

  const handleSave = () => {
    const newEvent = {
      id: event.id || Date.now(),
      title,
      location,
      start: event.start || start,
      end: event.end || moment(start).add(1, "hours").toDate(),
    };
    onSave(newEvent);
  };

  return (
    <div>
      <input
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Event Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="mm-popup__box__footer__right-space">
        <button className="mm-popup__btn mm-popup__btn--info" onClick={handleSave}>Save</button>
        {onDelete && (
          <button className="mm-popup__btn mm-popup__btn--danger" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default App;

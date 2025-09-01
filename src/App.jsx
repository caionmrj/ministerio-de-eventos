import { Routes, Route } from 'react-router-dom'
import Home from "./pages/home/Home"
import Events from "./pages/events/Events"
import CreateEvent from "./pages/createevent/CreateEvent"
import EventDetails from "./pages/eventdetails/eventDetails"
import WorkSchedule from "./pages/createworkschedule/WorkSchedule"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/eventDetails/:id" element={<EventDetails />} />
        <Route path="/workSchedule" element={<WorkSchedule />} />
      </Routes>
    </>
  )
}

export default App

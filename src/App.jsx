import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/createevent/CreateEvent";
import EventDetails from "./pages/eventdetails/eventDetails";
import PrivateRoute from "./assets/components/PrivateRoute";
import AllEvents from "./pages/all-events/AllEvents"; 
import { Analytics } from "@vercel/analytics/react"
function App() {
  return (
    <>
    <Analytics/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <Events />
            </PrivateRoute>
          }
        />
        <Route
          path="/allevents"
          element={
            <PrivateRoute>
              <AllEvents />
            </PrivateRoute>
          }
        />
        <Route
          path="/createevent"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-event/:id"
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          }
        />
        <Route
          path="/eventDetails/:id"
          element={
            <PrivateRoute>
              <EventDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Events from "./pages/events/Events";
import CreateEvent from "./pages/createevent/CreateEvent";
import EventDetails from "./pages/eventdetails/eventDetails";
import WorkSchedule from "./pages/createworkschedule/WorkSchedule";
import PrivateRoute from "./assets/components/PrivateRoute";
import AllEvents from "./pages/all-events/AllEvents"; // 1. Importe a nova página
function App() {
  return (
    <>
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
        {/* 2. Adicione a rota para a página de todos os eventos */}
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
        <Route
          path="/workSchedule"
          element={
            <PrivateRoute>
              <WorkSchedule />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

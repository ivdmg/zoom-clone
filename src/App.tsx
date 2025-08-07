import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateMeetings from "./pages/CreateMeetings/CreateMeetings";
import Create1on1Meeting from "./pages/Create1on1Meeting/Create1on1Meeting";
import CreateVideoConference from "./pages/CreateVideoConference/CreateVideoConference";
import MyMeetings from "./pages/MyMeetings/MyMeetings";
import Meetings from "./pages/Meetings/Meetings";
import JoinMeeting from "./pages/JoinMeeting/JoinMeeting";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/create" element={<CreateMeetings/>}/>
      <Route path="/create/create1on1meeting" element={<Create1on1Meeting/>}/>
      <Route path="/create/createVideoConference" element={<CreateVideoConference/>}/>
      <Route path="/mymeetings" element={<MyMeetings/>}/>
      <Route path="/meetings" element={<Meetings/>}/>
      <Route path="/join/:id" element={<JoinMeeting/>}/>
      <Route path="*" element={<Dashboard/>}/>
    </Routes>
  );
}

export default App;
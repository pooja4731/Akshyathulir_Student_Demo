import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Course";
import Placements from "./pages/Placement";
import Trainers from "./pages/Trainers";
import Certificates from "./pages/Certificate";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="placements" element={<Placements />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="allform" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;



// import React from 'react'
// import { Route, Routes } from 'react-router-dom';
// import Sidebar from "./pages/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import Course from "./pages/Course";
// import Placements from "./pages/Placement";
// import Trainers from './pages/Trainers';
// import Certificate from "./pages/Certificate";
// import Profile from './pages/Profile';


// function App() {
//   return (
//     <>
//     <Routes>
//         <Route path='/' element={<Sidebar/>}>
//         <Route index element={<Dashboard/>}/>
//         <Route path="course" element={<Course/>}/>
//         <Route path="placements" element={<Placements/>}/>
//         <Route path="trainers" element={<Trainers/>}/>
//         <Route path="certificates" element={<Certificate/>}/>
//         <Route path="allform" element={<Profile/>}/>
//         </Route>
//     </Routes>
    
//     </>
//   )
// }

// export default App;




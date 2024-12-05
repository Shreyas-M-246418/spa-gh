import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { JobsProvider } from './contexts/JobsContext';
import Navbar from './components/Navbar';
import DisplayJobsPage from './components/DisplayJobsPage';
import JobsPage from './components/JobsPage';
import HirePage from './components/HirePage';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobsProvider>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<DisplayJobsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/hire" element={<HirePage />} />
            </Routes>
          </div>
        </JobsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
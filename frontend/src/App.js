import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import CreateGroupPage from './pages/CreateGroupPage/CreateGroupPage';
import PrivateRoute from './components/PrivateRoute';
import NavigationBar from './components/NavigationBar/NavigationBar'; // Assuming you'll create this component
import AboutPage from './pages/AboutPage/AboutPage';
import FeaturesPage from './pages/FeaturesPage/FeaturesPage';
import MyGroupsPage from './pages/MyGroupsPage/MyGroupsPage';
import GroupDetailsPage from './pages/GroupDetailsPage/GroupDetailsPage';
import GroupSettingsPage from './pages/GroupSettingsPage/GroupSettingsPage';
import GroupList from './components/groups/GroupList/GroupList';
import './assets/css/global.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavigationBar />
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} /> {/* Add the route for AboutPage */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create-group" element={
            <PrivateRoute>
              <CreateGroupPage />
            </PrivateRoute>
          } />
          <Route path="/groups" element={<GroupList />} />
          <Route path="/my-groups" element={<PrivateRoute><MyGroupsPage /></PrivateRoute>} />
          <Route path="/groups/:groupId" element={<GroupDetailsPage />} />
          <Route path="/groups/:groupId/settings" element={<GroupSettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseJobs from './pages/BrowseJobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import RequesterDashboard from './pages/RequesterDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminPanel from './pages/AdminPanel';
import BookingDetail from './pages/BookingDetail';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/browse" element={<BrowseJobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route
        path="/post-job"
        element={
          <PrivateRoute allowedRoles={['requester']}>
            <PostJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/requester"
        element={
          <PrivateRoute allowedRoles={['requester']}>
            <RequesterDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/provider"
        element={
          <PrivateRoute allowedRoles={['provider']}>
            <ProviderDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/admin"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPanel />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <PrivateRoute>
            <BookingDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


import { useContext } from "react";
import { AuthContext } from "../../utils/auth";
import Dashboard from "../dashboard/Dashboard";
import SalesRepDashboard from "../salesRepDashboard/SalesRepDashboard";
import { Navigate } from "react-router-dom";
const DashboardWrapper = () => {
  const { user, loading } = useContext(AuthContext);
  // 1. First, check if the app is still loading.
  if (loading) {
    return <p>Loading...</p>;
  }
  // 2. Next, check if the user object is null after loading.
  if (!user) {
    return <Navigate to="/login" />;
  }
  // 3. Now that we're sure the user object is fully loaded, check the role.
  console.log('DA USER: ', user); // This will now contain the full user object with role
  console.log('DA ROLE: ', user.role);
  if (user.role === 'sales_rep') {
    return <SalesRepDashboard />;
  }
  // Default to the provider dashboard for all other roles
  return <Dashboard />;
};
export default DashboardWrapper;
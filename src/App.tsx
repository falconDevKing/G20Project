import { Routes, Route } from "react-router";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import { fetchAdminData } from "./services/auth";
import { fetchAppBasicData } from "./redux/appSlice";
import LayoutRoot from "./routes/layout/layout";
import Home from "./pages/admin";
import { Profile } from "./pages/admin/profile/profile";
import Overview from "./pages/admin/overview";
import Remissions from "./pages/admin/remissions";
import RemissionLog from "./pages/admin/remissionLog";
import Users from "./pages/admin/users";
import MessagePartners from "./pages/admin/message";
import Entities from "./pages/admin/entities";
import MediaAssets from "./pages/admin/media-assets";
import ToolsPage from "./pages/tools";
import Register from "./pages/auth/register";
import Login from "./pages/auth/login";
import ForgotPassword from "./pages/auth/forgot-password";
import VerifyEmail from "./pages/auth/verifyEmail";
import ResetPassword from "./pages/auth/reset-password";
import G20Registration from "./pages/g20/registration";
import G20LandingPage from "./pages/home";
import DashboardCom from "./pages/admin/dashboard";
import G20Users from "./pages/g20/hogUsers";
import G20User from "./pages/g20/hogUser";
import G20Landing from "./pages/g20/home";
import TermsAndConditions from "./pages/termsPolicies/termsAndConditions";
import Policies from "./pages/termsPolicies/policies";
import DataDeletion from "./pages/termsPolicies/dataDeletion";
import { GuidesHome } from "./pages/guides";
import { GuideDetailRoute } from "./pages/guides/detail";
import Update from "./pages/auth/update";
// import { useTheme } from "./components/themeProvider/theme-provider";

function App() {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { user_id, userDetails } = authState;

  // const { setTheme } = useTheme();
  // setTheme("dark");

  useEffect(() => {
    if (user_id) {
      fetchAdminData(userDetails);
    }
  }, [user_id, userDetails?.permission_type]);

  useEffect(() => {
    dispatch(fetchAppBasicData());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<G20LandingPage />} />
      <Route path="/remit-partnership" element={<G20LandingPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<Policies />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/update" element={<Update />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/g20-registration" element={<G20Registration />} />
      <Route path="/g20-partners" element={<G20Users />} />
      <Route path="/g20-partner/:id" element={<G20User />} />
      <Route path="/g20" element={<G20Landing />} />

      {/* Admin section with persistent layout */}
      <Route element={<LayoutRoot />}>
        <Route path="/guides" element={<GuidesHome />} />
        <Route path="/guides/:slug" element={<GuideDetailRoute />} />
        <Route path="dashboard" element={<DashboardCom />} />
        <Route path="history" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="overview" element={<Overview />} />
        <Route path="remissions" element={<Remissions />} />
        <Route path="pending-remissions" element={<RemissionLog />} />
        <Route path="users" element={<Users />} />
        <Route path="message" element={<MessagePartners />} />
        <Route path="entities" element={<Entities />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="media-assets" element={<MediaAssets />} />
      </Route>

      {/* 404 fallback */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default App;

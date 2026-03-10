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
import ProposalManagement from "./pages/admin/proposalManagement";
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
import G20LandingPage from "./pages/home";
import G20LandingAlt1 from "./pages/home/alts/alt-1";
import G20LandingAlt2 from "./pages/home/alts/alt-2";
import G20LandingAlt3 from "./pages/home/alts/alt-3";
import G20LandingAlt4 from "./pages/home/alts/alt-4";
import DashboardCom from "./pages/admin/dashboard";
import TermsAndConditions from "./pages/termsPolicies/termsAndConditions";
import Policies from "./pages/termsPolicies/policies";
import DataDeletion from "./pages/termsPolicies/dataDeletion";
import { GuidesHome } from "./pages/guides";
import { GuideDetailRoute } from "./pages/guides/detail";
import Update from "./pages/auth/update";
import ProposedSchedule from "./pages/auth/proposed-schedule";
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
      <Route path="/alt-1" element={<G20LandingAlt1 />} />
      <Route path="/alt-2" element={<G20LandingAlt2 />} />
      <Route path="/alt-3" element={<G20LandingAlt3 />} />
      <Route path="/alt-4" element={<G20LandingAlt4 />} />
      <Route path="/remit-partnership" element={<G20LandingPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<Policies />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/update" element={<Update />} />
      <Route path="/proposed-schedule" element={<ProposedSchedule />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
        <Route path="proposal-management" element={<ProposalManagement />} />
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

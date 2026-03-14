import { DesktopNavbar, MobileNavbar } from "@/components/Navbar";
import { SideBar } from "@/components/SideBar";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logOutUser, resolvePostAuthRoute } from "@/services/auth";
import { useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";

const LayoutRoot = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const pathname = location?.pathname;
  const isDashboardPage = location.pathname === "/dashboard";
  const permission_type = auth.userDetails.permission_type;
  const opsPermissionType = auth.userDetails.ops_permission_type;
  const isAdmin = ["division", "organisation"].includes(permission_type || "") || ["shepherd", "governor", "president"].includes(opsPermissionType || "");
  const postAuthRoute = auth.authenticated ? resolvePostAuthRoute(auth.userDetails) : "/login";

  const userAllowedPaths = [
    "/",
    "/profile",
    "/profile/", // dummy option to prevent redirect
    "/register",
    "/login",
    "/forgot-password",
    "/verify-email",
    "/reset-password",
    "/history",
    "/dashboard",
  ];

  useEffect(() => {
    if (!isAdmin && pathname && !userAllowedPaths.includes(pathname)) {
      navigate("/dashboard");
    }
  }, [isAdmin, pathname]);

  useEffect(() => {
    if (!auth.authenticated) {
      const url = pathname && !pathname.includes("/login") ? `/login?redirectTo=${pathname}` : "/login";
      logOutUser();
      navigate(url);
    }

    if (postAuthRoute !== "/dashboard" && pathname !== postAuthRoute) {
      navigate(postAuthRoute);
    }

    if (["/remit-partnership", "/remit-partnership/"].includes(pathname) && auth.authenticated) {
      navigate("/dashboard");
    }
  }, [auth.authenticated, pathname, postAuthRoute]);

  return (
    // <main className="h-screen w-full overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
    <main className="h-screen w-full overflow-hidden bg-[#F8F4EA] dark:bg-G20-surface text-[hsl(var(--foreground))]">
      <div className="flex h-[calc(100vh-64px)]">
        {isDashboardPage || isProfilePage ? (
          <section className={`flex-1 ml-0 overflow-y-auto`}>
            <Outlet />
          </section>
        ) : (
          <>
            {/* adjust 64px to your Navbar height */}
            {/* Sidebar Fixed on Left */}
            <aside className="hidden lg:block fixed top-16 left-0 h-[calc(100vh-64px)] w-[312px] border-r z-10">
              <SideBar />
            </aside>
            {/* Main Content */}
            <section className={`flex-1 ml-0 lg:ml-[312px] overflow-y-auto ${isProfilePage ? "p-0" : "p-2"}`}>
              <MobileNavbar />

              <DesktopNavbar />

              <Outlet />
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default LayoutRoot;

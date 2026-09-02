import { redirect } from "next/navigation";
import { APP_PATHS } from "@/shared/constants/paths";

/**
 * Root page — redirects to dashboard.
 * The middleware handles auth checks; if unauthenticated, the user
 * will be redirected to login before reaching the dashboard.
 */
export default function RootPage() {
  redirect(APP_PATHS.DASHBOARD);
}

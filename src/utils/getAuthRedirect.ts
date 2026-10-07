export type Access = "protected" | "guest";

// "protected" pages send signed-out users to /login; "guest" pages (login,
// sign-up) send signed-in users home. Nothing is decided before hydration.
const getAuthRedirect = (
  access: Access,
  hasHydrated: boolean,
  isSignedIn: boolean
) => {
  if (!hasHydrated) return null;
  if (access === "protected" && !isSignedIn) return "/login";
  if (access === "guest" && isSignedIn) return "/";
  return null;
};

export default getAuthRedirect;

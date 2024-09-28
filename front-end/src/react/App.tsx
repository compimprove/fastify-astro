import React, { useEffect, useState } from "react";
import { RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import axios from "axios";

const CLERK_PUBLISHABLE_KEY = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
const BACKEND_URL = import.meta.env.PUBLIC_BACKEND_URL;

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/dashboard/settings">Settings</Link>
        </li>
        <li>
          <Link to="/dashboard/profile">Profile</Link>
        </li>
        <SignedOut>
          <li>
            <SignInButton />
          </li>
        </SignedOut>
        <SignedIn>
          <li>
            <UserButton />
          </li>
        </SignedIn>
      </ul>
    </nav>
  );
};

const Dashboard = () => {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    axios.get(`${BACKEND_URL}/user`).then((res) => {
      setUserId(res.data.userName);
    });
  }, []);
  return <h1>Dashboard, Hello {userId}</h1>;
};
const Settings = () => <h1>Settings</h1>;
const Profile = () => <h1>Profile</h1>;

const Layout = () => (
  <div>
    <Navbar />
    <div>
      <Outlet />
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "dashboard",
    element: <Layout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "settings", element: <Settings /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

const App = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const setTokenAxios = async () => {
    const token = await getToken();
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };
  useEffect(() => {
    setTokenAxios();
  }, []);
  return (
    <>
      {isLoaded ? (
        isSignedIn ? (
          <RouterProvider router={router} />
        ) : (
          <RedirectToSignIn />
        )
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export const AppWrapperWithAuth = () => {
  return (
    <React.StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
};

export const AuthHeader = () => {
  return (
    <React.StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/settings">Settings</a>
          <a href="/dashboard/profile">Profile</a>
          <UserButton />
        </SignedIn>
      </ClerkProvider>
    </React.StrictMode>
  );
};

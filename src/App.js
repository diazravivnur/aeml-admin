import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Articles from "./Admin/Article/ListArticle";
import Categories from "./Admin/Categories/Categories";
import Inbox from "./Admin/Inbox/Inbox";
import Accounts from "./Admin/Accounts/Accounts";
import Add from "./Admin/Article/NewArticle";
import View from "./Admin/Article/DetailArticle";
import UpdateArticle from "./Admin/Article/UpdateArticle";
import ViewMessage from "./Admin/Inbox/ViewMessage";
import NotFound from "./layouts/PageNotFound";

function App() {
  const isAuthenticated = !!sessionStorage.getItem("authToken"); // Check for auth token

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/Login" element={<Login />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Admin" element={<Dashboard />} />
            <Route path="/Admin/Dashboard" element={<Dashboard />} />
            <Route path="/Admin/Articles" element={<Articles />} />
            <Route path="/Admin/Articles/New" element={<Add />} />
            <Route
              path="/Admin/Articles/Update/:id"
              element={<UpdateArticle />}
            />
            <Route path="/Admin/Articles/:id" element={<View />} />
            <Route path="/Admin/Categories" element={<Categories />} />
            <Route path="/Admin/Inbox" element={<Inbox />} />
            <Route path="/Admin/Inbox/:id" element={<ViewMessage />} />
            <Route path="/Admin/Accounts" element={<Accounts />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/Login" replace />} />
        )}

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Articles from "./Admin/Article/ListArticle";
import Publications from "./Admin/Publications/ListPublications";
import Categories from "./Admin/Categories/Categories";
import Inbox from "./Admin/Inbox/Inbox";
import Accounts from "./Admin/Accounts/Accounts";
import Add from "./Admin/Article/NewArticle";
import NewPublication from "./Admin/Publications/NewPublication";
import View from "./Admin/Article/DetailArticle";
import UpdateArticle from "./Admin/Article/UpdateArticle";
import ViewMessage from "./Admin/Inbox/ViewMessage";
import NotFound from "./layouts/PageNotFound";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/Login"
          element={
            isAuthenticated ? (
              <Navigate to="/Admin/Articles" replace />
            ) : (
              <Login />
            )
          }
        />

        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Admin" element={<Dashboard />} />
            {/* <Route path="/Admin/Dashboard" element={<Dashboard />} /> */}
            <Route path="/Admin/Articles" element={<Articles initialType="article" title="Articles" />} />
            <Route path="/Admin/Publications" element={<Publications />} />
            <Route path="/Admin/Publications/New" element={<NewPublication />} />
            <Route path="/Admin/Articles/New" element={<Add />} />
            <Route
              path="/Admin/Articles/Update/:id"
              element={<UpdateArticle />}
            />
            <Route path="/Admin/Articles/:id" element={<View />} />
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

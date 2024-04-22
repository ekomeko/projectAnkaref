import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./admin/AdminDashboard";
import UserDashboard from "./User/UserDashboard";
import Home from "./homepage/Home";
import UserCategorys from "./User/UserCategorys";
import UserActivaties from "./User/UserActivities";
import AdminCategories from "./admin/AdminCategories";
import AdminActivaties from "./admin/AdminActivities";
import AdminOldActivities from "./admin/AdminOldActivities";
import AdminUsers from "./admin/AdminUsers";
import UserOldActiviys from "./User/UserOldActiviys";
import UserAtp from "./User/UserAtp";
import AdminAtp from "./admin/AdminAtp";

export default function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/categorys" element={<UserCategorys />} />
        <Route path="/user/categorys/:categoryId" element={<UserActivaties />} />
        <Route path="/admin/categorys" element={<AdminCategories />} />
        <Route path="/admin/categorys/:categoryId" element={<AdminActivaties />} />
        <Route path="/admin/OldActivitys" element={<AdminOldActivities />} />
        <Route path="/admin/ManUsers" element={<AdminUsers />} />
        <Route path="/user/OldActivitys" element={<UserOldActiviys />} />
        <Route path="/user/About" element={<UserAtp />} />
        <Route path="/admin/About" element={<AdminAtp />} />
      </Routes>
    </Router>
  );
}

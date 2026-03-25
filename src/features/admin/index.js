import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";

export default function AdminIndex({ onBack }) {
  // A wrapper for Admin
  return <AdminDashboard onBack={onBack} />;
}

import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const navItems = [
    { path: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { path: "/students", icon: "Users", label: "Students" },
    { path: "/classes", icon: "BookOpen", label: "Classes" },
    { path: "/attendance", icon: "Calendar", label: "Attendance" },
    { path: "/grades", icon: "Award", label: "Grades" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden lg:block">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
            <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ClassTrack
            </h1>
            <p className="text-xs text-secondary">Student Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-primary/5",
                isActive 
                  ? "bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-md" 
                  : "text-secondary font-medium"
              )}
            >
              <ApperIcon name={item.icon} size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
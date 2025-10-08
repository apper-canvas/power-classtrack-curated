import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" size={24} className="text-secondary" />
          </button>
          <div className="flex items-center gap-3 lg:hidden">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ClassTrack
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
            <ApperIcon name="Bell" size={20} className="text-secondary" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AD</span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-900">Admin User</p>
              <p className="text-xs text-secondary">Administrator</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
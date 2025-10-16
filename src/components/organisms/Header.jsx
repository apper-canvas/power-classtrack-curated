import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick }) => {
  const userState = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);
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
          <button className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {userState?.user?.firstName?.[0] || 'U'}{userState?.user?.lastName?.[0] || ''}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-900">
                {userState?.user?.firstName || 'User'} {userState?.user?.lastName || ''}
              </p>
              <p className="text-xs text-secondary">{userState?.user?.role || 'User'}</p>
            </div>
          </button>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <ApperIcon name="LogOut" size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList className="flex flex-wrap justify-center md:justify-start space-x-2">
            {isAuthenticated ? (
              <>
                <NavigationMenuItem>
                  <Button onClick={() => navigate("/profile")} variant="ghost">
                    Profile
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button onClick={handleLogout} variant="ghost">
                    Logout
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Button onClick={() => navigate("/login")} variant="ghost">
                    Login
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button onClick={() => navigate("/signup")} variant="ghost">
                    Sign Up
                  </Button>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;

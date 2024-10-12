import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "../lib/utils";
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
                  <NavigationMenuLink asChild>
                    <Link
                      to="/profile"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-primary-foreground hover:bg-primary/90"
                  >
                    Logout
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/login"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      Login
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/signup"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      Sign Up
                    </Link>
                  </NavigationMenuLink>
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

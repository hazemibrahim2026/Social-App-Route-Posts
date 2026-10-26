import logo from "../../assets/favicon.png";
import { useLocation, useNavigate } from "react-router";
import { House, User, MessageCircle, Menu, Settings } from "lucide-react";
import { Tabs, Button, Dropdown, Label, Separator } from "@heroui/react";

import { useContext } from "react";
import { TokenContext } from "../Context/tokenContext";
import { UserContext, type UserContextType } from "../../Components/Context/UserContext";

export default function Navbar() {
  const tokenContext = useContext(TokenContext);
  const userContext: UserContextType | null = useContext(UserContext);
  const userDetails = userContext?.userDetails;
  
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split("/")[1] || "feed";
  if (!tokenContext) {
    throw new Error("Navbar must be rendered within a TokenContext provider");
  }
  const { setToken } = tokenContext;

  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
  }

  function goToUpdatePassword() {
    navigate("/update-password");
  }
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Route Posts"
              className="h-9 w-9 rounded-xl object-cover"
            />
            <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
              Route Posts
            </p>
          </div>
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
            <Tabs
              className="w-full max-w-md"
              selectedKey={activeTab}
              onSelectionChange={(key) => navigate(`/${key}`)}
            >
              <Tabs.ListContainer className="bg-white">
                <Tabs.List aria-label="Options">
                  <Tabs.Tab
                    id="feed"
                    className={`flex gap-2 ${activeTab === "feed" ? "text-[#1f6fe5]" : "text-slate-900"}`}
                  >
                    <House width={20} height={20} />
                    <span className="hidden font-bold sm:inline">Feed</span>
                    <span className="sr-only font-bold sm:hidden">Feed</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab
                    id="profile"
                    className={`flex gap-2 ${activeTab === "profile" ? "text-[#1f6fe5]" : "text-slate-900"}`}
                  >
                    <User width={20} height={20} />
                    <span className="hidden font-bold  sm:inline">Profile</span>
                    <span className="sr-only font-bold sm:hidden">Profile</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab
                    id="notifications"
                    className={`flex gap-2 ${activeTab === "notifications" ? "text-[#1f6fe5]" : "text-slate-900"}`}
                  >
                    <MessageCircle width={20} height={20} />
                    <span className="hidden font-bold sm:inline">Notifications</span>
                    <span className="sr-only font-bold sm:hidden">Notifications</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </nav>
          <div className="relative">
            <Dropdown>
              <Button
                aria-label="Menu"
                variant="tertiary"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 transition hover:bg-slate-100"
              >
                <img
                  src={userDetails?.photo}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden max-w-35 truncate text-sm font-semibold text-slate-800 md:block">{userDetails?.name}</span>
                <Menu width={15} height={15} />
              </Button>
              <Dropdown.Popover className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "profile") navigate("/profile");
                    if (key === "settings") goToUpdatePassword();
                  }}
                >
                  <Dropdown.Item id="profile" textValue="Profile">
                    <Label className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <User width={20} height={20} />
                      Profile
                    </Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="settings" textValue="Settings">
                    <Label className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      <Settings width={20} height={20} />
                      Settings
                    </Label>
                  </Dropdown.Item>
                  <Separator className="my-1 border-t border-slate-200" />
                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    onClick={logout}
                  >
                    <Label className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                      Logout
                    </Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>
      </header>
    </>
  );
}

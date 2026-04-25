import { NavLink, useNavigate } from "react-router-dom";

const ADMIN_NAV = [
  { name: "Dashboard", path: "/addashboard" },
  { name: "Fields", path: "/adfields" },
  { name: "Agents", path: "/adagents" },
  { name: "Updates", path: "/adupdates" },
  { name: "Report", path: "/adreport" },
];

const AGENT_NAV = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "My Fields", path: "/myfields" },
  { name: "History", path: "/history" },
];

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role?.toLowerCase() || "agent";

  const navItems = role === "admin" ? ADMIN_NAV : AGENT_NAV;

  const initials =
    role === "admin"
      ? "AD"
      : user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : "AG";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="bg-green-950 h-14 flex items-center justify-between px-10">
      <div className="flex items-center gap-8">
        <span className="text-green-400 font-semibold text-lg">
          Shamba
        </span>

        <nav>
          <ul className="flex text-white/60 font-bold gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white transition"
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden md:block text-xs text-white/60">
          {user?.email || "No user"}
        </span>

        <div className="w-8 h-8 rounded-full bg-green-800 flex items-center justify-center text-xs font-semibold text-green-400">
          {initials}
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-300 hover:text-red-500 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
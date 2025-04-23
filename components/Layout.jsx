import { Link, useLocation, Outlet } from "react-router-dom";

function Layout() {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "New Integration", path: "/new" },
    { label: "My Integrations", path: "/my-integrations" },
    { label: "Admin Panel", path: "/admin" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">IAM Integration Portal</div>
          <ul className="flex space-x-6">
            {navItems.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  className={`text-sm font-medium ${
                    location.pathname === path
                      ? "text-blue-600 underline"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/calendar', label: 'Calendar' },
  { path: '/plants', label: 'My Plants' },
  { path: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            LeGarden
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-700 text-white'
                    : 'text-green-100 hover:bg-green-700/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

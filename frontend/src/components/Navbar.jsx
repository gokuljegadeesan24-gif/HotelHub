import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          Hotel<span>Hub</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Hotels
          </NavLink>
          <NavLink to="/hotels/add">Add Hotel</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

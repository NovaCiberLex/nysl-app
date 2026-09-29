import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  isActive ? 'btn btn-light px-4' : 'btn btn-outline-light px-4';

const NavBar = () => (
  <nav className="navbar fixed-bottom bg-dark">
    <div className="container-fluid justify-content-around">
      <NavLink to="/" end className={linkClass}>Home</NavLink>
      <NavLink to="/games" className={linkClass}>Schedule</NavLink>
    </div>
  </nav>
);

export default NavBar;
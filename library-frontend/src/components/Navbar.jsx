import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"
function NavBar() {

  const { token, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           
    navigate("/login"); 
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}><img src={logo} alt="logo" style={styles.logo} /></Link>
      <div style={styles.links}>
        {token ? (
          <>
            <span>Welcome {username}</span>
            <Link to="/mybooks" sytle={styles.link}>📚Mybooks</Link>
            <Link to="/search" sytle={styles.link}>🔎Search</Link>
            <button onClick={handleLogout}>🔓Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>login</Link>
            <Link to="/register" style={styles.link}>Sign up!</Link>

          </>
        )}
      </div>

    </nav>
  )
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem",
    backgroundColor: "#333",
    color: "white"
  },

  logo: {
    margin: 0,
    width: "60px",
    height: "60px"
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center"
  }
  ,

  link: {
    display: "flex",
    textDecoration: "none"
  }
}

export default NavBar
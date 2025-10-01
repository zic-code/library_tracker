import { useState, useContext, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import BASE_URL from "../config"

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(data => ({ ...data, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, formData)
      login(res.data.token)
      navigate("/")
      alert("logged in successfully 🎉")
    } catch (err) {
      console.error(err)
      alert("failed to login")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <button type="sumbmit">Login</button>
    </form>
  )

}

export default LoginPage
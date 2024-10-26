import loginImg from "../assets/images/login.webp";
import Template from "../components/core/Auth/Template"

const Login = () => {
  return (
    // VERY INNOVATIVE WORK IS PENDING >> USER'S DON'T NEED TO REGISTER TO GET LOGIN USER EXPERIENCE
    <Template
    title="Welcome Back"
    description1="Build skills for today, tomorrow, and beyond."
    description2="Education to future-proof your career."
    image={loginImg}
    formType="login"
  />
  )
}

export default Login
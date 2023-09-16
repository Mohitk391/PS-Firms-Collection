import LoginPage, { Username, Password, Submit, Logo } from '@react-login-page/base';
import UmiyaMataji from "../../assets/umiya-mataji.png";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const styles = { height: "100vh" };

const Login = () => {
  const navigate = useNavigate();
  const {userDispatch} = useUser();
  const handle = (even) => {
    even.preventDefault();
    const formData = new FormData(even.target);
    const data = Object.fromEntries(formData);
    if(data.userName.trim() !== "" || data.password.trim() !== ""){
      if(data.userName === "test" && data.password === "demo123"){
          localStorage.setItem("token", "User123");
          userDispatch({type: "SET_USER", value: "User123"});
          navigate("/");
      }
    }
  };
  return (
  <form onSubmit={handle} style={styles}>
    <LoginPage>
      <Username name="userName" />
      <Password placeholder="Password" name="password" />
      <Submit>Submit</Submit>
      <Logo>
        <img src={UmiyaMataji} alt='logo' width={50}/>
      </Logo>
    </LoginPage>
  </form>
)}


export default Login;

import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };
  const handleDemoLogin = () =>{
    const email = "demo@aa.io"
    const password = "password"
    closeModal()
    dispatch(thunkLogin({email, password}))
    return
  }

  return (
    <div className="login-form-main">
      <h1>Log In</h1>
      <form className="form-container"  onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-login"
          />
        </label>
        <div className="login-error-div">
        {errors.email && <div className="login-error-div"><p style={{margin: "0"}}>{errors.email}</p></div>}
        </div>
       
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-login"
          />
        </label>
        <div className="login-error-div">
        {errors.password && <div className="login-error-div"><p style={{margin: "0"}}>{errors.password}</p></div>}
        </div>

        <button className="login-submit" type="submit">Log In</button>
        
      </form>
      <button className="login-submit-demo" onClick={handleDemoLogin}>Log In Demo</button>
    </div>
  );
}

export default LoginFormModal;

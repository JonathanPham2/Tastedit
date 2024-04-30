import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { useSelector } from "react-redux";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function Navigation() {
  const currentUser = useSelector(state => state.session.user)
  return (
    <div className="home-profile">
      <section className="title-logo-container" >
        <NavLink className={"title-logo"} to="/">Tastedit</NavLink>
      </section>

      <section className="profile-button">
       { currentUser !== null ?<ProfileButton /> :
        <div className="user-act-container">
        <OpenModalMenuItem
          itemText="Log In"
          className={"login-button"}
          modalComponent={<LoginFormModal />}
        />
        <OpenModalMenuItem
          itemText="Sign Up"
          className={"signup-button"}
          modalComponent={<SignupFormModal />}
        />
      </div>

       
       }
      </section>
    </div>
  );
}

export default Navigation;

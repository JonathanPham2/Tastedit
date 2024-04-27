import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <div className="home-profile">
      <section >
        <NavLink className={"title-logo"} to="/">Tastedit</NavLink>
      </section>

      <section>
        <ProfileButton />
      </section>
    </div>
  );
}

export default Navigation;

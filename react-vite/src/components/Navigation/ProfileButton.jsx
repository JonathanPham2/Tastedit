import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import profileIcon from "../../../dist/profile-picture.jpg"
import { FaBowlFood } from "react-icons/fa6";
import { GrSign } from "react-icons/gr";
import { MdAlternateEmail } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();
  const navigate = useNavigate()

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };

  return (
    <>
      <button onClick={toggleMenu}>
        <img className="profile-icon" src={profileIcon} alt="profile-icon" />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user && (
            <>
              <div> <GrSign /> {user.username}</div>
              <div> <MdAlternateEmail /> {user.email}</div>
              <div onClick={() =>navigate("/dishes/new")}  className="bowl-food"><FaBowlFood/>Post Dish</div>
              <div onClick={() => navigate("/dishes/current")} className="edit-button"><FaEdit /> Manage Dish</div>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </>
          )
          }
        </ul>
      )}
    </>
  );
}

export default ProfileButton;

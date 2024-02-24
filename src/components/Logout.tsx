import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { logout } from "./../services/users"
import { clearEvents } from "../redux/slices/eventSlice"
import { useAppDispatch } from "./../hooks"

const Logout = () => {
  const appDispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await appDispatch(logout())
      await appDispatch(clearEvents())
      navigate("/", { replace: true })
    }
    doLogout()
  }, []);

  return <div />;
};

export default Logout

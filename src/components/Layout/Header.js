import React from "react";
import { NavLink, Link } from "react-router-dom";
import { FaShopify } from "react-icons/fa";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import {Badge} from 'antd'


const Header = () => {
  const { auth, setAuth } = useAuth();
  const categories = useCategory();
  const {cart}=useCart();
  const handleLogout = () => {
    setAuth({ ...auth, user: null, token: "" });
    localStorage.removeItem("auth");
    toast.success("logout Successfully");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="navbar-brand" to="/">
              <FaShopify />
              Ecommerce
            </Link>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <SearchInput />
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to={'/categories'}
                  data-bs-toggle="dropdown"
                >
                  Categories
                </Link>
                <ul className="dropdown-menu">
                  <li>
                  <Link className="dropdown-item" to={`/categories`}>
                        All categories
                      </Link>
                  </li>
                  {categories?.map((c,idx) => (
                   
                      <Link className="dropdown-item" to={`/category/${c.slug}`} key={idx}>
                        {c.name}
                      </Link>
                  ))}
                </ul>
              </li>

              {!auth.user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      SignUp
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                    <NavLink
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {auth?.user?.name}
                    </NavLink>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user"
                          }`}
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          className="dropdown-item"
                          to="/login"
                        >
                          Logout
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  {/* ----- */}
                </>
              )}
              <li className="nav-item">
                <Badge count={cart?.length} showZero>
                <NavLink className="nav-link" to="/cart">
                 Cart
                </NavLink>
                </Badge>
                
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

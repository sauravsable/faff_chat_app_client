import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "./LoginSignup.css";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline, MdLockOpen, MdFace } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, registerApi } from "../../utils/api";
import type { LoginPayload, RegisterPayload } from "../../utils/api.ts";

interface InputFieldProps {
  icon: React.ElementType;
  type: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  icon: Icon,
  type,
  placeholder,
  name,
  value,
  onChange,
}: InputFieldProps) => (
  <div className={name}>
    <Icon />
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required
    />
  </div>
);

export default function LoginSignup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginTab = useRef<HTMLFormElement>(null);
  const registerTab = useRef<HTMLFormElement>(null);
  const switcherTab = useRef<HTMLButtonElement>(null);

  const [loginData, setLoginData] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [user, setUser] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
      alert("Login successful");
      navigate("/user");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
      alert("Registration successful");
      navigate("/user");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Registration failed");
    },
  });

  const switchTabs = (tab: "login" | "register") => {
    if (!switcherTab.current || !loginTab.current || !registerTab.current)
      return;

    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");
      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    } else {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");
      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const loginSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const registerSubmit = (e: FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(user);
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="LoginSignUpContainer">
      <div className="LoginSignUpBox">
        <div>
          <div className="login_signUp_toggle">
            <p className="mb-0" onClick={() => switchTabs("login")}>
              LOGIN
            </p>
            <p className="mb-0" onClick={() => switchTabs("register")}>
              REGISTER
            </p>
          </div>
          <button ref={switcherTab}></button>
        </div>

        <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
          <InputField
            icon={MdOutlineMailOutline}
            type="email"
            placeholder="Email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
          />
          <InputField
            icon={MdLockOpen}
            type="password"
            placeholder="Password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
          />
          <Link to="/password/forgot">Forget Password?</Link>

          <button type="submit" className="loginBtn" disabled={isLoading}>
            {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Login"}
          </button>
        </form>

        <form
          className="signUpForm"
          ref={registerTab}
          encType="multipart/form-data"
          onSubmit={registerSubmit}
        >
          <InputField
            icon={MdFace}
            type="text"
            placeholder="Name"
            name="name"
            value={user.name}
            onChange={handleRegisterChange}
          />
          <InputField
            icon={MdOutlineMailOutline}
            type="email"
            placeholder="Email"
            name="email"
            value={user.email}
            onChange={handleRegisterChange}
          />
          <InputField
            icon={MdLockOpen}
            type="password"
            placeholder="Password"
            name="password"
            value={user.password}
            onChange={handleRegisterChange}
          />

          <button type="submit" className="signUpBtn" disabled={isLoading}>
            {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

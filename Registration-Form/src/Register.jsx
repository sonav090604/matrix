import React, { useState, useEffect } from "react";
import { FaUser, FaLock, FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Navbar from './Navbar/Navbar';
import './index.css';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@example\.com$|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)?\.com$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const USERS_URL = 'http://localhost:3500/users';

const Register = () => {

    const [username, setUsername] = useState('');
    const [validName, setValidName] = useState(false);

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [password, setPassword] = useState('');
    const [validPass, setValidPass] = useState(false);

    const [confirmPass, setConfirmPass] = useState('');
    const [validConfirmPass, setValidConfirmPass] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const result = USER_REGEX.test(username);
        setValidName(result);
    }, [username]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone]);

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPass(result);
        const match = password === confirmPass;
        setValidConfirmPass(match);
    }, [password, confirmPass]);

    useEffect(() => {
        setErrMsg('');
    }, [username, password, confirmPass]);

    useEffect(() => {
        const checkUsernameTaken = async () => {
            try {
                const response = await fetch(USERS_URL);
                const existingUsers = await response.json();
                const isUsernameTaken = existingUsers.some(userData => userData.username === username);

                if (isUsernameTaken) {
                    alert("Username Taken!");
                    setUsername('');
                    return;
                }
            } catch (error) {
                console.error("Error checking username:", error);
            }
        };

        if (username) {
            checkUsernameTaken();
        }
    }, [username]);

    useEffect(() => {
        const checkPhoneTaken = async () => {
            try {
                const response = await fetch(USERS_URL);
                const existingUsers = await response.json();
                const isPhoneTaken = existingUsers.some(userData => userData.phone === phone);

                if (isPhoneTaken) {
                    alert("Phone Number Taken!");
                    setPhone('');
                    return;
                }
            } catch (error) {
                console.error("Error checking phone number:", error);
            }
        };

        if (phone) {
            checkPhoneTaken();
        }
    }, [phone]);

    useEffect(() => {
        const checkEmailTaken = async () => {
            try {
                const response = await fetch(USERS_URL);
                const existingUsers = await response.json();
                const isEmailTaken = existingUsers.some(userData => userData.email === email);

                if (isEmailTaken) {
                    alert("Email Taken!");
                    setEmail('');
                    return;
                }
            } catch (error) {
                console.error("Error checking email:", error);
            }
        };

        if (email) {
            checkEmailTaken();
        }
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invalidEntry = !USER_REGEX.test(username) || !PWD_REGEX.test(password);
        if (invalidEntry) {
            setErrMsg("Invalid Entry!");
            return;
        }

        try {
            const response = await fetch(USERS_URL);
            const existingUsers = await response.json();
            const isUsernameTaken = existingUsers.some(userData => userData.username === username);

            if (isUsernameTaken) {
                alert("Username Taken!");
                setUsername('');
                return;
            }

            const isPhoneTaken = existingUsers.some(userData => userData.phone === phone);
            if (isPhoneTaken) {
                alert("Phone Number Taken!");
                setPhone('');
                return;
            }

            const isEmailTaken = existingUsers.some(userData => userData.email === email);
            if (isEmailTaken) {
                alert("Email Taken!");
                setEmail('');
                return;
            }

            const newUser = {
                username: username,
                phone: phone,
                email: email,
                password: password,
                "confirm-pwd": confirmPass,
            }

            await fetch(USERS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
            setSuccess(true);

        } catch (error) {
            console.error("Error submitting registration:", error);
        }
    }

    return (
        <>
            <Navbar />
            <div className="register-section">
                {success ? (
                    <section>
                        <h1>Success!</h1>
                        <p>
                            <a href="#">Sign in</a>
                        </p>
                    </section>
                ) : (
                    <section className="registration-field">
                        <form onSubmit={handleSubmit}>
                            <div className='username-field'>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="ENTER NAME"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <FaUser className="icon" />
                            </div>

                            <div className='phone-field'>
                                <input
                                    type="text"
                                    id="phone"
                                    placeholder="ENTER PHONE NUMBER"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <FaPhone className="icon" />
                            </div>

                            <div className='email-field'>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="ENTER EMAIL ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <MdEmail className="icon" />
                            </div>

                            <div className='password-field'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="ENTER PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <FaLock className="icon" />
                            </div>

                            <div className='confirm-pass-field'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirm-pass"
                                    placeholder="ENTER CONFIRM PASSWORD"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    required
                                />
                                <FaLock className="icon" />
                            </div>

                            <button disabled={!validName || !validPass || !validConfirmPass}>REGISTER</button>
                        </form>
                    </section>

                )
                }
            </div>
        </>
    )
}

export default Register;

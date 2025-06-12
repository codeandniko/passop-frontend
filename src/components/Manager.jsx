import { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = "https://passop-backend-9v2i.onrender.com";

const Manager = () => {
    const ref = useRef();
    const [passwordArray, setPasswordArray] = useState([]);
    const [form, setForm] = useState({ site: "", username: "", password: "" });

    const getpasswords = async () => {
        try {
            let req = await fetch(`${BASE_URL}/`);
            const passwords = await req.json();
            setPasswordArray(passwords);
        } catch (error) {
            console.error("Error fetching passwords:", error);
        }
    };

    useEffect(() => {
        getpasswords();
    }, []);

    const copyText = (text) => {
        toast('🦄 Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        navigator.clipboard.writeText(text);
    };

    const showPassword = () => {
        const passwordInput = ref.current;
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordInput.nextSibling.src = "icons/eyecross.png";
        } else {
            passwordInput.type = "password";
            passwordInput.nextSibling.src = "icons/eye.png";
        }
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            await fetch(`${BASE_URL}/`, {
                method: "DELETE",
                body: JSON.stringify({ id: form.id }),
                headers: { "Content-Type": "application/json" }
            });

            const newPassword = { ...form, id: uuidv4() };
            setPasswordArray([...passwordArray, newPassword]);
            await fetch(`${BASE_URL}/`, {
                method: "POST",
                body: JSON.stringify(newPassword),
                headers: { "Content-Type": "application/json" }
            });
            setForm({ site: "", username: "", password: "" });
            toast('✅ Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            toast('❌ Error: Password not saved!');
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const deletePassword = async (id) => {
        setPasswordArray(passwordArray.filter(item => item.id !== id));
        await fetch(`${BASE_URL}/`, {
            method: "DELETE",
            body: JSON.stringify({ id }),
            headers: { "Content-Type": "application/json" }
        });
    };

    const suggestPassword = async () => {
        if (form.site.length > 3 && form.username.length > 3) {
            try {
                const res = await fetch(`${BASE_URL}/suggest-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ site: form.site, username: form.username }),
                });
                const data = await res.json();
                setForm({ ...form, password: data.password });
                toast('🔑 Suggested password added!', { theme: "dark" });
            } catch (err) {
                toast('❌ Failed to suggest password');
            }
        } else {
            toast('❗ Please enter a valid Site & Username first');
        }
    };

    const editPassword = (id) => {
        console.log("Editing password with id ", id);
        setForm({ ...passwordArray.filter(i => i.id === id)[0], id });
        setPasswordArray(passwordArray.filter(item => item.id !== id));
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
            </div>
            <div className="mycontainer min-h-[88vh]">
                <h1 className="text-4xl font-bold text-center">
                    <img src="image.png" alt="SafeSproot Logo" className="h-32 inline-block" />
                </h1>
                <p className="text-green-500 text-lg text-center">Your own password manager</p>
                <div className="lordiconcopy flex flex-col gap-8 items-center text-black p-4">
                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                        className="rounded-full border border-green-400 px-4 py-1 w-full"
                        type="text"
                        name="site"
                    />
                    <div className="lordiconcopy flex w-full gap-8 justify-between">
                        <button
                            onClick={suggestPassword}
                            className="lordiconcopy flex gap-2 justify-center border border-green-400 items-center bg-green-400 hover:bg-green-300 rounded-full px-4 py-2 w-fit"
                        >
                            <lord-icon
                                src="https://cdn.lordicon.com/jrmyyzvw.json"
                                trigger="hover"
                            ></lord-icon>
                            Suggest Password
                        </button>

                        <input
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Enter Username"
                            className="rounded-full border border-green-400 px-4 py-1 w-full"
                            type="text"
                            name="username"
                        />
                        <div className="relative">
                            <input
                                ref={ref}
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                className="rounded-full border border-green-400 px-4 py-1 w-full"
                                type="password"
                                name="password"
                            />
                            <span
                                className="absolute right-[3px] top-[3px] cursor-pointer"
                                onClick={showPassword}
                            >
                                <img className="p-2" width={25} src="/icons/eye.png" alt="Toggle password visibility" />
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={savePassword}
                        className="lordiconcopy flex gap-2 justify-center border border-green-400 items-center bg-green-400 hover:bg-green-300 rounded-full px-4 py-2 w-fit"
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover"
                        ></lord-icon>
                        Add password
                    </button>
                </div>
                <div className="passwords">
                    <h2 className="font-bold text-xl py-3">Your Passwords</h2>
                    {passwordArray.length === 0 ? (
                        <div>No passwords to show</div>
                    ) : (
                        <table className="table-auto w-full">
                            <thead className="text-white bg-green-600">
                                <tr>
                                    <th className="py-2">Site</th>
                                    <th className="py-2">Username</th>
                                    <th className="py-2">Password</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-green-100 overflow-hidden rounded-md">
                                {passwordArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2 text-center">
                                            <div className='lordiconcopy flex items-center justify-center' onClick={() => { copyText(item.site) }}>
                                                <a href={item.site} target="_blank" rel="noopener noreferrer">
                                                    {item.site}
                                                </a>
                                                <lord-icon
                                                    className="cursor-pointer"
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className='lordiconcopy flex items-center justify-center' onClick={() => { copyText(item.username) }}>
                                                <span>{item.username}</span>
                                                <lord-icon
                                                    className="cursor-pointer"
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className='lordiconcopy flex items-center justify-center' onClick={() => { copyText(item.password) }}>
                                                <span>{"*".repeat(item.password.length)}</span>
                                                <lord-icon
                                                    className="cursor-pointer"
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover"
                                                ></lord-icon>
                                            </div>
                                        </td>
                                        <td className="py-2 text-center">
                                            <div className='lordiconcopy flex items-center justify-center'>
                                                <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/gwlusjdu.json"
                                                        trigger="hover"
                                                        style={{ width: "25px", height: "25px" }}
                                                    ></lord-icon>
                                                </span>
                                                <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/skkahier.json"
                                                        trigger="hover"
                                                        style={{ width: "25px", height: "25px" }}
                                                    ></lord-icon>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Manager;

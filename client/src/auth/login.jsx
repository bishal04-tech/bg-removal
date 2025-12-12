// import React, { useMemo, useState } from "react";

// // Drop-in React component for Email/Password auth (JWT style)
// // Assumptions:
// //  - Backend exposes POST /api/auth/register and /api/auth/login
// //  - Both return { token, user } on success
// //  - user schema matches: { email, photo?, firstName?, lastName?, creditBalance? }
// //  - IMPORTANT: Even though your Mongo schema above doesn't show `password`,
// //    your backend must store a hashed password (add `password` field server-side).
// //    This UI sends it; ignore on server only if you implement passwordless.

// export default function AuthUI() {
//   const API = import.meta.env.VITE_BACKEND_URL;
//   const [mode, setMode] = useState("login"); // "login" | "signup"
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     firstName: "",
//     lastName: "",
//     photo: "",
//   });

//   const title = mode === "login" ? "Welcome back" : "Create your account";
//   const subtitle =
//     mode === "login"
//       ? "Enter your email and password to sign in"
//       : "Fill the details to sign up";

//   const canSubmit = useMemo(() => {
//     if (!form.email || !form.password) return false;
//     if (mode === "signup" && form.password !== form.confirmPassword) return false;
//     return true;
//   }, [form, mode]);

//   function onChange(e) {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     if (!canSubmit) return;

//     setLoading(true);
//     try {
//      const endpoint =
//   mode === "login"
//     ? `${API}/api/auth/login`
//     : `${API}/api/auth/register`;
//       const payload =
//         mode === "login"
//           ? { email: form.email, password: form.password }
//           : {
//               email: form.email,
//               password: form.password,
//               firstName: form.firstName || undefined,
//               lastName: form.lastName || undefined,
//               photo: form.photo || undefined,
//             };

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
        
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data?.error || "Something went wrong");
//       }

//       // Persist token (localStorage or let server set cookie)
//       if (data?.token) localStorage.setItem("token", data.token);

//       setMessage(mode === "login" ? "Logged in successfully" : "Account created successfully");
//        setTimeout(() => {
//     window.location.href = "/";
//         }, 800);
//       // Example redirect:
//       // window.location.href = "/dashboard";
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
//           <div className="mb-6 text-center">
//             <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
//             <p className="text-gray-500 mt-1">{subtitle}</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {mode === "signup" && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">First name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={form.firstName}
//                     onChange={onChange}
//                     className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
//                     placeholder="Jane"
//                     autoComplete="given-name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Last name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={form.lastName}
//                     onChange={onChange}
//                     className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
//                     placeholder="Doe"
//                     autoComplete="family-name"
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={onChange}
//                 className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
//                 placeholder="you@example.com"
//                 autoComplete="email"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={onChange}
//                 className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
//                 placeholder="••••••••"
//                 autoComplete={mode === "login" ? "current-password" : "new-password"}
//                 required
//                 minLength={6}
//               />
//             </div>

//             {mode === "signup" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Confirm password</label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={form.confirmPassword}
//                   onChange={onChange}
//                   className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
//                   placeholder="••••••••"
//                   required
//                   minLength={6}
//                 />
//                 {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
//                   <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
//                 )}
//               </div>
//             )}

//             {mode === "signup" && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Photo URL (optional)</label>
//                 <input
//                   type="url"
//                   name="photo"
//                   value={form.photo}
//                   onChange={onChange}
//                   className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
//                   placeholder="https://…"
//                   autoComplete="off"
//                 />
//                 {form.photo && (
//                   <div className="mt-2 flex items-center gap-3">
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img
//                       src={form.photo}
//                       alt="preview"
//                       className="h-10 w-10 rounded-full object-cover border"
//                       onError={(e) => ((e.currentTarget.style.display = "none"))}
//                     />
//                     <span className="text-xs text-gray-500">Preview</span>
//                   </div>
//                 )}
//               </div>
//             )}

//             {error && (
//               <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>
//             )}
//             {message && (
//               <div className="rounded-xl bg-green-50 text-green-700 p-3 text-sm">{message}</div>
//             )}

//             <button
//               type="submit"
//               disabled={!canSubmit || loading}
//               className="w-full rounded-xl bg-black text-white py-2.5 font-medium shadow hover:bg-black/90 disabled:opacity-50"
//             >
//               {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
//             </button>
//           </form>

//           <div className="mt-5 text-center text-sm text-gray-500">
//             {mode === "login" ? (
//               <span>
//                 Don't have an account?{" "}
//                 <button
//                   className="text-gray-800 underline underline-offset-4"
//                   onClick={() => setMode("signup")}
//                 >
//                   Sign up
//                 </button>
//               </span>
//             ) : (
//               <span>
//                 Already have an account?{" "}
//                 <button
//                   className="text-gray-800 underline underline-offset-4"
//                   onClick={() => setMode("login")}
//                 >
//                   Sign in
//                 </button>
//               </span>
//             )}
//           </div>
//         </div>

//         <p className="text-xs text-gray-400 text-center mt-4">
//           Tip: For production, consider HTTP-only cookies for JWTs instead of localStorage.
//         </p>
//       </div>
//     </div>
//   );
// }




import React, { useMemo, useState } from "react";

export default function AuthUI() {
  const API = import.meta.env.VITE_BACKEND_URL;
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ for password
  const [showConfirm, setShowConfirm] = useState(false);   // 👁️ for confirm password

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    photo: "",
  });

  const title = mode === "login" ? "Welcome back" : "Create your account";
  const subtitle =
    mode === "login"
      ? "Enter your email and password to sign in"
      : "Fill the details to sign up";

  const canSubmit = useMemo(() => {
    if (!form.email || !form.password) return false;
    if (mode === "signup" && form.password !== form.confirmPassword) return false;
    return true;
  }, [form, mode]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!canSubmit) return;

    setLoading(true);
    try {
      const endpoint =
        mode === "login"
          ? `${API}/api/auth/login`
          : `${API}/api/auth/register`;

      const payload =
        mode === "login"
          ? { email: form.email, password: form.password }
          : {
              email: form.email,
              password: form.password,
              firstName: form.firstName || undefined,
              lastName: form.lastName || undefined,
              photo: form.photo || undefined,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");

      if (data?.token) localStorage.setItem("token", data.token);

      setMessage(mode === "login" ? "Logged in successfully" : "Account created successfully");
      setTimeout(() => {
        window.location.href = "/";
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-gray-500 mt-1">{subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
                    placeholder="Jane"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-black/70"
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange}
                    className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-black/70"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
                )}
              </div>
            )}
 {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Photo URL (optional)</label>
                <input
                  type="url"
                  name="photo"
                  value={form.photo}
                  onChange={onChange}
                  className="mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-black/70"
                  placeholder="https://…"
                  autoComplete="off"
                />
                {form.photo && (
                  <div className="mt-2 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.photo}
                      alt="preview"
                      className="h-10 w-10 rounded-full object-cover border"
                      onError={(e) => ((e.currentTarget.style.display = "none"))}
                    />
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 text-red-700 p-3 text-sm">{error}</div>
            )}
            {message && (
              <div className="rounded-xl bg-green-50 text-green-700 p-3 text-sm">{message}</div>
            )}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-xl bg-black text-white py-2.5 font-medium shadow hover:bg-black/90 disabled:opacity-50"
            >
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            {mode === "login" ? (
              <span>
                Don't have an account?{" "}
                <button
                  className="text-gray-800 underline underline-offset-4"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  className="text-gray-800 underline underline-offset-4"
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Tip: For production, consider HTTP-only cookies for JWTs instead of localStorage.
        </p>
      </div>
    </div>
  );
}
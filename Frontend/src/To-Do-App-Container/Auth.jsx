import React, { useState } from "react";
import { User, Mail, Lock, Loader2, UserPlus, LogIn, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation: Min password length (6 characters as per model)
    if (!isLogin && formData.password.length < 6 || formData.password.length > 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Authentication failed");

      localStorage.setItem("todo_token", data.token);
      localStorage.setItem("todo_user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_#1e1b4b,_#0f172a,_#020617)] font-['Inter',sans-serif] text-slate-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-md glass-effect rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 p-6 sm:p-10 border border-white/5 animate-fade-in text-center sm:text-left">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {isLogin ? "Welcome" : "Join Us"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            {isLogin ? "Manage your day with precision" : "Start your productivity journey"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm rounded-2xl animate-shake">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                name="username"
                required
                placeholder="Username"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm sm:text-base outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-white placeholder-slate-600"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 sm:py-4 pl-11 sm:pl-12 pr-4 text-sm sm:text-base outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-white placeholder-slate-600"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-3 sm:py-4 pl-11 sm:pl-12 pr-12 text-sm sm:text-base outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-white placeholder-slate-600"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 outline-none -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 " />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            
            {/* Password Requirement Notice */}
            {!isLogin && (
              <div className="flex items-center gap-1.5 mt-2 ml-1 px-1">
                <ShieldCheck className={cn("w-3 h-3 transition-colors", formData.password.length >= 6 ? "text-green-500" : "text-slate-600")} />
                <p className={cn("text-[9px] sm:text-[10px] font-medium tracking-wide transition-colors", formData.password.length >= 6 ? "text-green-500/80" : "text-slate-500")}>
                  Password must be at least 6 characters
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all py-3 sm:py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 mt-4 sm:mt-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                <span className="text-sm sm:text-base">{isLogin ? "Sign In" : "Register"}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 text-center text-slate-500 text-xs sm:text-sm">
          {isLogin ? "Need an account?" : "Member already?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300 font-bold ml-1 transition-colors"
          >
            {isLogin ? "Join now" : "Go to Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

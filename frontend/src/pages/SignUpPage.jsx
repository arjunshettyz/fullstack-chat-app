import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className={`w-full max-w-md space-y-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group transition-all duration-700 delay-100 animate-fadeUp">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors animate-fadeUp delay-200"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2 animate-fadeUp delay-300">Create Account</h1>
              <p className="text-base-content/60 animate-fadeUp delay-400">Get started with your free account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: 'Full Name', icon: <User className='size-5 text-base-content/40' />, type: 'text', value: formData.fullName, onChange: e => setFormData({ ...formData, fullName: e.target.value }), placeholder: 'your name', name: 'fullName' },
              { label: 'Email', icon: <Mail className='size-5 text-base-content/40' />, type: 'email', value: formData.email, onChange: e => setFormData({ ...formData, email: e.target.value }), placeholder: 'you@example.com', name: 'email' },
              { label: 'Password', icon: <Lock className='size-5 text-base-content/40' />, type: showPassword ? 'text' : 'password', value: formData.password, onChange: e => setFormData({ ...formData, password: e.target.value }), placeholder: '••••••••', name: 'password', isPassword: true },
            ].map((field, idx) => (
              <div className="form-control animate-fadeUp" style={{ animationDelay: `${0.2 + idx * 0.1}s` }} key={field.name}>
                <label className="label">
                  <span className="label-text font-medium">{field.label}</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field.icon}
                  </div>
                  <input
                    type={field.type}
                    className={`input input-bordered w-full pl-10`}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={field.onChange}
                    autoComplete={field.name}
                  />
                  {field.isPassword && (
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5 text-base-content/40" />
                      ) : (
                        <Eye className="size-5 text-base-content/40" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button type="submit" className="btn btn-primary w-full animate-fadeUp" style={{ animationDelay: '0.5s' }} disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center animate-fadeUp" style={{ animationDelay: '0.6s' }}>
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
};
export default SignUpPage;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import heroLeaves from "@/assets/hero-leaves.jpg";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, user, isAuthenticated } = useAuth();

  // If already logged in and verified, go to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else if (user && !user.emailVerified) {
      // User is logged in but not verified
      navigate("/verify-email");
    }
  }, [user, isAuthenticated, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    const ok = await loginWithEmail(email, password);
    setIsLoading(false);
    // Navigation is handled by useEffect on user state change.
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
  };

  const ErrorMsg = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-destructive mt-1 ml-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="min-h-screen flex">
      {/* Left — visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={heroLeaves} alt="Lush green crops" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-overlay-dark" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-earth flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl text-primary-foreground">AgriSense</span>
          </div>
          <div className="max-w-md">
            <h1 className="font-heading text-4xl text-primary-foreground leading-snug mb-4">
              Welcome Back
            </h1>
            <p className="text-primary-foreground/70 leading-relaxed">
              Log in to access your farm dashboard, analytics, and intelligent crop guidance.
            </p>
          </div>
          <p className="text-primary-foreground/40 text-xs">
            © 2026 AgriSense · Smart Farming Assistant
          </p>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-earth flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl text-foreground">AgriSense</span>
          </div>

          <div className="auth-view-enter">
            <h2 className="font-heading text-3xl text-foreground mb-1">Sign In</h2>
            <p className="text-muted-foreground mb-8">
              Enter your credentials to access your account.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-11 h-12 rounded-xl"
                  />
                </div>
                <ErrorMsg field="email" />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground block">Password</label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-11 h-12 rounded-xl"
                  />
                </div>
                <ErrorMsg field="password" />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl gradient-earth text-primary-foreground font-semibold flex items-center justify-center gap-2">
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4" />
                <path d="M12 23.24C14.97 23.24 17.46 22.26 19.28 20.34L15.71 17.58C14.73 18.24 13.48 18.63 12 18.63C9.13 18.63 6.69 16.69 5.8 14.07H2.12V16.92C3.94 20.54 7.68 23.24 12 23.24Z" fill="#34A853" />
                <path d="M5.8 14.07C5.57 13.38 5.44 12.65 5.44 11.9C5.44 11.15 5.57 10.42 5.8 9.73V6.88H2.12C1.37 8.38 0.94 10.08 0.94 11.9C0.94 13.72 1.37 15.42 2.12 16.92L5.8 14.07Z" fill="#FBBC05" />
                <path d="M12 5.17C13.62 5.17 15.07 5.73 16.21 6.82L19.35 3.68C17.45 1.91 14.96 0.8 12 0.8C7.68 0.8 3.94 3.5 2.12 7.12L5.8 9.97C6.69 7.35 9.13 5.17 12 5.17Z" fill="#EA4335" />
              </svg>
              Google
            </Button>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

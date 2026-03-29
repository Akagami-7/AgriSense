import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroLeaves from "@/assets/hero-leaves.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
              Smarter farming starts with better insights
            </h1>
            <p className="text-primary-foreground/70 leading-relaxed">
              AI-powered crop disease detection, soil analysis, and personalized recommendations — 
              helping farmers make data-driven decisions for healthier yields.
            </p>
          </div>
          <p className="text-primary-foreground/40 text-xs">
            © 2026 AgriSense · Smart Farming Assistant
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-[420px] anim-enter">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl gradient-earth flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl text-foreground">AgriSense</span>
          </div>

          <h2 className="font-heading text-3xl text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in to your farming dashboard</p>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email or Phone</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="you@example.com" className="pl-11 h-12 rounded-xl" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <button className="text-xs text-primary hover:underline">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-11 pr-11 h-12 rounded-xl"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              className="w-full h-12 rounded-xl gradient-earth text-primary-foreground font-semibold text-sm tracking-wide"
              onClick={() => navigate("/dashboard")}
            >
              Sign in
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-background px-4 text-muted-foreground">or continue with</span></div>
            </div>

            <Button variant="outline" className="w-full h-12 rounded-xl font-medium text-sm">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              New to AgriSense?{" "}
              <button className="text-primary font-semibold hover:underline">Create an account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

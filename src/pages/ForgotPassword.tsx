import { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import heroLeaves from "@/assets/hero-leaves.jpg";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const { resetUserPassword } = useAuth();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        setError("");
        setIsSubmitting(true);
        const ok = await resetUserPassword(email);
        setIsSubmitting(false);
        if (ok) {
            setSuccess(true);
        }
    };

    return (
        <div className="min-h-screen flex">
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
                            Reset Your Password
                        </h1>
                        <p className="text-primary-foreground/70 leading-relaxed">
                            Don't worry, we'll help you get back to managing your farm securely.
                        </p>
                    </div>
                    <p className="text-primary-foreground/40 text-xs">
                        © 2026 AgriSense · Smart Farming Assistant
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-[400px]">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl gradient-earth flex items-center justify-center">
                            <Sprout className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-xl text-foreground">AgriSense</span>
                    </div>

                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to login
                    </Link>

                    {!success ? (
                        <div className="auth-view-enter">
                            <h2 className="font-heading text-3xl text-foreground mb-2">Forgot Password</h2>
                            <p className="text-muted-foreground mb-8">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleReset} className="space-y-5">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            autoFocus
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="pl-11 h-12 rounded-xl"
                                        />
                                    </div>
                                    {error && <p className="text-xs text-destructive mt-1 ml-1">{error}</p>}
                                </div>

                                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl gradient-earth text-primary-foreground font-semibold flex items-center justify-center gap-2">
                                    {isSubmitting ? "Sending link..." : "Send Reset Link"}
                                    {!isSubmitting && <Send className="w-4 h-4" />}
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="auth-view-enter text-center py-8">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <Send className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="font-heading text-3xl text-foreground mb-4">Check your email</h2>
                            <p className="text-muted-foreground mb-8">
                                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                            </p>
                            <Button asChild className="w-full h-12 rounded-xl gradient-earth text-primary-foreground font-semibold">
                                <Link to="/login">Return to Login</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import heroLeaves from "@/assets/hero-leaves.jpg";

const VerifyEmail = () => {
    const { user, sendVerification, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isSending, setIsSending] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        // If the user happens to become authenticated while sitting on this page, redirect them.
        if (isAuthenticated) {
            navigate("/dashboard");
        } else if (!user) {
            // If no user at all, go to login
            navigate("/");
        }
    }, [user, isAuthenticated, navigate]);

    const handleResend = async () => {
        setIsSending(true);
        setSuccessMsg("");
        const ok = await sendVerification();
        setIsSending(false);
        if (ok) {
            setSuccessMsg("Verification email has been resent. Please check your inbox.");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

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
                            Protecting Your Account
                        </h1>
                        <p className="text-primary-foreground/70 leading-relaxed">
                            We need to verify it's you before granting access to your smart farming assistant.
                        </p>
                    </div>
                    <p className="text-primary-foreground/40 text-xs">
                        © 2026 AgriSense · Smart Farming Assistant
                    </p>
                </div>
            </div>

            {/* Right — verify info */}
            <div className="flex-1 flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-[400px]">
                    <div className="lg:hidden flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl gradient-earth flex items-center justify-center">
                            <Sprout className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-heading text-xl text-foreground">AgriSense</span>
                    </div>

                    <div className="auth-view-enter text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>

                        <h2 className="font-heading text-3xl text-foreground mb-4">Verify your email</h2>
                        <p className="text-muted-foreground mb-2">
                            We sent an email to <span className="font-medium text-foreground">{user?.email}</span>
                        </p>
                        <p className="text-muted-foreground mb-8 text-sm">
                            Click the link inside to get started. After verifying, you can refresh this page or try logging in again.
                        </p>

                        {successMsg && (
                            <div className="mb-6 bg-green-50 text-green-700 text-sm p-3 rounded-lg border border-green-200">
                                {successMsg}
                            </div>
                        )}

                        <div className="space-y-4">
                            <Button
                                onClick={handleResend}
                                disabled={isSending}
                                className="w-full h-12 rounded-xl gradient-earth text-primary-foreground font-semibold flex items-center justify-center gap-2"
                            >
                                {isSending ? "Sending..." : "Resend Verification Email"}
                                {!isSending && <ArrowRight className="w-4 h-4" />}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => window.location.reload()}
                                className="w-full h-12 rounded-xl font-medium"
                            >
                                I have verified (Refresh)
                            </Button>
                        </div>

                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            Sign in with a different account?{" "}
                            <button onClick={handleLogout} className="text-primary hover:underline font-medium">
                                Log out
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;

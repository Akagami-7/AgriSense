import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    onAuthStateChanged,
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile as updateFirebaseProfile,
    deleteUser
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loginWithEmail: (email: string, pass: string) => Promise<boolean>;
    signupWithEmail: (email: string, pass: string, name: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<boolean>;
    sendVerification: () => Promise<boolean>;
    resetUserPassword: (email: string) => Promise<boolean>;
    updateProfile: (name: string) => Promise<boolean>;
    deactivateAccount: () => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoadingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            toast.success("Logged in successfully");
            return true;
        } catch (error: any) {
            toast.error("Login Failed", { description: error.message });
            return false;
        }
    };

    const signupWithEmail = async (email: string, pass: string, name: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            if (userCredential.user) {
                await updateFirebaseProfile(userCredential.user, { displayName: name });
                await sendEmailVerification(userCredential.user);
            }
            toast.success("Account created! Please check your email to verify.");
            return true;
        } catch (error: any) {
            toast.error("Signup Failed", { description: error.message });
            return false;
        }
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success("Logged in with Google successfully");
            return true;
        } catch (error: any) {
            toast.error("Google Auth Failed", { description: error.message });
            return false;
        }
    };

    const sendVerification = async () => {
        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                toast.success("Verification email sent!");
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error("Failed to send verification", { description: error.message });
            return false;
        }
    };

    const resetUserPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent!");
            return true;
        } catch (error: any) {
            toast.error("Failed to reset password", { description: error.message });
            return false;
        }
    };

    const updateProfile = async (name: string) => {
        try {
            if (auth.currentUser) {
                await updateFirebaseProfile(auth.currentUser, { displayName: name });
                // We need to trigger a context re-render by duplicating the user object or reloading it
                setUser({ ...auth.currentUser });
                toast.success("Profile Updated");
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error("Failed to update profile", { description: error.message });
            return false;
        }
    };

    const deactivateAccount = async () => {
        try {
            if (auth.currentUser) {
                await deleteUser(auth.currentUser);
                toast.success("Account Deactivated");
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error("Failed to deactivate account", { description: error.message });
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            sessionStorage.clear();
            toast.success("Logged out successfully");
        } catch (error: any) {
            toast.error("Failed to log out", { description: error.message });
        }
    };

    if (loadingAuth) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>; // Could customize
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                // Block 'isAuthenticated' if the user exists but hasn't verified email, unless it's a google account that's verified automatically
                isAuthenticated: !!user && user.emailVerified,
                loginWithEmail,
                signupWithEmail,
                loginWithGoogle,
                sendVerification,
                resetUserPassword,
                updateProfile,
                deactivateAccount,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

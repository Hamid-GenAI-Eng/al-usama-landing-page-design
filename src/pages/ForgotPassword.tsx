import { Link } from "react-router-dom";
import { Lock, ArrowLeft, Globe, HelpCircle } from "lucide-react";
import AuthFooter from "@/components/AuthFooter";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-extrabold text-foreground font-headline tracking-tight">
          Al-Usama Logistics
        </Link>
        <div className="flex items-center gap-4">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container-low border border-border flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-primary" />
          </div>

          <h2 className="text-2xl font-extrabold text-foreground font-headline">Forgot Password?</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-xs mx-auto">
            No worries, it happens. Please enter the email address associated with your Al-Usama account to receive a secure recovery link.
          </p>

          <form className="mt-8 space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full gradient-primary text-primary-foreground py-4 rounded-full font-headline font-bold text-base hover:opacity-90 transition-all"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};

export default ForgotPassword;

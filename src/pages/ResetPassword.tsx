import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowRight, Globe, HelpCircle, CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";
import resetHero from "@/assets/reset-hero.jpg";
import AuthFooter from "@/components/AuthFooter";
import api from "@/lib/api";
import { toast } from "sonner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidTokenError, setInvalidTokenError] = useState("");

  useEffect(() => {
    if (!token) {
      setInvalidTokenError("No secure recovery token found in the URL. Please make sure you copied or clicked the link correctly.");
      toast.error("Invalid recovery link");
    }
  }, [token]);

  const checks = useMemo(() => ({
    length: password.length >= 12,
    special: /[&$#!@%^*]/.test(password),
    numeral: /\d/.test(password),
  }), [password]);

  const strength = Object.values(checks).filter(Boolean).length;
  const strengthLabel = strength === 0 ? "" : strength === 1 ? "WEAK" : strength === 2 ? "MODERATE" : "STRONG";
  const strengthColors = ["bg-muted", "bg-destructive", "bg-primary", "bg-green-500"];

  const isFormValid = useMemo(() => {
    return checks.length && checks.special && checks.numeral && password === confirmPassword;
  }, [checks, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("No valid reset token found.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!isFormValid) {
      toast.error("Please meet all security requirements.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to reset password. The link may have expired.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-lg font-extrabold text-foreground font-headline tracking-tight">
          Al-Usama Logistics
        </Link>
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <HelpCircle className="w-4 h-4" /> Support
          </a>
          <a href="#" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Globe className="w-4 h-4" /> English
          </a>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
          {/* Left — Security panel */}
          <div className="w-full md:w-[45%] space-y-6">
            <div className="relative rounded-2xl overflow-hidden h-80">
              <img src={resetHero} alt="Security" className="w-full h-full object-cover" loading="lazy" width={800} height={600} />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,80%,15%)]/95 via-[hsl(220,80%,15%)]/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="font-headline text-2xl font-extrabold text-white leading-tight">
                  Securing the backbone of global trade.
                </h3>
                <p className="text-white/70 text-sm mt-3 leading-relaxed">
                  Your security is our priority. We employ enterprise-grade encryption to ensure your data remains protected across all global routes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <ShieldCheck className="w-7 h-7 text-primary mb-3" />
                <h4 className="font-bold text-sm text-foreground">Architecture</h4>
                <p className="text-xs text-muted-foreground mt-1">Multi-layer security protocols.</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <Lock className="w-7 h-7 text-primary mb-3" />
                <h4 className="font-bold text-sm text-foreground">Privacy</h4>
                <p className="text-xs text-muted-foreground mt-1">Encrypted credential storage.</p>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="w-full md:w-[55%] bg-card border border-border rounded-2xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-center">
            {/* Decorative circle */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-surface-container-low opacity-50" />

            {invalidTokenError ? (
              <div className="text-center py-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground font-headline">Invalid Recovery URL</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-sm mx-auto">
                  {invalidTokenError}
                </p>
                <div className="mt-8">
                  <Link to="/forgot-password" className="gradient-primary text-primary-foreground px-6 py-3 rounded-full font-headline font-bold text-sm inline-flex items-center gap-2 hover:opacity-90 transition-all">
                    Request New Link
                  </Link>
                </div>
              </div>
            ) : success ? (
              <div className="text-center py-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground font-headline font-semibold">Password Reset Successful!</h2>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-sm mx-auto">
                  Your Al-Usama password has been successfully updated. You will be redirected to the login portal in a few seconds...
                </p>
                <div className="mt-8">
                  <Link to="/login" className="gradient-primary text-primary-foreground px-8 py-3 rounded-full font-headline font-bold text-sm inline-flex items-center gap-2 hover:opacity-90 transition-all">
                    Go to Login Immediately
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-foreground font-headline relative z-10">Reset Password</h2>
                <p className="text-muted-foreground mt-2 text-sm relative z-10">
                  Please choose a unique password to protect your Al-Usama account.
                </p>

                <form className="mt-8 space-y-5 relative z-10" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                    {/* Strength bar */}
                    <div className="flex gap-1.5 mt-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength] : "bg-muted"}`}
                        />
                      ))}
                    </div>
                    {strengthLabel && (
                      <p className={`text-xs font-bold uppercase tracking-wider mt-1.5 ${strength === 3 ? "text-green-600" : strength === 2 ? "text-primary" : "text-destructive"}`}>
                        Strength: {strengthLabel}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive font-bold mt-1.5">Passwords do not match</p>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wider">Security Requirements</p>
                    {[
                      { label: "At least 12 characters long", met: checks.length },
                      { label: "Include a special character (&, $, #, @, etc.)", met: checks.special },
                      { label: "Include at least one numeral", met: checks.numeral },
                    ].map((req) => (
                      <div key={req.label} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className={`text-sm ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="w-full gradient-primary text-primary-foreground py-4 rounded-full font-headline font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        Update Password
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <Link to="/login" className="text-sm text-primary font-semibold hover:underline">
                    Back to Login Portal
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <AuthFooter />
    </div>
  );
};

export default ResetPassword;

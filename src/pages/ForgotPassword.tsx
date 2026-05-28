import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft, Globe, HelpCircle, Loader2, CheckCircle2, Copy, Check } from "lucide-react";
import AuthFooter from "@/components/AuthFooter";
import api from "@/lib/api";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [demoResetUrl, setDemoResetUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      toast.success("Recovery link generated successfully!");
      
      // Check if backend returned a mock reset URL for testing
      if (response.data?.data?.resetUrl) {
        setDemoResetUrl(response.data.data.resetUrl);
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to request recovery link. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (demoResetUrl) {
      navigator.clipboard.writeText(demoResetUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-10 text-center relative overflow-hidden">
          {/* Decorative subtle background gradient */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-3xl" />

          {!success ? (
            <>
              <div className="w-16 h-16 rounded-full bg-surface-container-low border border-border flex items-center justify-center mx-auto mb-6 relative z-10">
                <Lock className="w-7 h-7 text-primary" />
              </div>

              <h2 className="text-2xl font-extrabold text-foreground font-headline relative z-10">Forgot Password?</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-xs mx-auto relative z-10">
                No worries, it happens. Please enter the email address associated with your Al-Usama account to receive a secure recovery link.
              </p>

              <form className="mt-8 space-y-5 text-left relative z-10" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-primary text-primary-foreground py-4 rounded-full font-headline font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="relative z-10 py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>

              <h2 className="text-2xl font-extrabold text-foreground font-headline">Reset Email Sent</h2>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-sm mx-auto">
                A secure recovery link has been generated for <strong className="text-foreground">{email}</strong>. 
                Please check your inbox to complete the password reset.
              </p>

              {/* Demo Mode Link Display Box */}
              {demoResetUrl && (
                <div className="mt-8 p-4 bg-muted/50 border border-border rounded-xl text-left space-y-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Developer Demo Mode</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    No SMTP mail server is configured. You can click the recovery link below directly to set your new password:
                  </p>
                  <div className="flex gap-2 items-center mt-2 bg-background p-2 rounded-lg border border-border overflow-hidden">
                    <span className="text-xs text-foreground font-mono truncate select-all flex-1">{demoResetUrl}</span>
                    <button 
                      onClick={handleCopy} 
                      type="button" 
                      className="p-1.5 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground shrink-0"
                      title="Copy link"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <a 
                    href={demoResetUrl} 
                    className="mt-3 block text-center bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-xs hover:opacity-90 transition-all"
                  >
                    Go to Reset Password Page
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border relative z-10">
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

import { Link } from "react-router-dom";

const AuthFooter = () => (
  <footer className="border-t border-border bg-background py-6">
    <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-muted-foreground text-xs tracking-wide">
        © 2024 AL-USAMA IMPORT & EXPORT SYSTEM. ALL RIGHTS RESERVED.
      </p>
      <div className="flex gap-8">
        {["Privacy Policy", "Terms of Service", "Security Architecture"].map((item) => (
          <a key={item} href="#" className="text-muted-foreground hover:text-foreground text-xs tracking-wider uppercase transition-colors">
            {item}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default AuthFooter;

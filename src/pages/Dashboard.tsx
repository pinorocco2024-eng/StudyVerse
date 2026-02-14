import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, BookOpen, Brain, Users, Zap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/auth");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Zap className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Studente";

  return (
    <div className="min-h-screen hero-gradient text-hero-foreground">
      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-xl bg-hero/80 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold gradient-text">StudyVerse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/community">
              <Button variant="ghost" className="text-hero-foreground/70 hover:text-hero-foreground hover:bg-white/5">
                <Users className="w-4 h-4 mr-2" />
                Community
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="text-hero-foreground/50 hover:text-hero-foreground hover:bg-white/5">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">Ciao, {displayName} 👋</h1>
          <p className="text-hero-foreground/50 mb-10">Cosa vuoi studiare oggi?</p>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        >
          <Link to="/create" className="block">
            <div className="glass-card p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer group h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1">Crea Nuovo</h3>
              <p className="text-sm text-hero-foreground/50">Quiz, flashcard o set di studio</p>
            </div>
          </Link>

          <div className="glass-card p-6 hover:border-accent/30 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">Le Mie Flashcard</h3>
            <p className="text-sm text-hero-foreground/50">Riprendi lo studio</p>
          </div>

          <div className="glass-card p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">I Miei Quiz</h3>
            <p className="text-sm text-hero-foreground/50">Continua i tuoi quiz</p>
          </div>
        </motion.div>

        {/* Recent activity placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-bold mb-4">Attività Recente</h2>
          <div className="glass-card p-12 text-center">
            <Brain className="w-12 h-12 text-hero-foreground/20 mx-auto mb-4" />
            <p className="text-hero-foreground/40 font-medium">Nessuna attività ancora</p>
            <p className="text-sm text-hero-foreground/30 mt-1">Crea il tuo primo set di studio per iniziare!</p>
            <Link to="/create">
              <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Crea Ora
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

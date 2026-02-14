import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Users, Zap, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assests/hero-bg.jpg";

const features = [
  {
    icon: Upload,
    title: "Carica Qualsiasi Cosa",
    description: "PDF, immagini, testo — carica il tuo materiale e lascia che l'AI faccia il resto.",
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "Quiz Intelligenti",
    description: "Domande a risposta multipla, aperte, semplici o complesse — generate dall'AI.",
    color: "text-accent",
  },
  {
    icon: Sparkles,
    title: "Flashcard AI",
    description: "Flashcard create automaticamente dal tuo materiale, pronte per lo studio.",
    color: "text-primary",
  },
  {
    icon: Users,
    title: "Community",
    description: "Condividi i tuoi set di studio, usa i template degli altri, sfida i tuoi amici.",
    color: "text-accent",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-hero text-hero-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-hero/80 border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-7 h-7 text-primary" />
            <span className="font-display text-xl font-bold gradient-text">StudyVerse</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-hero-foreground/70 hover:text-hero-foreground transition-colors">Funzionalità</a>
            <Link to="/community" className="text-sm text-hero-foreground/70 hover:text-hero-foreground transition-colors">Community</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="text-hero-foreground/80 hover:text-hero-foreground hover:bg-white/5">Accedi</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold">
                Inizia Gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 hero-gradient opacity-80" />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powered by AI</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              Studia in modo
              <br />
              <span className="gradient-text">più intelligente</span>
            </h1>

            <p className="text-lg md:text-xl text-hero-foreground/60 max-w-2xl mx-auto mb-10 font-light">
              Carica i tuoi appunti, PDF o immagini. L'AI crea quiz e flashcard personalizzate. Condividi con la community e sfida gli altri.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?mode=signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold text-lg px-8 py-6">
                  <Zap className="w-5 h-5 mr-2" />
                  Crea il tuo primo quiz
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-white/20 text-hero-foreground hover:bg-white/5 text-lg px-8 py-6">
                  Scopri di più
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { num: "AI", label: "Generazione" },
              { num: "∞", label: "Flashcard" },
              { num: "🔥", label: "Community" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-display font-bold gradient-text">{stat.num}</div>
                <div className="text-sm text-hero-foreground/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Tutto ciò di cui hai <span className="gradient-accent-text">bisogno</span>
            </h2>
            <p className="text-hero-foreground/50 text-lg max-w-xl mx-auto">
              Una piattaforma completa per studiare, creare e condividere.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-hero-foreground/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 relative">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Come <span className="gradient-text">funziona</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Carica", desc: "Carica PDF, immagini o scrivi il tuo testo", icon: Upload },
              { step: "02", title: "Genera", desc: "L'AI crea quiz e flashcard dal tuo materiale", icon: Brain },
              { step: "03", title: "Studia & Condividi", desc: "Studia e condividi con la community", icon: BookOpen },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-xs text-primary font-mono mb-2">{s.step}</div>
                <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-hero-foreground/50">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card max-w-2xl mx-auto p-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Pronto a studiare <span className="gradient-accent-text">meglio</span>?
            </h2>
            <p className="text-hero-foreground/50 mb-8">Unisciti alla community e inizia a creare i tuoi quiz con l'AI.</p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent font-semibold text-lg px-8 py-6">
                Registrati Gratis
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-display text-sm font-semibold gradient-text">StudyVerse</span>
          </div>
          <p className="text-xs text-hero-foreground/30">© 2026 StudyVerse. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

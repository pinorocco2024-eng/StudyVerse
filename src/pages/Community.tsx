import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Users, Heart, Copy, Search, Brain, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock community data for now
const mockSets = [
  { id: "1", title: "Biologia - Cellula", author: "Marco R.", type: "flashcards", cards: 25, likes: 42, icon: BookOpen },
  { id: "2", title: "Storia Romana", author: "Giulia P.", type: "quiz_multiple", cards: 15, likes: 38, icon: Brain },
  { id: "3", title: "Matematica - Derivate", author: "Luca S.", type: "flashcards", cards: 30, likes: 67, icon: BookOpen },
  { id: "4", title: "Inglese B2 Vocabulary", author: "Sara M.", type: "quiz_open", cards: 20, likes: 55, icon: Brain },
  { id: "5", title: "Chimica Organica", author: "Andrea B.", type: "flashcards", cards: 18, likes: 31, icon: BookOpen },
  { id: "6", title: "Filosofia Moderna", author: "Elena C.", type: "quiz_multiple", cards: 12, likes: 28, icon: Brain },
];

const typeLabels: Record<string, string> = {
  flashcards: "Flashcard",
  quiz_multiple: "Quiz Multiplo",
  quiz_open: "Quiz Aperto",
};

const Community = () => {
  const [search, setSearch] = useState("");

  const filtered = mockSets.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen hero-gradient text-hero-foreground">
      <nav className="border-b border-white/5 backdrop-blur-xl bg-hero/80 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold gradient-text">StudyVerse</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-hero-foreground/70 hover:text-hero-foreground hover:bg-white/5">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="font-display text-3xl font-bold">Community</h1>
          </div>
          <p className="text-hero-foreground/50 mb-8">Scopri set di studio creati dalla community</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hero-foreground/30" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca set di studio..."
              className="pl-10 bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-foreground/30 focus:border-primary"
            />
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((set, i) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <set.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-hero-foreground/50">
                  {typeLabels[set.type]}
                </span>
              </div>

              <h3 className="font-display text-lg font-semibold mb-1">{set.title}</h3>
              <p className="text-sm text-hero-foreground/40 mb-4">di {set.author} · {set.cards} carte</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-hero-foreground/40">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">{set.likes}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  <Copy className="w-4 h-4 mr-1" />
                  Usa Template
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;

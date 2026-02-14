import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Upload, FileText, Image, Type, Brain, Sparkles, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type GenerationType = "quiz_multiple" | "quiz_open" | "flashcards";

const CreateStudySet = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [generationType, setGenerationType] = useState<GenerationType>("flashcards");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) navigate("/auth");
      else setUser(session.user);
    });
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      // For text files, read content
      if (f.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (ev) => setTextContent(ev.target?.result as string || "");
        reader.readAsText(f);
      }
    }
  };

  const handleGenerate = async () => {
    if (!textContent.trim() && !file) {
      toast.error("Inserisci del testo o carica un file");
      return;
    }

    setLoading(true);
    try {
      let contentToSend = textContent;

      // If file is PDF or image, convert to base64
      if (file && file.type !== "text/plain") {
        const reader = new FileReader();
        contentToSend = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      const { data, error } = await supabase.functions.invoke("generate-study-content", {
        body: {
          content: contentToSend,
          type: generationType,
          numQuestions,
          title: title || "Set di Studio",
          isFile: !!file && file.type !== "text/plain",
          fileType: file?.type,
        },
      });

      if (error) throw error;

      toast.success("Contenuti generati con successo!");
      // Navigate to study session with generated data
      navigate(`/study/new`, { state: { studyData: data, title: title || "Set di Studio", type: generationType } });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("429")) {
        toast.error("Troppe richieste, riprova tra qualche secondo");
      } else if (err.message?.includes("402")) {
        toast.error("Crediti AI esauriti. Aggiungi crediti nelle impostazioni del workspace.");
      } else {
        toast.error("Errore nella generazione. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "flashcards" as const, label: "Flashcard", icon: BookOpen, desc: "Domanda e risposta semplice" },
    { value: "quiz_multiple" as const, label: "Quiz Multiplo", icon: Brain, desc: "Risposte a scelta multipla" },
    { value: "quiz_open" as const, label: "Quiz Aperto", icon: Type, desc: "Risposte scritte" },
  ];

  return (
    <div className="min-h-screen hero-gradient text-hero-foreground">
      <nav className="border-b border-white/5 backdrop-blur-xl bg-hero/80 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-hero-foreground/50 hover:text-hero-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-display text-sm font-bold gradient-text">StudyVerse</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-2">Crea Set di Studio</h1>
          <p className="text-hero-foreground/50 mb-8">Carica il tuo materiale e l'AI farà il resto</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-hero-foreground/70">Titolo</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es: Biologia Capitolo 3"
              className="bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-foreground/30 focus:border-primary"
            />
          </div>

          {/* Type selector */}
          <div className="space-y-2">
            <Label className="text-hero-foreground/70">Tipo di Contenuto</Label>
            <div className="grid grid-cols-3 gap-3">
              {typeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGenerationType(opt.value)}
                  className={`glass-card p-4 text-left transition-all duration-300 ${
                    generationType === opt.value ? "border-primary/50 bg-primary/5" : "hover:border-white/20"
                  }`}
                >
                  <opt.icon className={`w-5 h-5 mb-2 ${generationType === opt.value ? "text-primary" : "text-hero-foreground/40"}`} />
                  <div className="font-display text-sm font-semibold">{opt.label}</div>
                  <div className="text-xs text-hero-foreground/40 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Num questions */}
          <div className="space-y-2">
            <Label className="text-hero-foreground/70">Numero di domande/carte</Label>
            <Input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              min={3}
              max={30}
              className="bg-white/5 border-white/10 text-hero-foreground focus:border-primary w-32"
            />
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label className="text-hero-foreground/70">Carica File (opzionale)</Label>
            <label className="glass-card p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all">
              <input type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" onChange={handleFileChange} className="hidden" />
              {file ? (
                <div className="flex items-center gap-3">
                  {file.type.startsWith("image") ? <Image className="w-6 h-6 text-primary" /> : <FileText className="w-6 h-6 text-primary" />}
                  <span className="text-sm">{file.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-hero-foreground/30 mb-2" />
                  <span className="text-sm text-hero-foreground/40">PDF, PNG, JPG o TXT</span>
                </>
              )}
            </label>
          </div>

          {/* Text area */}
          <div className="space-y-2">
            <Label className="text-hero-foreground/70">Oppure scrivi il tuo testo</Label>
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Incolla qui i tuoi appunti, il contenuto del libro, o qualsiasi testo da cui generare il materiale di studio..."
              rows={8}
              className="bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-foreground/30 focus:border-primary resize-none"
            />
          </div>

          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={loading || (!textContent.trim() && !file)}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-semibold py-6 text-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                Generazione in corso...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Genera con AI
              </span>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateStudySet;

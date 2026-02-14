import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowLeft, ArrowRight, RotateCcw, Check, X, BookOpen, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FlashcardData {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options?: string[];
  correct_answer: string;
}

const StudySession = () => {
  const location = useLocation();
  const state = location.state as { studyData: any; title: string; type: string } | null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Fallback demo data
  const demoFlashcards: FlashcardData[] = [
    { front: "Cos'è la mitosi?", back: "La divisione cellulare che produce due cellule figlie identiche alla cellula madre." },
    { front: "Cos'è il DNA?", back: "L'acido desossiribonucleico, molecola che contiene le informazioni genetiche." },
    { front: "Cos'è un ribosoma?", back: "Organello cellulare responsabile della sintesi proteica." },
  ];

  const demoQuiz: QuizQuestion[] = [
    { question: "Quale organello produce energia nella cellula?", options: ["Ribosoma", "Mitocondrio", "Nucleo", "Lisosoma"], correct_answer: "Mitocondrio" },
    { question: "Qual è la funzione del DNA?", options: ["Produrre energia", "Trasportare ossigeno", "Contenere informazioni genetiche", "Digerire nutrienti"], correct_answer: "Contenere informazioni genetiche" },
  ];

  const items = state?.studyData?.items || (state?.type === "flashcards" ? demoFlashcards : demoQuiz);
  const type = state?.type || "flashcards";
  const title = state?.title || "Sessione Demo";

  const currentItem = items[currentIndex];
  const isLast = currentIndex === items.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
      setUserAnswer("");
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setFlipped(false);
      setUserAnswer("");
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  const handleCheckAnswer = () => {
    if (type === "quiz_multiple" && selectedOption !== null) {
      const isCorrect = currentItem.options?.[selectedOption] === currentItem.correct_answer;
      if (isCorrect) setScore((s) => s + 1);
      setShowResult(true);
    } else if (type === "quiz_open" && userAnswer.trim()) {
      // Simple check
      const isCorrect = userAnswer.toLowerCase().includes(currentItem.correct_answer?.toLowerCase().slice(0, 10));
      if (isCorrect) setScore((s) => s + 1);
      setShowResult(true);
    }
  };

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
          <div className="text-sm text-hero-foreground/40">
            {currentIndex + 1} / {items.length}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold mb-1 text-center">{title}</h1>
          <div className="text-center mb-8">
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
              {type === "flashcards" ? "Flashcard" : type === "quiz_multiple" ? "Quiz Multiplo" : "Quiz Aperto"}
            </span>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-white/5 mb-8">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {type === "flashcards" ? (
              /* Flashcard */
              <div
                onClick={() => setFlipped(!flipped)}
                className="glass-card p-12 min-h-[300px] flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all"
              >
                <div className="text-center">
                  {!flipped ? (
                    <>
                      <BookOpen className="w-8 h-8 text-primary mx-auto mb-4" />
                      <p className="font-display text-xl font-semibold">{currentItem.front}</p>
                      <p className="text-xs text-hero-foreground/30 mt-4">Clicca per girare</p>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-8 h-8 text-accent mx-auto mb-4" />
                      <p className="text-lg text-hero-foreground/80">{currentItem.back}</p>
                      <p className="text-xs text-hero-foreground/30 mt-4">Clicca per girare</p>
                    </>
                  )}
                </div>
              </div>
            ) : type === "quiz_multiple" ? (
              /* Multiple choice */
              <div className="glass-card p-8">
                <Brain className="w-8 h-8 text-primary mb-4" />
                <h2 className="font-display text-xl font-semibold mb-6">{currentItem.question}</h2>
                <div className="space-y-3">
                  {currentItem.options?.map((opt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => !showResult && setSelectedOption(i)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        showResult
                          ? opt === currentItem.correct_answer
                            ? "border-primary/50 bg-primary/10"
                            : selectedOption === i
                            ? "border-destructive/50 bg-destructive/10"
                            : "border-white/5 bg-white/5"
                          : selectedOption === i
                          ? "border-primary/50 bg-primary/5"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm font-mono">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm">{opt}</span>
                        {showResult && opt === currentItem.correct_answer && <Check className="w-4 h-4 text-primary ml-auto" />}
                        {showResult && selectedOption === i && opt !== currentItem.correct_answer && <X className="w-4 h-4 text-destructive ml-auto" />}
                      </div>
                    </button>
                  ))}
                </div>
                {!showResult && selectedOption !== null && (
                  <Button onClick={handleCheckAnswer} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                    Verifica
                  </Button>
                )}
              </div>
            ) : (
              /* Open question */
              <div className="glass-card p-8">
                <Brain className="w-8 h-8 text-accent mb-4" />
                <h2 className="font-display text-xl font-semibold mb-6">{currentItem.question}</h2>
                {!showResult ? (
                  <div className="space-y-4">
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Scrivi la tua risposta..."
                      className="bg-white/5 border-white/10 text-hero-foreground placeholder:text-hero-foreground/30 focus:border-primary"
                      onKeyDown={(e) => e.key === "Enter" && handleCheckAnswer()}
                    />
                    <Button onClick={handleCheckAnswer} disabled={!userAnswer.trim()} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Verifica
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <p className="text-sm text-hero-foreground/60 mb-1">Risposta corretta:</p>
                    <p className="font-medium">{currentItem.correct_answer}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="text-hero-foreground/50 hover:text-hero-foreground hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Precedente
          </Button>

          {type !== "flashcards" && (
            <div className="text-sm text-primary font-mono">
              Punteggio: {score}/{currentIndex + (showResult ? 1 : 0)}
            </div>
          )}

          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={isLast}
            className="text-hero-foreground/50 hover:text-hero-foreground hover:bg-white/5"
          >
            Successivo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudySession;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { content, type, numQuestions, title, isFile, fileType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    
    if (type === "flashcards") {
      systemPrompt = `Sei un esperto educatore. Crea esattamente ${numQuestions} flashcard dal contenuto fornito. 
Rispondi SOLO con un JSON valido, senza markdown, senza backtick, senza testo aggiuntivo.
Il formato deve essere:
{"items": [{"front": "domanda", "back": "risposta"}]}
Le flashcard devono essere chiare, concise e utili per lo studio.`;
    } else if (type === "quiz_multiple") {
      systemPrompt = `Sei un esperto educatore. Crea esattamente ${numQuestions} domande a risposta multipla dal contenuto fornito.
Rispondi SOLO con un JSON valido, senza markdown, senza backtick, senza testo aggiuntivo.
Il formato deve essere:
{"items": [{"question": "domanda", "options": ["opzione1", "opzione2", "opzione3", "opzione4"], "correct_answer": "opzione_corretta"}]}
Ogni domanda deve avere esattamente 4 opzioni. La correct_answer deve essere una delle opzioni.`;
    } else {
      systemPrompt = `Sei un esperto educatore. Crea esattamente ${numQuestions} domande a risposta aperta dal contenuto fornito.
Rispondi SOLO con un JSON valido, senza markdown, senza backtick, senza testo aggiuntivo.
Il formato deve essere:
{"items": [{"question": "domanda", "correct_answer": "risposta_corretta"}]}
Le risposte devono essere concise ma complete.`;
    }

    const userContent = isFile 
      ? `Questo è un file ${fileType} codificato in base64. Analizza il contenuto e genera il materiale di studio: ${content}`
      : `Genera materiale di studio da questo testo:\n\n${content}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) throw new Error("No content from AI");

    // Parse JSON from AI response (handle potential markdown wrapping)
    let cleanContent = aiContent.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    }

    const parsed = JSON.parse(cleanContent);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-study-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

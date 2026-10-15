
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

app.post("/generate", async (req, res) => {
    try {
        const question = req.body.question;
        const type = req.body.type;
        const subject = req.body.subject || "General";

        console.log("Selected Subject:", subject);
        console.log("Selected Type:", type);

        if (!question || question.trim() === "") {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        let prompt = "";

        if (type === "2 Mark") {
            prompt =
                "You are StudyMate AI, an engineering exam tutor. " +
                "Answer in simple English using 30 to 60 words. " +
                "Start with a clear definition when appropriate. " +
                "Include only 1 or 2 important points. " +
                "Use correct technical terms. " +
                "Avoid unnecessary headings and conclusions. " +
                "Return ONLY one 2-mark exam answer. " +
                "Do not give a 5-mark or 10-mark answer. " +
                "Question: " + question;

        } else if (type === "5 Mark") {
            prompt =
                "You are StudyMate AI, an engineering exam tutor. " +
                "Write one complete 5-mark answer in simple English, " +
                "approximately 120 to 180 words. " +
                "Start with a definition or short introduction when suitable. " +
                "Include 4 to 6 numbered points with clear explanations. " +
                "Add a relevant example if useful. " +
                "Use headings only when they improve clarity. " +
                "Keep the answer technically correct and exam-friendly. " +
                "Avoid unnecessary repetition. " +
                "Return ONLY the 5-mark answer. " +
                "Do not give a 2-mark or 10-mark answer. " +
                "Question: " + question;

        } else if (type === "10 Mark") {
            prompt =
                "You are StudyMate AI, an engineering exam tutor. " +
                "Write one complete 10-mark answer in simple English, " +
                "approximately 250 to 400 words, depending on the topic. " +
                "Start with an introduction or definition. " +
                "Use suitable headings and detailed explanations. " +
                "Include numbered points, steps, or classifications " +
                "where relevant. " +
                "Add a suitable example, application, or diagram description " +
                "if useful. " +
                "Finish with a short conclusion when appropriate. " +
                "Keep the answer technically correct and exam-friendly. " +
                "Avoid unnecessary repetition. " +
                "Return ONLY the 10-mark answer. " +
                "Do not give a 2-mark or 5-mark answer. " +
                "Question: " + question;

        } else {
            return res.status(400).json({
                error: "Please select 2 Mark, 5 Mark or 10 Mark."
            });
        }

        // Add selected subject context to the answer prompt
        prompt =
            "You are helping an engineering college student. " +
            "Selected subject: " + subject + ". " +
            "Use relevant concepts and technical terminology from this subject. " +
            "Write in simple, clear English suitable for exam preparation. " +
            "If General / Other is selected, answer the question based on " +
            "the most relevant subject. " +
            "Do not invent facts. Follow the selected mark format strictly. " +
            prompt;

        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:3b",
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.2
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error("Ollama request failed");
        }

        const data = await response.json();

        res.json({
            answer: data.response.trim()
        });

    } catch (error) {
        console.error("Error:", error);

        res.status(500).json({
            error: "AI connection failed. Make sure Ollama is running."
        });
    }
});

app.listen(PORT, function () {
    console.log(
        "StudyMate AI running at http://localhost:" + PORT
    );
});

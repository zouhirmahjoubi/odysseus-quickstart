
export const generateModelComparison = (prompt) => {
  return `[MODEL COMPARISON MODE]
Analyzing: "${prompt}"

| Metric | Model A | Model B |
|---|---|---|
| Speed | 45 t/s | 15 t/s |
| VRAM | 8GB | 24GB |
| Quality | 8.5/10 | 9.8/10 |

Recommendation: Model A for speed, Model B for complex reasoning.`;
};

export const generateDeepResearch = (prompt) => {
  return `[DEEP RESEARCH MODE]
Query: "${prompt}"

[INFO] Initializing search agents...
[INFO] Querying 15 sources...
[PROCESSING] Synthesizing data...

## Key Findings
1. The landscape is shifting towards smaller, highly optimized models.
2. Quantization (AWQ, GGUF) is critical for edge deployment.

## Sources
- ArXiv: "Advances in INT4 Quantization" (Confidence: 95%)
- GitHub: "Local LLM Deployment Patterns" (Confidence: 88%)`;
};

export const generateEmailIntelligence = (prompt) => {
  return `[EMAIL INTELLIGENCE MODE]
Analyzing thread: "${prompt}"

**Sentiment:** Neutral / Urgent
**Priority:** High

**Action Items:**
- [ ] Reply to client with updated timeline by EOD.
- [ ] Schedule technical review for Thursday.

**Summary:** Client is requesting an update on the deployment phase and wants to ensure security protocols are met before the weekend.`;
};

export const generateHardwareCookbook = (prompt) => {
  return `[HARDWARE COOKBOOK MODE]
Topic: "${prompt}"

**Requirements:**
- 16GB+ VRAM GPU
- Ubuntu 22.04 LTS
- Docker & NVIDIA Container Toolkit

**Step-by-Step:**
1. Install NVIDIA drivers: \`sudo ubuntu-drivers autoinstall\`
2. Setup Docker repository and install Docker CE.
3. Install NVIDIA Container Toolkit.
4. Run Ollama container: \`docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama\`

**Optimization:** Ensure PCIe Gen4 x16 is enabled in BIOS for maximum bandwidth.`;
};

export const generateAutonomousAgents = (prompt) => {
  return `[AUTONOMOUS AGENTS MODE]
Task: "${prompt}"

[INFO] Initializing Agent Swarm...
[INFO] Task broken down into 3 sub-tasks.

**Agent 1 (Researcher):** Gathering context... [COMPLETE]
**Agent 2 (Coder):** Drafting implementation... [COMPLETE]
**Agent 3 (Reviewer):** Validating security... [COMPLETE]

**Final Output:**
The task has been completed successfully. All generated assets have been saved to the virtual workspace.`;
};

export const generateCodeGeneration = (prompt) => {
  return `[CODE GENERATION MODE]
Prompt: "${prompt}"

Here is the requested implementation:

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    text: str

@app.post("/generate")
async def generate(query: Query):
    # Simulated inference
    return {"response": f"Processed: {query.text}"}
\`\`\`

**Explanation:**
This is a basic FastAPI server with a single POST endpoint. It uses Pydantic for request validation.`;
};

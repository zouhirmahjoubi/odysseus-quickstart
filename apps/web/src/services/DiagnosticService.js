
export const getDiagnosticResult = ({ os, installRoute, stage, category }) => {
  // Base fallback structure
  let result = {
    title: "🔍 Undiagnosed Anomaly",
    verdict: "The exact signature of this issue does not match known deterministic faults. System context suggests a generic runtime collapse.",
    command: "tail -n 100 /var/log/syslog | grep -i error",
    actions: ["Restart the core daemon", "Verify environment variables"],
    avoid: ["Do not purge the database without a snapshot"]
  };

  // Evaluation Matrix
  if (category === 'ollama_missing') {
    result = {
      title: "🦙 Ollama Process Missing",
      verdict: "The local Ollama inference server is unreachable or the binary is missing from the PATH. The application cannot communicate with the LLM backend.",
      command: os === 'windows' ? "Get-Process ollama" : "ps aux | grep ollama",
      actions: [
        "Ensure Ollama is installed and the background service is running",
        "Check if another application is binding to port 11434",
        "Verify your system PATH includes the directory containing the Ollama executable"
      ],
      avoid: [
        "Do not run multiple instances of the server simultaneously",
        "Do not bypass the standard installation scripts without reading the manual"
      ]
    };
  } else if (category === 'network_timeout') {
    result = {
      title: "🔌 Network / Socket Timeout",
      verdict: "The client application timed out waiting for the local inference engine to respond. This usually indicates a blocked port, network isolation, or a hung model.",
      command: os === 'windows' ? "Test-NetConnection -ComputerName localhost -Port 11434" : "curl -v http://127.0.0.1:11434/api/tags",
      actions: [
        "Verify your local firewall is not blocking localhost port 11434",
        "Check if the model is exceptionally large and taking too long to load into memory",
        installRoute === 'docker' ? "Ensure the Docker container exposes and maps port 11434 to the host" : "Check the OLLAMA_HOST environment variable bindings"
      ],
      avoid: [
        "Do not expose OLLAMA_HOST to 0.0.0.0 on a public network without an authentication proxy",
        "Do not decrease the client timeout settings further"
      ]
    };
  } else if (category === 'cuda_error') {
    result = {
      title: "💥 VRAM Exhaustion / CUDA Error",
      verdict: "The selected model exceeds the available physical VRAM, or the GPU execution backend (CUDA/Metal/ROCm) failed to allocate memory.",
      command: os === 'macos_silicon' ? "sudo asitop" : os === 'windows' ? "nvidia-smi -l 1" : "nvtop",
      actions: [
        "Select a lower precision quantization (e.g., Q4_K_M instead of Q8_0)",
        "Close browser tabs and background applications consuming GPU memory",
        "Reduce the context window size in your inference parameters"
      ],
      avoid: [
        "Do not force full CPU offloading if real-time token streaming is required",
        "Do not ignore CUDA out-of-memory errors; restarting the daemon is required"
      ]
    };
  }

  return result;
};

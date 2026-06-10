
/**
 * VRAM Calculation Utilities
 */

export const calculateWeightMemory = (paramsBillion, bits) => {
  // 1 Billion parameters = 10^9 parameters
  // Memory = (params * bits) / 8 bytes
  // Convert to GB: / 1024^3
  // Add 1.15 overhead buffer
  const bytes = (paramsBillion * 1e9 * bits) / 8;
  const gb = bytes / Math.pow(1024, 3);
  return gb * 1.15;
};

export const calculateKVCache = (batchSize, contextLength, numLayers, numHeadsKV, headDim, precisionBits) => {
  // KV Cache = 2 (Key & Value) * batch * context * layers * heads_kv * head_dim * (precisionBits / 8)
  const bytes = 2 * batchSize * contextLength * numLayers * numHeadsKV * headDim * (precisionBits / 8);
  return bytes / Math.pow(1024, 3);
};

export const calculateActivationOverhead = (paramsBillion, contextLength, flashAttention) => {
  // Simplified activation overhead estimation
  // FlashAttention is O(s), Vanilla is O(s^2)
  const baseOverhead = (paramsBillion * 0.1); // Base overhead in GB
  if (flashAttention) {
    return baseOverhead + (contextLength * 0.00005); // Linear scaling
  } else {
    return baseOverhead + (Math.pow(contextLength, 2) * 0.00000001); // Quadratic scaling
  }
};

export const calculateTotalVRAM = (weights, kvCache, activation) => {
  return (weights + kvCache + activation) * 1.15; // 15% safety buffer
};

export const getHardwareCompatibility = (totalVRAM) => {
  const gpus = [
    { name: 'RTX 4060', vram: 8, type: 'Consumer' },
    { name: 'RTX 4070', vram: 12, type: 'Consumer' },
    { name: 'RTX 4080', vram: 16, type: 'Consumer' },
    { name: 'RTX 4090', vram: 24, type: 'Consumer' },
    { name: 'MacBook Pro M3 Max', vram: 36, type: 'Apple Silicon' },
    { name: 'Mac Studio M2 Ultra', vram: 192, type: 'Apple Silicon' },
    { name: 'NVIDIA A100', vram: 80, type: 'Professional' },
    { name: 'NVIDIA H100', vram: 80, type: 'Professional' }
  ];

  return gpus.map(gpu => {
    const usagePercent = (totalVRAM / gpu.vram) * 100;
    let status = 'incompatible';
    if (usagePercent <= 60) status = 'optimal';
    else if (usagePercent <= 80) status = 'recommended';
    else if (usagePercent <= 100) status = 'tight';

    return {
      ...gpu,
      compatible: totalVRAM <= gpu.vram,
      usagePercent,
      status
    };
  });
};

export const getMemoryColor = (totalVRAM) => {
  if (totalVRAM <= 8) return 'bg-secondary text-secondary-foreground'; // Green
  if (totalVRAM <= 16) return 'bg-primary text-primary-foreground'; // Blue
  if (totalVRAM <= 24) return 'bg-accent text-accent-foreground'; // Orange
  return 'bg-destructive text-destructive-foreground'; // Red
};

import { Wllama } from "@wllama/wllama/esm/wllama";
import { Template } from "@huggingface/jinja";

import wllamaSingle from "@wllama/wllama/esm/single-thread/wllama.wasm?url";
import wllamaMulti from "@wllama/wllama/esm/multi-thread/wllama.wasm?url";

const CHAT_TEMPLATE =
  "{% for message in messages %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}";

export const CHAT_ROLE = Object.freeze({
  assistant: "assistant",
  user: "user",
});

const isLocalHost = ["localhost", "0.0.0.0", "127.0.0.1"].includes(window.location.hostname);

export const PRESET_MODELS = {
  // https://huggingface.co/lmstudio-community/SmolLM2-360M-Instruct-GGUF
  "SmolLM2 (360M)": {
    name: "SmolLM2 (360M)",
    url: isLocalHost
      ? "/models/SmolLM2-360M-Instruct-Q4_K_M.gguf"
      : "https://huggingface.co/lmstudio-community/SmolLM2-360M-Instruct-GGUF/resolve/main/SmolLM2-360M-Instruct-Q4_K_M.gguf",
    license: "https://huggingface.co/HuggingFaceTB/SmolLM2-360M#license",
    description: "Higher quality and more accurate than the 135M version",
  },
  // https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF
  "Qwen2.5 (0.5B)": {
    name: "Qwen2.5 (0.5B)",
    url: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf",
    license: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/blob/main/LICENSE",
    description: "The 0.5B version of Qwen2.5",
  },
  // https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF
  "Llama 3.2 (1B)": {
    name: "Llama 3.2 (1B)",
    url: "https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF/resolve/main/llama-3.2-1b-instruct-q4_k_m.gguf",
    license: "https://raw.githubusercontent.com/meta-llama/llama-models/refs/heads/main/models/llama3_2/LICENSE",
    description: "The 1B version of The Meta Llama 3.2 collection.",
  },
  // https://huggingface.co/collections/tiiuae/falcon3-67605ae03578be86e4e87026
  "Falcon3 (1B)": {
    name: "Falcon3 (1B)",
    url: "https://huggingface.co/tiiuae/Falcon3-1B-Instruct-GGUF/resolve/main/Falcon3-1B-Instruct-q4_k_m.gguf",
    license: "https://falconllm.tii.ae/terms-and-conditions.html",
    description: "The 1B version of Falcon3 family of Open Foundation Models",
  },
  // https://huggingface.co/collections/tiiuae/falcon3-67605ae03578be86e4e87026
  "Falcon3 (1B)": {
    name: "Falcon3 (1B)",
    url: "https://huggingface.co/tiiuae/Falcon3-1B-Instruct-GGUF/resolve/main/Falcon3-1B-Instruct-q4_k_m.gguf",
    license: "https://falconllm.tii.ae/terms-and-conditions.html",
    description: "The 1B version of Falcon3 family of Open Foundation Models",
  },
  "Deepseek R1 (1.5B)": {
    name: "Deepseek R1 (1.5B)",
    url: "https://huggingface.co/bartowski/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q4_K_M.gguf",
    license: "https://huggingface.co/deepseek-ai/DeepSeek-R1#7-license",
    description: "The 1.5B version of Deepseek R1",
  }
};

export const formatChat = async (wllamaInstance, messages) => {
  const template = new Template(wllamaInstance.getChatTemplate() ?? CHAT_TEMPLATE);
  return template.render({
    messages,
    bos_token: await wllamaInstance.detokenize([wllamaInstance.getBOS()]),
    eos_token: await wllamaInstance.detokenize([wllamaInstance.getEOS()]),
    add_generation_prompt: true,
  });
};

export const getWllamaInstance = () =>
  new Wllama({
    "single-thread/wllama.wasm": wllamaSingle,
    "multi-thread/wllama.wasm": wllamaMulti,
  });

# How it works

An AI chat is a way to interact with a [Large Language Model (LLM)](https://www.cloudflare.com/learning/ai/what-is-large-language-model/). When you send a message, the LLM processes it through a step called "inference" - this is simply the process where the AI reads your input and generates a response.

When you use services like [ChatGPT](https://chatgpt.com/), [Claude](https://claude.ai/), or [Gemini](https://gemini.google.com/), your messages are sent to their servers, where the inference happens, and then the response is sent back to your browser. On the other hand, when you use tools like [Ollama](https://ollama.ai/) or [LMStudio](https://lmstudio.ai/), the inference happens right on your own computer, using your GPU or CPU to process the responses.

**We take a different approach: all the processing happens directly in your web browser. We use [Wllama](https://github.com/ngxson/wllama/) to run the AI model inference right here in your browser (even when offline) using your computer's CPU.**

## How to Chat Privately, Offline with your AI assistant


### Option 1 (Manual)

1. Download a GGUF model file from HuggingFace. Here are some recommended picks:

- [SmolLm 135M](https://huggingface.co/neopolita/smollm-135m-instruct-gguf/resolve/main/smollm-135m-instruct_q8_0.gguf?download=true) by HuggingFace 
- [Qwen 2.5 0.5B](https://huggingface.co/lmstudio-community/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/Qwen2.5-0.5B-Instruct-Q4_K_M.gguf?download=true) by Alibaba
- [Llama 3.2 1B](https://huggingface.co/hugging-quants/Llama-3.2-1B-Instruct-Q4_K_M-GGUF/resolve/main/llama-3.2-1b-instruct-q4_k_m.gguf?download=true) by Meta

2. Visit https://private-ai-chat-assistant.vercel.app/
3. Select the downloaded model file you downloaded

![Select downloaded model](https://github.com/user-attachments/assets/769c746f-288e-43d1-a712-89cbedb49295)

4. Start chatting. 

    _No information will be sent to any server (You can go offline as long as the page is already loaded)_

### Option 2 (Auto)

1. Visit https://private-ai-chat-assistant.vercel.app/
2. Start chatting. 

    _The model file will be downloaded automatically and cached to your browser, after that you can chat offline._ 

    _**NOTE: If the browser cache gets cleared, the model file will be downloaded AGAIN before chatting**_


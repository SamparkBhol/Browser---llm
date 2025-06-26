/**
 * The approach used in this code is to consolidate all the logic in a single component.
 * This was done to focus on more on demonstration of the concept. Its is wise and welcome to refactor
 * the code to suit your needs.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { CHAT_ROLE as ROLE, formatChat, getWllamaInstance, PRESET_MODELS } from "./lib/wllama";
import { Box, Callout, Container, DropdownMenu, Flex, Link, ScrollArea, Text, TextField } from "@radix-ui/themes";
import { ArrowRightIcon, DocumentDuplicateIcon, PencilSquareIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { StopCircleIcon } from "@heroicons/react/24/solid";
import Markdown from "./components/Markdown";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import NavLink from "./components/NavLink";
import Dropdown from "./components/Dropdown";
import IconButton from "./components/IconButton";

const ELLIPSIS = "...";
const DEFAULT_MODEL_ID = Object.keys(PRESET_MODELS)[0];

const preventClickAction = (e) => e.preventDefault();
// eslint-disable-next-line no-console
const copyToClipboard = (text) => navigator.clipboard.writeText(text).catch((e) => console.error(e));
const getCalloutProps = (role) =>
  role === "user" ? { variant: "soft" } : { variant: "outline", className: "no-box-shadow", highContrast: true };

const messageIdGenerator = (function* () {
  let id = 0;
  while (true) {
    yield `msg-${id++}`;
  }
})();

const modelStateDefaults = {
  isLoading: false,
  isReady: false,
  modelId: DEFAULT_MODEL_ID,
  loadingProgress: 0,
};

function App() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [{ isLoading, isReady, modelId, loadingProgress }, setModelState] = useState(modelStateDefaults);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [localModelFiles, setLocalModelFiles] = useState([]);
  const selectedModel = localModelFiles.length
    ? { name: localModelFiles[0].name, url: "file", license: "" }
    : PRESET_MODELS[modelId];

  const wllama = useMemo(() => getWllamaInstance(), [selectedModel.name]);

  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadModel = async () => {
    setModelState((current) => ({ ...current, isLoading: true }));
    const options = {
      useCache: true,
      allowOffline: true,
      progressCallback: (progress) =>
        setModelState((current) => ({
          ...current,
          loadingProgress: progress,
        })),
    };
    await wllama.exit();
    if (localModelFiles.length) {
      await wllama.loadModel(localModelFiles, options);
    } else {
      await wllama.loadModelFromUrl(selectedModel.url, options);
    }
    setModelState((current) => ({
      ...modelStateDefaults,
      isReady: true,
      modelId: current.modelId,
    }));
  };

  useEffect(
    function scrollChatToBottom() {
      const timeout = setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 0);
      return () => clearTimeout(timeout);
    },
    [messages]
  );
  useEffect(() => () => wllama.exit(), []);

  const streamMessages = (prompt) => {
    setMessages((current) => [
      ...current,
      { role: ROLE.user, content: prompt.trim(), id: messageIdGenerator.next().value },
      { role: ROLE.assistant, content: ELLIPSIS, id: messageIdGenerator.next().value },
    ]);
    return (token, piece, text) =>
      setMessages((current) => {
        const updatedMessages = [...current];
        updatedMessages[updatedMessages.length - 1].content = text;
        return updatedMessages;
      });
  };

  const submitPrompt = async () => {
    const onNewToken = streamMessages(prompt);
    setIsGenerating(true);
    if (!isReady) await loadModel();
    const latestMessages = [...messages].slice(-3);
    const formattedChat = await formatChat(wllama, [
      ...latestMessages,
      { role: ROLE.user, content: prompt.trim(), id: messageIdGenerator.next().value },
    ]);
    await wllama.createCompletion(formattedChat, {
      nPredict: 512,
      sampling: { temp: 0.5, penalty_repeat: 1.3 },
      onNewToken,
    });
    setIsGenerating(false);
    setPrompt("");
  };

  const handleOnPressEnter = (e) => (e.key === "Enter" ? submitPrompt() : null);

  const handlePromptInputChange = (e) => setPrompt(e.target.value);

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    if (!files.length) {
      return;
    }
    setLocalModelFiles(files);
    setModelState({ ...modelStateDefaults, modelId: "file" });
  };

  const handleOnNewChatClick = () => setMessages([]);

  const handleReadAloudClick = (text) => {
    if ("speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsReadingAloud(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsReadingAloud(true);
      utterance.onend = () => setIsReadingAloud(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getMenuOptionHandler = (modelId) => () => {
    setLocalModelFiles([]);
    setModelState({ ...modelStateDefaults, modelId });
  };

  const isBusy = isLoading || isGenerating;
  const shouldDisableSubmit = isBusy || prompt.trim().length === 0;
  const loadedSize = loadingProgress.loaded || 0;
  const totalSize = loadingProgress.total || 100;
  const loadingProgressDisplayString = `${Math.floor((loadedSize / totalSize) * 100)}%`;
  const modelSizeDisplayString = totalSize ? `(${Math.ceil(totalSize / 1024 / 1024)}MB)` : "";

  return (
    <Box p={{ initial: "1", md: "3" }}>
      <Flex direction="column">
        <Flex direction="row" align="center" justify="between" asChild>
          <header>
            <Flex gap="4" align="center">
              <IconButton tooltip="New Chat" onClick={handleOnNewChatClick} disabled={isBusy} variant="ghost">
                <PencilSquareIcon width="24" />
              </IconButton>
              <Dropdown label={selectedModel.name}>
                {Object.values(PRESET_MODELS).map(({ name, description }) => (
                  <DropdownMenu.Item
                    key={name}
                    disabled={name === selectedModel.name}
                    title={description}
                    onClick={getMenuOptionHandler(name)}>
                    {name}
                  </DropdownMenu.Item>
                ))}
                {localModelFiles.length > 0 && <DropdownMenu.Item disabled>{selectedModel.name}</DropdownMenu.Item>}
                <DropdownMenu.Separator />
                <DropdownMenu.Item asChild onSelect={preventClickAction}>
                  <label title="Select your own local GGUF file">
                    Select GGUF file (2GB Max)...
                    <input
                      type="file"
                      accept=".gguf"
                      disabled={isBusy}
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      hidden
                    />
                  </label>
                </DropdownMenu.Item>
              </Dropdown>
            </Flex>
            <Box>
              <NavLink href="https://huggingface.co/models?library=gguf&pipeline_tag=text-generation">
                Download Models
              </NavLink>
              &nbsp;&bull;&nbsp;
              <NavLink href="https://github.com/nadchif/in-browser-llm-inference">Github</NavLink>
            </Box>
          </header>
        </Flex>
        <Container size="2">
          <Box minHeight="20vh" py="2">
            {messages.length ? (
              <ScrollArea type="hover" scrollbars="vertical" className="messages-container" ref={messagesContainerRef}>
                {messages.map(({ content, role, id }, index) => {
                  const isLastMessage = index === messages.length - 1;
                  return (
                    <Box key={id} pl={role === "user" ? "9" : 0} pr="3">
                      <Callout.Root {...getCalloutProps(role)}>
                        <Callout.Text size="3" asChild>
                          <div>
                            {content !== ELLIPSIS && <Markdown>{content}</Markdown>}
                            {role === ROLE.assistant &&
                              (isLastMessage && isGenerating ? null : (
                                <Flex py="3" gap="4">
                                  <IconButton
                                    tooltip="Read"
                                    onClick={() => handleReadAloudClick(content)}
                                    variant="ghost">
                                    {isReadingAloud ? <StopCircleIcon width="20" /> : <SpeakerWaveIcon width="20" />}
                                  </IconButton>
                                  <IconButton tooltip="Copy" onClick={() => copyToClipboard(content)} variant="ghost">
                                    <DocumentDuplicateIcon width="20" />
                                  </IconButton>
                                </Flex>
                              ))}
                          </div>
                        </Callout.Text>
                      </Callout.Root>
                    </Box>
                  );
                })}
                {isLoading && loadedSize > 0 && (
                  <Text as="div" size="2">
                    <b>{loadingProgressDisplayString}</b> Downloading model file {modelSizeDisplayString} to your
                    computer. This happens only the first time you load the model.
                  </Text>
                )}
                <Loader isLoading={isGenerating && !isLoading} />
              </ScrollArea>
            ) : (
              <Box className="welcome-text" pb="5">
                <Text size="7" align="center" asChild>
                  <h1 className="scale-up-center">Hi, how may I help you?</h1>
                </Text>
              </Box>
            )}
          </Box>
          <Box>
            <TextField.Root
              value={prompt}
              onKeyDown={handleOnPressEnter}
              onChange={handlePromptInputChange}
              placeholder="Enter your prompt here"
              maxLength={512}
              disabled={isBusy}
              variant="soft"
              radius="full"
              size="3"
              className="no-outline">
              <TextField.Slot side="right" pr="1">
                <IconButton
                  size="2"
                  variant="solid"
                  title="submit"
                  onClick={submitPrompt}
                  disabled={shouldDisableSubmit}
                  loading={isGenerating}
                  highContrast>
                  <ArrowRightIcon height="16" width="16" />
                </IconButton>
              </TextField.Slot>
            </TextField.Root>
          </Box>
          <Box pt="2" pb="4">
            <Text as="div" align="center" size="1" color="gray">
              &#9888; Models can make mistakes, always double-check responses. &bull;&nbsp;
              <Link href={selectedModel.url} target="_blank" rel="noopener" download highContrast>
                Model
              </Link>
              &nbsp;&bull;&nbsp;
              <Link href={selectedModel.license} target="_blank" rel="noopener" highContrast>
                License
              </Link>
            </Text>
          </Box>
          <Footer />
        </Container>
      </Flex>
    </Box>
  );
}

export default App;

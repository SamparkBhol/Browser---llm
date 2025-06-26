import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Box, Button, Callout, Code, Flex, Text, Tooltip } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import { Light } from "react-syntax-highlighter";
import { atomOneDark as style } from "react-syntax-highlighter/dist/esm/styles/hljs";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import go from "react-syntax-highlighter/dist/esm/languages/hljs/go";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import bash from "react-syntax-highlighter/dist/esm/languages/hljs/bash";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import sql from "react-syntax-highlighter/dist/esm/languages/hljs/sql";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";
import java from "react-syntax-highlighter/dist/esm/languages/hljs/java";
import kotlin from "react-syntax-highlighter/dist/esm/languages/hljs/kotlin";
import c from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import cpp from "react-syntax-highlighter/dist/esm/languages/hljs/cpp";
import csharp from "react-syntax-highlighter/dist/esm/languages/hljs/csharp";

const codeStyle = {
  ...style,
  hljs: { ...style.hljs, fontSize: "0.8rem", lineHeight: "0.9rem", background: "transparent", width: "100%" },
};

Light.registerLanguage("javascript", js);
Light.registerLanguage("typescript", typescript);
Light.registerLanguage("python", python);
Light.registerLanguage("go", go);
Light.registerLanguage("php", php);
Light.registerLanguage("html", xml);
Light.registerLanguage("css", css);
Light.registerLanguage("bash", bash);
Light.registerLanguage("json", json);
Light.registerLanguage("sql", sql);
Light.registerLanguage("yaml", yaml);
Light.registerLanguage("java", java);
Light.registerLanguage("kotlin", kotlin);
Light.registerLanguage("c", c);
Light.registerLanguage("cpp", cpp);
Light.registerLanguage("csharp", csharp);

function Markdown({ children, ...markdownProps }) {
  const content = children.trim();

  return (
    <ReactMarkdown
      {...markdownProps}
      components={{
        p({ children }) {
          return <Text as="p">{children}</Text>;
        },
        pre({ children }) {
          return (
            <Callout.Root variant="surface">
              <Box maxWidth={"80vw"} width={{ initial: "480px", md: "576px" }} as="div">
                <Flex justify="between">
                  <Text>&nbsp;</Text>{" "}
                  <Tooltip content="Copy">
                    <Button size="1" variant="ghost">
                      <DocumentDuplicateIcon width="16" />
                      Copy Code
                    </Button>
                  </Tooltip>
                </Flex>
                {children}
              </Box>
            </Callout.Root>
          );
        },
        code({ children, className }) {
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <Light PreTag="div" language={match[1]} wrapLines wrapLongLines style={codeStyle}>
              {String(children).replace(/\n$/, "")}
            </Light>
          ) : (
            <Code>{children}</Code>
          );
        },
        h1: "p",
        h2: "p",
        h3: "p",
        h4: "p",
        h5: "p",
        h6: "p",
      }}>
      {content}
    </ReactMarkdown>
  );
}

export default Markdown;

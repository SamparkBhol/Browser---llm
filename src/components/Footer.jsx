import { Link, Text } from "@radix-ui/themes";

function Footer() {
  return (
    <Text weight="bold" align="center" color="gray" size={{ initial: "1", md: "2" }} asChild>
      <footer>
        Did you know? This chatbot runs entirely in your browser. No data is sent to any server.&nbsp;
        <Link href="https://github.com/nadchif/in-browser-llm-inference/blob/main/HOWTO.md" target="_blank">
          Learn more.
        </Link>
      </footer>
    </Text>
  );
}

export default Footer;

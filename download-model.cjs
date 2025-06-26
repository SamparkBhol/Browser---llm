if (process.env.SKIP_DOWNLOAD_MODEL) {
  console.log("Skipping model download");
  return;
}

const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

const fileName = "SmolLM2-360M-Instruct-Q4_K_M.gguf";
const fileUrl = `https://huggingface.co/lmstudio-community/SmolLM2-360M-Instruct-GGUF/resolve/main/${fileName}`;
const destination = path.join(__dirname, `public/models/${fileName}`);

// ✅ Ensure folder exists
const dirPath = path.dirname(destination);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// Skip if already downloaded
if (fs.existsSync(destination)) {
  console.log(`Skipping download. Model file ${destination} already exists`);
  return;
}

// ✅ Download
console.log("Downloading " + fileUrl);
fetch(fileUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const total = parseInt(response.headers.get("content-length"), 10);
    let downloaded = 0;

    const fileStream = fs.createWriteStream(destination);

    return new Promise((resolve, reject) => {
      response.body
        .on("data", (chunk) => {
          downloaded += chunk.length;
          const percentage = ((downloaded / total) * 100).toFixed(2);
          process.stdout.write(`Downloading ${fileName}: ${percentage}%\r`);
        })
        .on("end", () => {
          console.log("\n✅ File downloaded successfully!");
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        })
        .pipe(fileStream);
    });
  })
  .catch((err) => {
    console.error("❌ Download failed:", err.message);
    console.info("You may need to manually download the model:");
    console.info(fileUrl);
  });

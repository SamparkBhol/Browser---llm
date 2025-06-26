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
// check if file exists
if (fs.existsSync(destination)) {
  console.log(`Skipping download. Model file ${destination} already exists`);
  return;
}

console.log("Downloading " + fileUrl);
fetch(fileUrl)
  .then((response) => {
    // Check if the response is OK (status code 200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Get the total content length from the headers
    const total = parseInt(response.headers.get("content-length"), 10);
    let downloaded = 0;

    // Create a writable stream to the destination file
    const fileStream = fs.createWriteStream(destination);

    return new Promise((resolve, reject) => {
      // Pipe the response body into the file stream
      response.body
        .on("data", (chunk) => {
          downloaded += chunk.length;
          const percentage = ((downloaded / total) * 100).toFixed(2);
          process.stdout.write(`Downloading ${fileName}: ${percentage}%\r`);
        })
        .on("end", () => {
          console.log("\nFile downloaded successfully!");
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        })
        .pipe(fileStream);
    });
  })
  .catch((err) => {
    console.log(err);
    console.error(
      "------\r\nAn error during downloading '" +
        fileName +
        "'.\r\nYOU MAY NEED TO MANUALLY DOWNLOAD THE FILE ON YOUR OWN INSTEAD"
    );
    console.info("\r\n\r\nDownload " + fileUrl + " and add it to the 'public/models' folder------");
  });

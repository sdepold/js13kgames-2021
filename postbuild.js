const fs = require("fs");
const archiver = require("archiver");
const { execFile, execFileSync } = require("child_process");

(async () => {
  execFileSync("npx", [
    "roadroller",
    "-O2",
    "./dist/main.js",
    "-o",
    "./dist/main.new.js",
  ]);
  const compactJs = fs
    .readFileSync("./dist/main.new.js")
    .toString()
    .split("\n")
    .join("");
  const mainHtml = fs.readFileSync("./dist/index.html").toString();
  const newHtml = mainHtml.replace(
    /<script>(.*)<\/script>/,
    `<script>${compactJs}</script>`
  );

  fs.writeFileSync("./dist/index.html", newHtml);
  fs.unlinkSync("./dist/main.js");
  fs.unlinkSync("./dist/main.new.js");
  fs.unlinkSync("./dist/main.css");

  const zipDist = "./dist/build.zip";
  let output = fs.createWriteStream(zipDist);
  let archive = archiver("zip", {
    zlib: { level: 9 }, // set compression to best
  });

  const MAX = 13 * 1024; // 13kb

  output.on("close", function () {
    let bytes = archive.pointer();
    let percent = ((bytes / MAX) * 100).toFixed(2);

    console.log(`Normal zip size: ${bytes} bytes (${percent}%)`);
    execFile("./bin/ect", ["-9", "-zip", zipDist], (err) => {
      const stats = fs.statSync(zipDist);
      bytes = stats.size;
      percent = ((bytes / MAX) * 100).toFixed(2);

      if (bytes > MAX) {
        console.error(`ect size overflow: ${bytes} bytes (${percent}%)`);
      } else {
        console.log(`ect size: ${bytes} bytes (${percent}%)`);
      }
    });
  });

  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on("error", function (err) {
    throw err;
  });

  archive.pipe(output);
  archive.append(fs.createReadStream("./dist/index.html"), {
    name: "index.html",
  });

  // fs.readdirSync("./dist").filter(f => f.endsWith("gif")).forEach(file => {
  //   archive.append(fs.createReadStream(`./dist/${file}`), {
  //     name: file
  //   });
  // });

  archive.finalize();
})();

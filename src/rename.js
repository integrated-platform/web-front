const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "src");

function renameFiles(dir) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(dir, file);

      fs.stat(filePath, (err, stat) => {
        if (err) throw err;

        if (stat.isDirectory()) {
          renameFiles(filePath); // Recursively rename files in subdirectories
        } else if (file.endsWith(".js")) {
          const newFilePath = filePath.replace(/\.js$/, ".jsx");
          fs.rename(filePath, newFilePath, (err) => {
            if (err) throw err;
            console.log(`Renamed: ${filePath} -> ${newFilePath}`);
          });
        }
      });
    });
  });
}

renameFiles(directoryPath);
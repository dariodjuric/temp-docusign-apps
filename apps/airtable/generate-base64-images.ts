import path from 'path';
import fs from 'fs';

// Get the directory from the command-line arguments
const inputDir = process.argv[2];

if (!inputDir) {
  console.error('Please provide a directory as an argument.');
  process.exit(1);
}

// Ensure the provided path is a directory
if (!fs.existsSync(inputDir) || !fs.lstatSync(inputDir).isDirectory()) {
  console.error('The provided path is not a valid directory.');
  process.exit(1);
}

// Function to convert a file to Base64 and write a TypeScript file
function convertPngToBase64(pngFilePath: string) {
  const fileContent = fs.readFileSync(pngFilePath);
  const base64String = fileContent.toString('base64');

  const tsContent =
    `// Auto-generated TypeScript file\n` +
    `// Contains base64 string of ${path.basename(pngFilePath)}\n\n` +
    `const base64Image = "${base64String}";\n\n` +
    `export default base64Image;\n`;

  const tsFilePath = path.join(
    path.dirname(pngFilePath),
    `${path.basename(pngFilePath, '.png')}.ts`,
  );

  fs.writeFileSync(tsFilePath, tsContent, 'utf8');
  console.log(`Generated TypeScript file: ${tsFilePath}`);
}

// Read all files from the provided directory and filter PNGs
const files = fs
  .readdirSync(inputDir)
  .filter(file => path.extname(file).toLowerCase() === '.png');

// Convert each PNG to base64 and write the TypeScript file
files.forEach(file => {
  const filePath = path.join(inputDir, file);
  convertPngToBase64(filePath);
});

console.log('All PNG files have been processed.');

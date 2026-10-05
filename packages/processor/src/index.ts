import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputDir = 'input'
const outputDir = 'output'

const run = async () => {
  const files = await readdir(inputDir)
  for (const file of files){
    if(!file.toLowerCase().endsWith('.png')){
      continue
    }

    const input = path.join(inputDir,file)
    const output = path.join(
      outputDir,
      path.parse(file).name + '.avif'
    )

    await sharp(input)
      .resize({
        width: 2800,
        height: 2800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .avif({quality: 50})
      .toFile(output)
    
    console.log(`PROCESSED ${file} TO AVIF`)
  }
}
try {
  run()  
} catch (error) {
  console.log("ERROR")
  console.log(error)
}

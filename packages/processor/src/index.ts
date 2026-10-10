import fs from 'node:fs'
import { createObjectCsvWriter } from "csv-writer";
import { createHash } from "node:crypto";
import { readdir,readFile, rename,stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { parse } from 'csv-parse/sync';

const inputDir = 'input'
const outputDir = 'output'

// processor
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

//metadata + hash
const capture = async(dirPath: string,fileType:string) => {

  const csvWriter = createObjectCsvWriter({
    path:path.join(dirPath,'processed_image_metadata.csv'),
    header:[
      {id:'filename',title:'Filename'},
      {id:'size',title:'Size'},
      {id:'height', title: 'Height'},
      {id:'width',title:'Width'},
      {id:'hasAlpha',title:'Has_Alpha'},
      {id:'hash',title:'Hash'},
      {id:'format',title:'Format'}
    ]
  })

  const images = []

  const files = await readdir(dirPath)
  for(const file of files){
    if(!file.toLowerCase().endsWith('.png')) {
      console.log(`File ${file} does not end with ${'.png'}`)
      continue
    }
    const input = path.join(dirPath,file)
    console.log('IMAGE PATH: ',input )
    const filePath = await readFile(input)
    // console.log("FILEPATH: ", filePath)
    const hash = createHash('sha256')
      .update(filePath)
      .digest('hex')
    // console.log("HASH: ", hash)
    const mime = `image/${file.replace(".","")}`
    const { format, height, width, hasAlpha  } = await sharp(input).metadata()
    const { size } = await stat(input)
    // console.log("FORMAT: ",format)
    images.push({
      filename:file,
      size,
      height,
      width,
      hasAlpha,
      mime,
      hash,
      format
    })
    await rename(input, path.join(
      dirPath,
      hash + fileType
    ))
  }
  csvWriter.writeRecords(images)
}

/*
  id: uuid('id').defaultRandom().primaryKey(),
  hash: varchar('hash').unique().notNull(),
  storageKey: varchar('storage_key').unique().notNull(),
  mime: varchar('mime', { length: 64 }).notNull(),
  format: varchar('format', { length: 16 }).notNull(),
  size: integer('size').notNull(),
  height: varchar('height').notNull(),
  width: varchar('width').notNull(),
  hasAlpha: boolean('has_alpha').notNull()
*/

type CsvRow = {
  Filename: string,
  Size: number,
  Hash: string,
  Height: number,
  Width: number,
  Has_Alpha: string,
  Format: 'heif' | 'png'
}

const generate_import = async(dirName:string, fileType: ".png"|".avif") => {
  const outputPath = '../server/src/db/outputValues.ts'
  // Read one csv
  const csv = fs.readFileSync(path.join(dirName,'processed_image_metadata.csv'), 'utf-8')
  // Parse the data of each record
  const rows = parse<CsvRow>(csv, {
    columns: true,
    skip_empty_lines: true
  })
  console.log(rows)
  const values = rows.map(row => ({
    hash: row.Hash,
    storageKey: 'products/renderings/'+ row.Hash + fileType,
    mime: 'image/' + fileType.replace(".",""),
    format: row.Format,
    size: Number(row.Size),
    height: Number(row.Height),
    width: Number(row.Width),
    hasAlpha: row.Has_Alpha === 'true',
  }))
  console.log("values")
  console.log(values)
  // Write the array data into the output path
  const output = `export const output = ${JSON.stringify(values,null,2)};\n`
  fs.writeFileSync(outputPath, output)
}

try {
  generate_import('output','.avif')
} catch (error) {
  console.log("ERROR")
  console.log(error)
}




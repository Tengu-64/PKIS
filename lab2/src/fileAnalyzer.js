import fs from 'fs/promises'
import FileAnalysis from './FileAnalysis.js';

async function analyzeFile(filename) {
    try {
        const content = await fs.readFile(filename, 'utf-8')
        const wordCount = content.split(/\s+/).filter(Boolean).length;
        const charCount = content.length

        return new FileAnalysis(filename, wordCount, charCount)
    } catch (err) {
        console.log(`${filename}: ${err}`)
        return new FileAnalysis(filename, 0, 0)
    }
}

async function analyzeFiles(filenames) {
    const filesInfo = [];

    const promises = filenames.map(async (filename) => {
        const res = await analyzeFile(filename);
        if (res) {
            filesInfo.push(res)
        }
    })

    await Promise.all(promises)
    return filesInfo

}


export { analyzeFiles }
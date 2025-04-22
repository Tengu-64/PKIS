import { analyzeFiles } from './fileAnalyzer.js'

const filenames = process.argv.slice(2)

analyzeFiles(filenames).then((res) => {
    let totalWords = 0
    let totalChars = 0

    console.log("Результаты анализа:")

    res.forEach((file, i) => {
        console.log(`${i + 1}. ${file.filename}: ${file.wordCount} слов, ${file.charCount} символов`)
        totalWords += file.wordCount
        totalChars += file.charCount
    });

    console.log(`Итог: ${totalWords} слов, ${totalChars} символов`)
})
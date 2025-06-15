const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class FileAnalyzer {
  constructor(filePath, fileName) {
    this.filePath = filePath;
    this.fileName = fileName;
    this.resultFile = process.env.RESULT_FILE || 'analysis_result.txt';
  }

  async readFile() {
    try {
      this.content = await fs.readFile(this.filePath, 'utf-8');
    } catch (err) {
      throw new Error(`Ошибка чтения файла: ${err.message}`);
    }
  }

  analyze() {
    if (!this.content) throw new Error('Файл не загружен для анализа');

    this.lines = this.content.split(/\r?\n/).length;
    this.words = this.content.trim().split(/\s+/).filter(Boolean).length;
    this.chars = this.content.length;
  }

  async saveAnalysisResult() {
    const resultText = `Имя файла: ${this.fileName}\nСтрок: ${this.lines}, Слов: ${this.words}, Символов: ${this.chars}\n\n`;

    try {
      await fs.appendFile(this.resultFile, resultText);
    } catch (err) {
      throw new Error(`Ошибка записи результата анализа: ${err.message}`);
    }
  }

  async analyzeAndSave() {
    await this.readFile();
    this.analyze();
    await this.saveAnalysisResult();

    return {
      filename: this.fileName,
      lines: this.lines,
      words: this.words,
      chars: this.chars
    };
  }
}

module.exports = FileAnalyzer;

package handlers

import (
	"main/model"
	"strings"
)

// вспомогательные функции

var symbols = [...]string{",", ".", "(", ")", ";"}

func RemovePunctuation(text string) []string { // удаление знаков препинания
	cleanText := text
	for _, s := range symbols {
		cleanText = strings.ReplaceAll(cleanText, s, "")
	}
	cleanText = strings.ToLower(cleanText) //преобразование к нижнему регистру
	return strings.Fields(cleanText)       // возвращение массива слов в тексте
}

func WordCount(text, word string) model.LenWords { // подсчет общего количества слов, количества введенного слова в текст

	cleanText := RemovePunctuation(text)
	var sovp uint

	for _, ch := range cleanText {
		if ch == word {
			sovp++
		}
	}

	var res = model.LenWords{
		WordsLen:        uint(len(cleanText)),
		InputWordsCount: sovp,
	}

	return res
}

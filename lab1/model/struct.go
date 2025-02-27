package model

import "fmt"

type LenWords struct {
	WordsLen        uint
	InputWordsCount uint
}

func (wrds LenWords) WordsInfo() {
	fmt.Println("Всего", wrds.WordsLen, "слова. Введенное слово встречается", wrds.InputWordsCount, "раза")
}

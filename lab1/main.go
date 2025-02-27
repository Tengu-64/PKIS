package main

import (
	"fmt"
	"main/handlers"
	"os"
)

// type LenWords struct {
// 	wordsLen        uint
// 	inputWordsCount uint
// }

// func (wrds LenWords) WordsInfo() {
// 	fmt.Println("Всего", wrds.wordsLen, "слова. Введенное слово встречается", wrds.inputWordsCount, "раза")
// }

func main() {
	var path string
	fmt.Println("Введите путь к файлу:")
	fmt.Scan(&path)

	file, err := os.ReadFile(path)

	if err != nil {
		fmt.Println("Ошибка при чтении файла")
		os.Exit(1)
	}

	var word string
	fmt.Println("Введите слово для поиска:")

	//fmt.Println(string(file))
	res := handlers.WordCount(string(file), word)

	res.WordsInfo()

}

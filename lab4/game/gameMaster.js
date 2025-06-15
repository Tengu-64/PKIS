class GameMaster {
    constructor(codeLength = 4) {
        this.codeLength = codeLength;
        this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.secretCode = this.generateCode();
    }

    generateCode() {
        let code = '';
        for (let i = 0; i < this.codeLength; i++) {
            code += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        }
        return code;
    }

    checkGuess(guess) {
        if (guess.length !== this.codeLength) {
            throw new Error(`Guess must be ${this.codeLength} characters`);
        }

        let black = 0;
        let white = 0;
        const codeArr = this.secretCode.split('');
        const guessArr = guess.split('');
        const codeUsed = Array(this.codeLength).fill(false);
        const guessUsed = Array(this.codeLength).fill(false);

        for (let i = 0; i < this.codeLength; i++) {
            if (guessArr[i] === codeArr[i]) {
                black++;
                codeUsed[i] = true;
                guessUsed[i] = true;
            }
        }

        for (let i = 0; i < this.codeLength; i++) {
            if (guessUsed[i]) continue;
            for (let j = 0; j < this.codeLength; j++) {
                if (codeUsed[j]) continue;
                if (guessArr[i] === codeArr[j]) {
                    white++;
                    codeUsed[j] = true;
                    break;
                }
            }
        }

        return { black, white };
    }
}

module.exports = GameMaster;
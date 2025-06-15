const GameMaster = require('../game/GameMaster')
const XmlLogger = require('../utils/XmlLogger')
const { v4: uuidv4 } = require('uuid')

class GameSession {
    constructor(maxPlayers = 4, maxAttempts = 10, roundTimeSec = 180) {
        this.maxPlayers = maxPlayers
        this.maxAttempts = maxAttempts
        this.roundTimeSec = roundTimeSec

        this.players = new Map() // playerId -> { attempts, lastGuess, hasWon }
        this.playerOrder = []
        this.currentPlayerIndex = 0

        this.gameMaster = null
        this.roundStartTime = null
        this.roundTimer = null

        this.xmlLogger = new XmlLogger()
        this.roundActive = false
    }

    addPlayer() {
        if (this.players.size >= this.maxPlayers) {
            throw new Error('Maximum players reached')
        }
        const playerId = uuidv4()
        this.players.set(playerId, { attempts: 0, lastGuess: null, hasWon: false })
        this.playerOrder.push(playerId)

        if (this.players.size >= 2 && !this.roundActive) {
            this.startRound()
        }
        return playerId
    }

    startRound() {
        this.gameMaster = new GameMaster()
        this.roundStartTime = new Date()
        this.currentPlayerIndex = 0
        this.roundActive = true

        // Сброс попыток
        for (const player of this.players.values()) {
            player.attempts = 0
            player.hasWon = false
            player.lastGuess = null
        }

        // Запускаем таймер раунда
        if (this.roundTimer) clearTimeout(this.roundTimer)
        this.roundTimer = setTimeout(() => this.endRound(null), this.roundTimeSec * 1000)
    }

    getCurrentPlayer() {
        if (!this.roundActive) return null
        return this.playerOrder[this.currentPlayerIndex]
    }

    makeGuess(playerId, guess) {
        if (!this.roundActive) {
            throw new Error('Round not active')
        }

        if (playerId !== this.getCurrentPlayer()) {
            throw new Error('Not your turn')
        }

        const player = this.players.get(playerId)
        if (!player) throw new Error('Player not found')

        if (player.attempts >= this.maxAttempts) {
            throw new Error('Max attempts reached')
        }

        const result = this.gameMaster.checkGuess(guess);
        player.attempts++
        player.lastGuess = { guess, result }

        if (result.black === this.gameMaster.codeLength) {
            player.hasWon = true
            this.endRound(playerId)
        } else {
            this.nextTurn()
        }

        return result
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerOrder.length
    }

    getStatus(playerId) {
        return {
            yourTurn: playerId === this.getCurrentPlayer(),
            roundActive: this.roundActive,
            attemptsLeft: this.maxAttempts - (this.players.get(playerId)?.attempts || 0),
            lastGuess: this.players.get(playerId)?.lastGuess || null,
            players: Array.from(this.players.entries()).map(([id, data]) => ({
                id,
                attempts: data.attempts,
                hasWon: data.hasWon,
            })),
        }
    }

    async endRound(winnerId) {
        if (!this.roundActive) return;
        this.roundActive = false

        if (this.roundTimer) {
            clearTimeout(this.roundTimer);
            this.roundTimer = null
        }

        const endTime = new Date();
        const playersSummary = Array.from(this.players.entries()).map(([id, data]) => ({
            id,
            attempts: data.attempts,
        }))

        await this.xmlLogger.logRound({
            startTime: this.roundStartTime,
            endTime,
            secretCode: this.gameMaster.secretCode,
            players: playersSummary,
            winnerId,
        });

        // Через 10 секунд запускаем новый раунд, если есть минимум 2 игрока
        setTimeout(() => {
            if (this.players.size >= 2) {
                this.startRound();
            }
        }, 10000)
    }

    removePlayer(playerId) {
        this.players.delete(playerId)
        this.playerOrder = this.playerOrder.filter(id => id !== playerId)

        if (this.players.size < 2 && this.roundActive) {
            this.endRound(null)
        }

        if (this.currentPlayerIndex >= this.playerOrder.length) {
            this.currentPlayerIndex = 0
        }
    }
}

module.exports = GameSession
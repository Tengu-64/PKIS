const express = require('express');
const router = express.Router();
const GameSession = require('../services/GameSession');

const gameSession = new GameSession()

router.post('/join', (req, res) => {
    try {
        const playerId = gameSession.addPlayer()
        res.json({ playerId })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
});

router.post('/guess', express.json(), (req, res) => {
    const { playerId, guess } = req.body
    if (!playerId || !guess) return res.status(400).json({ error: 'playerId and guess required' })

    try {
        const result = gameSession.makeGuess(playerId.toString().toUpperCase(), guess.toUpperCase())
        res.json({ result })
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
});

router.get('/status/:playerId', (req, res) => {
    const { playerId } = req.params
    if (!playerId) return res.status(400).json({ error: 'playerId required' })

    try {
        const status = gameSession.getStatus(playerId)
        res.json(status)
    } catch (e) {
        res.status(400).json({ error: e.message })
    }
})

router.post('/leave', express.json(), (req, res) => {
    const { playerId } = req.body
    if (!playerId) return res.status(400).json({ error: 'playerId required' })

    gameSession.removePlayer(playerId)
    res.json({ message: 'Player removed' })
})

module.exports = router

const fs = require('fs').promises;
const { create } = require('xmlbuilder2');

class XmlLogger {
    constructor(filename = 'results.xml') {
        this.filename = filename
    }

    async logRound(data) {
        // data: { startTime, endTime, secretCode, players: [{id, attempts}], winnerId }

        let root

        try {
            const existing = await fs.readFile(this.filename, 'utf-8')
            root = create(existing).root()
        } catch {
            // если файла нет, создаём новый корень
            root = create({ version: '1.0' }).ele('Rounds')
        }

        const round = root.ele('Round')
        round.ele('StartTime').txt(data.startTime.toISOString())
        round.ele('EndTime').txt(data.endTime.toISOString())
        round.ele('SecretCode').txt(data.secretCode)

        const players = round.ele('Players')
        for (const p of data.players) {
            const player = players.ele('Player', { id: p.id })
            player.ele('Attempts').txt(p.attempts.toString())
        }

        round.ele('Winner').txt(data.winnerId ?? 'None')

        const xml = root.end({ prettyPrint: true })

        await fs.writeFile(this.filename, xml)
    }
}

module.exports = XmlLogger

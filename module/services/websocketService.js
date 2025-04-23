const WebSocket = require('ws');
const finalScoreService = require('./finalScoreService');
const logger = require('../../bin/helper/logger');

let wss;

function initialize(server) {
    wss = new WebSocket.Server({ server });
    
    wss.on('connection', (ws) => {
        logger.log('websocket-service', 'Client connected', 'connection');
        
        // Send initial data
        sendLatestScore(ws);
        
        ws.on('error', (error) => {
            logger.log('websocket-service', `WebSocket error: ${error}`, 'error');
        });
        
        ws.on('close', () => {
            logger.log('websocket-service', 'Client disconnected', 'connection');
        });
    });
}

async function sendLatestScore(ws) {
    try {
        const score = await finalScoreService.calculateFinalScore();
        ws.send(JSON.stringify({
            type: 'SCORE_UPDATE',
            data: score
        }));
    } catch (error) {
        logger.log('websocket-service', `Error sending score: ${error}`, 'error');
    }
}

function broadcastScore(score) {
    if (!wss) return;
    
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'SCORE_UPDATE',
                data: score
            }));
        }
    });
}

// Auto update every 5 minutes
const AUTO_UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

function startAutoUpdate() {
    setInterval(async () => {
        try {
            const score = await finalScoreService.calculateFinalScore();
            broadcastScore(score);
        } catch (error) {
            logger.log('websocket-service', `Auto update error: ${error}`, 'error');
        }
    }, AUTO_UPDATE_INTERVAL);
}

module.exports = {
    initialize,
    broadcastScore,
    startAutoUpdate
}; 
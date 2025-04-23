const Web3 = require('web3');
const logger = require('../../bin/helper/logger');
const global_config = require('../../bin/helper/global_config');

class SmartContractService {
    constructor() {
        this.web3 = new Web3(global_config.get('/blockchain/provider'));
        this.contractAddress = global_config.get('/blockchain/contractAddress');
        this.contractABI = require('../../contracts/FinalScore.json').abi;
        this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
    }

    async updateScore(score) {
        const ctx = 'smart-contract-service';
        try {
            // Convert score to blockchain format
            const blockchainScore = this.convertToBlockchainFormat(score);

            // Get account from private key
            const account = this.web3.eth.accounts.privateKeyToAccount(
                global_config.get('/blockchain/privateKey')
            );
            this.web3.eth.accounts.wallet.add(account);

            // Prepare transaction
            const tx = this.contract.methods.updateScore(
                blockchainScore.finalScore,
                blockchainScore.shortTermScore,
                blockchainScore.longTermScore,
                blockchainScore.indicators
            );

            // Estimate gas
            const gas = await tx.estimateGas({ from: account.address });

            // Send transaction
            const receipt = await tx.send({
                from: account.address,
                gas: gas
            });

            logger.log(ctx, `Score updated on blockchain. TX: ${receipt.transactionHash}`, 'blockchain');
            return receipt;

        } catch (error) {
            logger.log(ctx, `Error updating score on blockchain: ${error}`, 'error');
            throw error;
        }
    }

    convertToBlockchainFormat(score) {
        // Convert scores to fixed point numbers (multiply by 10^18 for solidity)
        const DECIMALS = 18;
        const MULTIPLIER = 10 ** DECIMALS;

        return {
            finalScore: Math.floor(score.final_score * MULTIPLIER),
            shortTermScore: Math.floor(score.short_term_score * MULTIPLIER),
            longTermScore: Math.floor(score.long_term_score * MULTIPLIER),
            indicators: score.indicators.map(indicator => ({
                name: this.web3.utils.asciiToHex(indicator.name),
                shortTerm: Math.floor(indicator.short_term * MULTIPLIER),
                longTerm: Math.floor(indicator.long_term * MULTIPLIER),
                weight: Math.floor(indicator.weight * MULTIPLIER),
                weightedScore: Math.floor(indicator.weighted_score * MULTIPLIER)
            }))
        };
    }
}

module.exports = new SmartContractService(); 
const finalScoreService = require("../services/finalScoreService");
const FinalScore = require("../models/FinalScore");

async function calculate(req, res) {
  try {
    const result = await finalScoreService.calculateFinalScore();
    res.status(200).json({
      message: "Final score calculated successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error calculating final score",
      error: error.message
    });
  }
}

async function getLatest(req, res) {
  try {
    const result = await FinalScore.findOne().sort({ timestamp: -1 });
    if (!result) {
      return res.status(404).json({
        message: "No final score found"
      });
    }
    res.status(200).json({
      message: "Latest final score retrieved successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving final score",
      error: error.message
    });
  }
}

module.exports = {
  calculate,
  getLatest
}; 
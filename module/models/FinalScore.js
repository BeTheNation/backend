const mongoose = require("mongoose");

const IndicatorScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short_term: { type: Number, required: true },
  long_term: { type: Number, required: true },
  weight: { type: Number, required: true },
  short_term_weighted: { type: Number, required: true },
  long_term_weighted: { type: Number, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const RiskAssessmentSchema = new mongoose.Schema({
  short_term_risk: { 
    type: String, 
    enum: ['LOW_RISK', 'LOW_MEDIUM_RISK', 'MEDIUM_RISK', 'MEDIUM_HIGH_RISK', 'HIGH_RISK'],
    required: true 
  },
  long_term_risk: { 
    type: String,
    enum: ['LOW_RISK', 'LOW_MEDIUM_RISK', 'MEDIUM_RISK', 'MEDIUM_HIGH_RISK', 'HIGH_RISK'],
    required: true 
  },
  overall_risk: { 
    type: String,
    enum: ['LOW_RISK', 'LOW_MEDIUM_RISK', 'MEDIUM_RISK', 'MEDIUM_HIGH_RISK', 'HIGH_RISK'],
    required: true 
  }
}, { _id: false });

const FinalScoreSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  indicators: [IndicatorScoreSchema],
  final_score: { type: Number, required: true },
  short_term_score: { type: Number, required: true },
  long_term_score: { type: Number, required: true },
  risk_assessment: { type: RiskAssessmentSchema, required: true }
}, {
  timestamps: true,
  collection: 'final_scores'
});

module.exports = mongoose.model('FinalScore', FinalScoreSchema); 
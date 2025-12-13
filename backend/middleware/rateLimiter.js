// backend/middleware/rateLimiter.js

// In-memory storage for daily limits
const userGenerations = new Map();

const DAILY_LIMIT = 100; // ← Change this number (was 3, now 100 for testing)

const checkDailyLimit = (req, res, next) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `${userIP}-${today}`;

  const count = userGenerations.get(key) || 0;

  if (count >= DAILY_LIMIT) {
    return res.status(429).json({
      success: false,
      message: `Daily limit reached (${DAILY_LIMIT} thumbnails/day). Sign up for more!`,
      remaining: 0
    });
  }

  req.generationCount = count;
  next();
};

const incrementUsage = (req) => {
  const userIP = req.ip;
  const today = new Date().toDateString();
  const key = `${userIP}-${today}`;
  
  const count = userGenerations.get(key) || 0;
  userGenerations.set(key, count + 1);
  
  return DAILY_LIMIT - (count + 1); // Remaining
};

// Export the Map so controller can access it
module.exports = { 
  checkDailyLimit, 
  incrementUsage,
  userGenerations,
  DAILY_LIMIT // ← Export this too
};
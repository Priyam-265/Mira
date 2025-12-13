const express = require('express');
const router = express.Router();
const { checkDailyLimit } = require('../middleware/rateLimiter');
const { 
  generateCreatorContent, 
  checkUsage, 
  generateCaption, 
  checkCaptionUsage,
  generateHashtags,
  checkHashtagUsage,
  removeBackground,
  checkBgRemovalUsage
} = require('../controllers/creatorController');

// Thumbnail routes
router.post('/generate', checkDailyLimit, generateCreatorContent);
router.get('/usage', checkUsage);

// Caption routes
router.post('/generate-caption', generateCaption);
router.get('/caption-usage', checkCaptionUsage);

// Hashtag routes
router.post('/generate-hashtags', generateHashtags);
router.get('/hashtag-usage', checkHashtagUsage);

// Background removal routes
router.post('/remove-background', removeBackground);
router.get('/bg-removal-usage', checkBgRemovalUsage);

module.exports = router;
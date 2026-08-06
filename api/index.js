const express = require('express');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

const GOOGLE_MAPS_REVIEWS_URL = 'https://maps.app.goo.gl/BpjjWKkSy26P5SF88';

module.exports = async (req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        'Accept-Language': 'ar' 
      }
    };

    const response = await fetch(GOOGLE_MAPS_REVIEWS_URL, options);
    const html = await response.text();

    const $ = cheerio.load(html);
    const reviews = [];

    $('.odb7Te').each((i, el) => {
      const name = $(el).find('.X54Nne').text().trim();
      
      const starsText = $(el).find('.wS892e').text().trim();
      const stars = parseInt(starsText.split(' ')[0]) || 5; 
      const text = $(el).find('.wiM76').text().trim();
      
      const date = $(el).find('.rsqaHe').text().trim();

      if (name && text) { 
        reviews.push({ name, stars, text, date });
      }
    });

    const formattedReviews = {
      title: "آراء عملائنا الحقيقية على قوقل ماب",
      count: reviews.length, 
      reviews: reviews
    };

    // إرسال البيانات
    return res.status(200).json(formattedReviews);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

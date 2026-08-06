const cors = require('cors')();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // رابط التقييمات المباشر لـ Arcid Design
  const MAPS_SEARCH_URL = 'https://www.google.com/maps/place/Arcid+Design/@26.3171019,50.375216,12z/data=!4m12!1m2!2m1!1z2KPYsdmD2YrYryDZhNmE2KrYtdmF2YrZhSDYp9mE2K_Yp9iu2YTZig!3m8!1s0x3e49e97a657e96b5:0x2ec16a9087b66d5a!8m2!3d26.317178!4d50.2233116!9m1!1b1';

  try {
    const response = await fetch(MAPS_SEARCH_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8'
      }
    });

    const htmlText = await response.text();
    const reviews = [];

    // استخراج النصوص والتقييمات بالنمط البرمجي
    const reviewPattern = /\["([^"]+)",(?:null|"[^"]*"),\[(\d+)\],\["([^"]+)"\]/g;
    let match;

    while ((match = reviewPattern.exec(htmlText)) !== null) {
      const name = match[1];
      const stars = parseInt(match[2]) || 5;
      const text = match[3];

      if (name && text && text.length > 2 && !text.startsWith('http')) {
        reviews.push({
          name: name,
          stars: stars,
          text: text.replace(/\\n/g, ' '),
          date: 'تقييم قوقل ماب'
        });
      }
    }

    // نمط احتياطي لاستخراج المراجعات المباشرة
    if (reviews.length === 0) {
      const simpleRegex = /class="[^"]*wiM76[^"]*">([^<]+)<\/div>/g;
      let fbMatch;
      while ((fbMatch = simpleRegex.exec(htmlText)) !== null) {
        if (fbMatch[1] && fbMatch[1].length > 2) {
          reviews.push({
            name: "عميل Arcid Design",
            stars: 5,
            text: fbMatch[1],
            date: "تقييم حقيقي"
          });
        }
      }
    }

    return res.status(200).json({
      title: "تقييمات Arcid Design على قوقل ماب",
      count: reviews.length,
      reviews: reviews
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

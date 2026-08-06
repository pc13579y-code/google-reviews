const cors = require('cors')();

module.exports = async (req, res) => {
  // ترويسات الحماية لضمان عمل الـ API على Hostinger
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // رابط متجرك المباشر على قوقل ماب
  const SHORT_URL = 'https://maps.app.goo.gl/BpjjWKkSy26P5SF88';

  try {
    // 1. تتبع الرابط المختصر لاستخراج الرابط الكامل للمتجر
    const headRes = await fetch(SHORT_URL, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar-SA,ar;q=0.9'
      }
    });

    const finalUrl = headRes.url;

    // 2. طلب محتوى صفحة قوقل ماب بلغة عربية وبشكل متصفح حقيقي
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ar-SA,ar;q=0.9,en-US;q=0.8'
      }
    });

    const htmlText = await response.text();
    const reviews = [];

    // 3. استخراج التقييمات والنصوص باستخدام النمط المباشر (Regex)
    const reviewPattern = /\["([^"]+)",(?:null|"[^"]*"),\[(\d+)\],\["([^"]+)"\]/g;
    let match;

    while ((match = reviewPattern.exec(htmlText)) !== null) {
      const name = match[1];
      const stars = parseInt(match[2]) || 5;
      const text = match[3];

      // إبعاد النصوص القصيرة جداً والأكواد النظامية
      if (name && text && text.length > 3 && !text.includes('http')) {
        reviews.push({
          name: name,
          stars: stars,
          text: text.replace(/\\n/g, ' '),
          date: 'تقييم قوقل ماب'
        });
      }
    }

    // نمط احتياطي في حال اختلفت الاستجابة من قوقل
    if (reviews.length === 0) {
      const fallbackRegex = /class="[^"]*wiM76[^"]*">([^<]+)<\/div>/g;
      let fbMatch;
      while ((fbMatch = fallbackRegex.exec(htmlText)) !== null) {
        if (fbMatch[1] && fbMatch[1].length > 3) {
          reviews.push({
            name: "عميل قوقل",
            stars: 5,
            text: fbMatch[1],
            date: "تقييم حقيقي"
          });
        }
      }
    }

    // إرجاع النتيجة
    return res.status(200).json({
      title: "آراء عملائنا الحقيقية على قوقل ماب",
      count: reviews.length,
      reviews: reviews
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

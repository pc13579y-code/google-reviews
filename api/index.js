const cors = require('cors')();

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const reviewsData = {
    title: "ماذا يقول عملاؤنا",
    reviews: [
      {
        name: "محمد سعيد",
        stars: 5,
        text: "خدمة ممتازة وتجاوب سريع جداً، من أفضل التجارب.",
        date: "قبل أسبوع"
      },
      {
        name: "عبدالله الشمري",
        stars: 5,
        text: "جودة عالية واحترافية في التعامل، أنصح بالتعامل معهم.",
        date: "قبل شهر"
      },
      {
        name: "سارة الخالدي",
        stars: 5,
        text: "سرعة ودقة في التنفيذ والتزام تام بالمواعيد.",
        date: "قبل 3 أسابيع"
      }
    ]
  };

  return res.status(200).json(reviewsData);
};

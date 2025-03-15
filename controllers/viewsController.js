module.exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'Overview all tours',
  });
};

module.exports.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The forst hicker tour',
  });
};

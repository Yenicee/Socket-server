import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {});
});

router.get('/', (req, res) => {
  res.render('realTimesProducts', { products });
});




export default router;
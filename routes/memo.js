const router = require('express').Router();
const Memo = require('../models/Memo');

// Récupère tous les mémos jusqu'à 15 maximum
router.get('/', async (req, res) => {
  try {
    const memos = await Memo.find().limit(15);
    res.json(memos);
  } catch (err) {
    res.json({ message: err });
  }
});

// Envoie un mémo champs nécessaire avant l'envoie: title, description
router.post('/', async (req, res) => {
  const memo = new Memo({
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const savedMemo = await memo.save();
    res.json(savedMemo);
  } catch (err) {
    res.json({ message: err });
  }
});

// Trouve un Mémo spécifique
router.get('/:memoId', async (req, res) => {
  try {
    const memo = await Memo.findById(req.params.memoId);
    res.json(memo);
  } catch (err) {
    res.json({ message: err });
  }
});

// Efface un Mémo
router.delete('/:memoId', async (req, res) => {
  try {
    const removedMémo = await Memo.remove({ _id: req.params.memoId });
    res.json(removedMémo);
  } catch (err) {
    res.json({ message: err });
  }
});

// Edite un Mémo
router.patch('/:memoId', async (req, res) => {
  try {
    const updatedMemo = await Memo.updateOne(
      { _id: req.params.memoId },
      { $set: { title: req.body.title, description: req.body.description } },
    );
    res.json(updatedMemo);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;

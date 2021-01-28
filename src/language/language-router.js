const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const LinkedList = require('./lang-linked-list')
const { insertUser } = require('../user/user-service')

const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      const headWord = words[req.language.head - 1];

      res.status(200).json({
        nextWord: headWord.original, 
        totalScore: req.language.total_score,
        wordCorrectCount: headWord.correct_count,
        wordIncorrectCount: headWord.incorrect_count
      })
      next()
    }
    catch (error) {
      next(error)
    }
  })

languageRouter
  .post('/guess', async (req, res, next) => {
    const { guess } = req.body;

    if (!guess) {
      return res.status(400).json({ error: `Missing 'guess' in request body`})
    }

    await LanguageService.updateUsersLanguageHead(
      req.app.get('db'),
      req.user.id,
      req.language.head + 1
      );

    const getWords = async () => {
      const words = await LanguageService.getLanguageWords(
          req.app.get('db'),
          req.language.id,
      )
      let last = await words.pop();
      let sorted = await words.sort((a, b) => a.next - b.next); sorted.push(last)
  
      return await sorted;
      }

    const hIdx = req.language.head - 1;
    const words = await getWords();
    const headWord = words[hIdx];

    const wordsLinkedList = new LinkedList();
    words.forEach((el => {
      wordsLinkedList.insert(el);
    }))

    const updateWords = async () => {
      const words = await wordsLinkedList.all();
      return await words.forEach(el => {     
        LanguageService.updateLanguageWords(
          req.app.get('db'),
          el.id,
          el
        )
      })
    }

    if (guess === headWord.translation) {
      try{
      wordsLinkedList.correct();
      await LanguageService.updateUsersTotalScore(
        req.app.get('db'),
        req.user.id,
        req.language.total_score + 1,
        );
      await updateWords();
      const newWords = await getWords();

      return res.status(200).json({
        nextWord: newWords[hIdx].original,
        totalScore: req.language.total_score + 1,
        wordCorrectCount: newWords[hIdx].correct_count,
        wordIncorrectCount: newWords[hIdx].incorrect_count,
        answer: headWord.translation,
        isCorrect: true
      })
      }
      catch(error) {
        next(error)
      }
    }

    else {
      try {
      wordsLinkedList.incorrect();
      await updateWords();
      const newWords = await getWords();
      
      return res.status(200).json({
        nextWord: newWords[hIdx].original,
        totalScore: req.language.total_score,
        wordCorrectCount: newWords[hIdx].correct_count,
        wordIncorrectCount: newWords[hIdx].incorrect_count,
        answer: headWord.translation,
        isCorrect: false
      })
    } 
    catch (error) {
      next(error);
      }
    }
  })

module.exports = languageRouter

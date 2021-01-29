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

      req.language = language;
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

      const headWord = words.find(el => el.id === req.language.head);

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
    const { body } = req;

    if (!body || !body.guess) {
      return res.status(400).json({ error: `Missing 'guess' in request body`})
    }

    const getWords = async () => {
      const words = await LanguageService.getLanguageWords(
          req.app.get('db'),
          req.language.id,
      )
        return await words;
      }

    const h = req.language.head;
    const words = await getWords();
    const headWord = {};
    await Object.assign(headWord, words.find(el => el.id === h));

    const wordsLinkedList = new LinkedList();
    words.forEach((el => {
      wordsLinkedList.insert(el);
    }))

    const updateWords = async () => {
      const words = await wordsLinkedList.all();
      await words.forEach(async el => {     
        await LanguageService.updateLanguageWords(
          req.app.get('db'),
          el.id,
          el
        )
      })
    }

    const getNextWord = async () => {
      await updateWords();
      const newWords = await getWords();
      return await newWords.find(el => el.id === wordsLinkedList.head.value.id);
    }

    if (body.guess === headWord.translation) {
      try {
        await wordsLinkedList.correct();
        await LanguageService.updateUsersTotalScore(
        req.app.get('db'),
        req.user.id,
        req.language.total_score + 1,
        );
        const nextWord = await getNextWord();
        await LanguageService.updateUsersLanguageHead(
          req.app.get('db'),
          req.user.id,
          nextWord.id
          );

        return await res.status(200).json({
        nextWord: nextWord.original,
        totalScore: req.language.total_score + 1,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
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
      await wordsLinkedList.incorrect();
      const nextWord = await getNextWord();
      await LanguageService.updateUsersLanguageHead(
        req.app.get('db'),
        req.user.id,
        nextWord.id
        );
      
      return await res.status(200).json({
        nextWord: nextWord.original,
        totalScore: req.language.total_score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
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

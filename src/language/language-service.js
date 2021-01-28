const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  updateUsersLanguageHead(db, user_id, head) {
    return db
      .from('language')
      .update({ head })
      .where('language.user_id', user_id);
  },

  updateUsersTotalScore(db, user_id, total_score) {
    return db
      .from('language')
      .update({ total_score })
      .where('language.user_id', user_id);
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  updateLanguageWords(db, id, data) {
    return db
      .from('word')
      .update({
        next: data.next,
        correct_count: data.correct_count,
        incorrect_count: data.incorrect_count,
        memory_value: data.memory_value
      })
      .where({ id });
  }
};

module.exports = LanguageService;

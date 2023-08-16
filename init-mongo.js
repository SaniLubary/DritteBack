// Create and switch to the desired database
db = db.getSiblingDB('dritte');

// Create collections and insert initial data
db.createCollection('users');
db.users.insert({
  name: 'John',
  mail: 'john@gmail.com',
  points: 10,
  daily_activities: {
    emotion: [{ name: 'angry' }, { name: 'happy' }],
    diary_entry: [
      {
        title: 'Title',
        description: 'description',
        picture: { uri: 'uri.to.image', description: 'description' },
      },
    ],
  },
  achievements: [{ name: 'percistent' }],
});

db.createCollection('movieCategorieToEmotionsMap');
db.movieCategorieToEmotionsMap.insert({
  category: 'thriller',
  emotions: ['chilling', 'spaced out'],
});

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { faker } from '@faker-js/faker';

const app = express();
const port = process.env.PORT || 3000;
const fileName = fileURLToPath(import.meta.url);
const folderName = path.dirname(fileName);

app.set('view engine', 'ejs');
app.set('views', path.join(folderName, 'views'));
app.use(express.static(path.join(folderName, 'public')));

const planets = [
  { name: 'Mercury', order: 1, type: 'Rocky planet', moons: 0 },
  { name: 'Venus', order: 2, type: 'Rocky planet', moons: 0 },
  { name: 'Earth', order: 3, type: 'Rocky planet', moons: 1 },
  { name: 'Mars', order: 4, type: 'Rocky planet', moons: 2 },
  { name: 'Jupiter', order: 5, type: 'Gas giant', moons: 95 },
  { name: 'Saturn', order: 6, type: 'Gas giant', moons: 146 },
  { name: 'Uranus', order: 7, type: 'Ice giant', moons: 28 },
  { name: 'Neptune', order: 8, type: 'Ice giant', moons: 16 }
];

const navigation = [
  { url: '/', text: 'Home' },
  { url: '/planets', text: 'Planets' },
  { url: '/nasa', text: 'NASA' },
  { url: '/package', text: 'Node Package' },
  { url: '/about', text: 'About' }
];

function pageData(page) {
  return { page, navigation, planets };
}

app.get('/', (req, res) => {
  res.render('home', pageData('home'));
});

app.get('/planets', (req, res) => {
  res.render('planets', pageData('planets'));
});

app.get('/planet/:name', (req, res) => {
  const planet = planets.find(
    item => item.name.toLowerCase() === req.params.name.toLowerCase()
  );

  if (!planet) return res.status(404).send('Planet not found');
  res.render('planet', { ...pageData('planet'), planet });
});

app.get('/nasa', async (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  const apiKey = '9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD';
  let picture = null;

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
    );
    picture = await response.json();
  } catch (error) {
    console.log('NASA API error:', error.message);
  }

  res.render('nasa', { ...pageData('nasa'), picture, date });
});

app.get('/package', (req, res) => {
  const person = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    city: faker.location.city(),
    favoriteColor: faker.color.human(),
    message: faker.lorem.sentence()
  };

  res.render('package', { ...pageData('package'), person });
});

app.get('/about', (req, res) => {
  res.render('about', pageData('about'));
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

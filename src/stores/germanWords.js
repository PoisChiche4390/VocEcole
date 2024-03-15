import {writable} from 'svelte/store'

const germanWords = writable([
  {
    id: 1,
    forLessen: false,
    content: "Kapitel 3"
  },
  {
    id: 2,
    forLesson: true,
    german: 'überall',
    germanWithoutMisspeling: 'überall',
    french: 'partout'
  },
  {
    id: 3,
    forLesson: true,
    german: 'die Öffnungszeiten',
    germanWithoutMisspeling: 'dieöffnungszeiten',
    french: "les heures d'ouverture"
  },
  {
    id: 4,
    forLesson: true,
    german: 'die Fussgängerzone, die Fussgängerzonen',
    germanWithoutMisspeling: 'diefussgängerzone,diefussgängerzonen',
    french: 'la zone piétonne'
  },
  {
    id: 5,
    forLesson: true,
    german: 'der Laden, die Laden',
    germanWithoutMisspeling: 'derladen,dieladen',
    french: 'le magasin'
  },
  {
    id: 6,
    forLesson: true,
    german: 'Ich kaufe lieber in kleinen Läden ein.',
    germanWithoutMisspeling: 'ichkaufelieberinkleinenlädenein.',
    french: 'Je préfère acheter dans des petits commerces.'
  },
  {
    id: 7,
    forLesson: true,
    german: 'die Beratung',
    germanWithoutMisspeling: 'dieberatung',
    french: 'le conseil'
  },
  {
    id: 8,
    forLesson: true,
    german: 'Die Beratung im Geschäft war sehr gut.',
    germanWithoutMisspeling: 'dieberatungimgeschäftwarsehrgut.',
    french: 'Le conseil dans le magasin était très bien.'
  },
  {
    id: 9,
    forLesson: true,
    german: 'teilen, teilt, hat geteilt',
    germanWithoutMisspeling: 'teilen,teilt,hatgeteilt',
    french: 'partager'
  },
  {
    id: 10,
    forLesson: true,
    german: 'brauchen, braucht, hat gebraucht',
    germanWithoutMisspeling: 'brauchen,braucht,hatgebraucht',
    french: 'avoir besoin de'
  },
  {
    id: 11,
    forLesson: true,
    german: 'weniger ≠ mehr',
    germanWithoutMisspeling: 'wenigermehr',
    french: 'moins ≠ plus'
  },
  {
    id: 12,
    forLesson: true,
    german: 'immer mehr',
    germanWithoutMisspeling: 'immermehr',
    french: 'toujours plus'
  },
  {
    id: 13,
    forLesson: true,
    german: '',
    germanWithoutMisspeling: '',
    french: ''
  },
  
]);

export default germanWords;
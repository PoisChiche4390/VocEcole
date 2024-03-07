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
    german: 'die Kleidung',
    germanWithoutMisspeling: 'diekleidung',
    french: 'les habits, les vêtements'
  },
  {
    id: 3,
    forLesson: true,
    german: 'der Spass',
    germanWithoutMisspeling: 'derspass',
    french: 'le plaisir, divertissement'
  },
  {
    id: 4,
    forLesson: true,
    german: 'die Liebe',
    germanWithoutMisspeling: 'dieliebe',
    french: "l'amour"
  },
  {
    id: 5,
    forLesson: true,
    german: 'das Taschengeld',
    germanWithoutMisspeling: 'dastaschengeld',
    french: "l'argent de poche"
  },
  {
    id: 6,
    forLesson: true,
    german: 'sich wünschen, er wünscht sich, er hat sich gewünscht',
    germanWithoutMisspeling: 'sichwünschen,erwünschtsich,erhatsichgewünscht',
    french: 'vouloir, souhaiter'
  },
  {
    id: 7,
    forLesson: true,
    german: 'Ich wünche mir einen Hund.',
    germanWithoutMisspeling: 'ichwünchemireinenHund.',
    french: 'Je voudrais un chien.'
  },
  {
    id: 8,
    forLesson: true,
    german: 'träumen vom, er träumt, er hat geträumt',
    germanWithoutMisspeling: 'träumenvom,erträumt,erhatgeträumt',
    french: 'rêver de'
  },
  {
    id: 9,
    forLesson: true,
    german: 'Sie träumt von Ferien am Meer.',
    germanWithoutMisspeling: 'sieträumtvonferienamMeer.',
    french: 'Elle rêve de vacances à la mer.'
  },
  {
    id: 10,
    forLesson: true,
    german: 'das Abenteuer',
    germanWithoutMisspeling: 'dasabenteuer',
    french: "l'aventure"
  },
  {
    id: 11,
    forLesson: true,
    german: 'Er liebt Reisen und sucht das Abenteuer.',
    germanWithoutMisspeling: 'erliebtreisenundsuchtdasabenteuer.',
    french: "Il aime voyager et cherche l'aventure."
  },
  {
    id: 12,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 13,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 14,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 15,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 16,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 17,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 18,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 19,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 20,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 21,
    forLesson: true,
    german: 'chillen',
    germanWithoutMisspeling: 'chillen',
    french: 'chiller, se détendre'
  },
]);

export default germanWords;
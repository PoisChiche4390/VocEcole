import {writable} from 'svelte/store'

const germanWords = writable([
  // first 10
  {
    id: 1,
    german: 'die Kleidung',
    germanWithoutSpaces: 'dieKleidung',
    french: 'les habits, les vêtements'
  },
  {
    id: 2,
    german: 'der Spass',
    germanWithoutSpaces: 'derSpass',
    french: 'le plaisir, divertissement'
  },
  {
    id: 3,
    german: 'die Liebe',
    germanWithoutSpaces: 'dieLiebe',
    french: "l'amour"
  },
  {
    id: 4,
    german: 'das Taschengeld',
    germanWithoutSpaces: 'dasTaschengeld',
    french: "l'argent de poche"
  },
  {
    id: 5,
    german: 'sich wünschen, er wünscht sich, er hat sich gewünscht',
    germanWithoutSpaces: 'sichwünschen,erwünschtsich,erhatsichgewünscht',
    french: 'vouloir, souhaiter'
  },
  {
    id: 6,
    german: 'Ich wünche mir einen Hund.',
    germanWithoutSpaces: 'IchwünchemireinenHund.',
    french: 'Je voudrais un chien.'
  },
  {
    id: 7,
    german: 'träumen vom, er träumt, er hat geträumt',
    germanWithoutSpaces: 'träumenvom,erträumt,erhatgeträumt',
    french: 'rêver de'
  },
  {
    id: 8,
    german: 'Sie träumt von Ferien am Meer.',
    germanWithoutSpaces: 'SieträumtvonFerienamMeer.',
    french: 'Elle rêve de vacances à la mer.'
  },
  {
    id: 9,
    german: 'das Abenteuer',
    germanWithoutSpaces: 'dasAbenteuer',
    french: "l'aventure"
  },
  {
    id: 10,
    german: 'Er liebt Reisen und sucht das Abenteuer.',
    germanWithoutSpaces: 'ErliebtReisenundsuchtdasAbenteuer.',
    french: "Il aime voyager et cherche l'aventure."
  },
  // second 10
  {
    id: 11,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 12,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 13,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 14,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 15,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 16,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 17,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 18,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 19,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
  {
    id: 20,
    german: 'chillen',
    germanWithoutSpaces: 'chillen',
    french: 'chiller, se détendre'
  },
]);

export default germanWords;
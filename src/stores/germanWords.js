import {writable} from 'svelte/store'

const germanWords = writable([
  {
    id: 1,
    forLesson: false,
    content: "Kapitel 3",
    color: "blue"
  },
  {
    id: 2,
    forLesson: true,
    german: 'überall',
    germanWithoutMisspeling: 'uberall',
    french: 'partout'
  },
  {
    id: 3,
    forLesson: true,
    german: 'die Öffnungszeiten',
    germanWithoutMisspeling: 'dieoffnungszeiten',
    french: "les heures d'ouverture"
  },
  {
    id: 4,
    forLesson: true,
    german: 'die Fussgängerzone, die Fussgängerzonen',
    germanWithoutMisspeling: 'diefussgangerzonediefussgangerzonen',
    french: 'la zone piétonne, les zones piétonnes'
  },
  {
    id: 5,
    forLesson: true,
    german: 'der Laden, die Laden',
    germanWithoutMisspeling: 'derladendieladen',
    french: 'le magasin, les magasins'
  },
  {
    id: 6,
    forLesson: true,
    german: 'Ich kaufe lieber in kleinen Läden ein.',
    germanWithoutMisspeling: 'ichkaufelieberinkleinenladenein',
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
    germanWithoutMisspeling: 'dieberatungimgeschaftwarsehrgut',
    french: 'Le conseil dans le magasin était très bien.'
  },
  {
    id: 9,
    forLesson: true,
    german: 'teilen, teilt, hat geteilt',
    germanWithoutMisspeling: 'teilenteilthatgeteilt',
    french: 'partager (3 formes)'
  },
  {
    id: 10,
    forLesson: true,
    german: 'brauchen, braucht, hat gebraucht',
    germanWithoutMisspeling: 'brauchenbrauchthatgebraucht',
    french: 'avoir besoin de (3 formes)'
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
    german: 'verzichten auf, verzichtet, hat verzichtet',
    germanWithoutMisspeling: 'verzichtenaufverzichtethatverzichtet',
    french: 'renoncer à (3 formes)'
  },
  {
    id: 14,
    forLesson: true,
    german: 'Ich möchte nicht auf meine Musik verzichten.',
    germanWithoutMisspeling: 'ichmochtenichtaufmeinemusikverzichten',
    french: 'Je ne voudrais pas renoncer à ma musique.'
  },
  {
    id: 15,
    forLesson: true,
    german: 'besitzen, besitzt, besass, hat besessen',
    germanWithoutMisspeling: 'besitzenbesitztbesasshatbesessen',
    french: 'posséder (4 formes)'
  },
  {
    id: 16,
    forLesson: true,
    german: 'Er besitzt ein Haus.',
    germanWithoutMisspeling: 'erbesitzteinhaus',
    french: 'Il possède une maison.'
  },
  {
    id: 17,
    forLesson: true,
    german: 'Ich habe nicht viel/genug Platz.',
    germanWithoutMisspeling: 'ichhabenichtvielgenugplatz',
    french: "Je n'ai pas beaucoup/assez de place."
  },
  {
    id: 18,
    forLesson: true,
    german: 'Ich habe (sehr) wenig Platz.',
    germanWithoutMisspeling: 'ichhabe(sehr)wenigplatz',
    french: "J'ai (très) peu de place."
  },
  {
    id: 19,
    forLesson: true,
    german: 'verdienen, verdient, hat verdient',
    germanWithoutMisspeling: 'verdienenverdienthatverdient',
    french: "gagner de l'argent (3 formes)"
  },
  {
    id: 20,
    forLesson: true,
    german: 'Ich würde gern viel Geld verdienen !',
    germanWithoutMisspeling: 'ichwurdegernvielgeldverdienen',
    french: "J'aimerais bien gagner beaucoup d'argent !"
  },
  {
    id: 21,
    forLesson: true,
    german: 'verschenken, verschenkt, hat verschenkt',
    germanWithoutMisspeling: 'verschenkenverschenkthatverschenkt',
    french: 'donner, faire cadeau de (3 formes)'
  },
  {
    id: 22,
    forLesson: true,
    german: 'Sie verschenkt alle Bücher.',
    germanWithoutMisspeling: 'sieverschenktallebucher',
    french: 'Elle fait cadeau de tous les livres.'
  },
  {
    id: 23,
    forLesson: true,
    german: 'aushalten, hält aus, hielt aus, hat ausgehalten',
    germanWithoutMisspeling: 'aushaltenhaltaushieltaushatausgehalten',
    french: 'supporter (3 formes)'
  },
  {
    id: 24,
    forLesson: true,
    german: 'Ich könnte das nicht aushalten !',
    germanWithoutMisspeling: 'ichkonntedasnichtaushalten',
    french: 'Je ne pourrais pas supporter cela !'
  },
  {
    id: 25,
    forLesson: true,
    german: 'bewusst leben',
    germanWithoutMisspeling: 'bewusstleben',
    french: 'vivre consciemment'
  },
  {
    id: 26,
    forLesson: true,
    german: 'Er verzichtet auf vieles und lebt bewusst.',
    germanWithoutMisspeling: 'erverzichtetaufvielesundlebtbewusst',
    french: 'Il renonce à beaucoup de choses et vit consciemment.'
  },
  {
    id: 27,
    forLesson: false,
    content: "Révision 10ème K.5 S.2",
    color: "grey"
  },
  {
    id: 28,
    forLesson: true,
    german: 'die Kartoffel, die Kartoffeln',
    germanWithoutMisspeling: 'diekartoffeldiekartoffeln',
    french: 'la pomme de terre, les pommes de terre'
  },
  {
    id: 29,
    forLesson: true,
    german: 'der Käse',
    germanWithoutMisspeling: 'derkase',
    french: 'le fromage'
  },
  {
    id: 30,
    forLesson: true,
    german: 'die Milch',
    germanWithoutMisspeling: 'diemilch',
    french: 'le lait'
  },
  {
    id: 31,
    forLesson: true,
    german: 'die Butter',
    germanWithoutMisspeling: 'diebutter',
    french: 'le beurre'
  },
  {
    id: 32,
    forLesson: true,
    german: 'das Wasser',
    germanWithoutMisspeling: 'daswasser',
    french: "l'eau"
  },
  {
    id: 33,
    forLesson: true,
    german: 'der Saft, die Säfte',
    germanWithoutMisspeling: 'dersaftdiesafte',
    french: 'le jus, les jus'
  },
  {
    id: 34,
    forLesson: true,
    german: 'die Limonade, die Limonaden',
    germanWithoutMisspeling: 'dielimonadedielimonaden',
    french: 'la limonade, les limonades'
  },
  {
    id: 35,
    forLesson: true,
    german: 'die Schokolade, die Schokoladen',
    germanWithoutMisspeling: 'dieschokoladedieschokoladen',
    french: 'le chocolat, les chocolats'
  },
  {
    id: 36,
    forLesson: true,
    german: 'der Reis',
    germanWithoutMisspeling: 'derreis',
    french: 'le riz'
  },
  {
    id: 37,
    forLesson: true,
    german: 'die Wurst, die Würste',
    germanWithoutMisspeling: 'diewurstdiewurste',
    french: 'la saucisse'
  },
  {
    id: 38,
    forLesson: true,
    german: 'der Schinken',
    germanWithoutMisspeling: 'derschinken',
    french: 'le jambon'
  },
  {
    id: 39,
    forLesson: true,
    german: 'die Birne, die Birnen',
    germanWithoutMisspeling: 'diebirnediebirnen',
    french: 'la poire'
  },
  {
    id: 40,
    forLesson: true,
    german: 'die Trauben',
    germanWithoutMisspeling: 'dietrauben',
    french: 'le raisin'
  },
  {
    id: 41,
    forLesson: true,
    german: 'die Früchte / das Obst',
    germanWithoutMisspeling: 'diefruchtedasobst',
    french: 'les fruits (les 2 variantes)'
  },
  {
    id: 42,
    forLesson: true,
    german: 'das Gemüse',
    germanWithoutMisspeling: 'dasgemuse',
    french: 'les légumes'
  },
  {
    id: 43,
    forLesson: true,
    german: 'das Salz',
    germanWithoutMisspeling: 'dassalz',
    french: 'le sel'
  },
  {
    id: 44,
    forLesson: true,
    german: 'der Pfeffer',
    germanWithoutMisspeling: 'derpfeffer',
    french: 'le poivre'
  },
  {
    id: 45,
    forLesson: true,
    german: 'das Mehl',
    germanWithoutMisspeling: 'dasmehl',
    french: 'la farine'
  },
  {
    id: 46,
    forLesson: true,
    german: 'der Zucker',
    germanWithoutMisspeling: 'derzucker',
    french: 'le sucre'
  },
  {
    id: 47,
    forLesson: true,
    german: 'das Fett, die Fette',
    germanWithoutMisspeling: 'dasfettdiefette',
    french: 'la graisse, les graisses'
  },
  {
    id: 48,
    forLesson: true,
    german: 'das Öl, die Öle',
    germanWithoutMisspeling: 'dasoldieole',
    french: "l'huile"
  },
  {
    id: 49,
    forLesson: true,
    german: 'das Ei, die Eier',
    germanWithoutMisspeling: 'daseidieeier',
    french: "l'oeuf, les oeufs"
  },
  {
    id: 50,
    forLesson: true,
    german: 'die Süssigkeiten',
    germanWithoutMisspeling: 'diesussigkeiten',
    french: 'les sucreries'
  },
  {
    id: 51,
    forLesson: true,
    german: 'gesund ≠ ungesund',
    germanWithoutMisspeling: 'gesundungesund',
    french: 'sain ≠ malsain'
  },
  {
    id: 52,
    forLesson: true,
    german: 'das Stück, die Stücke',
    germanWithoutMisspeling: 'dasstuckdiestucke',
    french: 'le morceau, la tranche'
  },
  {
    id: 53,
    forLesson: true,
    german: 'zu viel / zu oft',
    germanWithoutMisspeling: 'zuvielzuoft',
    french: 'trop / trop souvent'
  },
  {
    id: 54,
    forLesson: true,
    german: 'täglich / jeden Tag',
    germanWithoutMisspeling: 'taglichjedentag',
    french: 'tous les jours / chaque jour'
  },
  {
    id: 55,
    forLesson: true,
    german: 'pro Tag',
    germanWithoutMisspeling: 'protag',
    french: 'par jour'
  },
  {
    id: 56,
    forLesson: false,
    content: "Bientot Kapitel 6",
    color: "blue"
  },
]);

export default germanWords;
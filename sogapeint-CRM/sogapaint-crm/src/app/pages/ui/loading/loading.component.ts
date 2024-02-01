import { Component, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  loadingTexts = [
    'Veuillez patienter pendant que nous récupérons les informations dans la base de données...',
    'Juste une seconde, nous sommes en train de chercher les informations...',
    'Un instant, nous sommes en train de préparer les données...',
    'Avez-vous déjà vu une base de données faire des étirements ? C\'est ce que nous faisons maintenant...',
    'Mélangeons ces données pour une expérience utilisateur parfaite...',
    'Accrochez-vous, nous plongeons profondément dans les données...',
    'Nous demandons gentiment aux octets de se mettre en rang...',
    'Nous sommes actuellement en train de dresser les 0 et les 1...',
    'Faites une pause, prenez un café, nous nous occupons du reste...',
    'Nous sommes en train de peindre les pixels, juste pour vous...',
    'Les données se préparent, elles veulent être parfaites pour vous...',
    'Les petits hamsters de notre serveur se mettent en action...',
    'Un peu de patience, les étoiles de données s\'alignent...',
    'Le chef prépare votre plat de données, ça mijote...',
    'Nous sommes en train de réveiller les données, elles sont un peu endormies ce matin...',
    'Les données font leur jogging matinal, elles arrivent bientôt...',
    'Nous faisons une petite danse pour accélérer les données...',
    'Les données jouent à cache-cache, nous les trouvons pour vous...',
    'Un moment de patience pendant que nous téléchargeons le monde...',
    'Nous sommes en train de construire des ponts de données pour vous...',
    'Les données se font belles, elles veulent faire bonne impression...',
    'Les données sont en train de se coiffer, elles veulent être présentables...',
    'Nous sommes en train de jouer au Tetris avec vos données, alignement parfait en cours...',
    'Un peu de patience, nous sommes en train de charger le futur...',
    'Les données se font un petit check-up, sécurité avant tout !',
    'Nous sommes en train d\'apprivoiser les octets sauvages...',
    'Vos données prennent un bain de soleil, elles arrivent rafraîchies et prêtes !',
    'On entraîne les pixels à se mettre en formation, juste un moment…',
    'Les données prennent un petit détour par la Lune, patience…',
    'Nous sommes en train de négocier avec les bits pour qu\'ils se dépêchent…',
    'Les octets font de la musculation pour être plus rapides, ça arrive…',
    'Les données se font une beauté, elles veulent être parfaites pour vous…',
    'Chut… Les données sont en méditation, elles arrivent zen…',
    'On vérifie si les 0 et les 1 sont bien alignés, sécurité avant tout !',
    'On joue à la marelle avec vos données, elles seront là après le ciel…',
    'Les données font une petite pause thé, elles reviennent bientôt…',
    'Les bits ont pris le chemin panoramique, mais ils arrivent…',
    'On fait un petit briefing aux données, elles seront prêtes en un rien de temps…',
    'Les données font un marathon, dernier kilomètre !',
    'On est en train de décorer les données, elles veulent être jolies pour vous…',
    'On chuchote des secrets aux données, elles sont presque prêtes…',
    'Les données font du yoga, elles seront là, détendues et prêtes…',
    'Les bits jouent à cache-cache, mais on est les champions de ce jeu !',
    'Les données font une petite sieste, mais on les réveille juste pour vous…',
    'Les octets font un tour de magie, et pouf, ils apparaîtront…',
    'Les données font un tour du monde express, elles ramènent des souvenirs…',
    'On poli les données pour qu\'elles brillent de mille feux…',
    'Nous mélangeons les couleurs des données, pour un résultat éclatant…',
    'Les données se font repeindre, pour un rendu plus brillant…',
    'On applique une seconde couche de vérification sur les données…',
    'Les données prennent un bain de peinture, pour être éclatantes à leur présentation…',
    'On secoue bien les données avant usage pour un mélange parfait…',
    'Les octets sont en séance de coloriage, pour des données plus vives…',
    'On gratte les vieilles couches de données pour une finition impeccable…',
    'Les données se mettent en tenue de peinture, elles ne veulent pas se tacher…',
    'On donne un coup de pinceau magique aux données, elles vont briller…',
    'Les données font un stage de poterie, elles prennent forme…',
    'Les octets sont en train de poser du papier peint, pour un décor parfait…',
    'Les données prennent une douche de solvant, elles vont être toutes propres…',
    'Les bits font un cours de décoration intérieure, pour un résultat harmonieux…',
    'Les données prennent une leçon de peinture à l’huile, pour un rendu classique…',
    'On tamise les données pour enlever les grumeaux…',
    'Les données font un cours de calligraphie, pour une écriture parfaite…',
    'On équipe les données de petits pinceaux, elles vont peindre votre écran…',
    'Les octets font un atelier de teinture, pour un affichage coloré…',
    'On peint les données à la main, pour un rendu artisanal…',
    'Les données sont en train de choisir leur palette de couleurs, patience…'
  ];
  backupTexts = [...this.loadingTexts];
  
  currentText = this.loadingTexts[0];
  animationClass = 'typing';
  
  constructor(private elementRef: ElementRef) { }
  
  ngOnInit() {
    setInterval(() => this.changeText(), 7000);
  }
  
  changeText() {
    if (this.loadingTexts.length === 0) {
      this.loadingTexts = [...this.backupTexts];
    }
    const randomIndex = Math.floor(Math.random() * this.loadingTexts.length);
    this.animationClass = '';
    setTimeout(() => {
      void this.elementRef.nativeElement.offsetWidth; // force un reflow
      this.animationClass = 'typing';
      this.currentText = this.loadingTexts[randomIndex];
      this.loadingTexts.splice(randomIndex, 1);
    }, 50);
  }
}

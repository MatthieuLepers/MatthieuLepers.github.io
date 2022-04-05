# **R-Type Web**
---

## **Sommaire**
- Préambule
- Fonctionnalités
- Fonctionnalités à venir
- Installation

---
## **Préambule**

Jeu (très) inspiré de la licence [Irem](https://fr.wikipedia.org/wiki/Irem_(entreprise)), [R-Type](https://fr.wikipedia.org/wiki/R-Type) est un jeu d'arcade asses difficile. Ce jeu est basé sur les jeux R-Type et R-Type II respectivement sortie en 1987 et 1989 sur une multitude de plate-forme et encore aujourd'hui de nouvelle plate-forme comme Android ou I-OS propose ces deux jeux dans leur App Store respectif.

R-Type Web à pour but d'être un jeu de divertissement à un ou deux joueurs, il est fractionné en un système de manches. Les manches standards et les manches bonus.

### Les manches
Les manches standards sont des manches remplies de divers ennemies qui vous tirerons dessus à vu et essaierons de mettre fin à votre session de jeu.

Les manches bonus en plus d'avoir la même capacité que les manches standards proposent un ennemie dit "Bonus" qui, une fois détruit, va déposer une amélioration que le joueur peut prendre et utiliser contre les ennemies.

### Les améliorations
Elles sont aux nombre de 6, voici leurs spécification plus en détail:

- ![Dna Upgrade](http://matthieulepers.github.io/images/gui/icons/upgrade_dna.gif) Permet d'obtenir le module ainsi que d'obtenir l'arme ADN
- ![Laser Upgrade](http://matthieulepers.github.io/images/gui/icons/upgrade_laser.gif) Permet d'obtenir le module ainsi que d'obtenir l'arme Laser
- ![Fire upgrade](http://matthieulepers.github.io/images/gui/icons/upgrade_fire.gif) Permet d'obtenir le module ainsi que d'obtenir l'arme Lance flamme
- ![Speed Upgrade](http://matthieulepers.github.io/images/gui/icons/upgrade_speed.gif) Augmente la vitesse du joueur de 25% de sa valeur de base (cumulable 4 fois par joueur)
- ![Bit module Upgrade](http://matthieulepers.github.io/images/gui/icons/bit_module_top.gif) Ajoute un module 'Bit' au dessus et/ou en dessous du joueur (cumulable 2 fois par joueur)
- ![Rockets Upgrade](http://matthieulepers.github.io/images/gui/icons/upgrade_rockets.gif) Permet au joueur de tirer deux roquettes toutes les deux secondes (non cumulable)
- ![ForceField Upgrade](http://matthieulepers.github.io/images/gui/icons/upgrade_forcefield.gif) Augmente la vie du joueur de deux points, lui permettant de générer un champ de force pouvant absorber un projectile, ces améliorations sont cumulables

---

## **Les modes de jeu disponibles**
#### Normal
Permet de joué simplement à R-Type Web à un ou deux joueurs sur le même clavier.
#### Assisté
Comme le mode normal mais ajoute une IA qui tirera sur les ennemies quand vous serez en fasse d'eux.
#### 1 Joueur
Permet de joué en solo.
#### 2 Joueurs
Permet de joué à deux sur le même clavier.

## **Les idées de modes de jeu**
#### Tower defense
Vous ne devez pas laissé passer un ennemie, si un ennemie sort de l'écran par la gauche pour perdrez.
#### No miss
Quand vous tirez, vos tirs doivent à chaque fois touché, dans le cas contraire vous perdrez (des points ?).

---

## **Les contrôles**
#### Général
- Echap : Mettre le jeu en pause
- F5 : Recharger, remet le jeu à zéro pour un nouvel essai
- Entré : Même effet que F5 mais quand Game Over
- ↑ ↓ : Changer la lettre de la colonne (Enregistrement du score)
- ← → : Changer de colonne (Enregistrement du score)

#### Joueur 1
- Z : Monter
- Q : Avancer
- S : Descendre
- D : Reculer
- L : Tirer (Enfoncer pour tirer en continu)
- M : Charger (Rester enfoncer pour charger un tir, lâchez pour le tirer)
- Ctrl : Permet d'appeler ou de lancer le module s'il est attaché à votre vaisseau

#### Joueur 2 (Nécessite un clavier avec pavé numérique)
- ↑ : Monter
- → : Avancer
- ↓ : Descendre
- ← : Reculer
- NUMPAD2 : Tirer (Enfoncer pour tirer en continu)
- NUMPAD3 : Charger (Rester enfoncer pour charger un tir, lâchez pour le tirer)
- NUMPAD0 : Permet d'appeler ou de lancer le module s'il est attaché à votre vaisseau

---
## **Fonctionnalités**

- Système d'essai, par défaut vous avez trois essais, dès votre première mort vous serez repositionné au milieu à gauche de l'écran et serez invulnérable durant deux secondes.
- Mode deux joueurs, tout le jeu est pensé pour pouvoir accueillir un second joueur, vérifier cependant que votre clavier permet l'appuie de plusieurs touches simultanément (10 à 12), dans le cas contraire les joueurs auront du mal à ce déplacer/tirer en même temps.
- Système de statistiques, chaque tir, destruction, amélioration, etc sont enregistrés dans les statistiques
- Anti-triche, un semblant d'anti-triche est en place, la console web n'est pas accessible depuis les raccourcis clavier mais reste cependant accessible depuis le panneau de votre navigateur. De plus un algorithme est présent pour calculer le nombre total théorique de point possible par manche.
- Les skins, chaque joueur peut changer le skin de son vaisseau, en passant par le menu d'aide en bas à droite de l'écran.
- Quelques paramètres tel que la possibilité de jouer sans son et/ou sans le fond étoilé.
- Le Konami code à un effet sur le jeu, il donne un essai supplémentaire à chaque joueur encore en vie.

## **Fonctionnalités en bêta ou encore en développement**
- [En bêta]Un pad pour pouvoir jouer sur téléphone/tablette
- [WIP] Intelligence artificielle

## **Fonctionnalités à venir**
- Mode Tower Defense
- Ajout d'un niveau contenant des murs dès la manche 10 (level design)
- Ajout d'un boss final à la manche 25
- Ajout de nouvelles mécaniques telle que le tir super-chargé (R-Type II)
- Permettre l'obtention d'un nouvel essai quand le joueur cumule 25 000 points
- Permettre, en mode 2 joueurs, de réanimé un joueur ne pouvant plus respawn lors de l'obtention d'un nouvel essai (25 000 points)
- Ajouter d'autre type d’ennemies et projectiles
- Ajouter de nouveaux succès
- Ajouter une barre d'instabilité qui réalisera un spray de plus en plus imprécis des tirs du joueur quand celui-ci abuse de la touche de tir (Sera désactivable mais présent par défaut)
- Permettre au deuxième joueur de jouer avec la sourie

## **Installation**
Actuellement les fonctionnalités d'enregistrement de score sont implémentées en PHP + MySQL, il vous faudra installer WampServer afin de permettre à votre ordinateur d'interpréter le langage PHP et avoir accès à MySQL.
Quand le projet passera sur Node.JS, il vous faudra installer ce dernier, ainsi le projet tournera **uniquement** sous Node.JS et MySQL.

## **Aparté sur l'IA actuelle**
### Ce qu'elle peut faire
- Esquiver les projectiles durant un certain temps
- Tirer sur les ennemies
- Prendre en chasse un ennemies et le détruire
- Utiliser le tir chargé sur les Cheetahs

### Ce qu'elle ne peut pas (encore) faire
- Esquiver à tout les coups
- Prévoir les trajectoires sinusoïdales des PataPatas
- Utiliser le tir chargé de manière cohérente (multi-kills)
- Prioriser les upgrades dropées et détruire les drones bonus
- Appeler/Relâcher le module
- Mettre le module à l'avant/arrière
- Éviter les collisions avec les vaisseaux ennemies
- Utiliser les bitmodules/module pour entré en collision avec les ennemies
- Ignorer les Balles de Plasma qui arrive de l'avant lorsque le module est à l'avant et réciproquement à l'arrière
- Utiliser correctement les Forcefields

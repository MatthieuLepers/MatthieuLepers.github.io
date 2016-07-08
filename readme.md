# **R-Type Web**
---

# /!\ **Vérifier que votre navigateur supporte le JavaScript ECMA 6** /!\

## **Sommaire**
- Préambule
- Fonctionnalités
- Fonctionnalités à venir
- Installation
- Comment contribuer

---
## **Préambule**

Jeu (très) inspiré de la licence [Irem](https://fr.wikipedia.org/wiki/Irem_(entreprise)), [R-Type](https://fr.wikipedia.org/wiki/R-Type) est un jeu d'arcade asses difficile. Ce jeu est basé sur les jeux R-Type et R-Type II respectivement sortie en 1987 et 1989 sur une multitude de plate-forme et encore aujourd'hui de nouvelle plate-forme comme Android ou I-OS propose ces deux jeux dans leur App Store respectif.

R-Type Web à pour but d'être un jeu de divertissement à un ou deux joueurs, il est fractionné en un système de manches. Les manches standards et les manches bonus.

### Les manches
Les manches standards sont des manches remplies de divers ennemies qui vous tirerons dessus à vu et essaierons de mettre fin à votre session de jeu.

Les manches bonus en plus d'avoir la même capacité que les manches standards proposent un ennemie dit "Bonus" qui, une fois détruit, va déposer une amélioration que le joueur peut prendre et utiliser contre les ennemies.

### Les améliorations
Elles sont aux nombre de 6, voici leurs spécification plus en détail:

- ![Dna Upgrade](http://aireayquaza.github.io/images/gui/icons/upgrade_dna.gif) Permet d'obtenir le module ainsi que d'obtenir l'arme ADN
- ![Laser Upgrade](http://aireayquaza.github.io/images/gui/icons/upgrade_laser.gif) Permet d'obtenir le module ainsi que d'obtenir l'arme Laser
- ![Fire upgrade](http://aireayquaza.github.io/images/gui/icons/upgrade_fire.gif) Permet d'obtenir le module ainsi que d'obtenir l'arme ADN
- ![Speed Upgrade](http://aireayquaza.github.io/images/gui/icons/upgrade_speed.gif) Augmente la vitesse du joueur de 25% de sa valeur de base
- ![Bit module Upgrade](http://aireayquaza.github.io/images/gui/icons/bit_module_top.gif) Ajoute un module 'Bit' au dessus et/ou en dessous du joueur
- ![Rockets Upgrade](http://aireayquaza.github.io/images/gui/icons/upgrade_rockets.gif) Permet au joueur de tirer deux roquettes toutes les deux secondes
- ![ForceField Upgrade](http://aireayquaza.github.io/images/gui/icons/upgrade_forcefield.gif) Augmente la vie du joueur de deux points, lui permettant de générer un champ de force pouvant absorber un projectile, ces améliorations sont cumulables

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

## **Fonctionnalités à venir**
- Un pad pour pouvoir jouer sur téléphone/tablette
- Mode Tower Defense
- Ajout d'un niveau contenant des murs dès la manche 10 (level design)
- Ajout d'un boss final à la manche 25
- Ajout de nouvelles mécaniques telle que le tir super-chargé (R-Type II)
- Permettre l'obtention d'un nouvel essai quand le joueur cumule 25 000 points
- Ajouter d'autre type d’ennemies et projectiles
- Ajouter de nouveaux succès
- Transformer le mode deux joueurs pour qu'il utilise le module socket.io de Node.JS (Création et gestion de serveurs, retrait du mode 2 joueurs sur le même clavier (?), inclusion du mode 2 joueurs sur 2 ordinateurs séparés)

## **Installation**
Actuellement les fonctionnalités d'enregistrement de score sont implémentées en PHP + MySQL, il vous faudra installer WampServer afin de permettre à votre ordinateur d'interprété le langage PHP et avoir accès à MySQL.
Quand le projet passera sur Node.JS, il vous faudra installer ce dernier, ainsi le projet tournera **uniquement** sous Node.JS et MySQL.

## **Comment contribuer**
Il est préférable, lors d'une pull request, qu'il n'y ai qu'un seul commit pour simplifier le merge final.
Merci de respecté l'indentation et les conventions utilisé dans le code, en voici quelques exemples :
- Une boucle à une instruction ne possède pas de crochets (if, for, while, etc ...)
- Les crochets ouvrants sont toujours à la ligne (sauf cas extrême d'écriture de fonction sur une ligne comme pour les addEventListener, setTimeout, etc ...)
- La documentation est requise pour chaque nouvelle classe, fonctions, méthodes, etc ...

Au niveau des tests, merci de vérifier que votre contribution fonctionne avant de l'envoyer, ne sachant pas comment testé avec JavaScript, tout code non fonctionnel compromettra la relecture du code.


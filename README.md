# PakaPuParty
![](https://github.com/MiltonEBR/PakaPuParty/blob/main/readmelogo.png)
## The idea
PakaPuParty was meant to be a multiplayer party game inspired by Mario Party, Pummel Party and browser games like agar.io and skribbl.io.
The objective was to put into practice what I learned from a 52 hour bootcamp on JavaScript.

## What it is
A game can be created with up to 8 players, in this game, you can throw the dice and select in which direction you want to go. Once your moves are done, the turn changes to the next player and continues indefinetly.

The server was made in [Node.js](https://nodejs.org) with the use of [Express.js](https://expressjs.com) and [socket.io](https://socket.io/). Thanks to [socket.io](https://socket.io/) and it's rooms, players can create multiple rooms. Each room gives them a randomly generated code, that other people can use to join the game.
Before the game starts, you are sent into a lobby where you can choose your color. Once all the players are ready, the game will start.

The game works by running [Matter.js](https://brm.io/matter-js/). on server side (One instance of an engine per game) and sending an update via socket.io as serialized objects positions, which are then interpreted by a custom renderer on the browser.

The reason the game uses [Matter.js](https://brm.io/matter-js/) it's because it was planned to be used for physic based minigames which didn't get implemented (explanation on **Why I stopped**).

## Why I stopped

I decided to stop the development as the project wasn't a challenge anymore and became a cycle of implementing already known logic and fixing non-challenging problems.

And the challenges that I did encounter were about game-development rather than increasing my software developer skills, therefore I decided to finish this project unfinished but in a working state and focus into new topics and projects that I find interesting.
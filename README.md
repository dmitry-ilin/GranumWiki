# Granum Wiki

A personal distributed Wiki based on Node.JS and Electron.
The key feature is synchronization over LAN.

## Usage

### Entities

Granum Wiki provides two main entities for operation:
1. Articles
2. Media (images/audio)

Both entities are not available for deletion, because it is not a note book but a personal knowledge base.
Articles are the main entity and represent knowledge imprints.

### Synchronization

The key feature of this Wiki is local network autodiscovery and synchronization. To make your app detect other nodes, you need to set up same "Network token" on every node you wish to connect.

Synchronization is performed in several cases:
* Once an article is updated, all available nodes are notified about it, so this particular article is going to be synced
* Once you've started an app, all available nodes are requested for article hashes to determine the diff and start full sync for this particular node
* Every N hours (based on sync frequency setting) all available nodes are requested for article hashes to determine the diff and start full sync for this particular node

Synchronization works based on Update time of every article. So, it is a bad idea to modify the same article on two different nodes without synchronization.

The same rules are valid for media as well.

### Hotkeys

Cmd/Ctrl + Shift + C - Copy currently opened article/media markdown code to clipboard
Cmd/Ctrl + N - Create a new article
Cmd/Ctrl + J - Create a new media
Cmd/Ctrl + E - Edit currently opened article/media
Cmd/Ctrl + S - Save currently opened article
Cmd/Ctrl + F - Search for text on current view
Cmd/Ctrl + Shift + F - Search for article

## Development info

### Technologies

Following technologies are in use:
* Node.JS
* Electron
* Semantic UI
* Angular
* jQuery
* SQLite
* Markdown

### How to run the code

#### Step 1

Clone the repository

#### Step 2

Go to ./sources directory and execute following:
```sh
bower i
npm i
npm run build-electron
```

#### Step 3

Start the app using following:
```sh
npm start
```

#### Possible issues:

If you see an error about Sequelize asking you to install SQLite module manually, run ```npm run build-electron``` one more time.

### How to build a package

The project uses __electron-build__ as the main building tool. So, you must satisfy it's [requirements](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) prior to building a package.

#### Build for Linux

On Linux machine, run following code:
```sh
cd ./sources
npm run dist
```

#### Build for OS X

On OS X machine, run following code:
```sh
cd ./macbuild
npm run dist
```

#### Build for Windows

It hasn't been tested yet.

## Licence

Granum Wiki is licensed under GNU GPL 2.0 only.

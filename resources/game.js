import {starnames} from "./starnames.js";

// ======== Sound & Music ========
class AudioController {
    constructor() {
        this.flipSounds = [
            new Audio('./resources/audio/Flip-01.mp3'),
            new Audio('./resources/audio/Flip-02.mp3'),
            new Audio('./resources/audio/Flip-03.mp3'),
            new Audio('./resources/audio/Flip-04.mp3'),
            new Audio('./resources/audio/Flip-05.mp3'),
            new Audio('./resources/audio/Flip-06.mp3')
        ];
        this.lastFlip = 0;

        this.travelSounds = [
            new Audio('./resources/audio/Travel-01.mp3'),
            new Audio('./resources/audio/Travel-02.mp3'),
            new Audio('./resources/audio/Travel-03.mp3'),
            new Audio('./resources/audio/Travel-04.mp3')
        ];
        this.lastTravel = 0;
        this.errorSound = new Audio('./resources/audio/Error.mp3');

        this.selectSounds = [
            new Audio('./resources/audio/Select-01.mp3'),
            new Audio('./resources/audio/Select-02.mp3'),
            new Audio('./resources/audio/Select-03.mp3'),
            new Audio('./resources/audio/Select-04.mp3')    
        ];
        this.lastSelect = 0;
        this.selecting = false;
        this.deselectSound = new Audio('./resources/audio/Deselect.mp3');

        this.matchSound = new Audio('./resources/audio/Match-01.mp3');
        
        this.towerIntroSound = new Audio('./resources/audio/16-Intro.mp3');
        this.towerHitSound = new Audio('./resources/audio/16-Hit.mp3');
        this.towerIntroSound.volume = 0.5;
        this.towerHitSound.volume = 0.5;

        this.priestessIntroSound = new Audio('./resources/audio/02-Intro.mp3');
        this.priestessHitSound = new Audio('./resources/audio/02-Hit.mp3');
        this.priestessHitSound.volume = 0.7;

        this.messageSound = new Audio('./resources/audio/Message.mp3');

        this.reshuffleSound = new Audio('./resources/audio/Reshuffle.mp3')

        this.bgMusic = new Audio('./resources/audio/Aphaxone-SpaceParticles.mp3');
        this.bgMusic.volume = 0.2;
        this.bgMusic.loop = true;
        this.bgMusicStarted = false;
    }
    
    flip() {
        let x = Math.floor(Math.random() * 6 );
        while( x == this.lastFlip){
            x = Math.floor(Math.random() * 6 );
        }
        this.flipSounds[x].play();
        this.lastFlip = x;
    }

    travel() {
        let x = Math.floor(Math.random() * 4 );
        while( x == this.lastTravel){
            x = Math.floor(Math.random() * 4 );
        }
        this.travelSounds[x].play();
        this.lastTravel = x;
    }

    error() {
        this.selecting = true;
        
        this.errorSound.play();
        
        setTimeout(() => {
            this.selecting = false;
        }, 200)
    }

    select() {
        this.selecting = true;

        let x = Math.floor(Math.random() * 4 );
        while( x == this.lastSelect){
            x = Math.floor(Math.random() * 4 );
        }
        this.selectSounds[x].play();
        this.lastSelect = x;

        setTimeout(() => {
            this.selecting = false;
        }, 200)
    }

    deselect() {
        setTimeout(()=> {
            if (!this.selecting) {
                this.deselectSound.play();
            } 
        }, 5)
        
    }

    reshuffle() {
        this.reshuffleSound.play();
    }

    message() {
        this.messageSound.play();
    }

    towerIntro() {
        setTimeout(() => {
            this.towerIntroSound.play();
        }, 400);
    }
    towerHit() {
        this.towerHitSound.play();
    }

    priestessIntro() {
        this.priestessIntroSound.play();
    }
    priestessHit() {
        this.priestessHitSound.play();
    }

    match() {
        this.matchSound.play();
    }

    startMusic() {
        this.bgMusic.play();
    }

    pauseMusic() {
        this.bgMusic.pause();
    }    

    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
}

// ======== Main Game ========
class NavigatorGame {
    constructor() {
        this.currentLevel = 0;
        this.levels = [
            {
                flips: 24,
                columns: 4,
                rows: 3,
                minors: 4,
                majors: 2,
                minorsList: ["01W","01V","01S","01C"],
                majorsList: ["02","16"]
            },
            {
                flips: 48,
                columns: 6,
                rows: 4,
                minors: 8,
                majors: 4,
                minorsList: ["01W","01V","01S","01C","02W","02V","02S","02C"],
                majorsList: ["01","02","13","16"]
            },
            {
                flips: 80,
                columns: 8,
                rows: 5,
                minors: 12,
                majors: 8,
                minorsList: ["01W","01V","01S","01C","02W","02V","02S","02C","03W","03V","03S","03C"], // TODO: Add 03X minors svgs
                majorsList: ["01","02","13","16"] // TODO: Choose 4 more majors
            }
        ]
        this.lastCard = null;
        this._gameReady = false;
        this.burnAnimation = 0;
        
        this._currentStar = null;
        this._selectedStar = null;
        this.routesAvailable = [];

        this.requiredResources = []
        this.destinationStar = ""
        this.destinationStarName = ""

        this.shipNames = [
            "Impolite Oblivion",
            "Siberion Alpha",
            "SSE Nimesis",
            "Thylacine Dream",
            "Rude Utopia",
            "Sadness of the Last Horizon",
            "Caelestis Bastion",
            "Baldrin Melody",
            "Galvanised Vagabond",
            "Falcon's Song",
            "Credulous Harbinger",
            "Saratoga Prospect"
        ]
    }

    get gameReady() {
        return this._gameReady;
    }

    set gameReady(bool) {
        this._gameReady = bool;
        if (this.gameReady) {
            let card = document.querySelector(".awaitingHover");
            if (card && card.flippable) {
                setTimeout(() =>{
                    card.classList.add("cardHovered");
                    card.classList.remove("awaitingHover");
                }, 500);
                
            }
        } else {
            let card = document.querySelector(".cardHovered");
            if (card) {
                card.classList.add("awaitingHover");
                card.classList.remove("cardHovered");
            }
        }
    } 

    get currentStar() {
        return this._currentStar;
    }

    set currentStar(newStar) {
        if (newStar) {
            this._currentStar = newStar;
            
            // Update currentstar settings
            starfield[newStar.id].reached = true;
            
            // Update the whole starfield
            this.routesAvailable = this.currentStar.connectsTo;
            for (let star in starfield) {
                starfield[star].accessible = false;
                this.starChart[star].classList.add("inaccessibleNode")
                this.starChart[star].classList.remove("currentNode")
                
            }
            for (let i in this.routesAvailable) {
                let star = this.routesAvailable[i];
                starfield[star].accessible = true;
                this.starChart[star].classList.remove("inaccessibleNode")
            }
            
            // Update currentstar visuals
            let starVisual = this.starChart[newStar.id];
            starVisual.classList.add("currentNode")
        } else {
            this._currentStar = null;
        }
    }

    get selectedStar() {
        return this._selectedStar;
    }

    set selectedStar(newStar){
        if (newStar) {
            let lastSelectedStar = this._selectedStar;
            this._selectedStar = newStar;
            if(lastSelectedStar){
                this.deselectStar(lastSelectedStar.id);
            }
        } else {
            this._selectedStar = null;
        }
    }

    restart() {
        audioController.reshuffle();
        // Remove remaining cards.
        cards.forEach(function(card) {
            card.remove();
        })

        // Remove map.
        for (let starVisual in game.starChart) {
            game.starChart[starVisual].remove();
        }

        let linesArr = Array.from(document.querySelectorAll("line"))
        linesArr.forEach(function(line) {
            line.remove();
        })

        // Reset counters
        this.counter_W.value = 0;
        this.counter_V.value = 0;
        this.counter_S.value = 0;
        this.counter_C.value = 0;
        this.adjustCounters("W");
        this.adjustCounters("V");
        this.adjustCounters("S");
        this.adjustCounters("C");

        // Reset flips
        let level = this.levels[this.currentLevel]
        this.flipCount = level.flips;
        this.flips.innerText = this.flipCount

        // Reshuffle & re-deal
        game.shuffleCards(game.cardsList);
        game.populateGrid();
        cards = Array.from(document.getElementsByClassName("card"))
        game.buildCardObjects();

        selectedPermutations = selectPermutationsWithIdenticalLast(allPermutations);
        appendCount(selectedPermutations);
        starfield = createStarfield();
        assignStarNames(starfield);
        assignCoordinates(starfield);
        plotRoutes(starfield);
        game.currentStar = null;
        game.routesAvailable = [];
        game.initiallyAvailableRoutes()

        game.gameReady = true;
    }

    createLayout() {
        let gameGrid = document.getElementById("game-grid");
        let level = this.levels[this.currentLevel]
        gameGrid.style.gridTemplateColumns = `repeat(${level.columns}, var(--card-width))`;
        gameGrid.style.gridTemplateRows = `repeat(${level.rows}, var(--card-height))`;
        
        const cardSlot = '<div class="card-slot"></div>';
        gameGrid.innerHTML = cardSlot.repeat(level.columns * level.rows);

        this.flips = document.getElementById("flips");
        this.flipCount = level.flips;
        this.flips.innerText = this.flipCount
    }

    createCardsList () {
        let level = this.levels[this.currentLevel]
        this.cardsList = level.minorsList.concat(level.majorsList);
        let tempCardsList = [];
        for(let i = 0; i < this.cardsList.length; i++) {
            tempCardsList.push(this.cardsList[i]);
            tempCardsList.push(this.cardsList[i]);
        }
        this.cardsList = tempCardsList;
    }

    shuffleCards(cardsList) {
        for(let i = cardsList.length-1; i > 0; i--) {
            let randIndex = Math.floor(Math.random()*(i+1));
            let shuffleMemory = cardsList[randIndex];
            cardsList[randIndex] = cardsList[i]
            cardsList[i] = shuffleMemory;
        }
    }

    populateGrid() {
        const gridArr = Array.from(document.getElementsByClassName("card-slot"));

        for (let i=0; i < this.cardsList.length; i++){
            gridArr[i].innerHTML+= `<div class="card">
                <div class="card-back card-face">
                    <img class="card-img" src="./resources/svg/Back.svg" alt="">
                </div>
                <div class="card-front card-face"><img class="card-img" src="./resources/svg/Front.svg" alt=""><img class="card-img" src="./resources/svg/${this.cardsList[i]}.svg" alt="">
                </div>
            </div>`;
        }
    }

    buildCardObjects() {
        cards.forEach((card, index) => {
            card.value = game.cardsList[index];
            card.flippable = true;
            card.seen = 0;
            card.matched = false;
            card.addEventListener("click", function() {
                cardFlip(card)
            });

            card.addEventListener("mouseover", function() {
                if (game.gameReady && this.flippable) {
                    this.classList.add("cardHovered");
                } else {
                    this.classList.add("awaitingHover");
                }
            })

            card.addEventListener("mouseout", function() {
                this.classList.remove("awaitingHover");
                this.classList.remove("cardHovered");
            })
        //console.log(`${index+1}: ${card.value}`)  //Debug
        });
    }

    setCounters() {
        this.counter_W = document.getElementById("resource-W");
        this.counter_W.value = 0;
        this.counter_W.resource = "W";
        this.counter_V = document.getElementById("resource-V");
        this.counter_V.value = 0;
        this.counter_V.resource = "V";
        this.counter_S = document.getElementById("resource-S");
        this.counter_S.value = 0;
        this.counter_S.resource = "S";
        this.counter_C = document.getElementById("resource-C");
        this.counter_C.value = 0;
        this.counter_C.resource = "C";

        this.countersArr = [this.counter_W, this.counter_V, this.counter_S, this.counter_C]
        this.countersArr.forEach((counter) => {
            counter.addEventListener("click", (event) => {
                this.spendResource(counter)
            })
        })
    }

    adjustCounters(resource) {
        if (this[`counter_${resource}`].value > 0) {
            this[`counter_${resource}`].src = `./resources/svg/counters/1${resource}.svg`
        } else {
            this[`counter_${resource}`].src = `./resources/svg/counters/0${resource}.svg`
        }
    }

    findCounterparts() {
        // Returns least frequently seen pair of unmatched cards, 
        // selecting randomly if more than 1 pair is least seen. 
        const pairsArr = [];

        // Collects pairs of unmatched cards into pairsArr
        const unmatchedCards = cards.filter((card) => !card.matched);
        game.levels[game.currentLevel].minorsList.forEach((value) => {
            let pair = unmatchedCards.filter((card) => card.value == value);
            if (pair.length > 0) {
                pair.seen = (pair[0].seen + pair[1].seen)
                pairsArr.push(pair);
            }
            
        })
        
        // Shuffles pairsArr
        this.shuffleCards(pairsArr)

        // Returns least seen pair
        pairsArr.sort((a, b) => a.seen - b.seen)
        return pairsArr[0];
    }

    matchBurn(card, delay = false) {
        const cardFront =  card.querySelector(".card-front");
        const img = card.firstElementChild.querySelector('img');
        this.burnAnimation++;
        if (this.burnAnimation > 5) this.burnAnimation = 1;
        const burn = document.createElement("video");
        burn.src = `./resources/vid/cardBurn_${this.burnAnimation}.webm`;
        burn.autoplay = true;
        burn.classList.add("burn")
        
        let t = 150;
        if (delay) t = 300;
        setTimeout(()=> {
            cardFront.removeChild(cardFront.firstChild);
            cardFront.firstChild.classList.add("fadeAway")
            cardFront.prepend(burn.cloneNode(true));
        }, t)
        setTimeout(()=>{
            cardFront.removeChild(cardFront.firstChild)
        }, t+2000)
        
    }

    checkMatch(card) {
        // First Pick
        if (game.lastCard == null) {
            game.gameReady = false;
            card.flippable = false;
            game.lastCard = card;
            game.checkValue(card.value, false);

            (game.flipCount > 0) ? game.gameReady = true : game.gameReady= false;

        }

        // No-Match
        else if (game.lastCard.value != card.value) {
            game.gameReady = false;
            card.flippable = false;
            game.checkValue(card.value, false);
            setTimeout(() => {
                card.classList.toggle('flipped');
                game.lastCard.classList.toggle('flipped');
                card.flippable = true;
                game.lastCard.flippable = true;
                audioController.flip();
                game.lastCard = null;
                
                (game.flipCount > 0) ? game.gameReady = true : game.gameReady= false;

            }, 1300)    
        }

        // Match
        else if (game.lastCard.value == card.value){
            game.gameReady = false;
            card.flippable = false;
            card.matched = true;
            game.lastCard.flippable = false;
            game.lastCard.matched = true;
            game.matchBurn(card)
            game.matchBurn(game.lastCard, true)
            game.lastCard = null;
            
            
            game.checkValue(card.value);    
        }
    }
    
    checkValue(value, match=true) {
        setTimeout(() => {
            switch (value) {
                
                // ===== Majors =====
                case "16":
                    if (!match) {
                        audioController.towerIntro();
                    } else {
                        audioController.towerHit();
                        let flipsDown = Math.floor(game.flipCount / 2)
                        const towerHits = setInterval(() => {
                            game.flipCount--
                            game.flips.classList.toggle("reducingFlips");
                            game.flips.innerText--;
                            flipsDown--;
                            if (flipsDown <= 0) {
                                clearInterval(towerHits);
                                game.flips.classList.remove("reducingFlips");
                                (game.flipCount > 0) ? game.gameReady = true : game.gameReady= false;
                            }
                            
                        }, 300);
                        
                    }
                    break;
                
                case "02":
                    if (!match){
                        audioController.priestessIntro();
                    } else {
                        audioController.priestessHit();
                        let foundPair = this.findCounterparts();
                        if (foundPair){
                            // Building sparkle effect
                            const sparkle = document.createElement("video");
                            sparkle.src = "./resources/vid/CardSparkle.webm"
                            sparkle.autoplay = true;
                            // sparkle.loop = true; // Debug
                            sparkle.classList.add("sparkle")

                            foundPair[0].prepend(sparkle.cloneNode(true));
                            setTimeout(() => {
                                foundPair[1].prepend(sparkle.cloneNode(true));
                            }, 150);
                            setTimeout(() => {
                                foundPair[0].removeChild(foundPair[0].firstChild);
                                setTimeout(() => {
                                    foundPair[1].removeChild(foundPair[1].firstChild);
                                }, 150);
                            }, 2000);

                            
                        }
                        (game.flipCount > 0) ? game.gameReady = true : game.gameReady= false;
                        
                    }
                    break;
                
                // ===== Minors =====
                default: 
                    if (!match){ 
                        
                    } else {
                        let resource = null;
                        switch(value) {
                            case "01W":
                                resource = "W"
                                break;
                            case "01V":
                                resource = "V"
                                break;
                            case "01S":
                                resource = "S"
                            break;
                            case "01C":
                                resource = "C"
                            break;
                        }

                        if (resource) {
                            game[`counter_${resource}`].value++
                            game.adjustCounters(resource)
                        }
                        
                        audioController.match();
                        (game.flipCount > 0) ? game.gameReady = true : game.gameReady= false;
                    }
                    
            }

            
        }, 600);
        
    }

    initiallyAvailableRoutes() {
        this.starChart = {};

        for (let star in starfield) {
            this.starChart[star] = document.getElementById(`${star}`);

            if (starfield[star].accessible) {
                this.routesAvailable.push(star)
            }
        }

        for (let starNode in this.starChart) {
            // Access the DOM element associated with the star
            const element = this.starChart[starNode];
             // Add event listener to the DOM element
            element.addEventListener("click", (event) => {
                const id = element.id
                this.selectStar(id);
        })
    }
        document.addEventListener("click", function(event){
                if (game.selectedStar) {
                    const id = game.selectedStar.id;
                    const starVisual = game.starChart[id]
                    if (!starVisual.contains(event.target)) {
                        game.deselectStar(id);
                        game.selectedStar = null;
                        audioController.deselect();
                    }
                }
        })

    }

    // Select star on click function
    selectStar(id) {
        const star = starfield[id];
        const starVisual = this.starChart[id]
        

        // if star is accessible
        if (star.accessible) { 
            // star becomes selected
            this.selectedStar = star;
            starVisual.classList.add("selectedNode")

            //plays select sound
            audioController.select();

            // game.required resources are changed.
            let resource = null;
            switch(star.requiredRes[0]) {
                case "01W":
                    resource = "W"
                    break;
                case "01V":
                    resource = "V"
                    break;
                case "01S":
                    resource = "S"
                break;
                case "01C":
                    resource = "C"
                break;
            }
            this.requiredResources.push(resource)
            
            // required resources are highlighted
            starVisual.querySelector(".nodename").classList.add("selectedNodeName");
            starVisual.querySelector(".resourceReq").classList.add("selectedResource");
            // on the resource counter too
            this[`counter_${resource}`].parentNode.classList.add("requiredResource");
        }

    }
    

    deselectStar(id) {
        const starVisual = this.starChart[id];
        starVisual.classList.remove("selectedNode");
        starVisual.querySelector(".nodename").classList.remove("selectedNodeName");
        starVisual.querySelector(".resourceReq").classList.remove("selectedResource");
        
        let resource = this.requiredResources[0];
        let parent = this[`counter_${resource}`].parentNode;
        parent.classList.remove("requiredResource");
        this.requiredResources = [];
    }

    //spend resource on click function
    spendResource(id) {
        if (this.selectedStar && this.requiredResources.includes(id.resource) && id.value > 0) {
            id.value--;
            this.adjustCounters(id.resource)

            // Update lines on travel
            let line = "";
            if (this.currentStar) {
                line = document.getElementById(`${this.currentStar.id}${this.selectedStar.id}`);
            } else {
                line = document.getElementById(`shipNode${this.selectedStar.id}`);
            }
            line.setAttribute('stroke-dasharray', '0');

            game.currentStar = this.selectedStar;
            audioController.travel();
            if (game.destinationStar.reached) {
                setTimeout(() =>{
                    success();
                }, 3500)
            }
        } else if (this.selectedStar && this.requiredResources.includes(id.resource)) {
            audioController.error();
        }
    }
}

function cardFlip(card) {
    if (card.flippable && game.gameReady) {
        audioController.flip();
        card.classList.toggle('flipped');
        card.seen++;
        
        game.checkMatch(card);

        if (card.classList.contains('flipped') ) {      // if a card WAS flipped
            game.flipCount--;
            game.flips.innerText = game.flipCount;
            if (game.flipCount <= 0) {
                game.flips.dispatchEvent(noFlipsLeftEvent);
            }
        }
    }
}



// starnames.js below for simplicity.

// ===============================

// === Star Class ===
class Star {
    constructor (id, row, column, array) {
        this.id = id;
        this.name = "";
        this.requiredRes = [id.match(/^(?:01|02)[A-Z]+/)[0]];
        this.optionalRes = [];
        this.row = row;
        this.level = column;
        this.connectsTo = (array[row][column + 1]) ? [`${array[row][column + 1]}`] : [];
        this.x = 0;
        this.y = 0;
        if (this.level == 0) {this.accessible = true } else {this.accessible = false}
        this.reached = false;
    }
}

// Generate all permutations of an array
function permuteStars(arr) {
    const result = [];
    
    // Recursive helper function to generate permutations
    function permuteHelper(currentPerm, remainingElems) {
        if (remainingElems.length === 0) {
            result.push(currentPerm);
            return;
        }
        
        for (let i = 0; i < remainingElems.length; i++) {
            const nextPerm = currentPerm.concat(remainingElems[i]);
            const remaining = remainingElems.slice(0, i).concat(remainingElems.slice(i + 1));
            permuteHelper(nextPerm, remaining);
        }
    }
    
    permuteHelper([], arr);
    return result;
}

// Randomly select four permutations that share an identical last object
function selectPermutationsWithIdenticalLast(permutations, i = 1) {
    const selected = [];
    const reference = Math.floor(Math.random() * permutations.length);
    

    while (selected.length < 4) {
        
        const index = Math.floor(Math.random() * permutations.length);
        const permutation = permutations[index];
        if (permutation[permutation.length - 1] === permutations[reference][permutations[reference].length - 1]) {
            selected.push(permutation);
        }
    }
    
    // Ensure that selected permutations are unique:
    let allUnique = selected.length === new Set(selected).size;
    
    if (allUnique) {
        return selected;
    } else {
        return selectPermutationsWithIdenticalLast(permutations, i + 1);
    }
    
}


function indicateSharedElements(arr) {

    for (let i = 0; i < arr.length; i++) {
        const row = arr[i];
    }
}

function appendCount(array) {
    const tallies = {};
    const found = [];
    
    // Iterate through the array
    for (let col = 0; col < array[0].length; col++) {
        for (let row = 0; row < array.length; row++) {
            const currentString = array[row][col];
    
            // Generate key to track tally for the current string
            const key = `${currentString}_${col}`;
    
            // First Time Found
            if (!found.includes(currentString)) {
                found.push(currentString) // Add to found
                tallies[key] = 1; // Add to tallies
            
            
            // Found in prior columns only
            } else if (!tallies[key]) {
                let lastColumn = col - 1;
                function priorKey() {return `${currentString}_${lastColumn}`}
                while (!tallies[priorKey()]) {
                    lastColumn--;
                }
                tallies[key] = tallies[priorKey()] + 1;
            } 
                
            // Found in prior column AND this column (earlier)
            // do nothing.
    
    
            // Append the tally to the current string
            array[row][col] = `${currentString}${tallies[key]}`;
        }
    }
    
}




function createStarfield(starfield = {}) {
        
    for (let row = 0; row < selectedPermutations.length; row++) {
        for (let col = 0; col < selectedPermutations[row].length; col++) {
            let key = `${selectedPermutations[row][col]}`
            if (!starfield[key]) {
                starfield[key] = new Star(key, row, col, selectedPermutations);
            } else {
                if(selectedPermutations[row][col + 1] ) {
                    starfield[key].connectsTo.push(selectedPermutations[row][col + 1])
                    starfield[key].connectsTo = [...new Set(starfield[key].connectsTo)] // Prevents occasional duplicated connectsTo values. 
                }
            }
        }
    }
    
    return starfield;
}

function assignStarNames(starsObj){
    const usedStarNames = [];
    
    for (let starKey in starsObj) {
        const randIndex = Math.floor(Math.random() * starnames.length);
        let randName = starnames[randIndex];

        // Until name not used generate another name
        while (usedStarNames.includes(randName)) {
            randName = starnames[Math.floor(Math.random() * starnames.length)];
        }

        // Assign to star.name
        starsObj[starKey].name = randName;
        usedStarNames.push(randName);
    }
}

function scrollMessage() {
    const scrollMessage = document.getElementById("scrollMessage");
    const scrollMessageClose = document.getElementById("scrollMessageClose")
    if (ship.getBoundingClientRect().top > (window.innerHeight - 50)) {
        scrollMessage.classList.add("messageOnScreen")
    }
    scrollMessageClose.addEventListener("click", () => {
        scrollMessage.classList.remove("messageOnScreen")
    })
}

function assignCoordinates(stars){
    // Get the width and height of starfield area
    const fieldContainer = document.getElementById("starMap");
    fieldContainer.style.height = document.getElementById("game-grid").clientHeight + "px"
    let mapWidth = fieldContainer.clientWidth;
    let mapHeight = fieldContainer.clientHeight;

    // Find the star with the highest level
    let highestLevelStar = null;
    for (let key in stars) {
        let star = stars[key];
        if (!highestLevelStar || star.level > highestLevelStar.level) {
            highestLevelStar = star;
        }
    }

    // Set xy values, & name of the highest level star
    highestLevelStar.x = mapWidth / 2;
    highestLevelStar.y = 0;
    if (game.currentLevel == 0) {
        highestLevelStar.name = "Founders\n Star";
    } else { highestLevelStar.name = "Coda\n Galaxy"}
    game.destinationStar = highestLevelStar;
    game.destinationStarName = highestLevelStar.name;

    // Set xy values for ship
    ship.x = highestLevelStar.x;
    ship.y = mapHeight;
    ship.style.left = `${ship.x}px`;
    ship.style.top = ship.y + "px";

    // Display scrollMessage if ship out of view
    scrollMessage()

    // Create an array to track star positions and prevent overcrowding
    const starsXYarr = [];
    starsXYarr.push([highestLevelStar.x, highestLevelStar.y]);
    
    // Reserving space for the ship starting location 
    starsXYarr.push([ship.x, ship.y]);

    function placeStar(star) {
        let node = document.getElementById("starTemplate").cloneNode(true); 
        node.id = star.id;

        // Create resource requirements display
        const resourceReqDiv = node.querySelector(".resourceReq")
        const resourceImg = document.createElement("img")
        let resource = null;
        switch(star.requiredRes[0]) {
            case "01W":
                resource = "W"
                break;
            case "01V":
                resource = "V"
                break;
            case "01S":
                resource = "S"
            break;
            case "01C":
                resource = "C"
            break;
        }
        resourceImg.src = `./resources/svg/counters/1${resource}.svg`
        resourceReqDiv.appendChild(resourceImg)

        node.style.left = star.x + "px";
        node.style.top = star.y + "px";
        node.classList.remove("template");
        node.firstChild.firstChild.innerText = star.name;

        // Apply .inaccessibleNode styling to inacessible nodes
        if (!star.accessible) {node.classList.add("inaccessibleNode")}

        fieldContainer.appendChild(node);
        if (star.name == "Founders\n Star" || star.name == "Coda\n Galaxy") node.firstChild.classList.add("exit-star");
    }

    placeStar(highestLevelStar);
    

    // Calculate levelHeight & rowWidth values
    const highestLevel = highestLevelStar.level;
    const levelHeight = mapHeight / highestLevel;
    const rowWidth = mapWidth / 4;

    function randInRange(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Calculate x & y value for every other star
    for (let key in stars) {
        
        let star = stars[key];
        if (star != highestLevelStar) {

            //Setting minimum and maximum ranges,
            //Math.min Math.max clamp prevents stars touching edge of field.
            const minY = Math.floor(Math.max(60, (mapHeight - ((star.level + 1) * levelHeight))));
            const maxY = Math.floor(Math.min(mapHeight - 100, (mapHeight - (star.level * levelHeight))));
            const minX = Math.floor(Math.max(30, (star.row * rowWidth)));
            const maxX = Math.floor(Math.min((mapWidth - 30), ((star.row + 1) * rowWidth)));

            star.y = randInRange(minY, maxY);
            star.x = randInRange(minX, maxX);

            const tooClose = (element) => {
                if (Math.abs(element[0] - star.x) <= 30 && Math.abs(element[1] - star.y) <= 40) {
                    return true;
                } else {
                    return false;
                }
            }            

            while(starsXYarr.some(tooClose)) {
                star.y = randInRange(minY, maxY);
                star.x = randInRange(minX, maxX);
            }

            placeStar(star);
            starsXYarr.push([star.x, star.y])
            
        }
        
    }

    
}



function plotRoutes(stars) {
    const svgContainer = document.getElementById('svg-container');
    const line = document.createElementNS("http://www.w3.org/2000/svg", 'line');

    function drawLineBetweenNodes(nodeOne, nodeTwo) {

        // Create line element
        line.setAttribute('x1', nodeOne.x); 
        line.setAttribute('y1', nodeOne.y);
        line.setAttribute('x2', nodeTwo.x);
        line.setAttribute('y2', nodeTwo.y);
        line.setAttribute('stroke', '#ffffff99');
        line.setAttribute('stroke-dasharray', '7, 15');
        line.setAttribute('stroke-width', '0.5')
        line.setAttribute('stroke-dashoffset', '10')
        line.setAttribute('id', `${nodeOne.id}${nodeTwo.id}`)
    
        // Append line to SVG container
        svgContainer.appendChild(line.cloneNode(true));
        
    }

    for (let key in stars) {
        let star = stars[key];
        

        if (star.connectsTo.length > 0) {
            for (let i in star.connectsTo) {
                drawLineBetweenNodes(star, stars[star.connectsTo[i]])
            }
        }

        if (star.level == 0) {
            drawLineBetweenNodes(ship, star)
        }
    }
}


const game = new NavigatorGame;
// game.currentLevel++
game.createLayout();
game.createCardsList();
game.shuffleCards(game.cardsList);
game.populateGrid();
let cards = Array.from(document.getElementsByClassName("card"));
game.buildCardObjects();
game.setCounters();




let audioController = new AudioController;

// ==============

let list = Array.from(game.levels[game.currentLevel].minorsList)
const allPermutations = permuteStars(list);
let selectedPermutations = selectPermutationsWithIdenticalLast(allPermutations);

appendCount(selectedPermutations);
let starfield = createStarfield();
const ship = document.getElementById("shipNode");
assignStarNames(starfield);
assignCoordinates(starfield);
plotRoutes(starfield);
game.initiallyAvailableRoutes()

game.gameReady = true;


// ===== Background Music Start & Stop =====
const page = document.getElementById("root");

// Starts music once page clicked.
page.addEventListener("click", function () {    
    if (!audioController.bgMusicStarted) {
        audioController.startMusic();
        audioController.bgMusicStarted = true;
    };
})
// Pauses Music if tab loses focus.
window.onblur = () => {
    audioController.pauseMusic();
    audioController.bgMusicStarted = false;
}


// ===== Game End Conditions =====

// Stop cardflips
const noFlipsLeftEvent = new Event("noFlipsLeft");
game.flips.addEventListener("noFlipsLeft", () => {
    game.gameReady = false;
    
    function canJourneyContinue() {
        // Create an array of the resources required for available routes
        let nextResources = []
        game.routesAvailable.forEach((route) => {
            let match = route.match(/[A-Z]+/);
            if (match) {
                let resource = match[0];
                nextResources.push(resource);
            }
        });

        let anyResourceHeld = false;
        // Iterate over elements in nextResources
        nextResources.forEach(resource => {
            // Check if the counter value is greater than 0
            if (game[`counter_${resource}`].value > 0) {
                // If a counter has a value greater than 0, set the flag to true
                anyResourceHeld = true;
            }
        });
    
        // Check if any counter has a value greater than 0
        if (!anyResourceHeld) {
            failure();
        } else {
            // Check again after 2s
            setTimeout(canJourneyContinue, 2000);
        }
    }
    canJourneyContinue();
})


// ===== Success Letter =====
function success() {
    audioController.message();
    const successOverlay = document.createElement("div");
    const successMessageTitle = document.createElement("h2");
    const successMessageText = document.createElement("p");
    const successMessageLetter = document.createElement("div");
    successMessageLetter.className = "message-letter";
    successOverlay.className = "message-overlay";
    
    const reviewContainer = document.createElement("div");
    reviewContainer.className = "review-container";
    
    const score = document.createElement("h2");
    score.id = "message-score";
    score.innerHTML = `Efficiency Score: <span>${game.flips.innerText}</span>`
    
    const restart = document.createElement("h3");
    restart.id = "restart";
    restart.innerHTML = "Return to the void. (Restart)"
    restart.addEventListener("click", function() {
        successOverlay.classList.remove("message-slide-in")
        audioController.deselect()
        game.restart();
        setTimeout(() =>{
            successOverlay.remove()
        }, 2500)
    });


    
    const shipName = game.shipNames[Math.floor(Math.random()* game.shipNames.length)]
    
    successMessageTitle.textContent = "Course Charted: Success"
    successMessageText.innerHTML = `Dear Navigator,<br><br><br>
        We pray that this message finds you well.<br><br>
        As we journey through the vast expanse of space aboard the ${shipName}, we wanted to take a moment to express our sincerest gratitude for the invaluable role you've played in charting our course.<br><br>
        Your skillful navigation has been instrumental in guiding us safely through this hostile void.<br><br> Thanks to your expertise, our voyage has been smooth and steady, allowing us to maintain course towards our destination at ${game.destinationStarName} with confidence and precision.<br><br>
        We are pleased to report that our progress continues to be on track and our systems remain fully operational.<br><br>
        The crew has been in high spirits, buoyed by the knowledge that we are under the guidance of such a capable navigator.<br><br>
        We are making good time.<br><br>
        There will be no further correspondence until we reach ${game.destinationStarName}.<br><br><br> 
        Wishing you clear skies and smooth sailing,<br><br><br><br>
        
        Elegy Blake,<br><br>First Officer / Devemora<br>
        On behalf of the Crew of the ${shipName}.`
        
    successOverlay.appendChild(successMessageTitle);
    successOverlay.appendChild(successMessageLetter);
    successOverlay.appendChild(reviewContainer);
    reviewContainer.appendChild(score);
    reviewContainer.appendChild(restart);
    successMessageLetter.appendChild(successMessageText);
    page.appendChild(successOverlay);
    game.gameReady = false;
    setTimeout(() => {
        successOverlay.classList.add("message-slide-in");
    }, 2000)
}

// ===== Failure Letter =====
function failure() {
    audioController.message();
    const failureOverlay = document.createElement("div");
    const failureMessageTitle = document.createElement("h2");
    const failureMessageText = document.createElement("p");
    const failureMessageLetter = document.createElement("div");
    failureMessageLetter.className = "message-letter";
    failureOverlay.className = "message-overlay";
    
    const reviewContainer = document.createElement("div");
    reviewContainer.className = "review-container";
    
    const score = document.createElement("h2");
    score.id = "message-score";
    score.innerHTML = `Efficiency Score: <span>${game.flips.innerText}</span>`
    
    const restart = document.createElement("h3");
    restart.id = "restart";
    restart.innerHTML = "Return to the void. (Restart)"
    restart.addEventListener("click", function() {
        failureOverlay.classList.remove("message-slide-in")
        audioController.deselect()
        game.restart();
        setTimeout(() =>{
            failureOverlay.remove()
        }, 2500)
    });


    const shipName = game.shipNames[Math.floor(Math.random()* game.shipNames.length)]
    let lastKnown = ""
    
    if(game.currentStar) {
        lastKnown = `Our last known location was the vicinity of ${game.currentStar.name}<br><br>`;
    } else {
        lastKnown = `Our sensors have failed, and location data has been corrupted.<br><br>`
    }
    
    failureMessageTitle.textContent = "Course Charted: Failure"
    failureMessageText.innerHTML = `Dear Navigator,<br><br><br>
        We pray that this message reaches you.<br><br><br>
        As we traverse the boundless void aboard the ${shipName}, we find ourselves in a dire predicament, and we must address it with utmost urgency.<br><br>
        Our journey, once filled with hope and determination, has taken a devastating turn.<br><br>
        We are lost, and we have little chance of ever reaching ${game.destinationStarName}.<br><br> 
        Furthermore, I regret to inform you that the responsibility for our current plight rests heavily upon your shoulders, dear Navigator. Your navigational decisions, once trusted and revered, have led us astray in this perilous abyss.<br><br>
        ${lastKnown}
        The crew's morale has plummeted as uncertainty and fear grip our hearts. Mutiny looms in every shadow.<br><br>
        Each passing moment brings us closer to despair as our resources dwindle and our hopes fade.<br><br> 
        If this distress call reaches you please provide immediate assistance. Our survival depends on you.<br><br>
        We await your guidance with bated breath, clinging to the faint glimmer of faith that remains.<br><br><br>
        May your wisdom and expertise illuminate our path through this darkened void.<br><br><br><br>
        
        Elegy Blake,<br><br> First Officer / Devemora<br> 
        On behalf of the Desperate Crew of the ${shipName}`
    
    
    failureOverlay.appendChild(failureMessageTitle);
    failureOverlay.appendChild(failureMessageLetter);
    failureOverlay.appendChild(reviewContainer);
    reviewContainer.appendChild(score);
    reviewContainer.appendChild(restart);
    failureMessageLetter.appendChild(failureMessageText);
    page.appendChild(failureOverlay);
    game.gameReady = false;
    setTimeout(() => {
        failureOverlay.classList.add("message-slide-in");
    }, 2000)
}

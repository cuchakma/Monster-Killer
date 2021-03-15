const ATTACK_VALUE         = 10;
const MONSTER_ATTACK_VALUE = 21; 
const STRONG_ATTACK_VALUE  = 17;
const HEAL_VALUE           = 20; 

const MODE_ATTACK                    = 'ATTACK';
const MODE_STRONG_ATTACK             = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK        = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK       = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL          = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER            = 'GAME_OVER';

let enteredValue = prompt( 'Please Enter The Max Life For You And The Monster', '100' );


let chosenMaxLife = parseInt(enteredValue);
let battleLog     = [];

if( isNaN( chosenMaxLife )  || chosenMaxLife <= 0 ){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth  = chosenMaxLife;
let hasBonusLife         = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
    let logEntry = {
        event              : ev,
        value              : val,
        finalMonsterHealth : monsterHealth,
        finalPlayerHealth  : playerHealth
    };
    switch(ev) {
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                event              : ev,
                value              : val,
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth  : playerHealth
            }
            break;
    }
    battleLog.push(logEntry);
    // if( ev === LOG_EVENT_PLAYER_ATTACK ) {
    //    logEntry.target = 'MONSTER'
    // }else if( ev === LOG_EVENT_PLAYER_STRONG_ATTACK ) {
    //     logEntry.target = 'MONSTER';
    // } else if( ev === LOG_EVENT_MONSTER_ATTACK ) {
    //    logEntry.target = 'PLAYER';
    // } else if( ev === LOG_EVENT_PLAYER_HEAL ) {
    //     logEntry.target = 'PLAYER';
    // } else if( ev === LOG_EVENT_GAME_OVER ) {
    //     logEntry = {
    //         event              : ev,
    //         value              : val,
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth  : playerHealth
    //     }
    // }
    // battleLog.push(logEntry);
}

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth  = chosenMaxLife;   
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog( LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth );

    if( currentPlayerHealth <= 0 && hasBonusLife ) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but the bonus life saved you");
        
    }

    if( currentMonsterHealth <= 0 && currentPlayerHealth > 0 ) {
        alert('You Won');
        writeToLog( LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMonsterHealth, currentPlayerHealth );
    } else if( currentPlayerHealth <= 0 && currentMonsterHealth > 0 ) {
        alert( 'You Lost' );
        writeToLog( LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMonsterHealth, currentPlayerHealth );
    } else if( currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ) {
        alert('The Match Is Draw');
        writeToLog( LOG_EVENT_GAME_OVER, 'DRAW', currentMonsterHealth, currentPlayerHealth );
    }

    if( currentMonsterHealth <= 0 && currentPlayerHealth > 0 || currentPlayerHealth <= 0 && currentMonsterHealth > 0 || currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ) {
        reset();
    }
}

function attackMonster(mode) {
    const maxDamage = ( mode === MODE_ATTACK ) ? ATTACK_VALUE : (mode === MODE_STRONG_ATTACK) ? STRONG_ATTACK_VALUE:''; 
    const logEvent  =  ( mode === MODE_ATTACK ) ? LOG_EVENT_PLAYER_ATTACK : (mode === MODE_STRONG_ATTACK) ? LOG_EVENT_PLAYER_STRONG_ATTACK:'';

    // if( mode == MODE_ATTACK ) {
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // } else if( mode == MODE_STRONG_ATTACK ) {
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent  = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }

    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    writeToLog( logEvent, damage, currentMonsterHealth, currentPlayerHealth );
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
    console.log(MODE_ATTACK)
}

function strongAttackHandler() {
    attackMonster(MODE_STRONG_ATTACK);
    console.log(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
    let healValue;
    if( currentPlayerHealth >= (chosenMaxLife - HEAL_VALUE) ) {
        alert("You can't heal more than your max initial health.");
        healValue = chosenMaxLife - currentPlayerHealth;
    } else {
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog( LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth );
    console.log('HEAL');
    endRound();
}

function printLogHandler() {
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler );
strongAttackBtn.addEventListener('click', strongAttackHandler );
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener( 'click', printLogHandler );
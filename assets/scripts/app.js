const ATTACK_VALUE         = 10;
const MONSTER_ATTACK_VALUE = 21; 
const STRONG_ATTACK_VALUE  = 17;
const HEAL_VALUE           = 20; 

const MODE_ATTACK        = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

let enteredValue = prompt( 'Please Enter The Max Life For You And The Monster', '100' );
let chosenMaxLife = parseInt(enteredValue);

if( isNaN( chosenMaxLife )  || chosenMaxLife <= 0 ){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth  = chosenMaxLife;
let hasBonusLife         = true;

adjustHealthBars(chosenMaxLife);

function reset() {
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth  = chosenMaxLife;   
    resetGame(chosenMaxLife);
}

function endRound() {
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    if( currentPlayerHealth <= 0 && hasBonusLife ) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but the bonus life saved you");
        
    }

    if( currentMonsterHealth <= 0 && currentPlayerHealth > 0 ) {
        alert('You Won');
    } else if( currentPlayerHealth <= 0 && currentMonsterHealth > 0 ) {
        alert( 'You Lost' );
    } else if( currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ) {
        alert('The Match Is Draw');
    }

    if( currentMonsterHealth <= 0 && currentPlayerHealth > 0 || currentPlayerHealth <= 0 && currentMonsterHealth > 0 || currentPlayerHealth <= 0 && currentMonsterHealth <= 0 ) {
        reset();
    }
}

function attackMonster(mode) {
    let maxDamage; 

    if( mode == MODE_ATTACK ) {
        maxDamage = ATTACK_VALUE;
    } else if( mode == MODE_STRONG_ATTACK ) {
        maxDamage = STRONG_ATTACK_VALUE;
    }

    const damage = dealMonsterDamage(maxDamage);
    endRound();
}

function attackHandler() {
    attackMonster(MODE_ATTACK);
    console.log(ATTACK_VALUE)
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
    console.log('HEAL');
    endRound();
}

attackBtn.addEventListener('click', attackHandler );
strongAttackBtn.addEventListener('click', strongAttackHandler );
healBtn.addEventListener('click', healPlayerHandler);

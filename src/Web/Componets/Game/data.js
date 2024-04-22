import Triangle from '../../assets/images/bg-triangle.svg';
import Pentagon from '../../assets/images/bg-pentagon.svg';
import OriginalHeader from '../../assets/images/logo.svg';
import BonusHeader from '../../assets/images/logo-bonus.svg';
import OriginalRules from '../../assets/images/image-rules.svg';
import BonusRules from '../../assets/images/image-rules-bonus.svg';
import { createRef } from 'react';

export let original = {
    options: ['rock', 'paper', 'scissors'],
    rules: OriginalRules,
    img: OriginalHeader,
    rulesAlt: 'rock beats scissors, paper beats rock, scissors beats paper',
    background: Triangle,
    original: true
};

export let bonus = {
    options: ['rock', 'paper', 'scissors', 'spock', 'lizard'],
    rules: BonusRules,
    img: BonusHeader,
    rulesAlt: 'rock beats scissors and lizard, paper beats rock and spock, scissors beats paper and lizard, spock beats scissors and rock, lizard beats spock and paper',
    background: Pentagon,
    original: false
};

export const createItemsArray = (arr) => {
    const itemsArr = [];
    arr.forEach(item => itemsArr.push({ name: item, nodeRef: createRef() }));
    return itemsArr;
};

export const gameModes = [original, bonus];

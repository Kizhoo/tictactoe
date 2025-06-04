import { gameState, elements, applyEffect, saveSettings, applySkin } from './game.js';

// 10 Skin untuk simbol X dan O
export const skins = [
    {
        id: 'classic',
        name: 'Classic',
        xIcon: 'fas fa-times',
        oIcon: 'far fa-circle',
        xColor: '#ff6b6b',
        oColor: '#51cf66',
        xEffect: 'none',
        oEffect: 'none'
    },
    {
        id: 'fire-ice',
        name: 'Fire & Ice',
        xIcon: 'fas fa-fire',
        oIcon: 'fas fa-snowflake',
        xColor: '#ff7b00',
        oColor: '#00a8ff',
        xEffect: 'fire',
        oEffect: 'ice'
    },
    {
        id: 'cosmic',
        name: 'Cosmic',
        xIcon: 'fas fa-rocket',
        oIcon: 'fas fa-moon',
        xColor: '#ff00ff',
        oColor: '#00ffff',
        xEffect: 'glow',
        oEffect: 'glow'
    },
    {
        id: 'fantasy',
        name: 'Fantasy',
        xIcon: 'fas fa-dragon',
        oIcon: 'fas fa-hat-wizard',
        xColor: '#9c27b0',
        oColor: '#ff9800',
        xEffect: 'scale',
        oEffect: 'scale'
    },
    {
        id: 'animals',
        name: 'Animals',
        xIcon: 'fas fa-paw',
        oIcon: 'fas fa-feather',
        xColor: '#795548',
        oColor: '#ffeb3b',
        xEffect: 'none',
        oEffect: 'none'
    },
    {
        id: 'tech',
        name: 'Tech',
        xIcon: 'fas fa-microchip',
        oIcon: 'fas fa-robot',
        xColor: '#00ff00',
        oColor: '#ff00ff',
        xEffect: 'pulse',
        oEffect: 'pulse'
    },
    {
        id: 'nature',
        name: 'Nature',
        xIcon: 'fas fa-leaf',
        oIcon: 'fas fa-seedling',
        xColor: '#4caf50',
        oColor: '#8bc34a',
        xEffect: 'rotate',
        oEffect: 'grow'
    },
    {
        id: 'sports',
        name: 'Sports',
        xIcon: 'fas fa-futbol',
        oIcon: 'fas fa-basketball-ball',
        xColor: '#e91e63',
        oColor: '#ff5722',
        xEffect: 'bounce',
        oEffect: 'bounce'
    },
    {
        id: 'holiday',
        name: 'Holiday',
        xIcon: 'fas fa-gift',
        oIcon: 'fas fa-candy-cane',
        xColor: '#f44336',
        oColor: '#4caf50',
        xEffect: 'spin',
        oEffect: 'spin'
    },
    {
        id: 'emoji',
        name: 'Emoji',
        xIcon: 'fas fa-angry',
        oIcon: 'fas fa-laugh-beam',
        xColor: '#ffd700',
        oColor: '#00bfff',
        xEffect: 'shake',
        oEffect: 'shake'
    }
];

// Skin functions
export function initSkinSelector() {
    skins.forEach(skin => {
        const skinCard = document.createElement('div');
        skinCard.className = `skin-card ${gameState.currentSkin === skin.id ? 'active' : ''}`;
        skinCard.dataset.skin = skin.id;
        skinCard.innerHTML = `
            <div class="skin-preview">
                <div class="skin-x" style="color: ${skin.xColor}">
                    <i class="${skin.xIcon}"></i>
                </div>
                <div class="skin-o" style="color: ${skin.oColor}">
                    <i class="${skin.oIcon}"></i>
                </div>
            </div>
            <div class="skin-name">${skin.name}</div>
        `;
        skinCard.addEventListener('click', () => setSkin(skin.id));
        elements.skinGrid.appendChild(skinCard);
    });
}

export function setSkin(skinId) {
    gameState.currentSkin = skinId;
    document.querySelectorAll('.skin-card').forEach(card => {
        card.classList.toggle('active', card.dataset.skin === skinId);
    });
    applySkin();
    saveSettings();
}

/*
 * Copyright 2017 Huub de Beer <huub@heerdebeer.org>
 *
 * This file is part of playing_cards.
 *
 * playing_cards is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * playing_cards is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with playing_cards.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */
import {GameElement} from "../GameElement.js";
import {PileModel} from "../model/PileModel.js";
import {PileView} from "../view/PileView.js";

// Fan types
const FAN_NONE = Symbol("fan:none");
const FAN_UP = Symbol("fan:up");
const FAN_DOWN = Symbol("fan:down");
const FAN_LEFT = Symbol("fan:left");
const FAN_RIGHT = Symbol("fan:right");
const FAN_ARC = Symbol("fan:arc");
const FAN_TYPES = [FAN_NONE, FAN_UP, FAN_DOWN, FAN_LEFT, FAN_RIGHT, FAN_ARC];
        
// Pile predicates
const TAUTOLOGY = function (pile) { return true; };
const FACE_DOWN = function (pile) {
    return pile.cards.every((c) => c.isFaceDown());
};
const FACE_UP = function (pile) {
    return pile.cards.every((c) => c.isFaceUp());
};
const MAX_SIZE = function (N) {
    return function (pile) {
        return pile.count <= N;
    };
};
const CELL = MAX_SIZE(1);



/**
 * @module
 */
const _view = new WeakMap();
const _model = new WeakMap();
const _fanning = new WeakMap();

const _x = new WeakMap();
const _y = new WeakMap();
const _rotation = new WeakMap();

/**
 * A pile in a card game.
 *
 * @extends GameElement
 */
class Pile extends GameElement {
    constructor(game, specification = {}) {
        if (!specification.hasOwnProperty("name")) {
            throw new Error("No name specified in pile");
        }

        super(game, specification.name);


        let cards = [];
        if (specification.hasOwnProperty("deck")) {
            const deck = game.deck(specification.deck);
            if (deck) {
                cards = deck.cards;
            }
        }

        _model.set(this, new PileModel(specification.invariant, cards));

        _fanning.set(this, specification.fanning || FAN_NONE);

        const position = specification.position || {x: 0, y: 0};
        _x.set(this, parseFloat(position.x) || 0);
        _y.set(this, parseFloat(position.y) || 0);

        _rotation.set(this, parseFloat(specification.rotation || 0));

        _view.set(this, new PileView(this.game.table, this.model, this.x, this.y))
    }

    /**
     * Update this pile's view.
     */
    updateView() {
        if (this.view) {
            this.view.x = _x.get(this);
            this.view.y = _y.get(this);
            this.view.render();
        }
    }

    /**
     * Get this pile's underlying model.
     *
     * @return {PileModel} the underlying model.
     */
    get model() {
        return _model.get(this);
    }

    /**
     * Get this pile's view.
     *
     * @return {PileView} this pile's view
     */
    get view() {
        return _view.get(this);
    }

    /**
     * get the fan type of this pile.
     *
     * @return {symbol} this pile's fan type.
     */
    get fanning() {
        return _fanning.get(this);
    }

    /**
     * Is this pile fanned?
     *
     * @return {Boolean} true if this pile is fanned, false otherwise.
     */
    isFanned() {
        return !this.isSquared();
    }
    
    /**
     * Is this pile squared?
     *
     * @return {Boolean} true if this pile is squared, false otherwise.
     */
    isSquared() {
        return FAN_NONE === this.fanning;
    }

    /**
     * Set the fanning for this pile.
     *
     * @param {Symbol|string} [fanType = FAN_NONE] - the fan type
     */
    set fanning(fanType = FAN_NONE) {
        let type = FAN_NONE;
        if (typeof fanType === "string" || fanType instanceof String) {
            if (fanType === "left") {
                type = FAN_LEFT;
            } else if (fanType === "right") {
                type = FAN_RIGHT;
            } else if (fanType === "up") {
                type = FAN_UP;
            } else if (fanType === "down") {
                type = FAN_DOWN;
            } else if (fanType === "arc") {
                type = FAN_ARC;
            }
        } else if (FAN_TYPES.includes(fanType)) {
                type = fanType;
        }

        _fanning.set(this, type);
        this.updateView();
    }

    /**
     * Get the fanning of this pile.
     *
     * @return {symbol} the fanning type of this pile.
     */
    get fanning() {
        return _fanning.get(this);
    }


    /**
     * Set the x coordinate of this pile.
     *
     * @param {float} newX - the new x coordinate.
     */
    set x(newX) {
        _x.set(this, newX);
        this.updateView();
    }

    /**
     * Get the x coordinate of this pile.
     *
     * @return {float} the x coordinate fo this pile.
     */
    get x() {
        return _x.get(this);
    }

    /**
     * Set the y coordinate of this pile.
     *
     * @param {float} newY - the new y coordinate.
     */
    set y(newY) {
        _y.set(this, newY);
        this.updateView();
    }

    /**
     * Get the y coordinate of this pile.
     *
     * @return {float} the y coordinate fo this pile.
     */
    get y() {
        return _y.get(this);
    }

    /**
     * Set the rotation of this pile.
     *
     * @param {float} newRotation - the new rotation in degrees
     */
    set rotation(newRotation) {
        _rotation.set(this, newRotation);
        this.updateView();
    }

    /**
     * Get the rotation of this pule.
     *
     * @return {float} the rotation of this pile in degrees
     */
    get rotation() {
        _rotation.get(this);
    }

}

export {
    Pile,
    FAN_NONE,
    FAN_UP,
    FAN_DOWN,
    FAN_LEFT,
    FAN_RIGHT,
    FAN_ARC,
    FAN_TYPES,
};

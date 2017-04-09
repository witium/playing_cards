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

/**
 * @module
 */
import SVG from "../svg.js";
import {CardSupplier} from "./CardSupplier.js";

const _url = new WeakMap();

/**
 * SVGCardsCardSupplier is a CardSupplier that uses {@link https://github.com/htdebeer/SVG-cards|SVG Cards}
 * to supply cards.
 */
class SVGCardsCardSupplier extends CardSupplier {

    /** 
     * Create a SVGCardsCardsSupplier. Specify the URL to the SVG file to get
     * the cards from.
     *
     * @param {string} [url = "/svg-cards.svg"] - the URL to the SVG file to
     * get the cards from.
     */
    constructor(url = "/svg-cards.svg") {
        super();
        _url.set(this, url);
    }

    /**
     * The URL to the SVG file to get the cards from;
     */
    get url() {
        return _url.get(this);
    }

    /**
     * Represent a card as an SVG USE element, using cards defined in {@link https://github.com/htdebeer/SVG-cards| SVG Cards}.
     *
     * @param {Card} card - the card model to represent;
     *
     * @return {SVGElement} An SVG representation of the card.
     */
    createCard(card) {
        let id = "back";
        if (card.isFacingUp()) {
            let [rank, suit] = card.name.split(" of ");
            if (card.isPipCard()) {
                rank = card.pips;
            }
            id = `${rank}_${suit.slice(0, -1)}`;
        }
        return SVG.use(`${this.url}/#${id}`);
    }
}

export {SVGCardsCardSupplier};
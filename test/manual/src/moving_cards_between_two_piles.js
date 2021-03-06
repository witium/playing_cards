import {Deck} from "../../../src/Deck.js";
import {CARD_SUPPLIER} from "../../../src/CardSupplier.js";
import {SVGCardsCardRenderEngine} from "../../../src/card_render_engine/SVGCardsCardRenderEngine.js";

import {EVENT_CLICK, EVENT_DRAG_OVER} from "../../../src/view/View.js";

import {PileModel} from "../../../src/model/PileModel.js";
import {PileView} from "../../../src/view/PileView.js";
import {TableModel} from "../../../src/model/TableModel.js";
import {TableView} from "../../../src/view/TableView.js";

CARD_SUPPLIER.engine = new SVGCardsCardRenderEngine("/SVG-cards/svg-cards.svg");

// Use one deck of cards; the back is colored "maroon"
const deck = new Deck("Maroon");


// Create two piles and a playing table
//
// 1. Create the models
const table = new TableModel();
const pileA = new PileModel(function () {return true;}, deck);
const pileB = new PileModel();


// 2. Create the views for these models
const tableView = new TableView(table)
const pileBView = new PileView(tableView, pileB, 300, 100);
const pileAView = new PileView(tableView, pileA, 100, 100);

pileBView.on(EVENT_DRAG_OVER, (view) => {
    console.log("Dragged over");
    console.log(view);
});

// Add the playing table to an SVG element
const svgElt = document.getElementById("table");
svgElt.appendChild(tableView.element);

// Turn all card, so we can see them face up.
for (const card of pileA.each()) {
    card.turn();
}

// Shuffle the pile, so we get a different order each time we run this program
pileA.shuffle();

let piles = [pileA, pileB];

// Add a click handler to the SVG element to move cards from A to B
tableView.on(EVENT_CLICK, () => {
    const [sourcePile, destinationPile] = piles;

    destinationPile.add(sourcePile.take());

    if (sourcePile.isEmpty()) {
        piles = [destinationPile, sourcePile];
    }
});

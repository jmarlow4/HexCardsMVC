function HexBoard(center, tileImg, scale, ctx) {
    var cards = [];

    //create our cards
    //draw 19 tiles for hand, starting with first and going around in a circle
    var centerslot = new Card(null, tileImg, scale, center, ctx);
    cards.push(centerslot);

    var hexLevel = 1;
    var currentAngle = 0;
    var tileWidth = tileImg.width * scale;
    var tileHeight = tileImg.height * scale;

    for (var i = 0; i < 18; i++) {
        var slot = new Card(null, tileImg, scale, { x: 0, y: 0 }, ctx);

        currentAngle += 60 / hexLevel;
        var distance = tileWidth;

        if (i > 5) {
            hexLevel = 2;
            if (i % 2 != 0) {
                distance = 1.5 * tileHeight;
            }
            else {
                distance = hexLevel * distance;
            }
        }

        slot.location = CalculatePoint(center, distance, Math.PI * currentAngle / 180);
        cards.push(slot);
    }

    this.Draw = function () {
        for (var i = 0; i < cards.length; i++) {
            cards[i].Draw();
        }
    }

    this.ContainsPoint = function (point) {
        return ContainsPoint(point, cards);
    }
        
}

function PlayerHand(numCards, topLeftPos, scale, ctx) {
    var cards = [];

    var frameImg = new Image();
    frameImg.src = "static/img/frameSheet.png";
    var numbersImg = new Image();
    numbersImg.src = "static/img/numbers.png";
    var mainImg = new Image();
    mainImg.onload = function () {
        var scaledCard = { width: mainImg.width * scale, height: mainImg.height * scale };
        for (var i = 0; i < numCards; i++) {
            //get position
            var cardPosition;
            if (i < numCards / 2) //first row
            {
                cardPosition = { x: (i * scaledCard.width) + scaledCard.width / 2 + topLeftPos.x, y: topLeftPos.y };
            }
            else //second row
            {
                cardPosition = { x: (i - (numCards / 2)) * scaledCard.width + scaledCard.width / 2 + topLeftPos.x, y: topLeftPos.y + scaledCard.height * 0.75 };
            }

            var card = new Card(frameImg, mainImg, numbersImg, scale, cardPosition, ctx);
            cards.push(card);
        }

    }
    mainImg.src = "static/img/backofcard.png";

    this.Draw = function () {
        for (var i = 0; i < cards.length; i++) {
            cards[i].Draw();
        }
    }

    this.ContainsPoint = function(point){
        return ContainsPoint(point, cards);
    }

}




function Card(frameImg, mainImg, numbersImg, scale, point, ctx) {
    this.width = mainImg.width * scale;
    this.height = mainImg.height * scale;
    this.location = { x: point.x, y: point.y }
    this.origLocation = { x: point.x, y: point.y }
    this.vals = {top: 0, left: 0, right: 0}

    this.SetPointVals = function(vals){
        this.vals.top = vals[0];
        this.vals.left = vals[1];
        this.vals.right = vals[2];
    }

    this.Draw = function () {
        ctx.drawImage(mainImg, this.location.x - this.width / 2, this.location.y - this.height / 2, this.width, this.height);
        if (frameImg != null) ctx.drawImage(frameImg, 0, 0, mainImg.width, mainImg.height, this.location.x - this.width / 2, this.location.y - this.height / 2, this.width, this.height);
        for (var i = 0; i < 3; i++) {
            ctx.drawImage()
        }
        
    }
}


function CalculatePoint(centerOfBoard, distance, angle) {
    //bx = ax + d*cos(t);
    //by = ay + d*sin(t)

    var finalPoint = {};
    finalPoint.x = Math.round(centerOfBoard.x + distance * Math.cos(angle));
    finalPoint.y = Math.round(centerOfBoard.y + distance * Math.sin(angle));

    return finalPoint;
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.pageX - rect.left,
        y: evt.pageY - rect.top
    };
}

function ContainsPoint(point, collection) {
    var grabRadius = collection[0].width / 2;
    for (var i = 0; i < collection.length; i++) {
        if (Math.abs(point.x - collection[i].location.x) < grabRadius && Math.abs(point.y - collection[i].location.y) < grabRadius) {
            return collection[i];
        }
    }
    return null;
}

function CopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
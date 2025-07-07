function TypedText(text, initialType, typeRate, color) {
    this.TEXT = text;
    this.index = 0;
    this.currentText = "";
    this.lastTyped = initialType;
    this.typeRate = typeRate;
    this.color = color;
    
    this.update = function(currentTime) {
        if (this.index == this.TEXT.length) {
            this.maxed = true;
            return;
        }
        if (this.lastTyped + this.typeRate < currentTime) {
            this.currentText += this.TEXT[this.index++];
            this.lastTyped = currentTime;
        }
    }
}

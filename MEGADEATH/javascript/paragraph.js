function Paragraph(x, y, style) {
    this.x = x;
    this.y = y;
    
    this.textObjects = [];
    
    this.color = style.color;
    this.font = style.font;
    this.align = style.align;
    
    this.height=40;
    /*{
        ctx.font = this.font;
        let metrics = ctx.measureText("HELLO, WORLD");
        this.height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
    }*/
    
    this.update = function(now) {
        for (let i = 0; i < this.textObjects.length; i++) {
            let textObj = this.textObjects[i];
            textObj.update(now);
        }
    }
    
    this.display = function() {
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = this.align;
        for (let i = 0; i < this.textObjects.length; i++) {
            let textObj = this.textObjects[i];
            if (textObj.color) ctx.fillStyle = textObj.color;
            ctx.fillText(textObj.currentText, this.x, this.y + i * this.height);
            ctx.fillStyle = this.color;
        }
    }
}

class ParagraphHelper {
    static sendAlert(message) {
        g_paragraph.textObjects.push(new TypedText(message, 0, 7, Color.RED));
        let dummyIndex = g_paragraph.textObjects.length-1;
        g_timeline.push(new Event(g_currentTime+1000, function() {
            g_paragraph.textObjects.remove(Math.min(2, dummyIndex));
        }));
    }
}

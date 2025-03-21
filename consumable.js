function Consumable(x, y, fn, radius=10, radius2=4, primaryColor, secondaryColor){
    this.x = x;
    this.y = y;
    this.fn = fn;
    this.radius = radius;
    this.radius2 = radius2;
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
    
    this.display = (ctx) => {
        consumable_show_x = this.x + g_camera.x;
        consumable_show_y = this.y + g_camera.y;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.primaryColor;
        drawCircle(ctx, consumable_show_x, consumable_show_y, this.radius, this.primaryColor);
        drawCircle(ctx, consumable_show_x, consumable_show_y, this.radius2, this.secondaryColor);
        ctx.shadowBlur = 0;
    }
}

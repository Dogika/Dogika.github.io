function DropoffHelper_display() {
    let progressPercent = g_pollen/g_backpack[g_currentBackpack].capacity;
    
    if (progressPercent > 0.666) {
        ctx.drawImage(g_image["navigatorUp"], g_screenWidth*0.5-50, g_screenHeight*0.5-100, 100, 200);
    } else if (progressPercent > 0.333) {
        ctx.drawImage(g_image["navigatorLeft"], g_screenWidth*0.5-50, g_screenHeight*0.5-100, 100, 200);
    } else {
        ctx.drawImage(g_image["navigatorDown"], g_screenWidth*0.5-50, g_screenHeight*0.5-100, 100, 200);
    }
}
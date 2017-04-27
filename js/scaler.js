var Gengu = Gengu || {};


Gengu.getGameLandscapeDimensions = function(max_w, max_h){
    
    //get both w and h of screen
    var w = window.innerWidth * window.devicePixelRatio;
    var h = window.innerHeight * window.devicePixelRatio;
    
    // get actual w and h
    var landW = Math.max(w, h);
    var landH = Math.min(w, h);
    
    //scaling for width
    if(landW>max_w){
        var ratioW = max_w / landW;
        landW *= ratioW;
        landH *= ratioW;
    }
    
    if(landH>max_h){
        var ratioH = max_w / landW;
        landW *= ratioH;
        landH *= ratioH;
    }
    
    return {
        w: landW,
        h: landH
    };
    
};
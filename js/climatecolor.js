function range_pos( value, start, stop )
{
    if (start < stop )
    {
        if ( value < start )
            return 0;
        else if (value > stop )
            return 1;
        else
            return (value - start) / (stop - start);
    }
    else
    {
        if (value < stop)
            return 1;
        else if (value > start )
            return 0;
        else
            return (start - value) / (start - stop);
    }
}

function hex (val)
{
    let i=Math.round(val);
    let s=i.toString(16);
    if (s.length==1)
        s='0'+s;
    return s.toUpperCase();
}

function temperature_color( val )
{
    let item, background, text_color;
    
    if (val == null )
        return get_style([ "FFFFFF", "000000" ]);
   
    if (val < 4.5) 
    {    
        item = range_pos( val, -42.75, 4.5 )*255;
        background = hex( item );
    }
    else
    {      
        item = range_pos( val, 60, 41.5 )*255;
        background = hex( item );
    }
   
    
    if (val <= 4.5)
    {
        item = range_pos( val, -42.75, 4.5 )*255;
        background = background + hex( item );
    }
    else
    {
        item = range_pos( val, 41.5, 4.5 )*255;
        background = background + hex( item );
    }
            
    if (val < -42.78 )
    {
        item = range_pos( val, -90, -42.78 )*255;
        background = background + hex( item );
    }
    else  
    {
        item = range_pos( val, 23, 4.5 )*255;
        background = background + hex( item );
    }
    
    if (val < -23.3 || val >= 37.8)
        text_color = "FFFFFF";
    else
        text_color = "000000";
   
    return get_style([ background, text_color ]);
}

function precipitation_color( val )
{
    let item, background, text_color;
    
    if (val == null )
        return get_style([ "FFFFFF", "000000" ]);
   
    item = hex( range_pos( val, 165.6, 0 )*255 );
    background = item + item;
    
    item = hex( range_pos( val, 300, 165.61 )*207 + 48 );
    background = background + item;
    
    if (val > 90) 
        text_color = "FFFFFF";
    else        
        text_color = "000000";

    return get_style([ background, text_color ]);
}

function get_style (data)
{
    return `background:#${data[0]};color:#${data[1]}`
}
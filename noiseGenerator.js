function perlinNoise()
{
    
}

function simplexNoise()
{
    
}

function seetNoise(position,seed,octive)
{
    seed = Math.abs(seed) + 1000;
    var ans = position.x*position.x+position.y*position.y+position.z*position.z;
    ans = Math.pow(ans,seed);
    ans = ans % seed ;
    
}
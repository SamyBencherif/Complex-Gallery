
var gallery;

function createCard(F, iwindow, owindow, size)
{
    var plot = complexPlot(F, iwindow, owindow, size);
    
    var newCard = `<div class="gallery">
                <img onclick="select(event);" src="${plot.toDataURL()}" alt="${applyJax(F)}" width="300" height="300">
                <div class="desc">\`${applyJax(F)}\`</div>
            </div>`;
    $('#images').append(newCard);
    MathJax.Hub.Typeset() //this really should be async
    return newCard;
}

function createGifCard(F, iwindow, owindow, size, duration, fps)
{

    if (fps*duration <= 1) //invalid gif settings or single frame
    {
        return createCard(F, iwindow, owindow, size);
    }

    var fps = fps || 5;
    var duration = duration || 2;

    var images = []

    var count=0;
    for (var t=0; t<=1; t+=1/(fps*duration-1))
    {
        var plot = complexPlot(F, iwindow, owindow, size, {t:t});
        
        count++;

        images.push(plot.toDataURL());
        /*
        if (count==fps*duration) //last frame
            gif.addFrame(plot, {delay: 3000}) //3 second delay before replay
        else
            gif.addFrame(plot, {delay: 1000/fps})
        */
    }

    this.newCard = $(`<div class="gallery gifcard">
            <img onclick="select(event);" src="${plot.toDataURL()}" alt="${applyJax(F)}" width="300" height="300">
            <div class="desc">\`${applyJax(F)}\`</div>
        </div>`);


    function reverse(k)
    {
        o = []
        for (var i in k)
        {
            o[i] = k[k.length-i-1];
        }
        return o;
    }

    gifshot.createGIF({
        'images': images.concat(reverse(images)),
        'gifWidth': 512,
        'gifHeight': 512
    }, function(obj) {

        if(!obj.error) {
            this.newCard.children('img').attr('src', obj.image);
            $('#full-image').attr('src', obj.image);
        }

    }.bind(this));

    $('#images').append(newCard);
    MathJax.Hub.Typeset() //this really should be async
    return this.newCard;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var toJax = {
"acos": "arccos",
"acosh":"arccosh",
"acot":"arccot",
"acoth":"arccoth",
"acsc":"arccsc",
"acsch":"arccsch",
"asec":"arcsec",
"asech":"arcsech",
"asin":"arcsin",
"asinh":"arcsinh",
"atan":"arctan",
"atan2":"arctan2",
"atanh":"arctanh"
}


function applyJax(F)
{
    for (atrig in toJax)
        F = F.replaceAll(atrig, toJax[atrig])

    return F;
}

function unApplyJax(F)
{
    for (atrig in toJax)
        F = F.replaceAll(toJax[atrig], atrig)

    return F;
}

function expressionContains(exp, v)
{
    if (exp.args!=undefined || exp.content!=undefined)
    {
        var args = (exp.args || exp.content.args);
        for (var i in args)
        {
            if (expressionContains(args[i], v))
                return true;
        }
    }
    else
    {
        if (exp.name==v)
            return true;
    }

    return false;
}

function ccDown(ev)
{

    if (ev.keyCode==75 && ev.metaKey)
    {
        $('#images').html("");
    }

    if (ev.keyCode==13)
    {
        if ($('#card-creator').val()=="clear")
        {
            $('#images').html("");
        }
        else
        {
            var F = unApplyJax($('#card-creator').val());

            if (expressionContains(math.parse(F), 't'))
                var card = createGifCard(F); //this also should be async
            else
                var card = createCard(F); //this also should be async

            $('#full-image').attr('src', $(card).children('img').attr('src'));
        }
        $('#card-creator').val("")
    }
}

function select(ev)
{
    var imgurl = $(ev.target).attr('src');
    $('#full-view').show();
    $('#full-image').attr('src', imgurl);
}

$(document.body).on('keydown', function(ev)
{
    if (ev.keyCode == 27)
    {
        $('#full-view').hide();
    }
})

$("#full-container").click(function(ev)
{
    $('#full-view').hide();
})

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        gallery = JSON.parse(this.responseText);

        for (var filename in gallery)
        {
            var file = gallery[filename];
            $('#images').append(`<div class="gallery">
                <img onclick="select(event);" src="gallery/${filename}" alt="z^(z^-1)" width="300" height="300">
                <div class="desc">\`${file.function}\`</div>
            </div>`);

        }
    }
};
xmlhttp.open("GET", "gallery/listing.json", true);
xmlhttp.send();
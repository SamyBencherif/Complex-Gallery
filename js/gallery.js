
var gallery;

function createCard(F, iwindow, owindow, size)
{
    var plot = complexPlot(F, iwindow, owindow, size);
    
    $('#images').append(`<div class="gallery">
                <img onclick="select(event);" src="${plot.toDataURL()}" alt="z^(z^-1)" width="300" height="300">
                <div class="desc">\`${F}\`</div>
            </div>`);
    MathJax.Hub.Typeset()
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
            createCard($('#card-creator').val());
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
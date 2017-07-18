//math = require("mathjs");

cn = math.complex

function squareWindow(x)
{
	x = x || 1;
	return [cn(-x/2, -x/2), cn(x/2, x/2)];
}

function complexPlot(F, iwindow, owindow, size)
{
	var iwindow = iwindow || squareWindow(10);
	var owindow = owindow || squareWindow(10);//'auto';
	var size = size || [256,256];

	blendQuality = 3;
	
	var canvas = document.createElement('canvas');
	canvas.width = size[0];
	canvas.height = size[1];
	canvas.style.width = "256px";//size[0] + "px";
	canvas.style.height = "256px";//size[1] + "px";

	var render = canvas.getContext('2d');

	//calc0
	var span = math.subtract(iwindow[1], iwindow[0]);
	//math.eval('iwx-iwy', {iwx: iwindow[0], iwy: iwindow[1]});
	var spanx = span.re;
	var spany = span.im;

	var Fc = math.compile(F);

	var mapping = [];
	for (var x=0; x<size[0]; x++)
	{
		for (var y=0; y<size[1]; y++)
		{
			//complex input
			var c = math.add(iwindow[0], cn(spanx*x/size[0], spany*y/size[1]));
			//calc1
			//math.eval('iwx + spanx*x/sizex + i*spany*y/sizey', {iwx: iwindow[0], spanx: spanx, spany: spany, x:x, y:y, sizex: size[0], sizey: size[1]})
			//iwindow[0] + cn(spanx*x/size[0], spany*y/size[1]);

			//complex output
			//calc2
			var o = Fc.eval({z:c, x:c.re, y:c.im});
			mapping.push([c,o,x,y]);
		}
	}

	var lio;
	var hio;
	var lro;
	var hro;

	if (owindow=='auto')
	{
		lio = math.min(mapping.map(zp=>zp[1].im));
		hio = math.max(mapping.map(zp=>zp[1].im));
		lro = math.min(mapping.map(zp=>zp[1].re));
		hro = math.max(mapping.map(zp=>zp[1].re));

		hio = math.max(hio, -lio);
		lio = math.min(lio, -hio);
		hro = math.max(hro, -lro);
		lro = math.min(lro, -hro);
	}
	else
	{
		lio = owindow[0].im;
		hio = owindow[1].im;
		lro = owindow[0].re;
		hro = owindow[1].re;
	}

	fp = x => math.max(0, x);
	//calc3
	bl = (a,b) => (math.pow(math.pow(fp(a), blendQuality) + math.pow(fp(b), blendQuality), 1/blendQuality))
	
	//math.compile(`(${fp}(a)^${blendQuality} + ${fp}(b)^${blendQuality})^(1/${blendQuality})`)

	//(math.pow(math.pow(fp(a), blendQuality) + math.pow(fp(b), blendQuality), 1/blendQuality))

	for (var i in mapping)
	{
		var c = mapping[i][0];
		var o = mapping[i][1];
		var x = mapping[i][2];
		var y = mapping[i][3];

		var rsp = hro-lro;
		var isp = hio-lio;
		if (rsp==0) rsp=2;
		if (isp==0) isp=2;

		if (o.im == undefined)
			o = math.complex(o, 0);

		var r = (o.re-lro)/rsp;
		var i = (o.im-lio)/isp;
		
		var int = parseInt;

		if (x==int(size[0]/2) || y==int(size[1]/2))
		{
			//axis
			render.fillStyle = "rgb(255,255,255)";
			render.fillRect(x,y,1,1);
		}
		else if (math.abs(x-int(size[0]/2))==1 || math.abs(y-int(size[1]/2))==1)
		{
			//axis border
			render.fillStyle = "rgb(0,0,0)";
			render.fillRect(x,y,1,1);
		}
		else
		{

			//applying map with int has weird bad side effects
			render.fillStyle = "rgb(" + 
			[int(bl(255*2*(i-.5), 255*2*(.5-r))),
			int(bl(255*2*(.5-i), 255*2*(.5-r))),
			int(bl(255*2*(.5-i), 255*2*(r-.5)))] + ")";
			render.fillRect(x,size[1]-y,1,1);			
		}
	}

	return canvas;
	//document.body.appendChild(canvas);
	//document.body.appendChild(document.createElement('br'));
}

//complexPlot('z');
//complexPlot('e^z');
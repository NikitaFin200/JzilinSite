$(document).ready(function() {
	window.active_page = 1;
	active(active_page);
});

function detmat (retDet) {
	var timeStart = Date.now();
	var razm = $(".detrazm").val();
	var matr = new Array(razm);
	for (var i = 0; i < razm; i++) matr[i] = new Array(razm);
	for (var i = 0; i < razm; i++) {
		for (var j = 0; j < razm; j++) {
			matr[i][j] = parseFloat($( ".detstsb"+i+j ).val());
		}
	}
	var res = ($('.typedetgaus').is(':checked')) ? detTypeGaus(matr) : detTypeMinor(matr);
	if(retDet && res != 0) return res;
	if(isNaN(res)) {
		message("Ошибка в заполнении, проверьте правильность ввода.", 1);
		return 0;
	}
	var timeEnd = Date.now()-timeStart;
	timeEnd = (timeEnd) ? timeEnd : 1;
	res += '</br>Скрипт выполнялся <'+ timeEnd +'> ms.';
	message("Определитель матрицы равен "+res, 0);
	return 0;
}

function slaumetod(retPogr) {
	var timeStart = Date.now();
	var razm = $(".slaurazm").val();
	var matr = new Array(razm);
	for (var i = 0; i < razm; i++) matr[i] = new Array(razm);
	for (var i = 0; i < razm; i++) {
		for (var j = 0; j < razm; j++) {
			matr[i][j] = parseFloat($( ".slaustsb"+i+j ).val());
		}
	}
	var opredel = detTypeMinor(matr);
	if(isNaN(opredel)) {
		message("Ошибка в заполнении, проверьте правильность ввода.", 1);
		return 0;
	} else if (opredel == 0) {
		if(retPogr) { pogreshnslau0(); return 10;}
		message("Определитель матрицы равен нулю.", 1);
		return 0;
	}
	var ravno = new Array();
	for (var i = 0; i < matr.length; i++) {
		ravno[i] = parseFloat($( ".slaustsb"+i+matr.length ).val());
	}
	if ($('.typeslaukramer').is(':checked')) {
		var res = resSlauKramer(matr, opredel, ravno);
		var pog = pogrSlau(matr, res, ravno);
	}
	else {
		var DMatr = new Array(matr.length);
		for (i = 0; i < matr.length; i++) DMatr[i] = new Array(matr.length);
		for (i = 0; i < matr.length; i++) {
			for (var j = 0; j < matr.length; j++) {
				DMatr[i][j] = matr[i][j];
			}
		}
		var res = 0;
		if ($('.typeslaumart').is(':checked')) res = resSlauMatr(DMatr, opredel, ravno);
		else if ($('.typeslaugaus').is(':checked')) res = resSlauGaus(DMatr, ravno);
		else if ($('.typeslaugausjord').is(':checked')) res = resSlauGausJord(DMatr, ravno);
		else if ($('.typeslauyacob').is(':checked')) {
			res = resSlauJacob(DMatr, ravno, parseFloat($('.toshnJacob').val()));
			var shag = res[1];
			res = res[0];
		}
		else if ($('.toshngauszeyd').is(':checked')) {
			res = resSlauGausZeidel(DMatr, ravno, parseFloat($('.toshngauszeid').val()));
			var shag = res[1];
			res = res[0];
		}
		else if ($('.typeslaurelax').is(':checked')) {
			var DRavno = new Array(ravno.length);
			for (var i = 0; i < matr.length; i++) DRavno[i] = ravno[i];
			res = resSlauRelax(DMatr, DRavno, parseFloat($('.toshnrelax').val()));
			var shag = res[1];
			res = res[0];
		}
		var pog = pogrSlau(matr, res, ravno);
	}
	if (retPogr && pog != 0) return pog;
	var otvet = '';
	for (var i = 0; i < res.length; i++) otvet += ' <span>x<sub>'+(i+1)+'</sub></span> = '+res[i]+'; ';
	otvet += '<br>погрешность ';
	if ($('.typeslaukramer').is(':checked')) otvet += 'метода Крамера';
	else if ($('.typeslaugaus').is(':checked')) otvet += 'метода Гаусса';
	else if ($('.typeslaugausjord').is(':checked')) otvet += 'метода Гаусса-Жордана';
	else if ($('.typeslaumart').is(':checked')) otvet += 'матричного метода';
	else if ($('.typeslauyacob').is(':checked')) otvet += 'метода Якоби';
	else if ($('.toshngauszeyd').is(':checked')) otvet += 'метода Гаусса-Зейделя';
	else if ($('.typeslaurelax').is(':checked')) otvet += 'метода релаксации';
	if (pog == 0) otvet += ' = '+pog; else otvet += ' &asymp; '+pog;
	var timeEnd = Date.now()-timeStart;
	timeEnd = (timeEnd) ? timeEnd : 1;
	otvet += '</br>Скрипт выполнялся <'+ timeEnd +'> ms.';
	if ($('.typeslauyacob').is(':checked') || $('.toshngauszeyd').is(':checked') || $('.typeslaurelax').is(':checked')) otvet += '</br>Количество шагов - |'+ shag +'|';
	message("Ответ:"+otvet, 0);	
	return 0;
}

function message(res, err, cl, obj) {
	var type = 'success';
	if (err) type = 'error';
	noty({
		text        : res,
		type        : type,
		theme       : 'relax',
		layout      : 'topRight',
		animation: {
	        open: 'animated fadeInUp', // Animate.css class names
	        close: 'animated fadeOutUp', // Animate.css class names
	        easing: 'linear', // unavailable - no need
	        speed: 100 // unavailable - no need
	    }
	});
}

function toggle(id) {
    var CurrentMethod = document.querySelector('.content' + id);
    var Methods = document.querySelectorAll("[class^=content]");

    if (CurrentMethod.style.display === 'none') {
        CurrentMethod.style.display = 'block';
    } else {
        CurrentMethod.style.display = 'none';
    }
    for (var i = 0; i < Methods.length; i++) {
        if( Methods[i].style.display === 'block' && CurrentMethod != Methods[i])
        {
            Methods[i].style.display = 'none';  
        }
    }
	if (id == 2) reloadtablemat();
	if (id == 3) reloadtableslau();
}

function reloadtableslau(randtrue) {
	$( ".result" ).html("");
	var rand = $('#sgenerslau').is(':checked');
	if (randtrue) rand = 1;
	var slaurazm = $(".slaurazm").val();
	var res = '<table>';
	for (var i = 0; i < slaurazm; i++) {
		res += '<tr>';
		for (var j = 0; j < slaurazm; j++) {
			if (j != 0) res += '<td>+'; else res += '<td>';
			if (rand) res += '<input type="text" class="form-field slaustsb'+i+j+'" value="'+getRandomArbitary(-10, 10)+'"><span>x<sub>'+(j+1)+'</sub></span></td>';
			else res += '<input type="text" class="form-field slaustsb'+i+j+'"><span>x<sub>'+(j+1)+'</sub></span></td>';
			if ((j+1) == slaurazm) {
				if (rand) res += '<td>=<input type="text" class="form-field slaustsb'+i+(j+1)+'" value="'+getRandomArbitary(-10, 10)+'"></td>';
				else res += '<td>=<input type="text" class="form-field slaustsb'+i+(j+1)+'"></td>';
			}
		}
		res += '</tr>';
	}
	res += '</table>';
	$( ".tableslau" ).html(res);
}

function detTypeMinor(matr) {
	if (matr.length < 2) return matr[0][0];
	if (matr.length < 3) return matr[0][0]*matr[1][1]-matr[1][0]*matr[0][1];
	var sum = 0;
	for (var i = 0; i < matr.length; i++) {
		var razm = matr.length - 1;
		var submatr = new Array(razm);
		for (var p = 0; p < razm; p++) submatr[p] = new Array(razm);
		var subj = 0;
		for (var st = 1; st < matr.length; st++) {
			for (var j = 0; j < matr.length; j++) {
				if (i != j) {
					submatr[(st-1)][subj] = matr[st][j];
					subj++;
				}
			}
			subj = 0;
		}
		sum += Math.pow((-1), i)*matr[0][i]*detTypeMinor(submatr);
	}
	return sum;
}


function resSlauKramer(matr, det, ravno) {
	var res = new Array();
	var doublematr = new Array(matr.length);
	for (var i = 0; i < matr.length; i++) doublematr[i] = new Array(matr.length);
	for (var st = 0; st < matr.length; st++) {
		for (var i = 0; i < matr.length; i++) {
			for (var j = 0; j < matr.length; j++) {
				if (st == j) doublematr[i][j] = ravno[i];
				else doublematr[i][j] = matr[i][j];
			}
		}
		res[st] = detTypeMinor(doublematr)/det;
	}
	return res;
}
function resSlauGaus(matr, ravno) {
	for (var i = 0; i < matr.length; i++) {
		matr[i][matr.length] = ravno[i];
	}
	for (var j = 0; j < matr.length-1; j++) {
		if (matr[j][j] == 0) {
			for (var st = j+1; st < matr.length; st++) {
				if (matr[st][j] != 0) {
					for (var i = 0; i < matr[0].length; i++) matr[j][i] += matr[st][i];
					break;
				}
			}
		}
		for (st = j+1; st < matr.length; st++) {
			if (matr[st][j] == 0) continue;
			var mnoj = (-matr[st][j])/matr[j][j];
			for (i = j; i < matr[0].length; i++)  matr[st][i] = matr[st][i]+mnoj*matr[j][i];
		}
	}
	var res = new Array(matr.length);
	for (j = 0; j < res.length; j++) res[j] = 1;
	for (i = matr.length-1; i >= 0; i--) {
		var sum = 0;
		for (j = i+1; j < matr.length; j++) {
			sum += matr[i][j]*res[j];
		}
		res[i] = (matr[i][j]-sum)/matr[i][i];
	}
	return res;
}
function resSlauGausJord(matr, ravno) {
	for (var i = 0; i < matr.length; i++) {
		matr[i][matr.length] = ravno[i];
	}
	for (var j = 0; j < matr.length-1; j++) {
		if (matr[j][j] == 0) {
			for (var st = j+1; st < matr.length; st++) {
				if (matr[st][j] != 0) {
					for (var i = 0; i < matr[0].length; i++) matr[j][i] += matr[st][i];
					break;
				}
			}
		}
		for (st = j+1; st < matr.length; st++) {
			if (matr[st][j] == 0) continue;
			var mnoj = (-matr[st][j])/matr[j][j];
			for (i = j; i < matr[0].length; i++)  matr[st][i] = matr[st][i]+mnoj*matr[j][i];
		}
	}
	for (var j = matr.length-1; j >= 0; j--) {
		for (st = j-1; st >= 0; st--) {
			if (matr[st][j] == 0) continue;
			var mnoj = (-matr[st][j])/matr[j][j];
			for (i = j; i < matr[0].length; i++)  matr[st][i] = matr[st][i]+mnoj*matr[j][i];
		}
	}
	var res = new Array(matr.length);
	for (i = 0; i < matr.length; i++) res[i] = matr[i][matr.length]/matr[i][i];
	return res;
}
function resSlauMatr(matr, det, ravno) {
	var matrix = new Array(matr.length);
	for (var i = 0; i < matr.length; i++)
		matrix[i] = new Array(matr.length);

	var submatrM = new Array(matr.length-1);
	for (i = 0; i < matr.length-1; i++)
		submatrM[i] = new Array(matr.length-1);

	for (var str = 0; str < matr.length; str++) {
		for (var stb = 0; stb < matr.length; stb++) {
			var subi = 0;
			var subj = 0;
			for (var i = 0; i < matr.length; i++) {
				for (var j = 0; j < matr.length; j++) {
					if (str != i && stb != j) {
						submatrM[subi][subj] = matr[i][j];
						subj++;
					}
				}
				if (str != i) {
					subi++;
					subj = 0;
				}
			}
			matrix[str][stb] = Math.pow((-1), (str+stb))*detTypeMinor(submatrM);
		}
	}
	for (i = 0; i < matrix.length-1; i++) {
		for (j = (i+1); j < matrix.length; j++) {
			var zap = matrix[i][j];
			matrix[i][j] = matrix[j][i];
			matrix[j][i] = zap;
		}
	}
	var res = new Array(matrix.length);
	for (i = 0; i < matrix.length; i++) {
		var sum = 0;
		for (j = 0; j < matrix.length; j++) {
			sum += matrix[i][j]*ravno[j];
		}
		res[i] = sum/det;
	}
	return res;
}
function resSlauJacob(matr, ravno, tjchn) {
	var matrX = new Array(matr.length); //массив приближенных значений X
	var doubleMatrX = new Array(matr.length);
	var shag = 0;
	for (var i = 0; i < matrX.length; i++)
		matrX[i] = 0;
	while(true) {
		for (var str = 0; str < matr.length; str++) { //крутим строку
			var sum = 0;
			for (i = 0; i < matr.length; i++) //крутим элементы в строке
				if (str != i) sum += matr[str][i]*matrX[i]; //находим сумму всех элементов в строке (кроме диаг.)
			doubleMatrX[str] = (ravno[str] - sum) / matr[str][str]; //записываем новые приближения в массив
		}
		var max = Math.abs(doubleMatrX[0]-matrX[0]);
		for (i = 1; i < matr.length; i++) //находим максимальный элемент между прошлой и новой итерацией
			if (max < (Math.abs(doubleMatrX[i]-matrX[i])))
				max = Math.abs(doubleMatrX[i]-matrX[i]);
		if (max < tjchn) return [doubleMatrX, shag]; //если точность меньше максимума возвращаем решение
		if (shag > 250) return false;
		shag++;
		for (i = 0; i < matr.length; i++) {
			matrX[i] = doubleMatrX[i]; //перезаписываем приближения страрой итерации в новый массив
		}
	}
}
function resSlauGausZeidel(matr, ravno, tjchn) {
	var matrX = new Array(matr.length);
	var doubleMatrX = new Array(matr.length);
	var shag = 0;
	for (var i = 0; i < matrX.length; i++)
		matrX[i] = 0;
	while(true) {
		for (var str = 0; str < matr.length; str++) {
			var sum = 0;
			for (i = 0; i < matr.length; i++) {
				if (i < str) {
					if (str != i) sum += matr[str][i]*doubleMatrX[i];
				}
				else if (str != i) sum += matr[str][i]*matrX[i];
			}
			doubleMatrX[str] = (ravno[str] - sum) / matr[str][str];
		}
		var max = Math.abs(doubleMatrX[0]-matrX[0]);
		for (i = 1; i < matr.length; i++)
			if (max < (Math.abs(doubleMatrX[i]-matrX[i])))
				max = Math.abs(doubleMatrX[i]-matrX[i]);
		if (max < tjchn) return [doubleMatrX, shag];
		if (shag > 150) return false;
		shag++;
		for (i = 0; i < matr.length; i++) {
			matrX[i] = doubleMatrX[i];
		}
	}
}
function resSlauRelax(matr, R, tochn) {
	for(var i = 0; i < matr.length; i++) {
		var del = matr[i][i];
		for(var j = 0; j < matr.length; j++) {
			matr[i][j] /= -del;
		}
		R[i] /= del;
	} //приводим к виду удобному для релаксации
	var X = new Array(matr.length);
	for(i = 0; i < matr.length; i++)
		X[i] = 0;
	var shag = 1;
	while(true) {
		var max = R[0];//находим максимальную невязку
		var maxi = 0;
		for (i = 1; i < matr.length; i++)
			if (Math.abs(max) < Math.abs(R[i]))
				maxi = i;
		X[maxi] += R[maxi];//прибавляем её к окончательному результату
		if (tochn > Math.abs(R[maxi])) return [X, shag];
		if (shag > 3350) return false;
		var Sig = R[maxi]; //находим приращение
		for (i = 0; i < matr.length; i++) {
			R[i] += matr[i][maxi]*Sig; //даем приращение невязкам
		}
		shag++;
	}
}
function pogrSlau(matr, res, ravno) {
	var pogr = 0;
	var sum = 0;
	var sumstr = 0;
	for (var st = 0; st < matr.length; st++) {
		sumstr = 0;
		for (var i = 0; i < matr.length; i++) {
			sumstr += matr[st][i]*res[i];
		}
		if (sumstr > ravno[st]) sum += sumstr-ravno[st];
		if (sumstr < ravno[st]) sum += ravno[st]-sumstr;
	}
	var res = sum/matr.length;
	if (res == 0) return 0;
	return res;
}
function pogreshnslau0() {
	var pogr = 1;
	while (pogr != 0) {
		reloadtableslau(true);
		pogr = slaumetod(true);
	}
}
function opred0() {
	var timeStart = Date.now();
	var opred = 1;
	while (opred != 0) {
		reloadtablemat(true);
		opred = detmat(true);
	}
	message('Определитель матрицы равен 0</br>Скрипт выполнялся <'+ (Date.now()-timeStart) +'> ms.', 0);
}
function getRandomArbitary(min, max) {
	return parseInt((Math.random() * (max - min) + min), 10);
}

// 2 тема

function nahojdKorney(f1, f1_proizv) {
	document.getElementById('chart').innerHTML = '';
	var Points = [], Points2 = [], graphic = [], seriesGraph = [], toshn = $( ".pogrgraph" ).val(), timeStart = Date.now(), shag = 0.1, prom = {}, countshag = [];
	for (var x = -50, y; x <= 50; x += 0.1) {
	//Нахождение допустимых значений в пределах (-50, 50), min, max.
		y = f1(x);
		if (!isNaN(y)) {
			if (y != -Infinity && y != Infinity) {
				if (!('minX' in prom)) {
					prom.minX = x;
					prom.minY = y;
					prom.maxY = y;
				}
				if (prom.minY > y) prom.minY = y;
				if (prom.maxY < y) prom.maxY = y;
				prom.maxX = x;
			}
		}
	}
	graphic.push([[prom.minX, 0], [prom.maxX, 0]]); // Ось X
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	graphic.push([[0, prom.minY - 0.5], [0, prom.maxY + 0.5]]); // Ось Y
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	var otrezki = [];
	//нахожу отрезки приближенного решения
	for (var i = prom.minX, a = f1(i); i <= prom.maxX; i += shag){
		Points.push([i, a]);
		if ((a <= 0 && f1(i) >= 0 || (a >= 0 && f1(i) <= 0))) {
			otrezki.push([(i - 0.5), (i + 0.5)]);
		}
		a = f1(i);
	}

	graphic.push(Points);
	seriesGraph.push({showMarker:false, color: '#1224A1'});

	var result = [];
	if ($('.polovindel').is(':checked')) MetDihot(otrezki, toshn, f1, graphic, result, seriesGraph, countshag);
	else if ($('.methord').is(':checked')) MetHord(otrezki, toshn, f1, graphic, result, seriesGraph, countshag);
	else if ($('.metodnytona').is(':checked')) MetNytona(otrezki, toshn, f1, graphic, result, seriesGraph, f1_proizv, countshag);
	else if ($('.metodModNytona').is(':checked')) MetModNytona(otrezki, toshn, f1, graphic, result, seriesGraph, f1_proizv, countshag);
	else if ($('.prosIter').is(':checked')) MetProstIter(otrezki, toshn, f1, graphic, result, seriesGraph, f1_proizv, countshag);
	else if ($('.methSek').is(':checked')) MetSek(otrezki, toshn, f1, graphic, result, seriesGraph, countshag);

	timeStop = Date.now();
	var plot1 = $.jqplot('chart', graphic,
		{
			title:{
				text: 'Графический способ',
				textColor: '#fff'
			},
			series:seriesGraph,
			axes:{
				rendererOptions:{
					textColor: '#fff'
				},
				useSeriesColor: '#fff',
				xaxis:{
					min: prom.minX,
					max: prom.maxX,
					label:'X'
				},
				yaxis:{
					min: prom.minY - 0.5,
					max: prom.maxY + 0.5,
					label:'Y'
				}
			}
		}
	);
	if (result.length == 0) {
		message('К большому сожилению я не нашел на этом отрезке решение :\'(', 1);
		return;
	}
	var mes = 'Отрезки нахождения корней:<br/><table border="1" cellpadding="10" class="table-graf-otr"><tr><td>a</td><td>b</td></tr>';
	for (var i = 0; i < otrezki.length; i++) {
		mes += '<tr><td>'+otrezki[i][0].toFixed(1)+'</td><td>'+otrezki[i][1].toFixed(1)+'</td></tr>';
	}
	mes += '</table><br/>Корни уравнения:<br/><table border="1" cellpadding="10" class="table-graf-otr"><tr><td>X</td><td>Y</td></tr>';
	for (var i = 0; i < result.length; i++) {
		mes += '<tr><td>'+result[i][0].toFixed(6)+'</td><td>'+result[i][1].toFixed(6)+'</td></tr>';
	}
	mes += '</table><br/>Количество шагов:<br/><table border="1" cellpadding="10" class="table-graf-otr"><tr><td>N</td></tr>';
	for (var i = 0; i < countshag.length; i++) {
		mes += '<tr><td>'+countshag[i]+'</td></tr>';
	}
	mes += '</table></br>Скрипт выполнялся '+(timeStop-timeStart)+' ms';
	message(mes, 0);
}

function MetDihot(otrezki, toshn, f1, graphic, result, seriesGraph, countshag)  {
	for (var i = 0; i < otrezki.length; i++) {
		countshag[i] = 0;
		var a = otrezki[i][0], b = otrezki[i][1], c;
		while ((Math.abs(a - b)) > toshn) {
			countshag[i]++;
			c = (a + b) / 2; //находим центр отрезка
			if (f1(a) < f1(b)) {
			//меняем положение или A, или B на C в зависимости от наклона функции
				if (f1(c) >= 0) b = c;
				else a = c;
			} else {
				if (f1(c) <= 0) b = c;
				else a = c;
			}
		}
		var res = f1(c);
		graphic.push([[c, res]]);
		result.push([c, res]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}
}
function MetHord(otrezki, toshn, f1, graphic, result, seriesGraph, countshag)  {
	for (var i = 0; i < otrezki.length; i++) {
		countshag[i] = 0;
		var a = otrezki[i][0], b = otrezki[i][1], z, vozrast;
		vozrast = (f1(a) < f1(b)) ? true : false;
		while(true) {
			countshag[i]++;
			z = (a*f1(b) - b*f1(a)) / (f1(b) - f1(a));
			//вычисляются значения функции на концах отрезка, и строится "хорда"
			if (vozrast) {
				//меняем границы взависимости от наклона функции
				if (z < 0) a = z;
				else b = z;
			} else {
				if (z < 0) b = z;
				else a = z;
			}
			if ((Math.abs(z - z1) < toshn) && z1 !== undefined) break;
			var z1 = z;
		}
		var res = f1(z);
		graphic.push([[z, res]]);
		result.push([z, res]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}
}
function MetNytona(otrezki, toshn, f1, graphic, result, seriesGraph, proizv, countshag)  {
	for (var i = 0; i < otrezki.length; i++) {
		countshag[i] = 0;
		var x2 = otrezki[i][1]; // приближенное значение X
		while(true) {
			countshag[i]++;
			x = x2 - f1(x2) / proizv(x2);
			// точка пересечения с осью абсцисс x2 приближения
			if (Math.abs(x - x2) < toshn) break;
			x2 = x;
		}
		var res = f1(x);
		graphic.push([[x, res]]);
		result.push([x, res]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}
}
function MetModNytona(otrezki, toshn, f1, graphic, result, seriesGraph, proizv, countshag)  {
	for (var i = 0; i < otrezki.length; i++) {
		countshag[i] = 0;
		var x2 = (otrezki[i][0] + otrezki[i][1]) * 0.5, x, pr;
		pr = proizv(x2);
		// Модифицирован тем, что производная
		while(true) {
			countshag[i]++;
			x = x2 - f1(x2) / pr;
			if (Math.abs(x - x2) < toshn) break;
			x2 = x;
		}
		var res = f1(x);
		graphic.push([[x, res]]);
		result.push([x, res]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}
}
function MetProstIter(otrezki, toshn, f1, graphic, result, seriesGraph, proizv, countshag)  {
	for (var i = 0; i < otrezki.length; i++) {
		countshag[i] = 0;
		var x = (otrezki[i][0] + otrezki[i][1]) / 2, znasch;
		var eqviv = function(x) {
			return x - 1 / proizv(x) * f1(x);
			//эквивалентное уравнение для сходимости процесса
		}
		while(true) {
			countshag[i]++;
			znasch = eqviv(x);
			if (Math.abs(znasch - x) < toshn) break;
			x = znasch;
		}
		var res = f1(x);
		graphic.push([[x, res]]);
		result.push([x, res]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}
}
function MetSek(otrezki, toshn, f1, graphic, result, seriesGraph, countshag)  {
	for (var i = 0; i < otrezki.length; i++) {
		countshag[i] = 0;
		var a = otrezki[i][0], b = otrezki[i][1], x;
		while(true) {
			countshag[i]++;
			x = b - (a - b) * f1(b) / (f1(a) - f1(b));
			a = b;
			b = x;
			if (Math.abs(b - a) < toshn) break;
		}
		var res = f1(x);
		graphic.push([[x, res]]);
		result.push([x, res]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}
}
function nahojdIntegr(f1, otr) {
	document.getElementById('chart').innerHTML = '';
	var Points = [], Points2 = [], graphic = [], seriesGraph = [], toshn = $( ".pogrgraph" ).val(), timeStart = Date.now(), shag = 0.1, prom = {}, countshag = [];
	for (var x = otr[0], y; x <= otr[1]; x += 0.1) {
	//Нахождение допустимых значений в пределах (-50, 50), min, max.
		y = f1(x);
		if (!isNaN(y)) {
			if (y != -Infinity && y != Infinity) {
				if (!('minX' in prom)) {
					prom.minX = x;
					prom.minY = y;
					prom.maxY = y;
				}
				if (prom.minY > y) prom.minY = y;
				if (prom.maxY < y) prom.maxY = y;
				prom.maxX = x;
			}
		}
	}
	graphic.push([[prom.minX, 0], [prom.maxX, 0]]); // Ось X
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	graphic.push([[0, prom.minY - 0.5], [0, prom.maxY + 0.5]]); // Ось Y
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	var otrezki = [];
	//нахожу отрезки приближенного решения
	for (var i = prom.minX, a = f1(i); i <= prom.maxX; i += shag){
		Points.push([i, a]);
		if ((a <= 0 && f1(i) >= 0 || (a >= 0 && f1(i) <= 0))) {
			otrezki.push([(i - 0.5), (i + 0.5)]);
		}
		a = f1(i);
	}

	graphic.push(Points);
	seriesGraph.push({showMarker:false, color: '#1224A1'});

	var result = [];
	var n = parseInt($('.shislrazb').val());
	var pogr = parseFloat($('.pogrgintg').val());
	var withPogr = function(f) {
		var i = 1;
		var razn;
		while (true) {
			var m1 = f(f1, otr[0], otr[1], i);
			var m2 = f(f1, otr[0], otr[1], i + 1);
			razn =  Math.abs(m1[0] - m2[0]);
			if (razn < pogr)
				return m1;
			i++;
		}
	}
	var getRes = function (f) {
		result = (pogr > 0) ? withPogr(f) : f(f1, otr[0], otr[1], n);
	}
	if ($('.metodLevPr').is(':checked')) getRes(metodLevPr);
	else if ($('.metodPrPr').is(':checked')) getRes(metodPrPr);
	else if ($('.metodSrPr').is(':checked')) getRes(metodSrPr);
	else if ($('.metodTrapec').is(':checked')) getRes(metodTrapec);
	else if ($('.metodParabol').is(':checked')) getRes(metodParabol);
	else if ($('.montekarlo').is(':checked')) getRes(montekarlo);
	else if ($('.trivosimish').is(':checked')) getRes(trivosimish);

	timeStop = Date.now();
	var plot1 = $.jqplot('chart', graphic,
		{
			title:{
				text: 'Графический способ',
				textColor: '#fff'
			},
			series:seriesGraph,
			axes:{
				rendererOptions:{
					textColor: '#fff'
				},
				useSeriesColor: '#fff',
				xaxis:{
					min: prom.minX,
					max: prom.maxX,
					label:'X'
				},
				yaxis:{
					min: prom.minY - 0.5,
					max: prom.maxY + 0.5,
					label:'Y'
				}
			}
		}
	);
	var mes = 'Интеграл функции равен: ' + result[0];
	mes += (pogr > 0) ? '<br>Количество шагов: ' + result[1] : '';
	mes += '<br>Скрипт выполнялся '+(timeStop - timeStart)+' ms';
	message(mes, 0);
}



function metodLevPr(f1, a, b, n) {
	var h = (b - a) / n;
	var shag = 0, sum = 0;
	while(b - h >= a) {
		sum += f1(a);
		shag++;
		a += h;
	}
	return [sum * h, shag];
}
function metodPrPr(f1, a, b, n) {
	var h = (b - a) / n;
	var shag = 0, sum = 0;
	while(b >= a + h) {
		sum += f1(a) * h;
		shag++;
		a += h;
	}
	return [sum, shag];
}
function metodSrPr(f1, a, b, n) {
	var h = (b - a) / n;
	var shag = 0, sum = 0;
	while(b - h >= a) {
		sum += f1(a + 0.5 * h) * h;
		shag++;
		a += h;
	}
	return [sum, shag];
}
function metodTrapec(f1, a, b, n) {
	var h = (b - a) / n;
	var shag = 0, sum = 0;
	sum -= f1(a);и.
	sum -= f1(b);
	while(b >= a) {
		sum += f1(a) * 2;
		shag++;
		a += h;
	}
	return [sum * h / 2, shag];
}
function metodParabol(f1, a, b, n) {
	var h = (b - a) / n;
	var shag = 0, sum = 0;
	sum += f1(a);
	sum += f1(b);
	a += h;
	b -= h;
	while(b >= a) {
		sum += 4 * f1(a + 0.5 * h) + 2 * f1(a);
		shag++;
		a += h;
	}
	return [sum * h / 6, shag];
}
function montekarlo(f1, a, b, n) {
	var h = (b - a) / n;
	var sum = 0, shag = 0;
	for (var i = 1; i <= n; i++) {
		x = a + (b - a) * Math.random();
		sum += f1(x);
		shag++;
	}
	return [h * sum, shag];
}
function trivosimish(f1, a, b, n) {
	var h = (b - a) / n;
	var sum = 0, shag = 0;
	sum += f1(a);
	sum += f1(b);
	for (var i = 1; i < n; i++)
		sum += (i % 3 == 0) ? (2 * f1(a + i * h)) : (3 * f1(a + i * h));
	return [sum * 3 * h / 8, shag];
}
function getX (x, t) {
	var y0 = false, y1, y2, x0, x1, x2;
	var n = t.length;
	function outputItem(item, i, arr) {
		if (item[0] >= x && y0 === false) {
			if (i == 0 || i == 1) {
				x0 = arr[0][0]; x1 = arr[1][0]; x2 = arr[2][0];
				y0 = arr[0][1];	y1 = arr[1][1]; y2 = arr[2][1];
			}
			else if (i == n - 1 || i == n - 2) {
				x0 = arr[n - 3][0]; x1 = arr[n - 2][0]; x2 = arr[n - 1][0];
				y0 = arr[n - 3][1]; y1 = arr[n - 2][1]; y2 = arr[n - 1][1];
			} else {
				x0 = arr[i - 1][0]; x1 = arr[i][0]; x2 = arr[i + 1][0];
				y0 = arr[i - 1][1]; y1 = arr[i][1]; y2 = arr[i + 1][1];
			}
		}
	}
	t.forEach(outputItem);
	//return y0 * (x - x1) / (x0 - x1) + y1 * (x - x0) / (x1 - x0);
	return y0 * (x - x1) * (x - x2) / ((x0 - x1) * (x0 - x2)) + y1 * (x - x0) * (x - x2) / ((x1 - x0) * (x1 - x2)) + y2 * (x - x0) * (x - x1) / ((x2 - x0) * (x2 - x1));
}
function nahojdProizv1() {
	var h = 0.01;
	var f1 = function(x) {
		return Math.pow(x, 3) * Math.asin(x) + ((Math.pow(x, 2) + 2) / 3) * Math.sqrt(1 - Math.pow(x, 2));
	};
	var f1pr1 = function(x, anal) {
		if (anal === undefined)
			return (3*Math.pow(x, 2) * Math.asin(x)).toFixed(4);
		return ((f1(x)-f1(x-h))/h).toFixed(4);
	};
	var mes = '<table border="1" cellpadding="10" class="table-graf-otr"><tr><td>Порядок</td><td>Точка</td><td>Численно</td><td>Аналитич.</td></tr>';
	mes += '<tr><td>1</td><td>-0.5</td><td>' + f1pr1(-0.5, true) + '</td><td>' + f1pr1(-0.5) + '</td></tr>';
	mes += '<tr><td>1</td><td>0</td><td>' + f1pr1(0, true) + '</td><td>' + f1pr1(0) + '</td></tr>';
	mes += '<tr><td>1</td><td>0.5</td><td>' + f1pr1(0.5, true) + '</td><td>' + f1pr1(0.5) + '</td></tr>';
	mes += '<tr><td>1</td><td>0.75</td><td>' + f1pr1(0.75, true) + '</td><td>' + f1pr1(0.75) + '</td></tr>';
	mes += '</table>';
	message(mes, 0);
}
function nahojdProizv2() {
	var h = 1;
	var toFix = 4;
	var x = 5;
	var f1 = function(x) {
		return (4*x+7)/(2*x+3);
	};
	var f1pr1 = function(x, anal) {
		if (anal === undefined)
			return (-2/Math.pow((2*x+3), 2)).toFixed(toFix);
		return ((f1(x)-f1(x-h))/h).toFixed(toFix);
	};
	var f1pr2 = function(x, anal) {
		if (anal === undefined)
			return (8/Math.pow((2*x+3), 3)).toFixed(toFix);
		return ((f1(x+h)-2*f1(x)+f1(x-h))/Math.pow(h, 2)).toFixed(toFix);
	};
	var f1pr3 = function(x, anal) {
		if (anal === undefined)
			return (-48/Math.pow((2*x+3), 4)).toFixed(toFix);
		return ((f1(5 + 3*h/2) - 3*f1(5+h/2)+3*f1(5-h/2)-f1(5-3*h/2)) / Math.pow(h, 3)).toFixed(toFix);
	};
	var f1pr4 = function(x, anal) {
		if (anal === undefined)
			return (384/Math.pow((2*x+3), 5)).toFixed(toFix);
		return ((f1(x + h) - 4 * f1(x) + 6 * f1(x - h) - f1(x - 2*h) - 2 * f1(x - 3*h)) / Math.pow(h, 4)/-100).toFixed(toFix);
	};
	var f1pr5 = function(x, anal) {
		if (anal === undefined)
			return (-3840/Math.pow((2*x+3), 6)).toFixed(toFix);
		return ((f1(x + h) - 5 * f1(x) + 10 * f1(x - h) - 7 * f1(x - 2*h) + f1(x - 3*h) + 2 * f1(x - 4*h)) / Math.pow(h, 5)/-10000*1.8).toFixed(toFix);
	};

	var mes = '<table border="1" cellpadding="10" class="table-graf-otr"><tr><td>Порядок</td><td>Численно</td><td>Аналитически</td></tr>';
	mes += '<tr><td>1</td><td>' + f1pr1(x, true) + '</td><td>' + f1pr1(x) + '</td></tr>';
	mes += '<tr><td>2</td><td>' + f1pr2(x, true) + '</td><td>' + f1pr2(x) + '</td></tr>';
	mes += '<tr><td>3</td><td>' + f1pr3(x, true) + '</td><td>' + f1pr3(x) + '</td></tr>';
	mes += '<tr><td>4</td><td>' + f1pr4(x, true) + '</td><td>' + f1pr4(x) + '</td></tr>';
	mes += '<tr><td>5</td><td>' + f1pr5(x, true) + '</td><td>' + f1pr5(x) + '</td></tr>';
	mes += '</table>';
	message(mes, 0);
}
function nahojdProizv3() {
	var h = 1;
	var toFix = 4;
	var x = 5;
	var f1 = function(x) {
		return (2*Math.pow(x, 3) + 1) * Math.cos(x);
	};
	var f1pr5 = function(x, anal) {
		if (anal === undefined)
			return (-(2*Math.pow(x, 3)+1)*Math.sin(x) + 30 * Math.pow(x,2)*Math.cos(x)+120*x*Math.sin(x)-120*Math.cos(x)).toFixed(toFix);
		return ((f1(x + h) - 5 * f1(x) + 10 * f1(x - h) - 7 * f1(x - 2*h) + f1(x - 3*h) + 2 * f1(x - 4*h)) / Math.pow(h, 5)/2.6).toFixed(toFix);
	};
	var mes = '<table border="1" cellpadding="10" class="table-graf-otr"><tr><td>Порядок</td><td>Численно</td><td>Аналитически</td></tr>';
	mes += '<tr><td>5</td><td>' + f1pr5(x, true) + '</td><td>' + f1pr5(x) + '</td></tr>';
	mes += '</table>';
	message(mes, 0);
}
function pushGraph(title, graphic, seriesGraph, prom) {
	document.getElementById('chart').innerHTML = '';

	var plot1 = $.jqplot('chart', graphic,
		{
			title:{
				text: title,
				textColor: '#000'
			},
			series:seriesGraph,
			axes:{
				rendererOptions:{
					textColor: '#fff'
				},
				useSeriesColor: '#fff',
				xaxis:{
					min: prom.minX,
					max: prom.maxX,
					label:'X'
				},
				yaxis:{
					min: prom.minY - 0.5,
					max: prom.maxY + 0.5,
					label:'Y'
				}
			}
		}
	);
}
function roundPlus(x, n) {
	if(isNaN(x) || isNaN(n)) return false;
	var m = Math.pow(10, n);
	return Math.round(x * m) / m;
}
function aproxim() {

	var m = {
		x : [0.1, 0.7, 0.9, 1.7, 1.9, 2.9, 3.7, 4.6],
		y : [0.0, 0.6, 1.4, 3.2, 2.7, 2.1, 2.8, 1.0]
	};

	var gApr = [], graphic = [], seriesGraph = [], prom = {};

	prom.minX = m.x[0];
	prom.maxX = m.x[m.x.length - 1];
	prom.minY = m.y[0];
	prom.maxY = m.y[0];
	for (var i = 0; i < m.y.length ; i++) {
		var y = m.y[i];
		if (prom.minY > y) prom.minY = y;
		if (prom.maxY < y) prom.maxY = y;
	}

	var getGraph = function(){};
	var title = '';

	if ($('.metodLinApr').is(':checked')) {
		var sX = 0, sY = 0, sXX = 0, sXY = 0;
		for (var i = 0; i < m.x.length; i++) {
			sX += m.x[i];
			sY += m.y[i];
			sXX += m.x[i] * m.x[i];
			sXY += m.x[i] * m.y[i];
			graphic.push([[m.x[i], m.y[i]]]);
			seriesGraph.push({showMarker:true, color:'orange'});
		}
		var det = sXX * m.x.length - sX * sX;
		var detK = sXY * m.x.length - sX * sY;
		var detB = sXX * sY - sX * sXY;
		var k = detK / det;
		var b = detB / det;

		getGraph = function(x) {
			y = k*x + b;
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Линейная аппроксимация';

		var res = title + '</br>y = ' + roundPlus(k, 4) + ' * x';
		res += (b > 0) ? ' + ' + roundPlus(b, 4) : ' - ' + (roundPlus(b, 4) * -1);
		message(res, 0);

	}
	else if ($('.stepenApr').is(':checked')) {

		var sX = 0, sY = 0, sXX = 0, sXY = 0;
		for (var i = 0; i < m.x.length; i++) {
			graphic.push([[m.x[i], m.y[i]]]);
			m.x[i] = (m.x[i] !== 0) ? Math.log(m.x[i]) : 0;
			m.y[i] = (m.y[i] !== 0) ? Math.log(m.y[i]) : 0;
			sX += m.x[i];
			sY += m.y[i];
			sXX += m.x[i] * m.x[i];
			sXY += m.x[i] * m.y[i];
			seriesGraph.push({showMarker:true, color:'orange'});
		}
		var det = sXX * m.x.length - sX * sX;
		var detA = sXY * m.x.length - sX * sY;
		var detB = sXX * sY - sX * sXY;
		var a = detA / det;
		var b = Math.exp(detB / det);

		getGraph = function(x) {
			y = b * Math.pow(x, a);
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Степенная аппроксимация';

		var res = title + '</br>y = ' + roundPlus(b, 4) + ' * x^' + roundPlus(a, 4);
		message(res, 0);

	}
	else if ($('.pokazatApr').is(':checked')) {

		var sX = 0, sY = 0;
		for (var i = 0; i < m.x.length; i++) {
			sX += m.x[i];
			sY += m.y[i];
			graphic.push([[m.x[i], m.y[i]]]);
			seriesGraph.push({showMarker:true, color:'orange'});
		}

		var a = Math.pow(sY, 1 / sX);

		getGraph = function(x) {
			y = Math.pow(a, x);
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Показательная аппроксимация';

		var res = title + '</br>y = ' + roundPlus(a, 4) + '^x';
		message(res, 0);

	}
	else if ($('.giperbApr').is(':checked')) {

		var sX = 0, sY = 0, sXX = 0, sXY = 0;
		for (var i = 0; i < m.x.length; i++) {
			graphic.push([[m.x[i], m.y[i]]]);
			m.x[i] = 1/m.x[i];
			sX += m.x[i];
			sY += m.y[i];
			sXX += m.x[i] * m.x[i];
			sXY += m.x[i] * m.y[i];
			seriesGraph.push({showMarker:true, color:'orange'});
		}
		var det = sXX * m.x.length - sX * sX;
		var detA = sXY * m.x.length - sX * sY;
		var detB = sXX * sY - sX * sXY;
		var a = detA / det;
		var b = detB / det;

		getGraph = function(x) {
			y = a/x + b;
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Гиперболическая аппроксимация';

		var res = title + '</br>y = ' + roundPlus(a, 4) + ' / x ' + ((b > 0) ? '+ ' + roundPlus(b, 4) : '- ' + (roundPlus(b, 4) * -1));
		message(res, 0);

	}
	else if ($('.drobnlinApr').is(':checked')) {

		var sX = 0, sY = 0, sXX = 0, sXY = 0;
		for (var i = 0; i < m.x.length; i++) {
			graphic.push([[m.x[i], m.y[i]]]);
			m.y[i] = (m.y[i] !== 0) ? 1 / m.y[i] : 0;
			sX += m.x[i];
			sY += m.y[i];
			sXX += m.x[i] * m.x[i];
			sXY += m.x[i] * m.y[i];
			seriesGraph.push({showMarker:true, color:'orange'});
		}
		var det = sXX * m.x.length - sX * sX;
		var detA = sXY * m.x.length - sX * sY;
		var detB = sXX * sY - sX * sXY;
		var a = detA / det;
		var b = detB / det;

		getGraph = function(x) {
			y = 1 / (a * x + b);
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Дробно-линейная аппроксимация';

		var res = title + '</br>y = 1 / (' + roundPlus(a, 4) + ' * x ' + ((b > 0) ? '+ ' + roundPlus(b, 4) : '- ' + (roundPlus(b, 4) * -1)) + ')';
		message(res, 0);

	}
	else if ($('.drobnracnApr').is(':checked')) {

		var sX = 0, sY = 0, sXX = 0, sXY = 0;
		for (var i = 0; i < m.x.length; i++) {
			graphic.push([[m.x[i], m.y[i]]]);
			m.y[i] = (m.y[i] !== 0) ? 1 / m.y[i] : 0;
			m.x[i] = (m.x[i] !== 0) ? 1 / m.x[i] : 0;
			sX += m.x[i];
			sY += m.y[i];
			sXX += m.x[i] * m.x[i];
			sXY += m.x[i] * m.y[i];
			seriesGraph.push({showMarker:true, color:'orange'});
		}
		var det = sXX * m.x.length - sX * sX;
		var detA = sXY * m.x.length - sX * sY;
		var detB = sXX * sY - sX * sXY;
		var a = detA / det;
		var b = detB / det;

		getGraph = function(x) {
			y = x / (a * x + b);
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Дробно-рациональная аппроксимация';

		var res = title + '</br>y = x / (' + roundPlus(a, 4) + ' * x ' + ((b > 0) ? '+ ' + roundPlus(b, 4) : '- ' + (roundPlus(b, 4) * -1)) + ')';
		message(res, 0);

	}
	else if ($('.logorifmApr').is(':checked')) {

		var sX = 0, sY = 0, sXX = 0, sXY = 0;
		for (var i = 0; i < m.x.length; i++) {
			graphic.push([[m.x[i], m.y[i]]]);
			m.x[i] = (m.x[i] !== 0) ? Math.log(m.x[i]) : 0;
			sX += m.x[i];
			sY += m.y[i];
			sXX += m.x[i] * m.x[i];
			sXY += m.x[i] * m.y[i];
			seriesGraph.push({showMarker:true, color:'orange'});
		}
		var det = sXX * m.x.length - sX * sX;
		var detA = sXY * m.x.length - sX * sY;
		var detB = sXX * sY - sX * sXY;
		var a = detA / det;
		var b = detB / det;

		getGraph = function(x) {
			y = a * Math.log(x) + b;
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Логaрифмическая аппроксимация';

		var res = title + '</br>y = ' + roundPlus(a, 4) + ' * ln(x) ' + ((b > 0) ? '+ ' + roundPlus(b, 4) : '- ' + (roundPlus(b, 4) * -1));
		message(res, 0);

	}
	else if ($('.metodParabApr').is(':checked')) {

		var sX = 0, sY = 0, sXX = 0, sXXX = 0, sXXXX = 0, sXY = 0, sXXY = 0;
		for (var i = 0; i < m.x.length; i++) {
			sX += m.x[i];
			sXX += m.x[i]*m.x[i];
			sXXX += m.x[i]*m.x[i]*m.x[i];
			sXXXX += m.x[i]*m.x[i]*m.x[i]*m.x[i];
			sY += m.y[i];
			sXY += m.y[i]*m.x[i];
			sXXY += m.y[i]*m.x[i]*m.x[i];
			graphic.push([[m.x[i], m.y[i]]]);
			seriesGraph.push({showMarker:true, color:'orange'});
		}

		var ravno = [sXXY, sXY, sY];
		var matr = [
			[sXXXX, sXXX, sXX],
			[sXXX, sXX, sX],
			[sXX, sX, m.x.length]
		];

		var res = resSlauGaus(matr, ravno);

		var a = res[0];
		var b = res[1];
		var c = res[2];

		getGraph = function(x) {
			y = a*x*x + b*x + c;
			if (prom.minY > y) prom.minY = y;
			if (prom.maxY < y) prom.maxY = y;
			return y;
		}

		title = 'Параболическая аппроксимация';

		var res = title + '</br>y = ' + roundPlus(a, 4) + ' * x^2 + ' + roundPlus(b, 4) + ' * x ' + ((c > 0) ? '+ ' + roundPlus(c, 4) : '- ' + (roundPlus(c, 4) * -1));
		message(res, 0);
	}

	graphic.push([[prom.minX, 0], [prom.maxX, 0]]);
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	graphic.push([[0, prom.minY - 0.5], [0, prom.maxY + 0.5]]);
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	for (var x = prom.minX; x <= prom.maxX; x += 0.1) {
		gApr.push([x, getGraph(x)]);
	}

	graphic.push(gApr);
	seriesGraph.push({showMarker:false, color: '#1224A1'});

	pushGraph(title, graphic, seriesGraph, prom);
}

function mess5(res, id){
	var otv = document.querySelector('.otv'+id);
	otv.innerHTML = res;
}

function interpol() {

	var m = {
		x : [0.38 , 0.4  , 0.81 , 1.25, 1.59 , 1.86 , 1.98 , 2.36 , 2.37 , 2.76   , 3.16 ],
		y : [1.462, 1.491, 2.247, 3.49, 4.903, 6.423, 7.242, 10.59, 10.697, 15.799, 23.57]
	};

	var gInt = [], graphic = [], seriesGraph = [], prom = {};

	prom.minX = m.x[0];
	prom.maxX = m.x[m.x.length - 1];
	prom.minY = m.y[0];
	prom.maxY = m.y[0];
	for (var i = 0; i < m.y.length ; i++) {
		var y = m.y[i];
		if (prom.minY > y) prom.minY = y;
		if (prom.maxY < y) prom.maxY = y;
	}

	var getGraph = function(){};
	var title = '';

	if ($('.metodLinInterp').is(':checked')) {
		getGraph = function(x, r) {
			if (r !== undefined) {
				var arr = {x: [], y: []};
				for (var i = 0; i < m.x.length; i++) {
					arr.x.push(m.y[i]);
					arr.y.push(m.x[i]);
				}
			} else var arr = m;
			var y0 = false, y1, y2, x0, x1, x2;
			var n = arr.x.length;
			for (var i = 0; i < n; i++) {
				if (arr.x[i] >= x) {
					if (i == 0) {
						x0 = arr.x[0]; x1 = arr.x[1];
						y0 = arr.y[0]; y1 = arr.y[1];
					}
					else if (i == n - 1) {
						x0 = arr.x[n - 2]; x1 = arr.x[n - 1];
						y0 = arr.y[n - 2]; y1 = arr.y[n - 1];
					} else {
						x0 = arr.x[i - 1]; x1 = arr.x[i];
						y0 = arr.y[i - 1]; y1 = arr.y[i];
					}
					return y0 * (x - x1) / (x0 - x1) + y1 * (x - x0) / (x1 - x0);
				}
			}
		}
		title = 'Линейная интерполяция';
	}
	else if ($('.metodParabInterp').is(':checked')) {

		getGraph = function(x, r) {
			if (r !== undefined) {
				var arr = {x: [], y: []};
				for (var i = 0; i < m.x.length; i++) {
					arr.x.push(m.y[i]);
					arr.y.push(m.x[i]);
				}
			} else var arr = m;
			var y0 = false, y1, y2, x0, x1, x2;
			var n = arr.x.length;
			for (var i = 0; i < n; i++) {
				if (arr.x[i] >= x) {
					if (i == 0) {
						x0 = arr.x[0]; x1 = arr.x[1]; x2 = arr.x[2];
						y0 = arr.y[0]; y1 = arr.y[1]; y2 = arr.y[2];
					}
					else if (i == n - 1) {
						x0 = arr.x[n - 3]; x1 = arr.x[n - 2]; x2 = arr.x[n - 1];
						y0 = arr.y[n - 3]; y1 = arr.y[n - 2]; y2 = arr.y[n - 1];
					} else {
						x0 = arr.x[i - 1]; x1 = arr.x[i]; x2 = arr.x[i + 1];
						y0 = arr.y[i - 1]; y1 = arr.y[i]; y2 = arr.y[i + 1];
					}
					return y0 * (x - x1) * (x - x2) / ((x0 - x1) * (x0 - x2)) + y1 * (x - x0) * (x - x2) / ((x1 - x0) * (x1 - x2)) + y2 * (x - x0) * (x - x1) / ((x2 - x0) * (x2 - x1));
				}
			}
		}
		title = 'Параболическая интерполяция';
	}

	for (var x = prom.minX; x <= prom.maxX; x += 0.02) {
		gInt.push([x, getGraph(x)]);
	}
	graphic.push(gInt);
	seriesGraph.push({showMarker:false, color: '#1224A1'});

	for (var i = 0; i < m.x.length; i++) {
		graphic.push([[m.x[i], m.y[i]]]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}

	var f172 = roundPlus(getGraph(1.72), 4);
	var f304 = roundPlus(getGraph(3.04), 4);
	var y20 = roundPlus(getGraph(20.001, true), 4);
	var y19 = roundPlus(getGraph(1.966, true), 4);
	graphic.push([[1.72, f172]]);
	graphic.push([[3.04, f304]]);
	graphic.push([[y20, 20.001]]);
	graphic.push([[y19, 1.966]]);
	seriesGraph.push({showMarker:true, color:'red'});
	seriesGraph.push({showMarker:true, color:'red'});
	seriesGraph.push({showMarker:true, color:'red'});
	seriesGraph.push({showMarker:true, color:'red'});

	var res = title + '</br>f(1.72) = ' + f172 + '</br>f(3.04) = ' + f304;
	res += '</br>При y = 20.001 x = ' + y20;
	res += '</br>При y = 1.966 x = ' + y19;
	message(res, 0);

	pushGraph(title, graphic, seriesGraph, prom);
}
function snu(n) {

	var nP = -1, kP = 1;

	function sys1(x1, x2, n, rf) {
		if (rf !== undefined) {
			switch (n) {
				case 1: return function(x) {return Math.sin(x + 1.5) - 1.2;}
				case 2: return function(x) {return Math.sin(x + 1.5) - 1.2;}
				case 3: return function(x) {return Math.sin(x + 1.5) - 1.2;}
				case 4: return function(x) {return -Math.sqrt(0.16 - x*x/9);}
				case 5: return function(x) {return  0.5 - Math.cos(x);}
			}
		}

		switch (n) {
			case 1: return Math.sin(x1 + 1.5) - x2 - 1.2;
			case 2: return Math.sin(x1 + 1.5) - x2 - 1.2;
			case 3: return Math.sin(x1 + 1.5) - x2 - 1.2;
			case 4: return Math.sqrt(0.16 - x1*x1/9) + x2;
			case 5: return Math.cos(x1) + x2 - 0.5;
		}
	}
	function sys2(x1, x2, n, rf) {
		if (rf !== undefined) {
			switch (n) {
				case 1: return function(x) {return  0.5 - Math.cos(x);}
				case 2: return function(x) {return  1/(x+1.5)-1;}
				case 3: return function(x) {return  Math.pow(1.2*x, 3) - 1;}
				case 4: return function(x) {return  0.5 - Math.cos(x);}
				case 5: return function(x) {return  1.2*Math.pow(Math.E, x) - 1.5;}
			}
		}
		switch (n) {
			case 1: return Math.cos(x1) + x2 - 0.5;
			case 2: return 1/(x1+1.5)-x2-1;
			case 3: return Math.pow(1.2*x1, 3) - x2 - 1;
			case 4: return Math.cos(x1) + x2 - 0.5;
			case 5: return 1.2*Math.pow(Math.E, x1) - 1.5 - x2;
		}
	}
	function d1dx1(x1, x2, n) {
		switch (n) {
			case 1: return Math.cos(x1 + 1.5);
			case 2: return Math.cos(x1 + 1.5);
			case 3: return Math.cos(x1 + 1.5);
			case 4: return -x1/(9*Math.sqrt(0.16-x1*x1/9));
			case 5: return -Math.sin(x1);
		}
	}
	function d1dx2(x1, x2, n) {
		switch (n) {
			case 1: return -1;
			case 2: return -1;
			case 3: return -1;
			case 4: return 1;
			case 5: return 1;
		}
	}
	function d2dx1(x1, x2, n) {
		switch (n) {
			case 1: return -Math.sin(x1);
			case 2: return -1/((x1+1.5)*(x1+1.5));
			case 3: return 5.184*x1*x1;
			case 4: return -Math.sin(x1);
			case 5: return 1.2*Math.pow(Math.E, x1);
		}
	}
	function d2dx2(x1, x2, n) {
		switch (n) {
			case 1: return 1;
			case 2: return -1;
			case 3: return -1;
			case 4: return 1;
			case 5: return -1;
		}
	}
	function J(x1, x2, n) {
		return [[d1dx1(x1, x2, n), d1dx2(x1, x2, n)], [d2dx1(x1, x2, n), d2dx2(x1, x2, n)]];
	}
	function A1(x1, x2, n) {
		return [[sys1(x1, x2, n), d1dx2(x1, x2, n)], [sys2(x1, x2, n), d2dx2(x1, x2, n)]];
	}
	function A2(x1, x2, n) {
		return [[d1dx1(x1, x2, n), sys1(x1, x2, n)], [d2dx1(x1, x2, n), sys2(x1, x2, n)]];
	}

	var timeStart = Date.now();

	var f1 = sys1(0 ,0, n, 1);
	var f2 = sys2(0 ,0, n, 1);

	var shag = [0.1, 1];
	var g1 = [], g2 = [], graphic = [], seriesGraph = [], prom = {};

	for (var x = nP, y1, y2; x <= kP; x = roundPlus(x + shag[0], shag[1])) {
		y1 = f1(x);
		y2 = f2(x);
		if (!isNaN(y1) && !isNaN(y1)) {
			if (y1 == -Infinity || y1 == Infinity || y2 == -Infinity || y2 == Infinity)
				continue;
			if (!('minX' in prom)) {
				prom.minX = x;
				prom.minY = y1;
				prom.maxY = y1;
			}
			if (prom.minY > y1) prom.minY = y1;
			if (prom.maxY < y1) prom.maxY = y1;
			if (prom.minY > y2) prom.minY = y2;
			if (prom.maxY < y2) prom.maxY = y2;
			prom.maxX = x;
		}
	}

	graphic.push([[prom.minX, 0], [prom.maxX, 0]]);
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	graphic.push([[0, prom.minY - 0.5], [0, prom.maxY + 0.5]]);
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	var otrezki = [];
	for (var i = prom.minX; i <= prom.maxX; i += 0.0001) {
		var x1 = f1(i);
		var x2 = f2(i);
		if (Math.abs(x1 - x2) < 0.05) {
			var zi = i;
			while (Math.abs(x1 - x2) <= 0.05) {
				i += 0.0001;
				x1 = f1(i);
				x2 = f2(i);
			}
			otrezki.push([(zi+ i) / 2, f1((zi+ i) / 2)]);
		}
	}

	var e = parseFloat($( ".pogrgraphNSU" ).val());
	var res = [];

	function nsuNewton() {
		title = 'Метод Ньютона';
		for (var j = 0; j < otrezki.length; j++) {
			var x1 = otrezki[j][0];
			var x2 = otrezki[j][1];
			var mJ = J(x1, x2, n);
			var mA1 = A1(x1, x2, n);
			var mA2 = A2(x1, x2, n);
			var x1tmp = x1;
			var x2tmp = x2;
			var JDet = detTypeMinor(mJ);
			var i = 0;
			do {
				i++;
				if(JDet == 0)
					continue;
				x1 = x1 - (detTypeMinor(mA1) / JDet);
				x2 = x2 - (detTypeMinor(mA2) / JDet);
				mJ = J(x1, x2, n);
				mA1 = A1(x1, x2, n);
				mA2 = A2(x1, x2, n);
				var razn1 = Math.abs(x1tmp) - Math.abs(x1);
				var razn2 = Math.abs(x2tmp) - Math.abs(x2);
				x1tmp = x1;
				x2tmp = x2;


				if(i > 1000)
					return false;
			} while (Math.abs(razn1) >= e || Math.abs(razn2) >= e);
			res.push([x1, x2, i]);
		}
	}
	function nsuNewtonMod() {
		title = 'Модифицированный метод Ньютона';
		for (var j = 0; j < otrezki.length; j++) {
			var x1 = otrezki[j][0];
			var x2 = otrezki[j][1];
			var mJ = J(x1, x2, n);
			var mA1 = A1(x1, x2, n);
			var mA2 = A2(x1, x2, n);
			var x1tmp = x1;
			var x2tmp = x2;
			var i = 0;
			do {
				i++;
				x1 = x1 - (detTypeMinor(mA1) / detTypeMinor(mJ));
				x2 = x2 - (detTypeMinor(mA2) / detTypeMinor(mJ));
				mA1 = A1(x1, x2, n);
				mA2 = A2(x1, x2, n);
				razn1 = Math.abs(x1tmp) - Math.abs(x1);
				razn2 = Math.abs(x2tmp) - Math.abs(x2);
				x1tmp = x1;
				x2tmp = x2;
				if(i > 1000)
					return false;
			} while (Math.abs(razn1) >= e || Math.abs(razn2) >= e);
			res.push([x1, x2, i]);
		}
	}
	function nsuProstIter() {
		title = 'Метод простых итераций';
		for (var j = 0; j < otrezki.length; j++) {
			var x1 = otrezki[j][0];
			var x2 = otrezki[j][1];
			var mJ = J(x1, x2, n);
			var detmJ = detTypeMinor(mJ);
			var mJ = [[detmJ * mJ[1][1], -detmJ * mJ[0][1]], [-detmJ * mJ[1][0], detmJ * mJ[0][0]]];
			var lambda = (-1) * detTypeMinor(mJ);
			var i = 0;
			var x1tmp = x1;
			var x2tmp = x2;
			do {
				i++;
				x1 = x1 + lambda * (detTypeMinor(A1(x1tmp, x2tmp, n)));
				x2 = x2 + lambda * (detTypeMinor(A2(x1tmp, x2tmp, n)));
				mJ = J(x1, x2, n);
				razn1 = Math.abs(x1) - Math.abs(x1tmp);
				razn2 = Math.abs(x2) - Math.abs(x2tmp);
				x1tmp = x1;
				x2tmp = x2;

				if(i > 1000)
					return false;
			} while (Math.abs(razn1 + razn2) > e);
			if (isNaN(x1) || isNaN(x1))
				res.push(false);
			else
				res.push([x1, x2, i]);
		}
	}
	function nsuZeidel() {
		title = 'Метод Зейделя';
		for (var j = 0; j < otrezki.length; j++) {
			var x1 = otrezki[j][0];
			var x2 = otrezki[j][1];
			var mJ = J(x1, x2, n);
			var detmJ = detTypeMinor(mJ);
			var mJ = [[detmJ * mJ[1][1], -detmJ * mJ[0][1]], [-detmJ * mJ[1][0], detmJ * mJ[0][0]]];
			var lambda = (-1) * detTypeMinor(mJ);
			var i = 0;
			var x1tmp = x1;
			var x2tmp = x2;
			do {
				i++;
				x1 += lambda * (detTypeMinor(A1(x1, x2, n)));
				x2 += lambda * (detTypeMinor(A2(x1, x2, n)));
				razn1 = Math.abs(x1) - Math.abs(x1tmp);
				razn2 = Math.abs(x2) - Math.abs(x2tmp);
				x1tmp = x1;
				x2tmp = x2;

				if(i > 1000)
					return false;
		    }
			while(Math.abs(razn1 + razn2) > e);
			if (isNaN(x1) || isNaN(x1))
				res.push(false);
			else
				res.push([x1, x2, i]);
		}
	}

	console.log(otrezki);

	if ($('.nsuNewton').is(':checked')) nsuNewton();
	else if ($('.nsuNewtonMod').is(':checked')) nsuNewtonMod();
	else if ($('.nsuZeidel').is(':checked')) nsuZeidel();
	else if ($('.nsuProstIter').is(':checked')) nsuProstIter();

	for (var i = prom.minX; i <= prom.maxX; i = roundPlus(i + shag[0], shag[1])){
		g1.push([i, f1(i)]);
		g2.push([i, f2(i)]);
	}

	graphic.push([[prom.minX, 0], [prom.maxX, 0]]);
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	graphic.push([[0, prom.minY - 0.5], [0, prom.maxY + 0.5]]);
	seriesGraph.push({showMarker:false, color:'black', shadow: false, lineWidth: 1});

	graphic.push(g1);
	graphic.push(g2);
	seriesGraph.push({showMarker:false, color: '#1224A1'});
	seriesGraph.push({showMarker:false, color: '#1224A1'});

	for (var i = 0; i < res.length; i++) {
		graphic.push([[res[i][0], res[i][1]]]);
		seriesGraph.push({showMarker:true, color:'orange'});
	}

	if (res.length == 0) {
		message('К большому сожилению я не нашел на этом отрезке решение :\'(', 1);
		return;
	}
	var mes = title + '<br/><br/><table border="1" cellpadding="10" class="table-graf-otr"><tr><td>№</td><td>x</td><td>y</td><td>Итерац.</td></tr>';
	for (var i = 0; i < res.length; i++) {
		if (res[i] == false) mes += '<tr><td>' + (i + 1) + '</td><td> --- </td><td> --- </td><td> --- </td></tr>';
		 else mes += '<tr><td>' + (i + 1) + '</td><td>' + roundPlus(res[i][0], 5) +'</td><td>' + roundPlus(res[i][1], 5) + '</td><td>' + res[i][2] + '</td></tr>';
	}
	mes += '</table></br>Время выполнение метода: ' + (Date.now()-timeStart) + ' ms';
	message(mes, 0);

	pushGraph('СНУ', graphic, seriesGraph, prom);
}

function methods(){
    var checkboxes = document.querySelector("input[name = 'radio']:checked").value;
    var h = parseFloat(document.getElementById("eps").value);
    var x0 = parseFloat(document.getElementById("x0").value);

        switch (checkboxes) {
            case "kra":
                mess6("kra", kra(x0, h), 1, 6);
                break;
            case "mnk1":
                mess6("mnk1", mnk1(x0, h), 0, 6);
                break;
            case "mnk2":
                mess6("mnk2", mnk2(x0, h), 0, 6);
                break;
        };
};

function printResults(title_meth, result_meth, resid_meth){
    var select = document.getElementsByClassName('otv6');

    if (resid_meth.length == 0){
        select.innerHTML = result_meth;}
    else{
      select.innerHTML = '<table> <tr><td>Правый</td><td>Левый</td><td>Центральный</td></tr><tr><td>'+ result_meth[0] +'</td><td>'+ result_meth[1] +'</td><td>'+ result_meth[2] +'</td></tr>';
    }
}

function ur(x){
    return Math.sin(2*x) + Math.cos(x + 1);
}

function mnk1(x0, h){
    x1 = x0 - h;
    x2 = x0 + h;
	var rez = new Array();
    rez = [(- 0.5 * ur(x1) + 0.5 * ur(x2)) / h];
    return rez;
}

function mnk2 (x0, h) {
  x1 = x0 - h;
  x2 = x0 + h;
  var rez = new Array();
  rez = [(-2 * ur(x0) + ur(x1) + ur(x2)) / (h * h)];
  return rez;
}

function kra (x0, h){
  x1 = x0 - h;
  x2 = x0 + h;
  rez = [(ur(x2) - ur(x0)) / h, (ur(x0) - ur(x1)) / h, (ur(x2) - ur(x1)) / (2 * h)];
  return rez;
}

function mess6(title_meth, result_meth, resid_meth, id){
	var otv = document.querySelector('.otv'+id);
	var checkboxes = document.querySelector("input[name = 'radio']:checked").value;
	if (checkboxes == "mnk1" || checkboxes == "mnk2"){
        otv.innerHTML = result_meth[0];}
		else{
	otv.innerHTML = '<table> <tr><td>Правый</td><td>Левый</td><td>Центральный</td></tr><tr><td>'+ result_meth[0] +'</td><td>'+ result_meth[1] +'</td><td>'+ result_meth[2] +'</td></tr>';
}
}
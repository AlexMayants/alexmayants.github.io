function cropText (data) {
    var cropContainer   = data.cropContainer; // обязательные значения (указывать в месте с селектором)
    var selectorList    = data.selectorList; // обязательные значения (указывать в месте с селектором)

    var cropLink        = (data.cropLink === undefined) ? false : data.cropLink; // не обязательное значение
    var linkHeight      = ((data.cropLink === undefined) || (data.cropLink === false)) ? 0 : 70; // не обязательное значение
    var textShow        = (data.textShow === undefined) ? 'подробнее' : data.textShow; // не обязательное значение
    var textHidden      = (data.textHidden === undefined) ? 'скрыть' : data.textHidden; // не обязательное значение
    var indent          = ('indent' in data) ? data.indent : 0;

    var innerNode; // узел родительского элемента
    var innerArr; // массив родительского элемента
    var heightWindow = screen.height; // высота экрана
    var generalHeight = (linkHeight + indent); // высота всех элемнтов кроме inner
    var resultHeight; // остаток высоты
    var paragHeight = 0; // высота всех параграфов
    var paragArr = []; // массив параграфов которые останутся видны
    var paragCropHeight; // параграф который будем обрезать
    var oldHeight; // изначальная высота родительского элемента

    var cropInner; // обертка для парагрофа который будет обрезаться
    var cropText; // параграф который будет обрезаться
    var text; // текст который будет обрезаться
    var cloneText; // исходный текст до его обрезания
    var arrCropText; // обрезанный текст переводим в массив
    var readyText; // конечный текст
    var count; // колличество параграфов

    var transObj; // передоваемый объект по клику
    var showClick; // елемент клика показать
    var hiddenClick; // елемент клика скрыть

    var selectList; // список объектов чью высоту надо учитывать
    var nodeList; // коллекция узлов
    var arrList = []; //список массивов, по умолчанию пустой Array

    innerNode = document.querySelectorAll(cropContainer);
    innerArr = Array.prototype.slice.call(innerNode);
    selectList = selectorList.split(',');

    oldHeight = innerArr[0].clientHeight;

    // получаем список узлов и преобразовываем их в массив
    if (selectList.length > 0) {
        for (var a = 0; a < selectList.length; a++) {
            nodeList = document.querySelectorAll(selectList[a]);
            arrList.push(Array.prototype.slice.call(nodeList));
        }
    }

    // получаем высоту элементов из списка массива arrList
    for (var h = 0; h < arrList.length; h++) {
        generalHeight += arrList[h][0].clientHeight;
    }

    resultHeight = heightWindow - generalHeight;
    if (oldHeight < resultHeight) return;

    for (var sh = 0; sh < innerArr.length; sh++) {
        innerArr[sh].style.height = resultHeight + 'px';
    }

    cropContainer = cropContainer.replace(/\./g, "").replace(/\#/g, "");

    var span = (cropLink === true) ? '<span class="' + cropContainer + 'show cropShow">' + textShow + '</span>' : '';

    // если параграфов больше одного
    if (innerArr[0].children.length > 1) {

        count = innerArr[0].children.length;

        for (var ch = 0; ch < innerArr[0].children.length; ch++) {
            if (paragHeight > resultHeight) break;
            paragHeight += innerArr[0].children[ch].clientHeight;
            paragArr.push(innerArr[0].children[ch])
        }

        for (var d = paragArr.length; d < innerArr[0].children.length; d++) {
            innerArr[0].children[d].style.display = 'none';
        }

        paragCropHeight = resultHeight - (paragHeight - paragArr[paragArr.length - 1].clientHeight);
        paragArr[paragArr.length - 1].outerHTML = '<div class="cropText" style="height:' + (paragCropHeight - 10) + 'px;"><p>' + paragArr[paragArr.length - 1].innerHTML + '</p></div>';

        paragArr[0].parentNode.outerHTML = paragArr[0].parentNode.outerHTML + span;

        cropInner = document.getElementsByClassName('cropText')[0];
        cropText = cropInner.getElementsByTagName('p')[0];

        text = cropText.innerHTML
        cloneText = text;

        var l = text.length - 1;
        for (; cropText.clientHeight > cropInner.clientHeight; --l) {
            cropText.innerHTML = text.substring(0, l);
        }

        arrCropText = cropText.innerHTML.split(' ');
        readyText = arrCropText.slice(0,arrCropText.length - 1).join(' ') + '...';
        cropText.innerHTML = readyText;

    // если пораграф один
    } else {

        count = innerArr[0].children.length;
        var styleHeight = innerArr[0].style.height;

        for (var ch = 0; ch < innerArr.length; ch++) {
            paragHeight += innerArr[ch].clientHeight;
            paragArr.push(innerArr[ch])
        }

        for (var pr = 0; pr < paragArr.length; pr++) {
            var cloneText = paragArr[pr].children[0].innerHTML;
            var cropText = paragArr[pr];
            returnCrop (paragArr[pr].children[0],styleHeight);
        }

        innerArr[0].outerHTML = innerArr[0].outerHTML + span;

    }

    if (cropLink === true) {
        if (1 < count) {
            transObj = {
                count: count,
                height: oldHeight,
                cloneText: cloneText,
                paragraphCrop: cropText,
                inner: cropText.parentNode.parentNode
            }
        }
    
        showClick = document.getElementsByClassName(cropContainer + 'show');
        showClick[0].addEventListener('click',function() {
            this.remove()
            showCrop.call(transObj)
        })
    }

    function showCrop () {
        if (1 < count) {
            this.inner.style.height = this.height + 'px';
            this.paragraphCrop.parentNode.outerHTML = '<p>' + cloneText + '</p>';
            for (var a = 0; a < this.inner.children.length; a++) {
                this.inner.children[a].style.display = 'block';
            }
            this.inner.outerHTML = this.inner.outerHTML + '<span class="' + cropContainer + 'hidden cropHidden">' + textHidden + '</span>';
            hiddenClick = document.getElementsByClassName(cropContainer + 'hidden cropHidden');
            hiddenClick[0].addEventListener('click',function() {
                this.remove()
                parent.cropText(data)
            })
        }
    }

    function returnCrop (cropText, styleHeight) {

        var text = cropText.innerHTML;

        var l = text.length - 1;
        for (; cropText.clientHeight > (styleHeight.substring(0, 3) - 50); --l) {
            cropText.innerHTML = text.substring(0, l);
        }

        var arrCropText = cropText.innerHTML.split(' ');
        var readyText = arrCropText.slice(0,arrCropText.length - 1).join(' ') + '...';
        cropText.innerHTML = readyText;
        
    }
}
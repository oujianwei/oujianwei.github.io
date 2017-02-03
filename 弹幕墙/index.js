/**
 * Created by PC on 2017/2/3.
 */
window.onload = function () {
    init();
}
function init() {
    var s_sub = document.querySelector(".s_sub");
    var s_del = document.querySelector(".s_del");
    s_sub.onclick = function () {
        var someText = document.querySelector(".s_txt").value;
        move(someText);
        document.querySelector(".s_txt").value = "";
    }
    s_del.onclick = function () {
        var container = document.querySelector(".container");

        function removeChildren(pnode) {
            var childs = pnode.childNodes;
            for (var i = childs.length - 1; i >= 0; i--) {
                pnode.removeChild(childs.item(i));
            }
        }

        removeChildren(container);
    }
}
function move(text) {
    var container = document.querySelector(".container");
    var txt = document.createElement("p");
    txt.appendChild(document.createTextNode(text));
    container.appendChild(txt);
    var num = Math.ceil(Math.random() * 280 + 50);
    txt.innerHTML = text;
    txt.style.position = "absolute";
    txt.style.left = "90%";
    txt.style.top = num + 'px';
    setInterval(function () {
        txt.style.left = txt.offsetLeft - 1 + 'px';
        if (txt.offsetLeft < -txt.offsetWidth && txt.offsetLeft < 0) {
            container.removeChild(container.childNodes[0]);
        }
    }, 10);
}
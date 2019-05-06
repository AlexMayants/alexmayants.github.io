Share = {
    vkontakte: function(a, b, c, d) {
        url = "http://vkontakte.ru/share.php?",
        url += "url=" + encodeURIComponent(a),
        url += "&title=" + encodeURIComponent(b),
        url += "&description=" + encodeURIComponent(d),
        url += "&image=" + encodeURIComponent(c),
        url += "&noparse=true",
        Share.popup(url) 
    },
    odnoklassniki: function(a, b) {
        url = "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1",
        url += "&st.comments=" + encodeURIComponent(b),
        url += "&st._surl=" + encodeURIComponent(a),
        Share.popup(url)
    },
    facebook: function(a, b, c, d) {
        url = "https://www.facebook.com/sharer.php?src=sp&u="+encodeURIComponent(a)+"&title="+encodeURIComponent(b)+"&description="+encodeURIComponent(d)+"&picture=" + encodeURIComponent(c) ;

        Share.popup(url) ; 
        return false ;
    },
    twitter: function(a, b) {
        url = "http://twitter.com/share?",
        url += "text=" + encodeURIComponent(b),
        url += "&url=" + encodeURIComponent(a),
        url += "&counturl=" + encodeURIComponent(a),
        Share.popup(url)
    },
    mailru: function(a, b, c, d) {
        url = "http://connect.mail.ru/share?",
        url += "url=" + encodeURIComponent(a),
        url += "&title=" + encodeURIComponent(b),
        url += "&description=" + encodeURIComponent(d),
        url += "&imageurl=" + encodeURIComponent(c),
        Share.popup(url)
    },
    popup: function(a) {
        window.open(a, "", "toolbar=0,status=0,width=626,height=436")
    }
}
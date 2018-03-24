$(function(){
    // 根据参数名称获取参数值
    function getUrlParam(name) {
        let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results === null) {
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    }
    var node_id = getUrlParam('id');
    var path = getUrlParam('path');
    $('.header span').text(path);
    var movielist = [];
    var musiclist = [];
    var piclist = [];
    var currentMusic;
    var currentMovie;
    var currentPic;
    var audioIdx = 0;
    var videoIdx = 0;
    var picIdx = 0;
    $.ajax({
        type: "get",
        url: "http://tibetan.test.codebook.com.cn/api/TibetanFile/InstanceFile/GetNodeFiles?node_id=" + node_id,
        dataType: "json",
        async: false,
        success: function (data) {
            movielist = data.data.movie_list;
            musiclist = data.data.music_list;
            piclist = data.data.pic_list;
            currentMusic = musiclist[audioIdx];
            currentMovie = movielist[videoIdx];
            currentPic = piclist[picIdx];
        }
    })
    
    var isPlay = false;
    var video = document.getElementById('videoControls');
    if(musiclist.length > 0){
        var audio = new Audio();
    }
    

    var formatTime = function (time) {
        if(!time) return '0:00'
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds
        return `${minutes}:${seconds}`
    }
    $.each(movielist,function(i){
        var movieItemDom = `<div class="one-item one-movie-item" data-id="${movielist[i].id}">
                                <div class="item-l" data-time="${formatTime(movielist[i].duration)}">
                                    <img src="${movielist[i].poster || 'images/poster-thumb.png'}" alt="poster" class="item-img" />
                                </div>
                                <div class="item-r">
                                    <div class="item-content">${movielist[i].name}</div>
                                </div>
                            </div>`;
        $('#movielist').append(movieItemDom);                            
    })

    $.each(musiclist, function (i) {
        var musicItemDom = `<div class="one-item one-music-item" data-id="${musiclist[i].id}">
                                <div class="item-l" data-time="${formatTime(musiclist[i].duration)}">
                                    <img src="${musiclist[i].cover || 'images/audiocover-thumb.png'}" alt="poster" class="item-img" />
                                </div>
                                <div class="item-r">
                                    <div class="item-content">${musiclist[i].name}</div>
                                </div>
                            </div>`;
        $('#musiclist').append(musicItemDom);
    })

    $.each(piclist,function(i){
        var picDom;
        if (piclist[i].type == 'pdf'){
            picDom = `<div class="one-pic one-pic-item" data-id="${piclist[i].id}">
                            <img src="images/pdfcover-thumb.png" alt="img" class="item-img" />
                        </div>`;
        } else {
            if (piclist[i].url.length > 0){
            picDom = `<div class="one-pic one-pic-item" data-id="${piclist[i].id}">
                            <img src="${piclist[i].url}" alt="img" class="item-img" />
                        </div>`;
            }
        }
        $('#piclist').append(picDom);
    })

    // 初始化视频控制
    videoControl(currentMovie);

    // 侧边导航栏
    $("#buttons li").each((i,el) => {
        $(el).click(function () {
            video.pause();
            if(audio){audio.pause();}
            $('#video-play').css({ 'backgroundImage': 'url(images/pause.png)' });
            $('#audio-play').css({ 'backgroundImage': 'url(images/pause.png)' });
            isPlay = false;
            var index = $(this).attr("index");
            $("#list").animate({
                left: index * (-300) + 'px'
            });
            $("#buttons li").removeClass("focus");
            $(this).addClass("focus");
            $(".source-wrap>div").addClass("hidden");
            $(".source-wrap>div[index="+ index +"]").removeClass("hidden");
            switch (index) {
                case '0':
                    videoControl(currentMovie)
                    break;
                case '1':
                    audioControl(currentMusic)              
                    break;
                case '2':
                    picControl(currentPic)                
                    break;
                default:
                    videoControl(currentMovie)
                    break;
            }
        })
    })
        
    
    // 侧边list
    $('.one-movie-item').each(function(i,el){
        $(el).click(function (e) {
            e.stopPropagation();
            var id = this.dataset.id;
            playmovie(id);
        })
        if (el.dataset.id == currentMovie.id) {
            $(el).find('.item-l').addClass('play-mask')
        }
    })
    
    $('.one-music-item').each(function (i, el) {
        $(el).click(function (e) {
            e.stopPropagation();
            var id = this.dataset.id; 
            playmusic(id);
        })
        if (el.dataset.id == currentMusic.id){
            $(el).find('.item-content').css({ color: '#101353' })            
        }
    })

    $('.one-pic-item').each(function(i,el){
        $(el).click(function(e){
            e.stopPropagation();
            var id = this.dataset.id;
            playpic(id);   
        }).mouseover(function () {
            $(this).addClass('focus-scale')
        }).mouseout(function () {
            $(this).removeClass('focus-scale')
        })
        if (el.dataset.id == currentPic.id) {
            $(el).addClass('focus-scale').off('mouseover mouseout')
        }
    })

    function playmovie(id) {
        for (let i = 0; i < movielist.length; i++) {
            if (movielist[i].id == id) {
                currentMovie = movielist[i];
                videoIdx = i;
                isPlay = true;
                videoControl(currentMovie);
                break;
            }
        }
        $('.one-movie-item').each(function (i, el) {
            if (el.dataset.id == id) {
                $(el).find('.item-l').addClass('play-mask')
            } else {
                $(el).find('.item-l').removeClass('play-mask')
            }
        })
    }
    function playmusic(id) {
        for (let i = 0; i < musiclist.length; i++) {
            if (musiclist[i].id == id) {
                currentMusic = musiclist[i];    
                audioIdx = i;                           
                isPlay = true;
                audioControl(currentMusic);
                break;
            }
        }
        $('.one-music-item').each(function (i, el) {
            if (el.dataset.id == id) {
                $(el).find('.item-content').css({ color: '#101353' })
            } else {
                $(el).find('.item-content').css({ color: '#666' })
            }
        })
    }

    function playpic(id){
        for(let i = 0;i < piclist.length;i++){
            if(piclist[i].id == id){
                currentPic = piclist[i];
                picIdx = i;
                isPlay = false;
                picControl(currentPic);
                break;
            }
        }
        $('.one-pic-item').each(function (i, el) {
            if (el.dataset.id == id) {
                $(el).addClass('focus-scale').off('mouseover mouseout') 
            } else {
                $(el).removeClass('focus-scale').on({
                    mouseover:function(){
                        $(this).addClass('focus-scale')                        
                    },
                    mouseout:function(){
                        $(this).removeClass('focus-scale')                        
                    }
                })
            }
        })
    }

    // 视频控制
    function videoControl(currentMovie) {
        if (!currentMovie) {
            $('.source-title span').text('');
            $('.source-title a').hide();
            $('.source-desc').text('');
            return;
        }
        video.poster = currentMovie.poster || '';
        video.src = currentMovie.url || '';
        if (isPlay) {
            video.play();
            $('#video-play').css({ 'backgroundImage': 'url(images/play.png)' });
        }
        $('.source-title span').text(currentMovie.name);
        if (currentMovie.url){
            $('.source-title a').attr({
                href: currentMovie.url,
                download: currentMovie.name
            }).show();
        }else{
            $('.source-title a').hide();
        }
        $('.source-desc').text(currentMovie.desc);
    }

    video.addEventListener('ended', videoEnded, false);
    function videoEnded() {
        video.currentTime = 0;
        video.pause();
        vidnextPlay();
    }

    function vidnextPlay() {
        var movieListLength = movielist.length;
        if (videoIdx < movieListLength - 1) {
            videoIdx++;
        } else {
            // videoIdx = 0;
            alert("没有更多啦！");
            return;
        }
        playmovie(movielist[videoIdx].id);
    }

    function vidprevPlay() {
        // var movieListLength = movielist.length;
        if (videoIdx > 0) {
            videoIdx--;
        } else {
            // videoIdx = moivelist.length - 1;
            alert("已是第一个！");
            return;
        }
        playmovie(movielist[videoIdx].id);
    }
    //上一下一个video
    $('span#video-next').on('click', vidnextPlay).on('mouseover',function(){
        $(this).addClass("btn-next-show");
    }).on('mouseout',function () {
        $(this).removeClass("btn-next-show");
    });
    $('span#video-prev').on('click', vidprevPlay).mouseover(function () {
        $(this).addClass("btn-prev-show");
    }).mouseout(function () {
        $(this).removeClass("btn-prev-show");
    });

    // 音频控制
    function audioControl(currentMusic) {
        if (!currentMusic) 
        {
            $('.source-title span').text('');
            $('.source-title a').hide();
            $('.source-desc').text('');
            return;        
        }
        audio.src = currentMusic.url;
        $('.audio-cover').attr('src', currentMusic.cover || 'images/audiocover.png');
        audio.volume = .3;         
        if (isPlay) {
            audio.play();
            $('#audio-play').css({ 'backgroundImage': 'url(images/play.png)' });
        }
        
        $('.source-title span').text(currentMusic.name);
        if (currentMusic.url){
            $('.source-title a').attr({
                href: currentMusic.url,
                download: currentMusic.name
            }).show();
        }else{
            $('.source-title a').hide();
        }
        $('.source-desc').text(currentMusic.desc);
    }

    var duration;   
    var form = document.getElementById('volumeChange');    
    $(audio).on('loadedmetadata',function(){
        duration = this.duration;
    })
    if(audio){
        audio.addEventListener('timeupdate',updataProgress,false);
        audio.addEventListener('ended', audioEnded, false);  
        audio.volume = form.value / 100;              
    }
    // 音量控制
    form.addEventListener('input', function (e) {
        if (!audio) return;
        audio.volume = e.target.value / 100;
    })
    function updataProgress() {
        var currentTime = audio.currentTime;
        $('#audio-progress-time').text(formatTime(currentTime) + '/' + formatTime(duration));
        $('.progress').css({
            width: Math.floor((currentTime / duration) * 100) + '%'
        })
    }

    function audioEnded() {
        audio.currentTime = 0;
        audio.pause();
        nextPlay();
    }

    function nextPlay() {
        var musicListLength = musiclist.length;
        if (audioIdx < musicListLength - 1) {
            audioIdx++;
        } else {
            // audioIdx = 0;
            alert("没有更多啦！");
            return;
        }
        playmusic(musiclist[audioIdx].id);
    }

    function prevPlay() {
        var musicListLength = musiclist.length;
        if (audioIdx > 0) {
            audioIdx--;
        } else {
            // audioIdx = musiclist.length - 1;
            alert("已是第一首！");
            return;
        }
        playmusic(musiclist[audioIdx].id);
    }
    //上一曲下一曲
    $('span#audio-next').on('click', nextPlay);
    $('span#audio-prev').on('click', prevPlay);

    // 点击进度条跳到指定位置
    $('.component-progress').click(function(e) {
        var newProgress = (e.clientX - e.target.getBoundingClientRect().left) / e.target.clientWidth;
        $('.progress').css({
            width: Math.floor(newProgress * 100) + '%'
        })
        audio.currentTime = duration * newProgress;
    })

    $('.progress').on('dragend',function(e) {
        var newProgress = (e.clientX - 365) / 1400;
        $('.progress').css({
            width: Math.floor(newProgress * 100) + '%'
        })
        audio.currentTime = duration * newProgress;
    })
    
    // play or pause
    $('#audio-play').click(function (e) {
        e.stopPropagation();
        if(!audio) return;
        if (audio.paused) {
            $('#audio-play').css({ 'backgroundImage': 'url(images/play.png)' });
            audio.play();        
            isPlay = true;
            return;
        } else {
            $('#audio-play').css({ 'backgroundImage': 'url(images/pause.png)' });
            audio.pause();
            isPlay = false;
        }
    });


    $('#volumeChange').mouseover(function () {
        form.style.visibility = 'visible';
    }).mouseout(function () {
        form.style.visibility = 'hidden';
    })
    $('#laba').mouseover(function(){
        form.style.visibility = 'visible';
    }).mouseout(function(){
        form.style.visibility = 'hidden';        
    })


    // 图片、pdf
    function picControl(currentPic) {
        if (!currentPic) {
            $('.source-title span').text('');
            $('.source-title a').hide();
            $('.source-desc').text('');
            return
        };
        if(currentPic.type =='pdf'){
            $('#picEmbed').attr({ src: currentPic.url }).show();
            $('#picImg').hide();
        }else{
            $('#picImg').attr({ src: currentPic.url }).show();
            $('#picEmbed').hide();
        }
        $('.source-title span').text(currentPic.name);
        if (currentPic.url){
            $('.source-title a').attr({
                href: currentPic.url,
                download: currentPic.name
            }).show();
        }else{
            $('.source-title a').hide();
        }
        $('.source-desc').text(currentPic.desc);
    }

    //上一张下一张
    $('span#pic-next').on('click', picNext).on('mouseover', function () {
        $(this).addClass("btn-next-show");
    }).on('mouseout', function () {
        $(this).removeClass("btn-next-show");
    });
    $('span#pic-prev').on('click', picPrev).mouseover(function () {
        $(this).addClass("btn-prev-show");
    }).mouseout(function () {
        $(this).removeClass("btn-prev-show");
    });

    function picNext() {
        var picLength = piclist.length;
        if(picIdx < picLength - 1){
            picIdx++;
        }else{
            alert("没有更多啦！");
            return;
        }
        playpic(piclist[picIdx].id);       
    }
    function picPrev() {
        if(picIdx > 0){
            picIdx--;
        }else{
            alert("已是第一张！");
            return;
        }
        playpic(piclist[picIdx].id);
    }

    // var source = document.getElementsByClassName('source-title');
    // source.addEventListener('click',function(e){
    //     if (document.querySelector('.source-title span').nodeValue == ''){
    //         e.preventDefault()
    //     }
    // })

})

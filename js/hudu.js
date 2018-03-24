(function() {
  $(document).ready(function() {
    // // 背景更换
    // var hbg = document.getElementById("hudu");
    // var hbgNum = 0;
    // setInterval(function(){
    //     if(hbgNum == 0){
    //         hbg.style.backgroundImage = 'url(images/hudu/bg-1.png)';
    //         hbgNum = 1;
    //     }else{
    //         hbg.style.backgroundImage = 'url(images/hudu/bg_2.png)';
    //         hbgNum = 0;
    //     }
    // },10000);
    // 搜索
    $("#hBtn").click(function() {
      hSearch();
    });
    $("#hSearch").focus(function() {
      document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
          $(".hudu").css("display", "block");
          $("#treeCon").css("display", "none");
          $("#canvas").css("display", "none");
          $(".h-top").css("position", "fixed");
          $(".hudu").css("position", "fixed");
          $(".hudu").css("top", "120px");
          $(".hudu").css("right", "0");
          $(".h-top").css("right", "0");
          $(".h-top").css("width", "calc(100% - 200px)");
          $(".hudu").css("width", "calc(100% - 200px)");
          $(".nav-item").each(function() {
            $(this).removeClass("nav-item-active");
          });
          hSearch(1);
        }
      };
    });
    function hSearch() {
      var hsearch = document.getElementById("hSearch").value;
      document.getElementById("hSearch").value = "";
      $.get(
        "http://tibetan.test.codebook.com.cn/api/TibetanFile/InstanceFile/GetInstanceFiles?keyword=" +
          hsearch,
        function(res) {
          // console.log(res.data);
          var dlength = res.data.length;
          var hResult = document.getElementById("hResult");
          var hResultUl = hResult.children;
          hResult.innerHTML = "";

          var hPage = document.getElementById("hpaging");
          var hInt = parseInt(dlength / 21);
          var hCeil = Math.ceil(dlength / 21);
          var hRemainder = dlength - hInt * 21;

          // 翻页栏
          if (dlength > 0) {
            hPage.innerHTML =
              '<div class="h-blocks" id="hBlockll"><<</div>' +
              '<div class="h-blocks" id="hBlockl"><</div>' +
              '<div class="h-blocks h-select-block" id="hBlock1">1</div>';
            if (hCeil < 8) {
              for (let i = 2; i <= hCeil; i++) {
                hPage.innerHTML +=
                  '<div class="h-blocks" id="hBlock' + i + '">' + i + "</div>";
              }
            } else {
              for (let i = 2; i <= 5; i++) {
                hPage.innerHTML +=
                  '<div class="h-blocks" id="hBlock' + i + '">' + i + "</div>";
              }
              hPage.innerHTML +=
                '<div class="h-blocks" id="hBlock' +
                6 +
                '">' +
                "..." +
                "</div>";
              hPage.innerHTML +=
                '<div class="h-blocks" id="hBlock' +
                7 +
                '">' +
                hCeil +
                "</div>";
            }
            hPage.innerHTML +=
              '<div class="h-blocks" id="hBlockr">></div>' +
              '<div class="h-blocks" id="hBlockrr">>></div>';
          }

          function addData(data, start, end, add) {
            if (add) {
              hResult.innerHTML += "<ul></ul>";
            }
            var ul = hResult.children[hResult.children.length - 1];
            for (let i = start; i <= end; i++) {
              if (
                data[i].backgroud_url == null ||
                data[i].backgroud_url == ""
              ) {
                if (data[i].type == "video") {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic h-data-pic-none">' +
                    '<img src="" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-pic" src="images/hudu/hpic.png" alt="">' +
                    "</div>" +
                    '<!-- <div class="h-data-type-hover"></div> -->' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                } else if (data[i].type == "sound") {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic h-data-pic-none">' +
                    '<img src="" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-music" src="images/hudu/hmusic.png" alt="">' +
                    "</div>" +
                    '<!-- <div class="h-data-type-hover"></div> -->' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                } else if (data[i].type == "pdf") {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic h-data-pic-none">' +
                    '<img src="" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-pdf" src="images/hudu/hpdf.png" alt="">' +
                    "</div>" +
                    '<!-- <div class="h-data-type-hover"></div> -->' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                } else {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic h-data-pic-none">' +
                    '<img src="" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-pic" src="images/hudu/hpic.png" alt="">' +
                    "</div>" +
                    '<!-- <div class="h-data-type-hover"></div> -->' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                }
              } else {
                if (data[i].type == "video") {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic">' +
                    '<img src="' +
                    data[i].backgroud_url +
                    '" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-video" src="images/hudu/hvideo.png" alt="">' +
                    "</div>" +
                    '<div class="h-data-type-hover"></div>' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                } else if (data[i].type == "sound") {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic">' +
                    '<img src="' +
                    data[i].backgroud_url +
                    '" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-music" src="images/hudu/hmusic.png" alt="">' +
                    "</div>" +
                    '<div class="h-data-type-hover"></div>' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                } else if (data[i].type == "pdf") {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic">' +
                    '<img src="' +
                    data[i].backgroud_url +
                    '" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-pdf" src="images/hudu/hpdf.png" alt="">' +
                    "</div>" +
                    '<div class="h-data-type-hover"></div>' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                } else {
                  ul.innerHTML +=
                    "<li>" +
                    '<div class="h-data" id="hData' +
                    data[i].id +
                    '">' +
                    '<div class="h-data-pic">' +
                    '<img src="' +
                    data[i].backgroud_url +
                    '" alt="">' +
                    "</div>" +
                    '<div class="h-data-type">' +
                    '<div class="h-data-type-img">' +
                    '<img class="h-pic" src="images/hudu/hpic.png" alt="">' +
                    "</div>" +
                    '<div class="h-data-type-hover"></div>' +
                    "</div>" +
                    "</div>" +
                    '<p class="h-p">' +
                    data[i].name +
                    "</p>" +
                    "</li>";
                }
              }
            }
          }

          function gethGoNum() {
            var hGoNum = 1;
            for (let i = 0; i < hPage.children.length; i++) {
              if (/h-select-block/.test(hPage.children[i].className)) {
                hGoNum = hPage.children[i].innerHTML;
                return hGoNum;
                console.log(hGoNum);
                break;
              }
            }
          }
          hGoNum = gethGoNum();
          function hRefresh(hGoNum) {
            var hDif = dlength - (hGoNum - 1) * 21;
            if (hDif <= 7) {
              addData(res.data, (hGoNum - 1) * 21, res.data.length - 1, 1);
            } else if (hDif <= 14) {
              addData(res.data, (hGoNum - 1) * 21, (hGoNum - 1) * 21 + 6, 1);
              addData(res.data, (hGoNum - 1) * 21 + 7, res.data.length - 1, 1);
            } else {
              addData(res.data, (hGoNum - 1) * 21, (hGoNum - 1) * 21 + 6, 1);
              addData(
                res.data,
                (hGoNum - 1) * 21 + 7,
                (hGoNum - 1) * 21 + 13,
                1
              );
              addData(res.data, (hGoNum - 1) * 21 + 14, res.data.length - 1, 1);
            }
          }
          function hDelete() {
            var hRes = document.getElementById("hResult");
            hRes.innerHTML = " ";
          }

          hRefresh(hGoNum);

          // 底下翻页导航栏
          var hblocks = [];
          var hpaging = document.getElementById("hpaging");
          for (let i = 0; i < hpaging.children.length; i++) {
            hblocks[i] = hpaging.children[i];
          }
          // 跳转到最后一页
          document.getElementById("hBlockrr").onclick = function() {
            if (
              !/h-select-block/.test(
                hpaging.children[hpaging.children.length - 3].className
              )
            ) {
              for (let i = 2; i < hpaging.children.length - 2; i++) {
                if (/h-select-block/.test(hblocks[i].className)) {
                  hblocks[i].className = "h-blocks";
                }
                if (i == hpaging.children.length - 3) {
                  hblocks[i].className += " h-select-block ";
                }
              }
              if (hpaging.children.length > 10) {
                for (let i = 7, hnum = 1; i > 1; i--, hnum++) {
                  if (i == 2) {
                    hpaging.children[i].innerHTML = i - 1;
                    break;
                  }
                  hpaging.children[i].innerHTML =
                    hpaging.children[8].innerHTML - hnum;
                  if (i == 3) {
                    hpaging.children[i].innerHTML = "...";
                  }
                }
              }
              // getHpageNum();
              var pageNum = getHpageNum();
              hResult.innerHTML = " ";
              hRefresh(pageNum);
              toXupei();
            } else {
              // console.log("最后一页了！");
            }
          };
          // 跳转到后一页
          document.getElementById("hBlockr").onclick = function() {
            if (
              !/h-select-block/.test(
                hpaging.children[hpaging.children.length - 3].className
              )
            ) {
              for (let i = 2; i < hpaging.children.length - 2; i++) {
                if (i == hpaging.children.length - 3) {
                  break;
                }
                if (/h-select-block/.test(hblocks[i].className)) {
                  hblocks[i].className = "h-blocks";
                  hblocks[i + 1].className += " h-select-block ";

                  break;
                }
              }
              hSort();
              var pageNum = getHpageNum();
              hResult.innerHTML = " ";
              hRefresh(pageNum);
              toXupei();
            } else {
              // console.log("最后一页了！");
            }
          };
          // 跳转到第一页
          document.getElementById("hBlockll").onclick = function() {
            if (!/h-select-block/.test(hpaging.children[2].className)) {
              for (let i = 2; i < hpaging.children.length - 2; i++) {
                if (/h-select-block/.test(hblocks[i].className)) {
                  hblocks[i].className = "h-blocks";
                }
                if (i == hpaging.children.length - 3) {
                  hblocks[2].className += " h-select-block ";
                }
              }
              if (hpaging.children.length > 10) {
                for (let i = 2; i < 9; i++) {
                  if (i == 8) {
                    break;
                  }
                  hpaging.children[i].innerHTML = i - 1;
                  if (i == 7) {
                    hpaging.children[i].innerHTML = "...";
                  }
                }
              }
              var pageNum = getHpageNum();
              hResult.innerHTML = " ";
              hRefresh(pageNum);
              toXupei();
            } else {
              // console.log("第一页了！");
            }
          };
          // 跳转到前一页
          document.getElementById("hBlockl").onclick = function() {
            if (!/h-select-block/.test(hpaging.children[2].className)) {
              for (let i = hpaging.children.length - 3; i > 0; i--) {
                if (i == 2) {
                  break;
                }
                if (/h-select-block/.test(hblocks[i].className)) {
                  hblocks[i].className = "h-blocks";
                  hblocks[i - 1].className += " h-select-block ";
                  break;
                }
              }
              hSort();
              var pageNum = getHpageNum();
              hResult.innerHTML = " ";
              hRefresh(pageNum);
              toXupei();
            } else {
              // console.log("第一页了！");
            }
          };
          // 中间排序
          function hSort() {
            // 大于等于10页时
            if (hpaging.children.length > 10) {
              for (let i = 2; i < 9; i++) {
                if (/h-select-block/.test(hblocks[i].className)) {
                  if (
                    hpaging.children[i].innerHTML >= 4 &&
                    hpaging.children[i].innerHTML <=
                      hpaging.children[hpaging.children.length - 3].innerHTML -
                        3
                  ) {
                    var _page = hpaging.children[i].innerHTML;
                    hpaging.children[3].innerHTML = "...";
                    hpaging.children[7].innerHTML = "...";
                    hpaging.children[5].innerHTML = _page;
                    hpaging.children[4].innerHTML = _page - 1;
                    hpaging.children[6].innerHTML = _page - 1 + 2;
                    for (let j = 2; j < 9; j++) {
                      hblocks[j].className = "h-blocks";
                    }
                    hblocks[5].className += " h-select-block ";
                    break;
                  }
                  if (hpaging.children[i].innerHTML <= 3) {
                    for (let j = 2; j < 9; j++) {
                      if (j == 8) {
                        break;
                      }
                      hpaging.children[j].innerHTML = j - 1;
                      if (j == 7) {
                        hpaging.children[j].innerHTML = "...";
                      }
                    }
                    break;
                  }
                  if (
                    hpaging.children[i].innerHTML >=
                    hpaging.children[hpaging.children.length - 3].innerHTML - 2
                  ) {
                    for (let j = 7, hnum = 1; j > 1; j--, hnum++) {
                      if (j == 2) {
                        hpaging.children[j].innerHTML = j - 1;
                        break;
                      }
                      hpaging.children[j].innerHTML =
                        hpaging.children[8].innerHTML - hnum;
                      if (j == 3) {
                        hpaging.children[j].innerHTML = "...";
                      }
                    }
                    break;
                  }
                }
              }
            }
          }
          // 选中跳转
          for (let i = 1; i < hpaging.children.length - 1; i++) {
            $("#hBlock" + i).click(function() {
              if (!($("#hBlock" + i).html() == "...")) {
                for (let j = 2; j < hpaging.children.length - 2; j++) {
                  hblocks[j].className = "h-blocks";
                }
                hblocks[i + 1].className += " h-select-block ";
                hSort();
                var pageNum = getHpageNum();
                hResult.innerHTML = " ";
                hRefresh(pageNum);
                toXupei();
              }
            });
          }
          // 输入数字跳转
          document.getElementById("hGo").addEventListener("click", hGo);
          $("#hNum").focus(function() {
            console.log("222");
            // $(".h-jump").on("click","#hNum",function(){
            document.onkeydown = function(event) {
              var e =
                event || window.event || arguments.callee.caller.arguments[0];
              if (e && e.keyCode == 13) {
                hGo();
              }
            };
          });

          function hGo() {
            var inputNum = document.getElementById("hNum").value;
            document.getElementById("hNum").value = "";
            if (
              inputNum - 1 < hblocks[hpaging.children.length - 3].innerHTML &&
              inputNum - 1 >= 0
            ) {
              for (let j = 2; j <= hpaging.children.length - 3; j++) {
                hblocks[j].className = "h-blocks";
              }
              // 小于10页
              for (let i = 2; i <= hpaging.children.length - 3; i++) {
                if (hblocks[i].innerHTML == inputNum) {
                  hblocks[i].className += " h-select-block ";
                }
              }
              // 大于等于10页时
              if (hpaging.children.length > 10) {
                if (inputNum <= 3) {
                  hblocks[inputNum - 1 + 2].className += " h-select-block ";
                  if (hpaging.children.length > 10) {
                    for (let i = 2; i < 9; i++) {
                      if (i == 8) {
                        break;
                      }
                      hpaging.children[i].innerHTML = i - 1;
                      if (i == 7) {
                        hpaging.children[i].innerHTML = "...";
                      }
                    }
                  }
                }
                if (
                  inputNum >=
                  hpaging.children[hpaging.children.length - 3].innerHTML - 2
                ) {
                  hblocks[
                    inputNum -
                      1 +
                      hpaging.children.length -
                      hpaging.children[8].innerHTML -
                      2
                  ].className +=
                    " h-select-block ";
                  if (hpaging.children.length > 10) {
                    for (let i = 7, hnum = 1; i > 1; i--, hnum++) {
                      if (i == 2) {
                        hpaging.children[i].innerHTML = i - 1;
                        break;
                      }
                      hpaging.children[i].innerHTML =
                        hpaging.children[8].innerHTML - hnum;
                      if (i == 3) {
                        hpaging.children[i].innerHTML = "...";
                      }
                    }
                  }
                }
                for (let i = 2; i <= hpaging.children.length - 3; i++) {
                  if (
                    inputNum > 3 &&
                    inputNum <
                      hpaging.children[hpaging.children.length - 3].innerHTML -
                        2
                  ) {
                    for (let j = 2; j <= hpaging.children.length - 3; j++) {
                      hblocks[j].className = "h-blocks";
                    }
                    hblocks[5].className += " h-select-block ";
                    hblocks[5].innerHTML = inputNum;
                    hblocks[4].innerHTML = inputNum - 1;
                    hblocks[6].innerHTML = inputNum - 1 + 2;
                    hblocks[3].innerHTML = "...";
                    hblocks[7].innerHTML = "...";
                    break;
                  }
                }
              }
              var pageNum = getHpageNum();
              hResult.innerHTML = " ";
              hRefresh(pageNum);
              toXupei();
            } else {
              alert("输入错误！");
            }
          }

          // 获取页面id
          function getHpageNum() {
            var hpageNum = 1;
            for (let i = 0; i < hpaging.children.length; i++) {
              if (/h-select-block/.test(hblocks[i].className)) {
                hpageNum = hblocks[i].innerHTML;
                return hpageNum;
              }
            }
          }

          // 获取资源id
          toXupei();
          function toXupei() {
            var hpgNum = document.getElementById("hpgNum");
            hpgNum.innerHTML = res.data.length;
            $("div[id*='hData']").click(function(e) {
              var hid = e.currentTarget.id.slice(5);
              var instance_id = "";
              var path = "";
              $.get(
                "http://tibetan.test.codebook.com.cn/api/TibetanFile/InstanceFile/GetInstanceFileNodes?id=" +
                  hid,
                function(d) {
                  instance_id = d.data.instance_id;
                  path = d.data.path;
                },
                "json"
              );
              window.open("./detail.html?id=" + instance_id + "&path=" + path);
            });
          }
        },
        "json"
      );
    }
  });
})();

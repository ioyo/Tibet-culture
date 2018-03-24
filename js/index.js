var validate = true;
function validator (elem) {
  if (elem.value.length > 10) {
    validate = false;
  }
  
}
$(document).ready(function() {
  var tree = [];
  var uniqId = 0; //用于添加、编辑时提交表单的时候传id参数
  var opened = false; //控制点击添加时，小框是否显示
  var haschild = "";
  var service = "http://tibetan.test.codebook.com.cn/api/";

  $(".hudu").css("display", "none");
  $("#hBtn").click(function(e) {
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
  });

  $.ajax({
    url: `${service}Tibetan/TibetanCulture/GetTree`,
    type: "GET",
    async: false, //异步为false
    success: function(res) {
      console.log(res.data);
      tree = res.data;
    }
  });

  // 窗口发生改变时刷新页面
  $(window).resize(function() {
    var rightConW = $(window).width() - 200;
    $(".right-content").width(rightConW);
    window.location.reload();
  });

  // 渲染左边菜单
  var newList = [];
  var navList = [];
  for (let a = 0; a < tree.length; a++) {
    if (tree[a].children === "null") {
      haschild = "noChild";
    } else {
      haschild = "hasChild";
    }
    let ele = `<div class="nav-item" id="${tree[a].id}" data-level="${tree[a]
      .id + ","}
  " data-haschild="${haschild}">${tree[a].name}</div>`;
    navList.push(ele);
  }
  var addNav = `<div class="nav-item addNav">+</div>`;
  navList.push(addNav);
  $(".left-nav").append(navList.join(""));

  // 创建画布，在right-content容器中，从左上角开始，与treeCon同宽高
  var canH = document.body.scrollHeight - 120;
  var canW = document.body.scrollWidth - 200;
  $(".right-content").css("height", canH + 120);
  $(".right-content").css("width", canW);
  $("#treeCon").css("height", canH);
  $("#treeCon").css("width", canW);
  $("#canvas").attr("width", canW); //canvas的宽高在属性中，不是在style里面
  $("#canvas").attr("height", canH);
  var cxt = canvas.getContext("2d");

  // 点击左边菜单
  $(".left-nav").on("click", ".nav-item", function(e) {
    // 点击左边菜单时，右边隐藏搜索内容
    $(".hudu").css("display", "none");
    $("#treeCon").css("display", "block");
    $("#canvas").css("display", "block");
    $(".h-top").css("position", "static");
    $(".hudu").css("position", "fixed");
    $(".h-top").css("right", "0");
    $(".h-top").css("width", "100%");

    var curId = $(this)[0].id;
    var checkNode = $(this)[0];
    var node = $(this);
    $("#treeCon").empty();
    var cxtH = $("#canvas").height();
    var cxtW = $("#canvas").width();
    cxt.clearRect(0, 0, cxtW, cxtH);
    $(".nav-item").each(function() {
      $(this).removeClass("nav-item-active");
    });
    $(this).addClass("nav-item-active");

    // 判断是否是打开状态
    if ($("#treeCon").has(".leaf-con").length !== 0) {
      $("#treeCon").empty();
    } else {
      var curId = parseInt(e.target.id);
      var level = parseInt(e.target.dataset.level);
      var parent = "noneed";
      showChild(curId, level, parent);
      drawLine($(this), level);
    }
    // 再次检查是否有子节点
    $.ajax({
      url: `${service}Tibetan/TibetanCulture/GetTree?id=${curId}`,
      type: "GET",
      async: false, //异步为false
      success: function(res) {
        if (
          res.data[0].children.length !== 0 &&
          res.data[0].children !== "null"
        ) {
          checkNode.dataset.haschild = "hasChild";
        } else {
          checkNode.dataset.haschild = "noChild";
        }
        // 如果该节点没有子节点，提示可添加子节点，确定后直接调用showEdit
        console.log(checkNode);
        if (checkNode.dataset.haschild === "noChild") {
          var ques = confirm("该目录下无内容，是否添加子目录？");
          if (ques == true) {
            showEdit(node, 0);
            checkNode.dataset.haschild = "hasChild";
          }
        }
      }
    });
  });

  // 点击左边菜单的添加
  $(".left-nav").on("click", ".addNav", function(e) {
    $(this).removeClass("nav-item-active");
    if ($(this).hasClass("addNav-active")) {
      $(this).removeClass("addNav-active");
    } else {
      $(this).addClass("addNav-active");
    }
    var addNavDiv = `<div class="box add-nav-box">
    <form class="form-con" enctype="multipart/form-data" method="post" name="fileForm">
        <div class="title">
            <label>目录名称：</label>
            <input type="text" name="name" oninput="validator(this)"/>
        </div>
    </form>
    <div class="cha"></div>
    <div class="confirm">
        <button class="sure">确定</button>
        <button class="concel">取消</button>
    </div>
</div>`;
    var mask = `<div class="mask"></div>`;
    $(".main").append(addNavDiv);
    $(".main").append(mask);
    // 点右上角× 和取消
    $(".cha").click(function() {
      $(".addNav").removeClass("addNav-active");
      hideEdit();
    });

    $(".concel").click(function() {
      $(".addNav").removeClass("addNav-active");
      hideEdit();
    });

    // 点击确定，提交表单
    $(".sure").click(function() {
      var formData = new FormData(document.forms.namedItem("fileForm"));
      var id = uniqId;
      var name = formData.getAll("name");
      formData.append("id", uniqId);
      formData.append("name", name);
      $.ajax({
        url: `${service}Tibetan/TibetanCulture/AddFirstNode?name=${name}&id=${id}`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false, // 当有文件要上传时，此项是必须的，否则后台无法识别文件流的起始位置
        success: function(res) {
          console.log(res);
          // 重新请求树结构，渲染子节点
          $.ajax({
            url: `${service}Tibetan/TibetanCulture/GetTree`,
            type: "GET",
            async: false, //异步为false
            success: function(res) {
              console.log(res.data);
              var addNew = res.data[res.data.length - 1];
              var newDiv = `<div class="nav-item" id="${
                addNew.id
              }" data-level="${addNew.id + ","}
            " data-haschild="${haschild}">${addNew.name}</div>`;
              $(".addNav").before(newDiv);
              $(".addNav").removeClass("addNav-active");
            }
          });
        }
      });
      hideEdit();
    });
  });

  // 点击一级节点
  $("#treeCon").on("click", ".leaf-1", function(e) {
    showPop($(this));
    $(".leaf-con-2").empty();
    $(".leaf-con-3").empty();
    $(".leaf-con-4").empty();
    var cxtH = $("#canvas").height();
    var cxtW = $("#canvas").width();
    cxt.clearRect(310, 0, cxtW - 310, cxtH);
  });

  // 点击二级节点
  $("#treeCon").on("click", ".leaf-2", function(e) {
    showPop($(this));
    $(".leaf-con-3").empty();
    $(".leaf-con-4").empty();
    var cxtH = $("#canvas").height();
    var cxtW = $("#canvas").width();
    cxt.clearRect(620, 0, cxtW - 620, cxtH);
  });

  // 点击三级节点
  $("#treeCon").on("click", ".leaf-3", function(e) {
    showPop($(this));
    $(".leaf-con-4").empty();
    var cxtH = $("#canvas").height();
    var cxtW = $("#canvas").width();
    cxt.clearRect(930, 0, cxtW - 930, cxtH);
  });

  // 点击四级节点
  $("#treeCon").on("click", ".leaf-4", function(e) {
    showPop($(this));
    $("leaf-con-5").empty();
    var cxtH = $("#canvas").height();
    var cxtW = $("#canvas").width();
    cxt.clearRect(1240, 0, cxtW - 1240, cxtH);
  });

  // 点击简介
  function toNext(self) {
    var fileNode = self.parent().parent();
    var parent = $("#treeCon");
    var curId = fileNode.id;
    var level = fileNode[0].dataset.level;
    showChild(curId, level, parent);
    drawLine(fileNode, level);
    self.parent().remove();
    fileNode.removeClass("leafOn");
  }

  // 删除操作
  function del(self) {
    var conf = confirm("确定删除该目录吗？");
    var fileNode = self
      .parent()
      .parent()
      .parent(); //当前节点
    if (conf == true) {
      fileNode.remove();
      $.ajax({
        url: `${service}Tibetan/TibetanCulture/DeleteNode?id=${fileNode[0].id}`,
        type: "POST",
        async: false, //异步为false
        success: function(res) {
          console.log(res);
          // 删除后重新请求tree
          $.ajax({
            url: `${service}Tibetan/TibetanCulture/GetTree`,
            type: "GET",
            async: false, //异步为false
            success: function(res) {
              console.log(res.data);
              tree = res.data;
              // 重新从父节点渲染子节点(删除之后)
              var nowLevel = fileNode[0].dataset.level; //当前节点的level
              var nowLevelList = String(nowLevel).split(",");
              var parId = nowLevelList[nowLevelList.length - 2]; //当前节点的父节点的id
              var list = [];
              if (nowLevelList.length === 2) {
                //如果正在删除的是菜单下的第一级节点，那么只渲染， 不点击
                list = $(".nav-item");
                for (let i = 0; i < list.length; i++) {
                  if (list[i].id === parId) {
                    var nowSelf = list[i]; //从dom中根据id找到父节点
                    var curId = parseInt(nowSelf.id);
                    var level = parseInt(nowSelf.dataset.level);
                    var parent = "noneed";
                    showChild(curId, level, parent);
                    drawLine(nowSelf, level);
                    $("#treeCon").empty();
                    var cxtH = $("#canvas").height();
                    var cxtW = $("#canvas").width();
                    cxt.clearRect(0, 0, cxtW, cxtH);
                    break;
                  }
                }
              } else {
                list = $(".leaf");
                for (let i = 0; i < list.length; i++) {
                  if (list[i].id === parId) {
                    var nowSelf = list[i]; //从dom中根据id找到父节点
                    $(nowSelf).trigger("click"); //伪主动触发点击事件
                    $(nowSelf)
                      .children(".popup")
                      .children(".popTop")
                      .trigger("click");
                    $(nowSelf)
                      .children()
                      .remove();
                    break;
                  }
                }
              }
              alert("已删除");
            }
          });
        }
      });
    } else {
      self
        .parent()
        .parent()
        .remove(); //删除弹窗
      console.log("取消删除");
    }
  }

  // 添加操作
  function add(self, level) {
    var curNode = self
      .parent()
      .parent()
      .parent(); //当前节点
    var addItem;
    console.log(curNode, "当前节点");
    if (curNode[0].dataset.iflast === "notLast") {
      //如果不是最后一个元素，只能添加父级、同级、子级节点
      addItem = `<div class="item-con item-con-3">
      <div class="add-item nextNode">子级</div>
      <div class="add-item preNode">父级</div>
      <div class="add-item brother">同级</div>
      </div>`;
    } else if (
      curNode[0].dataset.iflast === "lastNode" &&
      curNode[0].dataset.ifres === "noRes"
    ) {
      //如果是最后一个元素且里面没有资源，可以添加资源和节点
      addItem = `<div class="item-con">
      <div class="add-item content">资源</div>
      <div class="add-item nextNode">子级</div>
      <div class="add-item preNode">父级</div>
      <div class="add-item brother">同级</div>
      </div>`;
    } else if (
      curNode[0].dataset.iflast === "lastNode" &&
      curNode[0].dataset.ifres === "hasRes"
    ) {
      //如果至最后一个节点，且里面已经有资源，只能添加父级节点和资源
      addItem = `<div class="item-con item-con-2">
      <div class="add-item content">资源</div>
      <div class="add-item preNode">父级</div>
      </div>`;
    }

    if (opened == false) {
      self.append(addItem);
      opened = true;
    } else {
      $(".item-con").remove();
      opened = false;
    }

    // 添加子级、父级、同级节点
    $(".nextNode").click(function(e) {
      var node = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .parent();
      e.stopPropagation();
      showEdit(node, 0);
    });
    $(".preNode").click(function(e) {
      var node = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .parent();
      e.stopPropagation();
      showEdit(node, 1);
    });
    $(".brother").click(function(e) {
      var node = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .parent();
      e.stopPropagation();
      showEdit(node, 3);
    });

    // 添加资源
    $(".content").click(function(e) {
      var node = $(this)
        .parent()
        .parent()
        .parent()
        .parent()
        .parent();
      e.stopPropagation();
      showAddRes(node);
    });
  }

  // 简介弹窗
  function showPop(self) {
    var defPic = "images/pic_bg.png";
    var level = self[0].dataset.level;
    if (self.hasClass("leafOn")) {
      $(".leafOn .popup").detach();
      self.removeClass("leafOn");
    } else {
      self
        .parent()
        .children()
        .each(function(e) {
          $(".leafOn .popup").detach();
          $(this).removeClass("leafOn");
        });
      self.addClass("leafOn");
    }
    var pic = self[0].dataset.pic || "";
    var popup = `<div class="popup">
        <div class="popTop">
         <div class="popPic" style="background-image: url(${
           pic === "" ? defPic : pic
         })"></div>
         <div class="popInfo">
          <input class="title" value="${
            self[0].dataset.name
          }" disabled="disabled" name="title"/>
          <textarea class="intro" readonly>${self[0].dataset.info}</textarea>
          <button class="ok">确定</button>
         </div>
        </div>
        <div class="popBottom">
          <div class="edit opera"><image src="images/edit.png" /><p>编辑</p></div>
          <div class="delete opera"><image src="images/delete.png" /><p>删除</p></div>
          <div class="add opera"><image src="images/add.png" /><p>添加</p></div>
        </div>
        </div>`;
    $(".leafOn").append(popup);

    // 点击简介
    $(".popTop").click(function(e) {
      e.stopPropagation();
      toNext($(this));
    });

    // 点击删除
    $(".delete").click(function(e) {
      e.stopPropagation();
      del($(this));
    });

    //点击编辑
    $(".edit").click(function(e) {
      var node = $(this)
        .parent()
        .parent()
        .parent();
      e.stopPropagation();
      showEdit(node, 2);
    });

    // 点击添加
    $(".add").click(function(e) {
      e.stopPropagation();
      add($(this), level);
    });
  }

  // 显示编辑、添加节点弹窗
  function showEdit(node, sign) {
    var pic, name, message;
    if (sign === 2) {
      pic = node[0].dataset.pic || ""; //图片路径
      name = node[0].dataset.name || "";
      message = node[0].dataset.info || "";
    } else {
      pic = "images/up_img.png";
      name = "";
      message = "";
    }
    uniqId = node[0].id;
    var box = `<div class="box">
    <form class="form-con" enctype="multipart/form-data" method="post" name="fileForm">
        <div class="title">
            <label class="required">目录名称：</label>
            <input type="text" name="name" value="${name === "" ? "" : name}" oninput="validator(this)">
        </div>
        <div class="photo">
            <label class="required">目录封面：</label>
            <span class="upload-img" style="background-image:url(${
              pic === "" ? "images/up_img.png" : pic
            });"><input class="upLoadPic" name="pic" type="file" accept="image/*" multiple="multiple"></span>
        </div>
        <div class="message">
            <label class="required">目录简介：</label>
            <textarea name="info">${message === "" ? "" : message}</textarea>
        </div>

    </form>
    <div class="cha"></div>
    <div class="confirm">
        <button class="sure">确定</button>
        <button class="concel">取消</button>
    </div>
</div>`;
    var mask = `<div class="mask"></div>`;
    $(".main").append(box);
    $(".main").append(mask);

    // 上传图片时产生缩略图
    $(".upLoadPic").change(function() {
      if (typeof FileReader != "undefined") {
        var phoPreview = $(".upload-img");
        $($(this)[0].files).each(function() {
          var file = $(this);
          var reader = new FileReader();
          reader.onload = function(e) {
            phoPreview.css({
              background: `url("${e.target.result}")`,
              "background-repeat": "no-repeat",
              "background-size": "contain"
            });
          };
          reader.readAsDataURL(file[0]);
        });
      }
    });

    // 点右上角× 和取消
    $(".cha").click(function() {
      hideEdit();
    });

    $(".concel").click(function() {
      hideEdit();
    });

    // 点击确定，提交表单
    $(".sure").click(function() {
      if (!validate) {
        return false;
      }
      var formData = new FormData(document.forms.namedItem("fileForm"));
      var id = uniqId;
      formData.append("id", uniqId);
      formData.append("sign", sign);
      $.ajax({
        url: `${service}Tibetan/TibetanCulture/AddOrEditTreeNode`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false, // 当有文件要上传时，此项是必须的，否则后台无法识别文件流的起始位置
        success: function(res) {
          console.log(res);
          // 重新请求树结构，渲染子节点
          $.ajax({
            url: `${service}Tibetan/TibetanCulture/GetTree`,
            type: "GET",
            async: false, //异步为false
            success: function(res) {
              console.log(res.data);
              tree = res.data;
            }
          });

          // 重新从父节点渲染子节点
          var nowLevel = node[0].dataset.level; //当前节点的level
          var nowLevelList = String(nowLevel).split(",");
          var parId = nowLevelList[nowLevelList.length - 2]; //当前节点的父节点的id
          var list = [];
          if (nowLevelList.length === 2) {
            list = $(".nav-item");
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === parId) {
                var nowSelf = list[i]; //从dom中根据id找到父节点
                $(nowSelf).trigger("click"); //伪主动触发点击事件
                $(nowSelf)
                  .children()
                  .remove();
                if (sign === 2) {
                  alert("修改成功");
                } else {
                  alert("添加成功");
                }
                break;
              }
            }
          } else {
            list = $(".leaf");
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === parId) {
                var nowSelf = list[i]; //从dom中根据id找到父节点,点击父节点下的popup的简介
                $(nowSelf).trigger("click"); //伪主动触发点击事件
                $(nowSelf)
                  .children(".popup")
                  .children(".popTop")
                  .trigger("click");
                if (sign === 2) {
                  alert("修改成功");
                } else {
                  alert("添加成功");
                }
                break;
              }
            }
          }
        }
      });
      hideEdit();
    });
  }

  // 点击添加资源，弹窗
  function showAddRes(node) {
    var pic, name, message;
    pic = "images/up_img.png";
    name = "";
    message = "";
    uniqId = node[0].id;
    var box = `<div class="box file-box">
    <form class="form-con file-con" enctype="multipart/form-data" method="post" name="fileForm">
        <div class="title required">
            <label class="required">资源名称：</label>
            <input type="text" name="name" oninput="validator(this)">
        </div>
        <div class="file">
            <label class="required">资源文件：</label>
            <p class="filename"></p>
            <span class="upLoad-file"><p class="choose">选择文件</p><input class="file-input" type="file" name="file"></span>
        </div>
        <div class="photo">
            <label>目录封面：</label>
            <span class="upload-img" style="background-image:url(${pic});"><input class="upLoadPic" name="file_pic" type="file" accept="image/*" multiple="multiple"></span>
        </div>
        <div class="message">
            <label class="required message">目录简介：</label>
            <textarea name="info"></textarea>
        </div>

    </form>
    <div class="cha"></div>
    <div class="confirm">
        <button class="sure">确定</button>
        <button class="concel">取消</button>
    </div>
</div>`;
    var mask = `<div class="mask"></div>`;
    $(".main").append(box);
    $(".main").append(mask);

    // 表单验证


    // 上传图片时产生缩略图
    $(".upLoadPic").change(function() {
      if (typeof FileReader != "undefined") {
        var phoPreview = $(".upload-img");
        $($(this)[0].files).each(function() {
          var file = $(this);
          var reader = new FileReader();
          reader.onload = function(e) {
            phoPreview.css({
              background: `url("${e.target.result}")`,
              "background-repeat": "no-repeat",
              "background-size": "contain"
            });
          };
          reader.readAsDataURL(file[0]);
        });
      }
    });

    //点击上传文件时，改变选择文件为重新选择，显示文件名
    $(".file-input").change(function(e) {
      var file = document.getElementsByClassName("file-input")[0].files[0];
      console.log(file);
      var fileName = file.name;
      $(".filename").text(fileName);
      $(".choose").text(`重新选择`);
    });

    // 点右上角× 和取消
    $(".cha").click(function() {
      hideEdit();
    });

    $(".concel").click(function() {
      hideEdit();
    });

    // 点击确定，提交表单
    $(".sure").click(function() {
      var formData = new FormData(document.forms.namedItem("fileForm"));
      var id = uniqId;
      var file = document.getElementsByClassName("file-input")[0].files[0];
      console.log(file, "文件");
      var typeList = String(file.type).split("/");
      var typeTest = typeList[0]; //判断文件的类型image,audio,video,application
      var type = ""; //定义文件类型album,sound,video,pdf
      if (typeTest === "image") {
        type = "album";
        console.log("图片资源");
      } else if (typeTest === "audio") {
        type = "sound";
        console.log("音频资源");
      } else if (typeTest === "video") {
        type = "video";
        console.log("视频资源");
      } else if (typeTest === "application") {
        type = "pdf";
        console.log("PDF资源");
      }
      formData.append("id", uniqId);
      formData.append("type", type);
      $.ajax({
        url: `${service}Tibetan/TibetanCulture/UploadInstanceFile`,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false, // 当有文件要上传时，此项是必须的，否则后台无法识别文件流的起始位置
        success: function(res) {
          console.log(res);
          // 重新请求树结构，渲染子节点
          $.ajax({
            url: `${service}Tibetan/TibetanCulture/GetTree`,
            type: "GET",
            async: false, //异步为false
            success: function(res) {
              console.log(res.data);
              tree = res.data;
              // 重新从父节点渲染子节点(删除之后)
              var nowLevel = node[0].dataset.level; //当前节点的level
              var nowLevelList = String(nowLevel).split(",");
              var parId;

              //新增资源，从自身开始渲染
              parId = nowLevelList[nowLevelList.length - 2];
              if (nowLevelList.length === 2) {
                list = $(".nav-item");
              } else {
                list = $(".leaf");
              }
              for (let i = 0; i < list.length; i++) {
                if (list[i].id === parId) {
                  var nowSelf = list[i]; //从dom中根据id找到父节点
                  $(nowSelf).trigger("click"); //
                  $(nowSelf)
                    .children(".popup")
                    .children(".popTop")
                    .trigger("click");
                  $(nowSelf)
                    .children()
                    .remove();
                  console.log("渲染了");
                  break;
                }
              }
              alert("成功添加资源");
            }
          });
        }
      });
      hideEdit();
    });
  }

  // 隐藏编辑弹窗和遮罩
  function hideEdit() {
    $(".box").remove();
    $(".mask").remove();
    $(".popup").remove();
  }

  // 渲染子元素
  function showChild(curId, level, parent) {
    var levelList = String(level).split(",");
    var childList = [];
    var resource = [];
    var resId = 0;
    var path = "";
    var leaves = [];
    var temp = [];
    var temp1 = [];
    var temp2 = [];
    var temp3 = [];

    // 判断层级，拿到childList
    if (levelList.length === 1) {
      for (let i = 0; i < tree.length; i++) {
        if (curId === tree[i].id) {
          childList = tree[i].children;
          resource = tree[i].resource;
          resId = tree[i].id;
          path = `${tree[i].name}`;
          break;
        } else {
          console.log("none parent node");
        }
      }
    } else if (levelList.length === 2) {
      for (let i = 0; i < tree.length; i++) {
        if (parseInt(levelList[0]) === tree[i].id) {
          console.log("firstNode");
          temp = tree[i].children;
          path = `${tree[i].name}/`;
          for (let j = 0; j < temp.length; j++) {
            if (parseInt(levelList[1]) === temp[j].id) {
              console.log("secondNode");
              childList = temp[j].children;
              resource = temp[j].resource;
              resId = temp[j].id;
              path += `${temp[j].name}`;
            } else {
              console.log("no parent node");
            }
          }
        }
      }
    } else if (levelList.length === 3) {
      for (let i = 0; i < tree.length; i++) {
        if (parseInt(levelList[0]) === tree[i].id) {
          console.log("firstNode");
          temp = tree[i].children;
          path = `${tree[i].name}/`;
          for (let j = 0; j < temp.length; j++) {
            if (parseInt(levelList[1]) === temp[j].id) {
              console.log("secondNode");
              temp1 = temp[j].children;
              path += `${temp[j].name}/`;
              for (let x = 0; x < temp1.length; x++) {
                if (parseInt(levelList[2]) === temp1[x].id) {
                  childList = temp1[x].children;
                  resource = temp1[x].resource;
                  resId = temp1[x].id;
                  path += `${temp1[x].name}`;
                } else {
                  console.log("no parent node");
                }
              }
            }
          }
        }
      }
    } else if (levelList.length === 4) {
      for (let i = 0; i < tree.length; i++) {
        if (parseInt(levelList[0]) === tree[i].id) {
          console.log("firstNode");
          temp = tree[i].children;
          path = `${tree[i].name}/`;
          for (let j = 0; j < temp.length; j++) {
            if (parseInt(levelList[1]) === temp[j].id) {
              console.log("secondNode");
              temp1 = temp[j].children;
              path += `${temp[j].name}/`;
              for (let x = 0; x < temp1.length; x++) {
                if (parseInt(levelList[2]) === temp1[x].id) {
                  console.log("thirdNode");
                  temp2 = temp1[x].children;
                  path += `${temp1[x].name}/`;
                  for (let y = 0; y < temp2.length; y++) {
                    if (parseInt(levelList[3]) === temp2[y].id) {
                      childList = temp2[y].children;
                      resource = temp2[y].resource;
                      resId = temp2[y].id;
                      path += `${temp2[y].name}`;
                    } else {
                      console.log("no parent node");
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else if (levelList.length === 5) {
      for (let i = 0; i < tree.length; i++) {
        if (parseInt(levelList[0]) === tree[i].id) {
          console.log("firstNode");
          temp = tree[i].children;
          path = `${tree[i].name}/`;
          for (let j = 0; j < temp.length; j++) {
            if (parseInt(levelList[1]) === temp[j].id) {
              console.log("secondNode");
              temp1 = temp[j].children;
              path += `${temp[j].name}/`;
              for (let x = 0; x < temp1.length; x++) {
                if (parseInt(levelList[2]) === temp1[x].id) {
                  console.log("thirdNode");
                  temp2 = temp1[x].children;
                  path += `${temp1[x].name}/`;
                  for (let y = 0; y < temp2.length; y++) {
                    if (parseInt(levelList[3]) === temp2[y].id) {
                      console.log("forthNode");
                      temp3 = temp2[y].children;
                      path += `${temp2[y].name}/`;
                      for (let m = 0; m < temp3.length; m++) {
                        if (parseInt(levelList[4]) === temp3[m].id) {
                          childList = temp3[m].children;
                          resource = temp3[m].resource;
                          resId = temp3[m].id;
                          path += `${temp3[m].name}`;
                        }
                      }
                    } else {
                      console.log("no parent node");
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // 开始渲染
    if (childList === "null") {
      console.log("children is null");
      if (resource.length === 0) {
        console.log("resource is null");
      } else {
        var url = `detail.html?id=${resId}&path=${path}`;
        window.open(url, "_blank");
        console.log(resId, path);
      }
    } else {
      var seeChildLen;
      var seeResource;
      for (let a = 0; a < childList.length; a++) {
        if (childList[a].children === "null") {
          seeChildLen = "lastNode"; //用于判断此节点是不是最后一个节点
        } else {
          seeChildLen = "notLast";
        }
        if (childList[a].resource.length === 0) {
          seeResource = "noRes"; //用于判断此节点中有没有资源
        } else {
          seeResource = "hasRes";
        }
        var newLevel = levelList.join(",");
        var leafConH = 80 * childList.length + 50 * (childList.length - 1);
        var node1 = `<div class="leaf leaf-1 ${childList[a].name.length < 6?'default-font':'small-font'}" id="${
          childList[a].id
        }" data-level="${newLevel + "," + childList[a].id}" data-pic="${
          childList[a].pic
        }" data-info="${childList[a].info}" data-name="${
          childList[a].name
        }" data-iflast="${seeChildLen}" data-ifres="${seeResource}">${
          childList[a].name
        }</div>`;
        var node2 = `<div class="leaf leaf-2" id="${
          childList[a].id
        }" data-level="${newLevel + "," + childList[a].id}" data-pic="${
          childList[a].pic
        }" data-info="${childList[a].info}" data-name="${
          childList[a].name
        }" data-iflast="${seeChildLen}" data-ifres="${seeResource}">${
          childList[a].name
        }</div>`;
        var node3 = `<div class="leaf leaf-3" id="${
          childList[a].id
        }" data-level="${newLevel + "," + childList[a].id}" data-pic="${
          childList[a].pic
        }" data-info="${childList[a].info}" data-name="${
          childList[a].name
        }" data-iflast="${seeChildLen}" data-ifres="${seeResource}">${
          childList[a].name
        }</div>`;
        var node4 = `<div class="leaf leaf-4" id="${
          childList[a].id
        }" data-level="${newLevel + "," + childList[a].id}" data-pic="${
          childList[a].pic
        }" data-info="${childList[a].info}" data-name="${
          childList[a].name
        }" data-iflast="${seeChildLen}" data-ifres="${seeResource}">${
          childList[a].name
        }</div>`;
        if (levelList.length === 1) {
          leaves.push(node1);
        } else if (levelList.length === 2) {
          leaves.push(node2);
        } else if (levelList.length === 3) {
          leaves.push(node3);
        } else if (levelList.length === 4) {
          leaves.push(node4);
        }
      }
      if (levelList.length === 1) {
        var leafCon = `<div class="leaf-con leaf-con-1"></div>`; // 先渲染叶子的容器
        $("#treeCon").append(leafCon);
        $(".leaf-con").append(leaves.join(""));
      } else if (levelList.length === 2) {
        var leafCon = `<div class="leaf-con leaf-con-2"></div>`;
        parent.append(leafCon);
        parent.children(".leaf-con-2").append(leaves.join(""));
      } else if (levelList.length === 3) {
        var leafCon = `<div class="leaf-con leaf-con-3"></div>`;
        parent.append(leafCon);
        parent.children(".leaf-con-3").append(leaves.join(""));
      } else if (levelList.length === 4) {
        var leafCon = `<div class="leaf-con leaf-con-4"></div>`;
        parent.append(leafCon);
        parent.children(".leaf-con-4").append(leaves.join(""));
      }
    }

    newList = leaves; //把得到的子元素放到全局变量中，划线的时候使用
  }

  // 画线
  function drawLine(self, level) {
    var levelList = String(level).split(",");
    var bx, by, ex, ey, leafBx, leafEx;
    var leafY = [];
    var childList = [];
    if (newList.length === 0) {
      console.log("no child");
    } else {
      if (levelList.length === 1) {
        bx = 0;
        by = self.position().top - 120 + 146 / 2;
        childList = $(".leaf-1");
      } else if (levelList.length === 2) {
        bx = self.position().left + 310;
        by = self.position().top + 73;
        childList = $(".leaf-2");
      } else if (levelList.length === 3) {
        bx = self.position().left + 620;
        by = self.position().top + 73;
        childList = $(".leaf-3");
      } else if (levelList.length === 4) {
        bx = self.position().left + 930;
        by = self.position().top + 73;
        childList = $(".leaf-4");
      }
      for (let i = 0; i < childList.length; i++) {
        // leafY[i] = 33 + 80 * (i + 1) + 50 * i - 40;
        leafY[i] = $(childList[i]).offset().top - 120 + 40;
      }
      ex = bx + 110 / 2;
      ey = by;
      leafBx = ex;
      leafEx = ex + 55;
      draw(bx, by, ex, ey, cxt);
      for (let i = 0; i < leafY.length; i++) {
        draw(leafBx, leafY[i], leafEx, leafY[i], cxt);
        if (i == childList.length - 1) {
          draw(leafBx, leafY[0], leafBx, leafY[i], cxt);
          draw(leafBx, leafY[i], leafBx, by, cxt); // 再画一条从中间接到最后一个的
        }
      }
    }
  }

  // 画线函数
  function draw(x1, y1, x2, y2, cxt) {
    cxt.beginPath();
    cxt.lineTo(x1, y1);
    cxt.lineTo(x2, y2);
    cxt.closePath();
    cxt.strokeStyle = "#fff";
    cxt.lineWeight = 4;
    cxt.stroke();
  }
});

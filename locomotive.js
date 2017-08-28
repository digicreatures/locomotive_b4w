b4w.register("locomotive", function(exports, require) {

var m = {
  app: require("app"),
  config: require("config"),
  version: require("version"),
  data: require("data"),
  objects: require("objects"),
  ctrl: require("controls"),
  scenes: require("scenes"),
  anchors: require("anchors"),
  container: require("container"),
}

// detect application mode
var DEBUG = (m.version.type() == "DEBUG");

// automatically detect assets path
var APP_ASSETS_PATH = m.config.get_assets_path("locomotive_b4w");

function selection_callback (obj) {
  console.log("hey");
  var anchors = document.getElementsByClassName("anchor");
  for (var i = 0; i < anchors.length; ++i) {
    anchors[i].style.visibility = "hidden";
  }
  var elem = document.getElementById(m.scenes.get_object_name(obj) + ".anchor");
  elem.style.visibility = "visible";
  console.log(m.scenes.get_object_name(obj) + " selected");
}

function anchor_move_callback (x, y, appearance, obj) {
  var elem = document.getElementById(m.scenes.get_object_name(obj));
  var rect = m.container.get_canvas().getBoundingClientRect();
  elem.style.left = (document.body.scrollLeft + rect.left + x + 100) + "px";
  elem.style.top = (document.body.scrollTop + rect.top + y) + "px";
}

function create_selectable_sensors() {
  var selectable_objects = m.objects.get_selectable_objects();
  for(var i = 0; i < selectable_objects.length; ++i) {
    var anchor = m.scenes.get_object_by_name(m.scenes.get_object_name(selectable_objects[i]) + ".anchor");
    if (anchor && document.getElementById(m.scenes.get_object_name(anchor))) {
      m.anchors.attach_move_cb(anchor, anchor_move_callback);
      var s = m.ctrl.create_selection_sensor(selectable_objects[i], false);
      m.ctrl.create_sensor_manifold(selectable_objects[i], "SELECTABLE", m.ctrl.CT_SHOT, [s], function(s){return s[0]}, selection_callback);
    }
  }
}

function add_anchor_event_listener() {
  var anchors = document.getElementsByClassName("anchor");
  for (var i = 0; i < anchors.length; ++i) {
    anchors[i].addEventListener("click", function(e) {e.currentTarget.style.visibility = "hidden";});
  }
}

function load_data() {
    var dataId = m.data.load(APP_ASSETS_PATH + "locomotive.json", function() {
      m.app.enable_camera_controls();
      create_selectable_sensors();
      add_anchor_event_listener();
    });
}

exports.init = function() {
  m.app.init({
    canvas_container_id: "locomotive_viewer",
    show_fps: DEBUG,
    console_verbose: DEBUG,
    force_container_ratio: 16/9,
    report_init_failure: true,
    autoresize: true,
    callback: function(canvas, success) {
      if(!success) {
        console.log("Application cannot started");
        return;
      }
      load_data();
    }
  });
}

});

b4w.require("locomotive").init();

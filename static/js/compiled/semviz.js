// Generated by CoffeeScript 1.4.0

/*
SemViz
A visualizer for Semafor parses

Requires jQuery, mustache

Author: Sam Thomson (sthomson@cs.cmu.edu)
*/


(function() {
    var AnnotationCell, BLANK, Cell, DEPENDENCY_CONTAINER_SELECTOR, DEPENDENCY_DISPLAY_ID, DEPENDENCY_CONLL_DISPLAY_ID, FRAME_JSON_DISPLAY_ID, FRAMENET_FRAME_URL_TEMPLATE, FRAME_CONTAINER_SELECTOR, FRAME_DISPLAY_SELECTOR, FRAME_TABLE_TEMPLATE, FrameElementCell, Header, INPUT_BOX_SELECTOR, PARSE_URL, SPINNER_SELECTOR, SemViz, TargetCell, globalObject,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FRAME_TABLE_TEMPLATE = "<table id=frame_table>\n	<tr>\n		<thead>\n			<th></th>\n			{{#targetHeaders}}\n				<th class=\"target\">\n					<a href={{getUrl}}>{{label}}</a>\n				</th>\n			{{/targetHeaders}}\n		</thead>\n	</tr>\n	{{#rows}}\n		<tr id=\"token_{{token.idx}}\">\n			<th>{{token.label}}</th>\n			{{#frames}}\n				<td rowspan={{spanLength}}\n						{{#isFrameElement}}\n							class=\"annotation frame_element\"\n						{{/isFrameElement}}\n						{{#isTarget}}\n							class=\"annotation target\"\n						{{/isTarget}}\n						>\n					{{label}}\n				</td>\n			{{/frames}}\n		</tr>\n	{{/rows}}\n</table>";

  FRAMENET_FRAME_URL_TEMPLATE = 'https://framenet2.icsi.berkeley.edu/fnReports/data/frame/{{name}}.xml';

  PARSE_URL = document.location.protocol + "//" + document.location.host + document.location.pathname + "/api/v1/parse";

  INPUT_BOX_SELECTOR = "textarea[name=sentence]";

  DEPENDENCY_CONTAINER_SELECTOR = '#dependency_parse';

  DEPENDENCY_DISPLAY_ID = 'brat_parse';

  DEPENDENCY_CONLL_DISPLAY_ID = 'conll_parse';
  
  FRAME_JSON_DISPLAY_ID = 'parse_json';

  FRAME_CONTAINER_SELECTOR = '#frame_semantic_parse';

  FRAME_DISPLAY_SELECTOR = '#parse_table';

  SPINNER_SELECTOR = "#spinner";

  Cell = (function() {

    function Cell(label, spanLength) {
      this.label = label != null ? label : '';
      this.spanLength = spanLength != null ? spanLength : 1;
    }

    return Cell;

  })();

  Header = (function(_super) {

    __extends(Header, _super);

    function Header(label, idx) {
      this.idx = idx;
      Header.__super__.constructor.call(this, label = label);
    }

    return Header;

  })(Cell);

  AnnotationCell = (function(_super) {

    __extends(AnnotationCell, _super);

    function AnnotationCell(span, frameId) {
      var label, spanLength;
      this.frameId = frameId;
      AnnotationCell.__super__.constructor.call(this, label = span.name, spanLength = span.end - span.start);
      this.spanStart = span.start;
    }

    return AnnotationCell;

  })(Cell);

  TargetCell = (function(_super) {

    __extends(TargetCell, _super);

    function TargetCell(target, frameId) {
      TargetCell.__super__.constructor.call(this, target, frameId);
      this.isTarget = true;
    }

    TargetCell.prototype.getUrl = function() {
      return Mustache.to_html(FRAMENET_FRAME_URL_TEMPLATE, {
        name: this.label
      });
    };

    return TargetCell;

  })(AnnotationCell);

  FrameElementCell = (function(_super) {

    __extends(FrameElementCell, _super);

    function FrameElementCell(fe, frameId) {
      FrameElementCell.__super__.constructor.call(this, fe, frameId);
      this.isFrameElement = true;
    }

    return FrameElementCell;

  })(AnnotationCell);

  BLANK = new Cell();

  /*
  Main functionality of the Semafor visualization demo
  */


  SemViz = (function() {

    function SemViz(parseUrl, inputArea) {
      this.parseUrl = parseUrl != null ? parseUrl : PARSE_URL;
      this.inputArea = inputArea != null ? inputArea : INPUT_BOX_SELECTOR;
    }

    /*
    	Clears room for the given span if it is a multiword span.
    */


    SemViz.prototype.makeRoom = function(table, span, frameId) {
      var offset, spanLength, _i, _results;
      spanLength = span.end - span.start;
      if (spanLength > 1) {
        _results = [];
        for (offset = _i = 1; 1 <= spanLength ? _i < spanLength : _i > spanLength; offset = 1 <= spanLength ? ++_i : --_i) {
          _results.push(table[span.start + offset][frameId] = void 0);
        }
        return _results;
      }
    };

    /*
    	Sorts the targets and frame elements of the given annotated sentence into
    	a table.
    	Their row in the table is determined by the start of their span.
    	Their column is based on their frame.
    */


    SemViz.prototype.sortIntoTable = function(sentence) {
      var fe, frame, frameId, numFrames, numTokens, table, target, x, y, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      numTokens = sentence.tokens.length;
      numFrames = sentence.frames.length;
      table = (function() {
        var _i, _results;
        _results = [];
        for (y = _i = 0; 0 <= numTokens ? _i < numTokens : _i > numTokens; y = 0 <= numTokens ? ++_i : --_i) {
          _results.push((function() {
            var _j, _results1;
            _results1 = [];
            for (x = _j = 0; 0 <= numFrames ? _j < numFrames : _j > numFrames; x = 0 <= numFrames ? ++_j : --_j) {
              _results1.push(BLANK);
            }
            return _results1;
          })());
        }
        return _results;
      })();
      _ref = [numFrames, numTokens], table.width = _ref[0], table.height = _ref[1];
      _ref1 = sentence.frames;
      for (frameId = _i = 0, _len = _ref1.length; _i < _len; frameId = ++_i) {
        frame = _ref1[frameId];
        _ref2 = frame.annotationSets[0].frameElements;
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          fe = _ref2[_j];
          table[fe.start][frameId] = new FrameElementCell(fe, frameId);
          this.makeRoom(table, fe, frameId);
        }
        target = frame.target;
        table[target.start][frameId] = new TargetCell(target, frameId);
        this.makeRoom(table, target, frameId);
      }
      return table;
    };

    /*
    	Takes the given semafor parse and renders it to html
    */


    SemViz.prototype.render = function(sentence) {
      var frame, i, row, rows, table, targetHeaders, token, tokenHeaders, x, _i, _len;
      table = this.sortIntoTable(sentence);
      for (i = _i = 0, _len = table.length; _i < _len; i = ++_i) {
        row = table[i];
        table[i] = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
            x = row[_j];
            if (x != null) {
              _results.push(x);
            }
          }
          return _results;
        })();
      }
      targetHeaders = (function() {
        var _j, _len1, _ref, _results;
        _ref = sentence.frames;
        _results = [];
        for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
          frame = _ref[i];
          _results.push(new TargetCell(frame.target, i));
        }
        return _results;
      })();
      tokenHeaders = (function() {
        var _j, _len1, _ref, _results;
        _ref = sentence.tokens;
        _results = [];
        for (i = _j = 0, _len1 = _ref.length; _j < _len1; i = ++_j) {
          token = _ref[i];
          _results.push(new Header(token, i));
        }
        return _results;
      })();
      rows = (function() {
        var _j, _len1, _results;
        _results = [];
        for (i = _j = 0, _len1 = table.length; _j < _len1; i = ++_j) {
          row = table[i];
          _results.push({
            token: tokenHeaders[i],
            frames: row
          });
        }
        return _results;
      })();
      return Mustache.to_html(FRAME_TABLE_TEMPLATE, {
        rows: rows,
        targetHeaders: targetHeaders
      });
    };

    /*
      Renders the given dependency-parsed sentence using brat
    */


    SemViz.prototype.renderDependencyParse = function(sentence,debug_info) {
      $("#" + DEPENDENCY_DISPLAY_ID).replaceWith('<div id="' + DEPENDENCY_DISPLAY_ID + '">');
      return Util.embed(DEPENDENCY_DISPLAY_ID, {}, sentence, []);
    };

    SemViz.prototype.renderConllDependencyParse = function(sentence,debug_info) {
      var $placeholder = $("#" + DEPENDENCY_CONLL_DISPLAY_ID);
      var display = $placeholder.css("display");
      $placeholder.replaceWith('<pre id="' + DEPENDENCY_CONLL_DISPLAY_ID + '" style="display: '+display+'">' + sentence['conll'] + '</pre>');
      receivedDepJSON(sentence,debug_info);
	return true;
    };
    
    SemViz.prototype.renderFrameJSON = function(sentence,debug_info) {
      var frameJ = {"tokens": sentence["tokens"], "frames": sentence["frames"]}
      var frameJS = JSON.stringify(frameJ, undefined, 2);
      var $placeholder = $("#" + FRAME_JSON_DISPLAY_ID);
      var display = $placeholder.css("display");
      $placeholder.replaceWith('<pre id="' + FRAME_JSON_DISPLAY_ID + '" style="display: '+display+'">' + frameJS + '</pre>').css({"display": display});
      receivedFrameJSON(sentence,debug_info);
	return true;
    };

    /*
    	 Submits the content of the input textarea to the parse API endpoint,
    	 and then renders and displays the response.
    */


    SemViz.prototype.submitSentence = function() {
      var sentence, spinner,
        _this = this;
      sentence = $(this.inputArea).val();
      spinner = $(SPINNER_SELECTOR);
      spinner.show();
      $(FRAME_CONTAINER_SELECTOR).hide();
      $(DEPENDENCY_CONTAINER_SELECTOR).hide();
      return $.ajax({
        url: this.parseUrl,
        data: {
          sentence: sentence
        },
        success: function(data) {
          spinner.hide();
          sentence = data.sentences[0];
          $(FRAME_DISPLAY_SELECTOR).html(_this.render(sentence));
          _this.renderDependencyParse(sentence,data.debug_info);
          _this.renderConllDependencyParse(sentence,data.debug_info);
          _this.renderFrameJSON(sentence,data.debug_info);
          $(FRAME_CONTAINER_SELECTOR).show();
          return $(DEPENDENCY_CONTAINER_SELECTOR).show();
        },
        error: function(data) {
          spinner.hide();
          $(FRAME_DISPLAY_SELECTOR).text("Error");
          $(DEPENDENCY_CONTAINER_SELECTOR).text("Error");
          $(FRAME_CONTAINER_SELECTOR).show();
          return $(DEPENDENCY_CONTAINER_SELECTOR).show();
        }
      });
    };

    return SemViz;

  })();

  if (typeof module !== "undefined" && module.exports) {
    globalObject = exports;
  } else {
    globalObject = window;
  }

  globalObject.SemViz = SemViz;
  globalObject.semViz = new SemViz();

}).call(this);

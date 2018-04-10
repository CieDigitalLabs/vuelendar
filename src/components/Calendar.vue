<template>
  <div class="container-fluid calendar">
      <div class="row">
          <div class="col-xl-12 main-title">
              <h4></h4>
          </div>
          <div class="col-xl-12">
              <div class="row">
                  <div class="col-xl-12 text-right">
                      <button data-toggle="tooltip" data-placement="bottom" title="Export to image" type="button" class="btn btn-primary" v-on:click="rasterize();">
                          <i class="fa fa-download" aria-hidden="true"></i> Export to image</button>
                      <button data-toggle="tooltip" data-placement="bottom" title="Export to SVG" type="button" class="btn btn-primary" v-on:click="rasterizeSVG();">
                          <i class="fa fa-download" aria-hidden="true"></i> Export to SVG</button>
                      <button data-toggle="tooltip" data-placement="bottom" title="Save to Titan Cloud" type="button" class="btn btn-primary"
                          v-on:click="saveCanvasToJSON();">
                          <i class="fa fa-save" aria-hidden="true"></i> Save</button>
                      <button data-toggle="tooltip" data-placement="bottom" title="Load from Titan Cloud" type="button" class="btn btn-primary"
                          v-on:click="loadCanvasFromJSON();">
                          <i class="fa fa-save" aria-hidden="true"></i> Load</button>
                      <button data-toggle="tooltip" data-placement="bottom" title="Clean Canvas" type="button" class="btn btn-danger" v-on:click="confirmClear();">
                          <i class="fa fa-ban" aria-hidden="true"></i> Clean</button>
                  </div>
              </div>
          </div>
      </div>
      <hr>
      <div class="row">
          <div class="col-sm-2">
              <div class="card">
                  <div class="card-header">Custom</div>
                  <div class="card-body">
                      <div class="custom-item" v-if="selected  && selected.type == 'group'">Group Selected</div>
                      <div class="custom-item" v-if="!selected">No items selected</div>
                      <div class="custom-item" v-if="selected && selected.type != 'group'">
                          <div class="custom-item-title">ID</div>
                          <div class="custom-item-body">
                              <input type="text" class="form-control" v-model="props.id" v-on:keyup="setId()">
                          </div>
                      </div>
                      <div class="custom-item" v-if="selected && selected.type != 'group'">
                          <div class="custom-item-title">Opacity</div>
                          <div class="custom-item-body">
                              <input type="range" v-model="props.opacity" v-on:change="setOpacity()">{{props.opacity}}</div>
                      </div>
                      <div class="custom-item" v-if="selected && textEditor || selected && figureEditor">
                          <div class="custom-item-title">Text Color</div>
                          <div class="custom-item-body">
                              <input type="text" class="form-control" v-bind:cpPosition="'bottom'" v-model="props.fill" v-on:change="setFill()">
                          </div>
                      </div>
                      <div class="custom-item" v-if="selected && textEditor">
                          <div class="custom-item-title">Font family</div>
                          <div class="custom-item-body">
                              <select v-model="props.fontFamily" class="form-control" v-on:change="setFontFamily()">
                                  <option value="arial">Arial</option>
                                  <option value="helvetica" selected>Helvetica</option>
                                  <option value="verdana">Verdana</option>
                                  <option value="courier">Courier</option>
                                  <option value="Roboto">Roboto</option>
                                  <option value="Open Sans">Open Sans</option>
                                  <option value="Zilla Slab">Zilla Slab</option>
                                  <option value="Lato">Lato</option>
                                  <option value="Bellefair">Bellefair</option>
                                  <option value="Fresca">Fresca</option>
                                  <option value="Raleway">Raleway</option>
                                  <option value="Open Sans Condensed">Open Sans Condensed</option>
                                  <option value="Indie Flower">Indie Flower</option>
                                  <option value="Josefin Sans">Josefin Sans</option>
                                  <option value="Inconsolata">Inconsolata</option>
                                  <option value="Pacifico">Pacifico</option>
                                  <option value="Gloria Hallelujah">Gloria Hallelujah</option>
                              </select>
                          </div>
                      </div>
                      <div class="custom-item" v-if="selected && textEditor">
                          <div class="custom-item-title">Text Align</div>
                          <div class="custom-item-body text-center">
                              <div class="btn-group" role="group" aria-label="...">
                                  <button type="button" class="btn btn-primary" v-bind:class="{'active': props.textAlign == 'left' }" v-on:click="setTextAlign('left')">
                                      <i class="fa fa-align-left"></i>
                                  </button>
                                  <button type="button" class="btn btn-primary" v-bind:class="{'active': props.textAlign == 'center' }" v-on:click="setTextAlign('center')">
                                      <i class="fa fa-align-center"></i>
                                  </button>
                                  <button type="button" class="btn btn-primary" v-bind:class="{'active': props.textAlign == 'right' }" v-on:click="setTextAlign('right')">
                                      <i class="fa fa-align-right"></i>
                                  </button>
                                  <button type="button" class="btn btn-primary" v-bind:class="{'active': props.textAlign == 'justify' }" v-on:click="setTextAlign('justify')">
                                      <i class="fa fa-align-justify"></i>
                                  </button>
                              </div>
                          </div>
                      </div>
                      <div class="custom-item" v-if="selected && textEditor">
                          <div class="custom-item-title">Style</div>
                          <div class="custom-item-body text-center">
                              <div class="btn-group" role="group" aria-label="...">
                                  <button type="button" class="btn btn-primary btn-sm" v-bind:class="{'active': props.fontWeight }" v-on:click="setBold()">
                                      <i class="fa fa-bold"></i>
                                  </button>
                                  <button type="button" class="btn btn-primary btn-sm" v-bind:class="{'active': props.fontStyle }" v-on:click="setFontStyle()">
                                      <i class="fa fa-italic"></i>
                                  </button>
                                  <button type="button" class="btn btn-primary btn-sm" v-bind:class="{'active': hasTextDecoration('underline') }"
                                      v-on:click="setTextDecoration('underline')">
                                      <i class="fa fa-underline"></i>
                                  </button>
                                  <button type="button" class="btn btn-primary btn-sm" v-bind:class="{'active': hasTextDecoration('overline') }"
                                      v-on:click="setTextDecoration('overline')">
                                      <i class="fa fa-underline fa-flip-vertical"></i>
                                  </button>
                                  <button type="button" class="btn btn-primary btn-sm" v-bind:class="{'active': hasTextDecoration('line-through') }"
                                      v-on:click="setTextDecoration('line-through')">
                                      <i class="fa fa-strikethrough"></i>
                                  </button>
                              </div>
                          </div>
                      </div>
                      <div class="custom-item" v-if="selected && textEditor">
                          <div class="custom-item-title">Font Size</div>
                          <div class="custom-item-body">
                              <input type="range" v-model="props.fontSize" v-on:change="setFontSize()" step="1" min="1" max="120">{{props.fontSize}}</div>
                      </div>
                      <div class="custom-item" v-if="selected && textEditor">
                          <div class="custom-item-title">Line Height</div>
                          <div class="custom-item-body">
                              <input type="range" v-model="props.lineHeight" v-on:change="setLineHeight()" step="0.1" min="0" max="10">{{props.lineHeight}}</div>
                      </div>
                      <div class="custom-item" v-if="selected && textEditor">
                          <div class="custom-item-title">Char Spacing</div>
                          <div class="custom-item-body">
                              <input type="range" v-model="props.charSpacing" v-on:change="setCharSpacing()" step="10" min="-200" max="800">{{props.charSpacing}}</div>
                      </div>
                  </div>
              </div>
              <br/>
              <div class="card">
                  <div class="card-header">Add text</div>
                  <div class="card-body">
                      <div class="input-group">
                          <input type="text" class="form-control" v-model="textString">
                          <div class="input-group-append">
                              <span class="input-group-text">
                                  <button id="add-text" data-toggle="tooltip" data-placement="bottom" title="Add text" class="btn btn-primary" v-on:click="addText()">
                                      <i class="fa fa-plus" aria-hidden="true"></i>
                                  </button>
                              </span>
                          </div>
                      </div>
                  </div>
              </div>
              <br/>
              <div class="card">
                  <div class="card-header">Add images</div>
                  <div class="card-body max-height">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/pikachu.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/squirtle.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/bullbasaur.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/charmander.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/bellsprout.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/caterpie.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/dratini.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/eevee.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/meowth.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/abra.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/snorlax.svg">
                      <img class="images-item" v-on:click="getImgPolaroid($event)" src="../assets/vue/img/zubat.svg">
                  </div>
              </div>
              <br/>
              <div class="card">
                  <div class="card-header">Upload image</div>
                  <div class="card-body text-center">
                      <img id="testImage" v-if="url" class="images-item-upload" v-bind:src='url' v-on:click="addImageOnCanvas(url);">
                      <input type="file" v-on:change="readUrl($event)">
                      <br/>
                      <br/>
                      <div class="btn-group btn-group-justified" role="group" aria-label="...">
                          <div class="btn-group" role="group">
                              <button type="button" class="btn btn-outline-danger btn-sm" v-on:click="removeWhite(url);">
                                  <i class="fa fa-times" aria-hidden="true"></i> Remove</button>
                          </div>
                      </div>
                  </div>
              </div>
              <br/>
              <div class="card">
                  <div class="card-header">Add figure</div>
                  <div class="card-body text-center max-height">
                      <div class="btn-group btn-group-vertical" role="group" aria-label="...">
                          <a v-on:click="addFigure('rectangle');"><i class="fas fa-circle"></i></a>

                          <button type="button" class="btn btn-primary" v-on:click="addFigure('rectangle');">Rectangle</button>
                          <button type="button" class="btn btn-primary" v-on:click="addFigure('square');">Square</button>
                          <button type="button" class="btn btn-primary" v-on:click="addFigure('triangle');">Triangle</button>
                          <button type="button" class="btn btn-primary" v-on:click="addFigure('circle');">Circle</button>
                      </div>
                  </div>
              </div>
              <div class="card">
                  <div class="card-header">Options</div>
                  <div class="card-body text-center">
                      <div class="btn-group" role="group" aria-label="...">
                          <button data-toggle="tooltip" data-placement="bottom" title="Delete element" type="button" class="btn btn-outline-danger" v-bind:class="{disabled: !selected}"
                              v-on:click="removeSelected();">
                              <i class="fa fa-trash" aria-hidden="true"></i>
                          </button>
                          <button data-toggle="tooltip" data-placement="bottom" title="Send to back" type="button" class="btn btn-outline-primary" v-bind:class="{disabled: !selected}"
                              v-on:click="sendToBack();">
                              <i class="fa fa-level-down" aria-hidden="true"></i>
                          </button>
                          <button data-toggle="tooltip" data-placement="bottom" title="Send to front" type="button" class="btn btn-outline-primary" v-bind:class="{disabled: !selected}"
                              v-on:click="bringToFront();">
                              <i class="fa fa-level-up" aria-hidden="true"></i>
                          </button>
                          <button data-toggle="tooltip" data-placement="bottom" title="Clone" type="button" class="btn btn-outline-primary" v-bind:class="{disabled: !selected || selected.type == 'group'}"
                              v-on:click="clone();">
                              <i class="fa fa-clone" aria-hidden="true"></i>
                          </button>
                          <button data-toggle="tooltip" data-placement="bottom" title="Unselect" type="button" class="btn btn-outline-primary" v-bind:class="{disabled: !selected}"
                              v-on:click="cleanSelect()">
                              <i class="fa fa-remove" aria-hidden="true"></i>
                          </button>
                      </div>
                  </div>
              </div>
              <br/>
              <div class="card" v-if="!selected">
                  <div class="card-header">Canvas</div>
                  <div class="card-body mx-auto">
                      <div class="custom-item" v-if="!props.canvasImage">
                          <div class="custom-item-title">Background Color</div>
                          <div class="custom-item-body">
                              <chrome-picker v-model="canvasFill" />
                          </div>
                      </div>
                      <div class="custom-item">
                          <div class="custom-item-title">Background Image (url)</div>
                          <div class="custom-item-body">
                              <input type="text" class="form-control" placeholder="http://example.jpg" v-model="props.canvasImage" v-on:keyup="setCanvasImage()">
                          </div>
                      </div>
                  </div>
              </div>
              <br/>
          </div>
          <div class="col-sm-10">
              <canvas id="canvas"></canvas>
          </div>
      </div>
      <div class="row">
          <div class="col-xl-12">
              <br/>
              <div class="card">
                  <div class="card-header">
                      <button type="button" class="btn btn-primary btn-sm" v-on:click="rasterizeJSON()">
                          <i class="fa fa-refresh" aria-hidden="true"></i> Render to json</button>
                  </div>
                  <div class="card-body">
                      <pre>{{json}}</pre>
                  </div>
              </div>
          </div>
      </div>
      <br>
      <br>
  </div>

</template>

<script>
import { fabric } from 'fabric';
import { Chrome } from 'vue-color';

export default {
  name: 'Calendar',
  components: { 'chrome-picker': Chrome },
  data() {
    return {
      test: '',
      canvas: '',
      size: {
        width: 1150,
        height: 888,
      },
      textString: '',
      url: '',
      selected: '',
      props: {
        canvasFill: '#ffffff',
        canvasImage: '',
        id: null,
        opacity: null,
        fill: null,
        fontSize: null,
        lineHeight: null,
        charSpacing: null,
        fontWeight: null,
        fontStyle: null,
        textAlign: null,
        fontFamily: null,
        TextDecoration: '',
      },
      canvasFill: '#ffffff',
      json: '',
      globalEditor: false,
      textEditor: false,
      imageEditor: false,
      figureEditor: false,
    };
  },
  watch: {
    canvasFill() {
      this.setCanvasFill();
    },
  },
  methods: {
    initCalendarGrid(gridSize = { days: 7, weeks: 5 }) {
      const distance = 154;
      for (let x = 1; x < this.canvas.width / gridSize.days; x += 1) {
        this.canvas.add(
          new fabric.Line([distance * x, 0, distance * x, distance * gridSize.weeks], {
            stroke: '#000000',
            strokeWidth: 1,
            selectable: false,
          }),
        );
        this.canvas.add(
          new fabric.Line([0, distance * x, distance * gridSize.days, distance * x], {
            stroke: '#000000',
            strokeWidth: 1,
            selectable: false,
          }),
        );
      }
    },

    /* ------------------------Block elements------------------------ */

    // Block "Size"

    changeSize() {
      this.canvas.setWidth(this.size.width);
      this.canvas.setHeight(this.size.height);
    },

    // Block "Add text"

    addText() {
      const textString = this.textString;
      const text = new fabric.IText(textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: '#000000',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true,
      });
      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    },

    // Block "Add images"

    getImgPolaroid(event) {
      const el = event.target;
      fabric.Image.fromURL(el.src, (image) => {
        image.set({
          left: 20,
          top: 20,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true,
          peloas: 12,
          width: 1400,
          height: 1400,
        });
        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    },

    // Block "Upload Image"

    addImageOnCanvas(url) {
      if (url) {
        fabric.Image.fromURL(url, (image) => {
          image.set({
            left: 10,
            top: 10,
            angle: 0,
            padding: 10,
            cornersize: 10,
            hasRotatingPoint: true,
            width: 200,
            height: 200,
          });
          this.extend(image, this.randomId());
          this.canvas.add(image);
          this.selectItemAfterAdded(image);
        });
      }
    },

    readUrl(event) {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          this.url = evt.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    },

    removeWhite() {
      this.url = '';
    },

    // Block "Add figure"

    addFigure(figure) {
      let add = '';
      switch (figure) {
        case 'rectangle':
          add = new fabric.Rect({
            width: 200,
            height: 100,
            left: 10,
            top: 10,
            angle: 0,
            fill: '#3f51b5',
          });
          break;
        case 'square':
          add = new fabric.Rect({
            width: 100,
            height: 100,
            left: 10,
            top: 10,
            angle: 0,
            fill: '#4caf50',
          });
          break;
        case 'triangle':
          add = new fabric.Triangle({
            width: 100, height: 100, left: 10, top: 10, fill: '#2196f3',
          });
          break;
        case 'circle':
          add = new fabric.Circle({
            radius: 50, left: 10, top: 10, fill: '#ff5722',
          });
          break;
        default:
          break;
      }
      this.extend(add, this.randomId());
      this.canvas.add(add);
      this.selectItemAfterAdded(add);
    },

    /* Canvas */

    cleanSelect() {
      this.canvas.deactivateAllWithDispatch().renderAll();
    },

    selectItemAfterAdded(obj) {
      // this.canvas.deactivateAllWithDispatch().renderAll();
      this.canvas.setActiveObject(obj);
    },

    setCanvasFill() {
      if (!this.props.canvasImage) {
        this.canvas.backgroundColor = this.canvasFill.hex;
        this.canvas.renderAll();
      }
    },

    extend(oldObj, id) {
      return Object.assign({ id }, oldObj);
    },

    setCanvasImage() {
      const self = this;
      if (this.props.canvasImage) {
        this.canvas.setBackgroundColor({ source: this.props.canvasImage, repeat: 'repeat' }, () => {
          // self.props.canvasFill = '';
          self.canvas.renderAll();
        });
      }
    },

    randomId() {
      return Math.floor(Math.random() * 999999) + 1;
    },

    /* ------------------------Global actions for element------------------------ */

    getActiveStyle(styleName, obj) {
      const object = obj || this.canvas.getActiveObject();
      if (!object) return '';

      return (object.getSelectionStyles && object.isEditing)
        ? (object.getSelectionStyles()[styleName] || '')
        : (object[styleName] || '');
    },


    setActiveStyle(styleName, value, obj) {
      const object = obj || this.canvas.getActiveObject();
      if (!object) return;

      if (object.setSelectionStyles && object.isEditing) {
        const style = {};
        style[styleName] = value;
        object.setSelectionStyles(style);
        object.setCoords();
      } else {
        object.set(styleName, value);
      }

      object.setCoords();
      this.canvas.renderAll();
    },


    getActiveProp(name) {
      const object = this.canvas.getActiveObject();
      if (!object) return '';

      return object[name] || '';
    },

    setActiveProp(name, value) {
      const object = this.canvas.getActiveObject();
      if (!object) return;
      object.set(name, value).setCoords();
      this.canvas.renderAll();
    },

    clone() {
      const activeObject = this.canvas.getActiveObject();

      if (activeObject) {
        let clone;
        switch (activeObject.type) {
          case 'rect':
            clone = new fabric.Rect(activeObject.toObject());
            break;
          case 'circle':
            clone = new fabric.Circle(activeObject.toObject());
            break;
          case 'triangle':
            clone = new fabric.Triangle(activeObject.toObject());
            break;
          case 'i-text':
            clone = new fabric.IText('', activeObject.toObject());
            break;
          case 'image':
            clone = fabric.util.object.clone(activeObject);
            break;
          default:
            break;
        }
        if (clone) {
          clone.set({ left: 10, top: 10 });
          this.canvas.add(clone);
          this.selectItemAfterAdded(clone);
        }
      }
    },

    getId() {
      this.props.id = this.canvas.getActiveObject().toObject().id;
    },

    setId() {
      const val = this.props.id;
      const complete = this.canvas.getActiveObject().toObject();
      this.canvas.getActiveObject().toObject = () => {
        complete.id = val;
        return complete;
      };
    },

    getOpacity() {
      this.props.opacity = this.getActiveStyle('opacity', null) * 100;
    },

    setOpacity() {
      this.setActiveStyle('opacity', parseInt(this.props.opacity, 10) / 100, null);
    },

    getFill() {
      this.props.fill = this.getActiveStyle('fill', null);
    },

    setFill() {
      this.setActiveStyle('fill', this.props.fill, null);
    },

    getLineHeight() {
      this.props.lineHeight = this.getActiveStyle('lineHeight', null);
    },

    setLineHeight() {
      this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
    },

    getCharSpacing() {
      this.props.charSpacing = this.getActiveStyle('charSpacing', null);
    },

    setCharSpacing() {
      this.setActiveStyle('charSpacing', this.props.charSpacing, null);
    },

    getFontSize() {
      this.props.fontSize = this.getActiveStyle('fontSize', null);
    },

    setFontSize() {
      this.setActiveStyle('fontSize', parseInt(this.props.fontSize, 10), null);
    },

    getBold() {
      this.props.fontWeight = this.getActiveStyle('fontWeight', null);
    },

    setBold() {
      this.props.fontWeight = !this.props.fontWeight;
      this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
    },

    getFontStyle() {
      this.props.fontStyle = this.getActiveStyle('fontStyle', null);
    },

    setFontStyle() {
      this.props.fontStyle = !this.props.fontStyle;
      this.setActiveStyle('fontStyle', this.props.fontStyle ? 'italic' : '', null);
    },


    getTextDecoration() {
      this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
    },

    setTextDecoration(value) {
      let iclass = this.props.TextDecoration;
      if (iclass.includes(value)) {
        iclass = iclass.replace(RegExp(value, 'g'), '');
      } else {
        iclass += ` ${value}`;
      }
      this.props.TextDecoration = iclass;
      this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
    },

    hasTextDecoration(value) {
      return this.props.TextDecoration.includes(value);
    },

    getTextAlign() {
      this.props.textAlign = this.getActiveProp('textAlign');
    },

    setTextAlign(value) {
      this.props.textAlign = value;
      this.setActiveProp('textAlign', this.props.textAlign);
    },

    getFontFamily() {
      this.props.fontFamily = this.getActiveProp('fontFamily');
    },

    setFontFamily() {
      this.setActiveProp('fontFamily', this.props.fontFamily);
    },

    /* System */


    removeSelected() {
      const activeObject = this.canvas.getActiveObject();
      const activeGroup = this.canvas.getActiveObjects();

      if (activeObject) {
        this.canvas.remove(activeObject);
        // this.textString = '';
      } else if (activeGroup) {
        const objectsInGroup = activeGroup;
        this.canvas.discardActiveGroup();
        objectsInGroup.forEach((object) => {
          this.canvas.remove(object);
        });
      }
    },

    bringToFront() {
      const activeObject = this.canvas.getActiveObject();
      const activeGroup = this.canvas.getActiveObjects();

      if (activeObject) {
        activeObject.bringToFront();
        // activeObject.opacity = 1;
      } else if (activeGroup) {
        const objectsInGroup = activeGroup;
        this.canvas.discardActiveGroup();
        objectsInGroup.forEach((object) => {
          object.bringToFront();
        });
      }
    },

    sendToBack() {
      const activeObject = this.canvas.getActiveObject();
      const activeGroup = this.canvas.getActiveObjects();

      if (activeObject) {
        activeObject.sendToBack();
        // activeObject.opacity = 1;
      } else if (activeGroup) {
        const objectsInGroup = activeGroup; // .getObjects()
        this.canvas.discardActiveGroup();
        objectsInGroup.forEach((object) => {
          object.sendToBack();
        });
      }
    },

    confirmClear() {
      // if (confirm('Are you sure?')) {
      this.canvas.clear();
      // }
    },

    rasterize() {
      if (!fabric.Canvas.supports('toDataURL')) {
        // alert('This browser doesn\'t provide means to serialize canvas to an image');
      } else {
        // window.open(this.canvas.toDataURL('png'));
        const image = new Image();
        image.src = this.canvas.toDataURL('png');
        const w = window.open('');
        w.document.write(image.outerHTML);
      }
    },

    rasterizeSVG() {
      // window.open(
      //   'data:image/svg+xml;utf8,' +
      //   encodeURIComponent(this.canvas.toSVG()));
      // console.log(this.canvas.toSVG())
      // var image = new Image();
      // image.src = this.canvas.toSVG()
      const w = window.open('');
      w.document.write(this.canvas.toSVG());
    },


    saveCanvasToJSON() {
      const json = JSON.stringify(this.canvas);
      // Temporarily save in localStorage for now
      localStorage.setItem('Kanvas', json);
    },

    loadCanvasFromJSON() {
      const CANVAS = localStorage.getItem('Kanvas');

      // and load everything from the same json
      this.canvas.loadFromJSON(CANVAS, () => {
        // making sure to render canvas at the end
        this.canvas.renderAll();

        // and checking if object's "name" is preserved
      });
    },

    rasterizeJSON() {
      this.json = JSON.stringify(this.canvas, null, 2);
    },

    resetPanels() {
      this.textEditor = false;
      this.imageEditor = false;
      this.figureEditor = false;
    },

  },
  mounted() {
    // setup front side canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
    });

    this.canvas.on({
      'object:moving': () => { },
      'object:modified': () => { },
      'object:selected': (e) => {
        const selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {
          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              break;
            default:
              this.figureEditor = true;
              this.getFill();
              break;
          }
        }
      },
      'selection:cleared': () => {
        this.selected = null;
        this.resetPanels();
      },
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    this.initCalendarGrid();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #canvas {
    border: 2px dashed #cccccc;
  }
  .main-title{
    margin-top: 10px;
  }
  .images-item {
    width: 48%;
    cursor: pointer;
    -webkit-transition: .5s ease;
    padding: 3px;
    max-width: 120px;
  }

  .images-item:hover {
    opacity: 0.7;
  }

  .images-item-upload {
    width: 80%;
    cursor: pointer;
    padding-bottom: 10px;
    -webkit-transition: .5s ease;
  }

  .images-item-upload:hover {
    opacity: 0.7;
  }

  .custom-item {
    border-bottom: 2px solid #f3f3f3;
  }

  .custom-item .custom-item-title {
    color: #666666;
    font-weight: 600;
  }

  .custom-item .custom-item-body {
    padding: 10px 0;
  }

  .max-height{
    overflow: auto;
    max-height: 300px;
  }

</style>

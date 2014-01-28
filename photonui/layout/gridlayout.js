/*
 * Copyright (c) 2014, Wanadev <http://www.wanadev.fr/>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *   * Redistributions of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 *   * Neither the name of Wanadev nor the names of its contributors may be used
 *     to endorse or promote products derived from this software without specific
 *     prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Authored by: Fabien LOISON <http://flozz.fr/>
 */

/**
 * PhotonUI - Javascript Web User Interface.
 *
 * @module PhotonUI
 * @submodule Widget
 * @namespace photonui
 */


var photonui = photonui || {};


/**
 * Grid layout.
 *
 * Layout Options:
 *
 *     {
 *          verticalExpansion: <Boolean, default: true>,
 *          horizontalExpansion: <Boolean, default: true>,
 *          gridX: <Number, default: 0>,
 *          gridY: <Number, default: 0>,
 *          gridWidth: <Number, default: 1>,
 *          gridHeight: <Number, default: 1>,
 *     }
 *
 * @class GridLayout
 * @constructor
 * @extends photonui.Layout
 * @param {Number} params.verticalSpacing Spacing between widgets (optional, default = 5).
 * @param {Number} params.horizontalSpacing Spacing between widgets (optional, default = 5).
 */
photonui.GridLayout = function(params) {
    photonui.Layout.call(this, params);

    var params = params || {};

    // Attrs
    this.verticalSpacing = (params.verticalSpacing != undefined) ? params.verticalSpacing : 5;
    this.horizontalSpacing = (params.horizontalSpacing != undefined) ? params.horizontalSpacing : 5;

    this._e = {};  // HTML elements

    // Build and bind
    this._buildHtml();
    this._updateAttributes();
}

photonui.GridLayout.prototype = new photonui.Layout();


//////////////////////////////////////////
// Getters / Setters                    //
//////////////////////////////////////////


/**
 * Get the vertical spacing.
 *
 * @method getVerticalSpacing
 * @return {Number} The vertical spacing between widgets.
 */
photonui.GridLayout.prototype.getVerticalSpacing = function() {
    return this.verticalSpacing;
}

/**
 * Set the vertical spacing.
 *
 * @method setVerticalSpacing
 * @param {Number} spacing The vertical spacing between widgets.
 */
photonui.GridLayout.prototype.setVerticalSpacing = function(spacing) {
    this.verticalSpacing = spacing;
    this._e.grid.style.borderSpacing = this.horizontalSpacing + "px " + this.verticalSpacing + "px";
}

/**
 * Get the horizontal spacing.
 *
 * @method getHorizontalSpacing
 * @return {Number} The horizontal spacing between widgets.
 */
photonui.GridLayout.prototype.getHorizontalSpacing = function() {
    return this.horizontalSpacing;
}

/**
 * Set the horizontal spacing.
 *
 * @method setHorizontalSpacing
 * @param {Number} spacing The horizontal spacing between widgets.
 */
photonui.GridLayout.prototype.setHorizontalSpacing = function(spacing) {
    this.horizontalSpacing = spacing;
    this._e.grid.style.borderSpacing = this.horizontalSpacing + "px " + this.verticalSpacing + "px";
}

/**
 * Get the HTML of the layout.
 *
 * @method getHtml
 * @return {HTMLElement}
 */
photonui.GridLayout.prototype.getHtml = function() {
    return this._e.outer;
}


//////////////////////////////////////////
// Private Methods                      //
//////////////////////////////////////////


/**
 * Build the HTML of the bow layout.
 *
 * @method _buildHtml
 * @private
 */
photonui.GridLayout.prototype._buildHtml = function() {
    this._e.outer = document.createElement("div");
    this._e.outer.className = "photonui-widget photonui-gridlayout";

    this._e.grid = document.createElement("table");
    this._e.outer.appendChild(this._e.grid);

    this._e.gridInner = document.createElement("tbody");
    this._e.grid.appendChild(this._e.gridInner);
}

/**
 * Update attributes.
 *
 * @method _updateAttributes
 * @private
 */
photonui.GridLayout.prototype._updateAttributes = function() {
    photonui.Layout.prototype._updateAttributes.call(this);

    this.setVerticalSpacing(this.verticalSpacing);
}

/**
 * Update the layout.
 *
 * @method _updateLayout
 * @private
 */
photonui.GridLayout.prototype._updateLayout = function() {
    // Calculate geometry
    var ox = Infinity;  // Offset X
    var oy = Infinity;  // Offset Y
    var nc = 0;  // Number of columns
    var nr = 0;  // Number of rows
    for (var i=0 ; i<this.childrenWidgets.length ; i++) {
        this.childrenWidgets[i].layoutOptions.gridX = (this.childrenWidgets[i].layoutOptions.gridX != undefined) ? this.childrenWidgets[i].layoutOptions.gridX : 0;
        this.childrenWidgets[i].layoutOptions.gridY = (this.childrenWidgets[i].layoutOptions.gridY != undefined) ? this.childrenWidgets[i].layoutOptions.gridY : 0;
        this.childrenWidgets[i].layoutOptions.gridWidth = Math.max(this.childrenWidgets[i].layoutOptions.gridWidth, 1) || 1;
        this.childrenWidgets[i].layoutOptions.gridHeight = Math.max(this.childrenWidgets[i].layoutOptions.gridHeight, 1) || 1;
        ox = Math.min(ox, this.childrenWidgets[i].layoutOptions.gridX);
        oy = Math.min(oy, this.childrenWidgets[i].layoutOptions.gridY);
        nc = Math.max(nc, this.childrenWidgets[i].layoutOptions.gridX + this.childrenWidgets[i].layoutOptions.gridWidth);
        nr = Math.max(nr, this.childrenWidgets[i].layoutOptions.gridY + this.childrenWidgets[i].layoutOptions.gridHeight);
    }
    nc -= ox;
    nr -= oy;

    // Find and fix conflicts
    // TODO

    // Build
    this._e.gridInner.innerHTML = "";
    var map = [];
    for (var y=0 ; y<nr ; y++) {
        var row = [];
        for (var x=0 ; x<nc ; x++) {
            row.push(false);
        }
        map.push(row);
    }
    for (var y=0 ; y<nr ; y++) {
        var e_tr = document.createElement("tr");
        this._e.gridInner.appendChild(e_tr);
        for (var x=0 ; x<nc ; x++) {
            if (map[y][x]) {
                continue;
            }
            var widget = false;
            var e_td = document.createElement("td");
            e_td.className = "photonui-gridlayout-cell";
            e_tr.appendChild(e_td);
            for (var i=0 ; i<this.childrenWidgets.length ; i++) {
                if (this.childrenWidgets[i].layoutOptions.gridX - ox == x && this.childrenWidgets[i].layoutOptions.gridY - oy == y) {
                    widget = true;
                    var cs = this.childrenWidgets[i].layoutOptions.gridWidth;
                    var rs = this.childrenWidgets[i].layoutOptions.gridHeight;
                    e_td.colSpan = cs;
                    e_td.rowSpan = rs;
                    e_td.appendChild(this.childrenWidgets[i].getHtml());
                    this.childrenWidgets[i]._updateAttributes();  // Fix for MSIE
                    if (this.childrenWidgets[i].layoutOptions.horizontalExpansion == undefined
                    ||  this.childrenWidgets[i].layoutOptions.horizontalExpansion) {
                        e_td.className += " photonui-container-expand-child-horizontal"
                    }
                    if (this.childrenWidgets[i].layoutOptions.verticalExpansion == undefined
                    ||  this.childrenWidgets[i].layoutOptions.verticalExpansion) {
                        e_td.className += " photonui-container-expand-child-vertical"
                    }
                    if (cs > 1 || rs > 1) {
                        for (var r=y ; r<y+rs ; r++) {
                            for (var c=x ; c<x+cs ; c++) {
                                map[r][c] = true;
                            }
                        }
                    }
                    break;
                }
            }
            if (!widget) {
                e_td.innerHTML = "&nbsp;";
            }
        }
    }

    // Hack for Gecko and Trident
    var cells = document.getElementsByClassName("photonui-gridlayout-cell");
    var heights = []
    for (var i=0 ; i<cells.length ; i++) {
        heights[i] = cells[i].offsetHeight + "px";
    }
    for (var i=0 ; i<cells.length ; i++) {
        cells[i].style.height = heights[i];
    }
}
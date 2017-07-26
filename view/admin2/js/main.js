
(function(){
    window.yS = window.yS || {};

    var s = window.yS;

    s.Rules = {
        init : function(){
            this._container = document.querySelector('#color-rules-cntainer');
            this._ul = this._container.querySelector('ul');
            this._onchangeCallbacks = [];
            this._addAddEventListener();
        },
        _change : function(){
            var rules = [];
            var rulesLis = this._ul.querySelectorAll('li');
            rulesLis.forEach(function(li){
                var checkbox = li.querySelector('.rule-checkbox');
                if(checkbox && checkbox.checked){
                    var pattern = li.querySelector('.pattern').value;
                    var color = li.querySelector('.rule-clor-picker').value;
                    // because I use an old ver of gulp minify ...
                    rules.push({
                        pattern: pattern,
                        color: color
                    });
                }
            });

            this._onchangeCallbacks.forEach(function(cb){
                cb(rules);
            })
        },
        _addChangeEvLis : function(li){
            var that = this;
            li.querySelectorAll('input').forEach(function(input){
                input.addEventListener('change', that._change.bind(that));
            });
        },
        _addAddEventListener: function(){
            var that = this;
            this._addbutton = this._container.querySelector('#add-rule');
            var firstli = that._ul.querySelector('li');
            this._addChangeEvLis(firstli);
            this._addbutton.addEventListener('click', function(ev){
                ev.preventDefault();
                var cloneli = firstli.cloneNode(true);
                that._addChangeEvLis(cloneli);
                that._ul.insertBefore(cloneli, that._addbutton.parentNode);
            });

        },
        onChange : function(cb){
            this._onchangeCallbacks.push(cb);
        }
    };

    s.Graph = {
        init : function(){
            this._container = document.querySelector('#graph-container');
            this._vis = window.vis || vis;
        },
        //initializes this._nodes and this._edges
        _initNodesEdges : function(dependencies){
            //temp no tie to rewrite
            var skipobj = {};
            var skipTab = dependencies.forEach(function(ext){
                if(ext.skip){
                    skipobj[ext.name] = true;
                }
            })

            var nodesData = [];
            var edgesData = [];
            for (var i = 0; i < dependencies.length; i++) {
                var ext = dependencies[i];
                if(ext.skip){//TODO 
                    continue;
                }
                nodesData.push({
                    id: ext.name,
                    label: ext.name,
                    path: ext.path
                });
                for (var ii = 0; ii < ext.requires.length; ii++) {
                    var extt = ext.requires[ii];
                    if(skipobj[extt]){
                        skipobj[extt] = false; //TODO . . .
                        nodesData.push({
                            id: extt,
                            label: extt,
                            // path: extt.path,
                            shape : 'box'
                        });
                    }
                    edgesData.push(
                        { 
                            from: ext.name,
                            to: extt,
                            arrows: 'to'
                        }
                    )
                }
            }
            // create an array with nodes
            this._nodes = new this._vis.DataSet(nodesData);

            // create an array with edges
            this._edges = new this._vis.DataSet(edgesData);
        },
        //this._network
        draw: function(dependencies){
            this._initNodesEdges(dependencies);
            var data = {
                nodes: this._nodes,
                edges: this._edges
            };
            var options = {
                height: '100%',
                width: '100%',
            };
            this._network = new this._vis.Network(this._container, data, options);
            this._bindEvents();
        },
        _getRuleFor: function(rules, node){
            // yes I get just the furst rule, this is a beta version, the user take of avoiding overlaps 
            return rules.filter(function(rule){
                //TODO make it expreg
                return node.label.indexOf(rule.pattern) !== -1;
            })[0] || null;
        },
        updateColors: function(rules){
            var _data = this._nodes._data;
            var that = this;
            var newNodes = Object.keys(_data)
                .map(function(id){
                    return _data[id];
                })
                .map(function(node){
                    var path = node.path;
                    var rule = that._getRuleFor(rules, node);
                    if(rule){
                        node.color = rule.color;
                    }else{
                        node.color = null;
                    }
                    return node;
                });
            this._nodes.update(newNodes);
        },
        _bindEvents : function(){
            var that = this;
            this._network.on('click', function(objs){
                var nodes = objs.nodes;
                if(nodes.length !== 0){
                    var node = nodes[0];
                    var edgesToSelect = objs.edges
                        .map(function(edgeId){
                            return that._edges.get(edgeId);
                        })
                        .filter(function(edge){
                            return edge.from === node;
                        });

                    var nodesToSelect = edgesToSelect
                        .map(function(edge){
                            return nodeTo = edge.to;
                        });
                    nodesToSelect.push(node);
                    that._network.setSelection({
                        nodes:nodesToSelect,
                        edges: edgesToSelect.map(function(edge){
                            return edge.id
                        })
                    },{
                        highlightEdges : false
                    });
                    // that._network.selectNodes(nodesToSelect, false);
                }
            })
        }
    };

    $(function(){
        Object.keys(window.yS).forEach(function(mName){
            window.yS[mName].init();
        });
    });


    //wiring the component together
    $(function(){
        var s = window.yS;

        s.Rules.onChange(s.Graph.updateColors.bind(s.Graph));
    });

})();
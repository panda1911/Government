
/**
 * 路由器
 * @author : yu.yuy
 * @createTime : 2012-07-21
 */
(function(){
    var homepage = require("./app/controllers/homepage.js"),
    javascript = require("./app/controllers/javascript.js"),
    css = require("./app/controllers/css.js");
    module.exports = function(app){
    	//JS组件
    	app.get('/js', function(req, res){
            javascript.init(req, res);
        });
        //css基础
    	app.get('/css', function(req, res){
            css.init(req, res);
        });
    };
})();
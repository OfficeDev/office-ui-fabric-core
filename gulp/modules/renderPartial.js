module.exports = function(partial, props) {
  var hbs = Plugins.handlebars.Handlebars;
  var fileContents = Plugins.fs.readFileSync(Config.paths.componentsPath + '/' + partial + '/' + partial +'.html',  "utf8");
  var template = hbs.compile(fileContents);
  var thisProps = {props: props};
  return new hbs.SafeString(template(thisProps));
}
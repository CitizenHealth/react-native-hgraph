const fs = require('fs');
const path = require('path');

console.log("rnpm-install info react-native-hgraph: Post Link")

// 
const appBuildGradlePath = path.join('android', 'app', 'build.gradle');

const defaultCompileStatement = "compile project(':react-native-hgraph')";
const requiredCompileStatement = "implementation project(':react-native-svg')\n    implementation project(':react-native-hgraph')";

var buildGradleContents = fs.readFileSync(appBuildGradlePath, 'utf8');

buildGradleContents = buildGradleContents.replace(defaultCompileStatement, requiredCompileStatement);
fs.writeFileSync(appBuildGradlePath, buildGradleContents);

//
const appIncludeGradlePath = path.join('android', 'settings.gradle');

const defaultIncludeStatement = "include ':react-native-hgraph'\nproject(':react-native-hgraph').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-hgraph/android')";
const requiredIncludeStatement = "include ':react-native-svg'\nproject(':react-native-svg').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-svg/android')\ninclude ':react-native-hgraph'\nproject(':react-native-hgraph').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-hgraph/android')";

var includeGradleContents = fs.readFileSync(appIncludeGradlePath, 'utf8');

if (includeGradleContents.indexOf("include ':react-native-svg'") === -1 ) {
  includeGradleContents = includeGradleContents.replace(defaultIncludeStatement, requiredIncludeStatement);
}

fs.writeFileSync(appIncludeGradlePath, includeGradleContents);

//
const appMaindGradlePath = path.join('android', 'app', 'src', 'main', 'java', 'com', 'example', 'MainApplication.java');

const defaultIncludeMainStatement = "import io.citizenhealth.RNReactNativeHgraphPackage;";
const requiredIncludeMainStatement = "import io.citizenhealth.RNReactNativeHgraphPackage;\nimport com.horcrux.svg.SvgPackage;";

var mainGradleContents = fs.readFileSync(appMaindGradlePath, 'utf8');

if (mainGradleContents.indexOf("import com.horcrux.svg.SvgPackage;") === -1 ) {
  mainGradleContents = mainGradleContents.replace(defaultIncludeMainStatement, requiredIncludeMainStatement);
}
fs.writeFileSync(appMaindGradlePath, mainGradleContents);

const defaultMainStatement = "new RNReactNativeHgraphPackage()";
const requiredMainStatement = "new SvgPackage(),\n            new RNReactNativeHgraphPackage()";

mainGradleContents = fs.readFileSync(appMaindGradlePath, 'utf8');
if (mainGradleContents.indexOf("new SvgPackage(),") === -1 ) {
  mainGradleContents = mainGradleContents.replace(defaultMainStatement, requiredMainStatement);
}
fs.writeFileSync(appMaindGradlePath, mainGradleContents);

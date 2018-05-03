const fs = require('fs');
const path = require('path');

console.log("rnpm-install info react-native-hgraph: Post Unlink")

// 
const appBuildGradlePath = path.join('android', 'app', 'build.gradle');

const empty = "";
const compileStatement1 = "implementation project(':react-native-svg')\n";
const compileStatement2 = "    implementation project(':react-native-hgraph')\n";

var buildGradleContents = fs.readFileSync(appBuildGradlePath, 'utf8');
buildGradleContents = buildGradleContents.replace(compileStatement1, empty);
buildGradleContents = buildGradleContents.replace(compileStatement2, empty);
fs.writeFileSync(appBuildGradlePath, buildGradleContents);

//
const appIncludeGradlePath = path.join('android', 'settings.gradle');

const includeStatement1 = "include ':react-native-hgraph'\nproject(':react-native-hgraph').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-hgraph/android')\n";
const includeStatement2 = "include ':react-native-svg'\nproject(':react-native-svg').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-svg/android')\n";

var includeGradleContents = fs.readFileSync(appIncludeGradlePath, 'utf8');
includeGradleContents = includeGradleContents.replace(includeStatement1, empty);
includeGradleContents = includeGradleContents.replace(includeStatement2, empty);
fs.writeFileSync(appIncludeGradlePath, includeGradleContents);

//
const appMaindGradlePath = path.join('android', 'app', 'src', 'main', 'java', 'com', 'example', 'MainApplication.java');

const includeMainStatement1 = "import io.citizenhealth.RNReactNativeHgraphPackage;\n";
const includeMainStatement2 = "import com.horcrux.svg.SvgPackage;\n";
const mainStatement1 = "new RNReactNativeHgraphPackage()\n";
const mainStatement2 = "new SvgPackage(),\n";

var mainGradleContents = fs.readFileSync(appMaindGradlePath, 'utf8');
mainGradleContents = mainGradleContents.replace(includeMainStatement1, empty);
mainGradleContents = mainGradleContents.replace(includeMainStatement2, empty);
mainGradleContents = mainGradleContents.replace(mainStatement1, empty);
mainGradleContents = mainGradleContents.replace(mainStatement2, empty);
fs.writeFileSync(appMaindGradlePath, mainGradleContents);

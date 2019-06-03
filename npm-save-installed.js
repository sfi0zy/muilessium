const fs = require('fs');
const path = require('path');


const thisPackage =
    JSON.parse(
        fs.readFileSync(
            path.join('package.json'), 'utf-8'));



const dependencies = Object.keys(thisPackage.dependencies || {});

if (dependencies.length !== 0) {
    console.log('DEPENDENCIES:');

    dependencies.forEach((dependency) => {
        const depPackage =
            JSON.parse(
                fs.readFileSync(
                    path.join('node_modules', dependency, 'package.json'), 'utf-8'));

        if (depPackage._requested.registry) {
            thisPackage.dependencies[dependency] = depPackage.version;
            console.log('NPM %s@%s', dependency, depPackage.version);
        } else {
            thisPackage.dependencies[dependency] = depPackage._resolved;
            console.log('--- %s@%s', dependency, depPackage._resolved);
        }
    });
}



const devDependencies = Object.keys(thisPackage.devDependencies || {});

if (devDependencies.length !== 0) {
    console.log('DEV DEPENDENCIES:');

    devDependencies.forEach((dependency) => {
        const depPackage =
            JSON.parse(
                fs.readFileSync(
                    path.join('node_modules', dependency, 'package.json'), 'utf-8'));

        if (depPackage._requested.registry) {
            thisPackage.devDependencies[dependency] = depPackage.version;
            console.log('NPM %s@%s', dependency, depPackage.version);
        } else {
            thisPackage.devDependencies[dependency] = depPackage._resolved;
            console.log('--- %s@%s', dependency, depPackage._resolved);
        }
    });
}


const newPackageJSON = JSON.stringify(thisPackage, null, 2);

fs.writeFileSync(path.join('package.json'), newPackageJSON, 'utf-8');

